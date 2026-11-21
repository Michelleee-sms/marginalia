'use strict';

(function (App) {
  const U = App.util;

  function render(root) {
    const entries = App.store.all();
    const ongoing = entries.filter(function (e) { return e.status === 'ongoing'; });
    const done = entries.filter(function (e) { return e.status !== 'ongoing'; });
    const monthKey = U.today().slice(0, 7);
    const thisMonth = entries.filter(function (e) { return String(e.finished_at).slice(0, 7) === monthKey; });
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    let html = '<div class="page page-diary">' +
      '<header class="diary-head">' +
        '<p class="diary-date">' + U.esc(today) + '</p>' +
        '<h2 class="sr-only">Diary</h2>' +
        '<p class="diary-stat">' + U.plural(entries.length, 'entry') + ' kept' +
          (thisMonth.length ? ' &middot; ' + thisMonth.length + ' this month' : '') + '</p>' +
      '</header>';

    html += App.ui.quickadd.html();

    if (!entries.length) {
      html += App.ui.empty('The diary is empty',
        'Log the last thing you finished. Two lines is enough \u2014 the point is that future you can see what you were thinking.',
        '<button type="button" class="btn btn-primary" data-focus-qa>Start here</button>');
    }

    if (ongoing.length) {
      html += App.ui.section('In progress',
        '<div class="stack">' + ongoing.map(function (e) { return App.ui.card(e); }).join('') + '</div>',
        'Still open. Nothing logged yet, so no recommendation pulls from these.');
    }

    if (done.length) {
      const groups = App.ui.dayGroups(done);
      let lastMonth = '';
      let stream = '';
      groups.forEach(function (g) {
        const mk = String(g.day).slice(0, 7);
        if (mk !== lastMonth) {
          lastMonth = mk;
          stream += '<div class="month-rule"><span>' + U.esc(U.monthLabel(mk)) + '</span></div>';
        }
        stream += '<div class="day">' +
          '<div class="day-rule"><span>' + U.esc(U.dayLabel(g.day)) + '</span>' +
            (g.items.length > 1 ? '<em>' + U.plural(g.items.length, 'entry') + '</em>' : '') + '</div>' +
          '<div class="stack">' + g.items.map(function (e) { return App.ui.card(e); }).join('') + '</div>' +
        '</div>';
      });
      html += '<section class="section"><div class="stream">' + stream + '</div></section>';
    }

    if (entries.length >= 4) {
      const picks = App.reco.alsoFromShelf(3);
      if (picks.length) {
        html += App.ui.section('Worth another look',
          '<ul class="reco-list reco-list-wide">' + picks.map(function (p) {
            return '<li class="reco reco-wide">' +
              '<a class="reco-link" href="#/e/' + U.esc(p.entry.id) + '">' + App.ui.tile(p.entry, 'xs') +
              '<span class="reco-main"><span class="reco-title">' + U.esc(p.entry.title) + '</span>' +
              '<span class="reco-meta">' + App.ui.byline(p.entry) + '</span></span></a>' +
              '<span class="reco-why">sits next to ' + U.esc(p.from.title) + ' &middot; ' + U.esc(p.reason.text) + '</span></li>';
          }).join('') + '</ul>',
          'Things already in the diary that belong together, from different weeks.');
      }
    }

    root.innerHTML = html;
    App.ui.quickadd.wire(root);
    const page = root.querySelector('.page');

    U.on(page, 'click', '[data-focus-qa]', function () {
      const t = document.getElementById('qa-title');
      if (t) t.focus();
    });
    U.on(page, 'click', '[data-edit]', function (ev, btn) {
      App.ui.sheet.open('form', { id: btn.getAttribute('data-edit') });
    });
    U.on(page, 'click', '[data-del]', function (ev, btn) {
      const id = btn.getAttribute('data-del');
      const e = App.store.get(id);
      if (!e) return;
      if (!window.confirm('Delete \u201c' + e.title + '\u201d from the diary? This cannot be undone.')) return;
      App.store.remove(id);
      App.ui.toast('Deleted.', 'ok');
    });
  }

  App.views.diary = { render: render };
})(App);
