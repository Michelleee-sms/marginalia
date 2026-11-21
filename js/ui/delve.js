'use strict';

(function (App) {
  const U = App.util;

  function threadBlock(t) {
    const ladder = t.ladder;
    const next = [];
    ladder.groups.forEach(function (g) {
      g.items.filter(function (d) { return !d.logged; }).forEach(function (d) { next.push(d); });
    });
    const shown = next.slice(0, 2);
    return '<article class="thread">' +
      '<header class="thread-head">' +
        '<h3>' + U.esc(ladder.title) + '</h3>' +
        '<p class="thread-tag">' + U.esc(ladder.tag) + ' &middot; ' + U.plural(t.rec.count, 'entry') + '</p>' +
      '</header>' +
      '<ol class="thread-track">' + t.rec.entries.map(function (e) {
        return '<li><a href="#/e/' + U.esc(e.id) + '">' + App.ui.tile(e, 'xs') +
          '<span class="thread-what"><b' + U.langAttr(e.title) + '>' + U.esc(e.title) + '</b><em>' + App.ui.byline(e) + '</em></span>' +
          '<span class="thread-when">' + U.esc(U.fmtDay(e.finished_at)) + '</span></a></li>';
      }).join('') + '</ol>' +
      (shown.length
        ? '<p class="thread-next-label">Next rung</p><div class="ladder-body">' + App.ui.ladderItems(shown, ladder.tag) + '</div>'
        : '<p class="thread-done">You have logged every rung on this ladder. Add one of your own.</p>') +
    '</article>';
  }

  function render(root) {
    const entries = App.store.all();
    const threads = App.reco.threads(4);
    const doors = App.reco.openDoors(3);
    const pairs = App.store.pairs();
    const ladders = App.reco.allLadders();
    const untouched = ladders.filter(function (l) { return !threads.some(function (t) { return t.ladder.tag === l.tag; }); });

    let html = '<div class="page page-delve">' +
      '<header class="page-head"><h2>Delve</h2>' +
      '<p class="page-sub">Recommendations built from your own notes. The ladders below are hand-written and editable in <code>js/data/ladder.js</code> \u2014 nothing here is fetched or scored by a model.</p></header>';

    if (entries.length < 3) {
      html += App.ui.empty('A few more entries and this gets interesting',
        'Suggestions need shared tags to work. Log ' + U.plural(Math.max(1, 3 - entries.length), 'more ' + (entries.length ? 'entry' : 'entry'), 'more entries') + ' and the threads will start forming.');
    }

    if (threads.length) {
      html += App.ui.section('You keep coming back to', threads.map(threadBlock).join(''),
        'Ordered by how strongly your ratings lean on each tag, weighted towards recent weeks.');
    }

    if (doors.length) {
      html += App.ui.section('Doors you left open', '<div class="door-grid">' + doors.map(function (d) {
        const first = d.ladder.groups[0].items.filter(function (i) { return !i.logged; })[0] || d.ladder.groups[0].items[0];
        return '<a class="door" href="#/e/' + U.esc(d.rec.entries[0].id) + '">' +
          '<span class="door-tag">' + U.esc(d.rec.tag) + '</span>' +
          '<span class="door-from">from one 5&#9733: ' + U.esc(d.rec.entries[0].title) + '</span>' +
          '<span class="door-then">try ' + U.esc(first.item.title) + ' &mdash; ' + U.esc(first.item.by || '') + '</span></a>';
      }).join('') + '</div>', 'A tag you touched once, rated highly, with a ladder waiting.');
    }

    if (pairs.length) {
      html += App.ui.section('Both versions of one story', '<ul class="pair-list">' + pairs.map(function (p) {
        const src = p.source, ver = p.version;
        const won = src.rating !== null && ver.rating !== null
          ? (src.rating === ver.rating ? 'rated the same, which says something'
            : 'the ' + (src.rating > ver.rating ? U.kind(src.type).sourceWord : U.kindLabel(ver.type)) + ' won')
          : '';
        return '<li class="pair"><a href="#/e/' + U.esc(src.id) + '">' + App.ui.tile(src, 'xs') + '<span' + U.langAttr(src.title) + '>' + U.esc(src.title) + '</span></a>' +
          '<span class="pair-arrow">&#8594;</span>' +
          '<a href="#/e/' + U.esc(ver.id) + '">' + App.ui.tile(ver, 'xs') + '<span' + U.langAttr(ver.title) + '>' + U.esc(ver.title) + '</span></a>' +
          '<span class="pair-note">' + (won ? U.esc(won) + ' &middot; ' : '') +
            U.esc(src.year || '?') + ' vs ' + U.esc(ver.year || '?') + '</span></li>';
      }).join('') + '</ul>', 'Novel to film, book to series, film to series. Link the two from either entry with the adaptation field.');
    }

    html += App.ui.section('Every ladder', '<div class="ladder-bank">' + ladders.map(function (l) {
      const mine = App.store.all().filter(function (e) { return e.tags.indexOf(l.tag) >= 0; });
      return '<details class="ladder-fold"' + (l.tag === (threads[0] && threads[0].ladder.tag) ? ' open' : '') + '>' +
        '<summary><span class="fold-title">' + U.esc(l.title) + '</span>' +
          '<span class="fold-meta">' + U.esc(l.tag) + (mine.length ? ' &middot; ' + mine.length + ' of yours' : '') + ' &middot; ' + l.remaining + ' of ' + l.total + ' to go</span></summary>' +
        '<p class="ladder-q">' + U.esc(l.question) + '</p>' +
        App.ui.ladderGroups(l) +
      '</details>';
    }).join('') + '</div>');

    if (untouched.length && entries.length >= 3) {
      html += '<p class="delve-foot">' + U.plural(untouched.length, 'ladder') + ' on this page do not match any tag you use yet \u2014 ' +
        U.esc(U.list(untouched.slice(0, 3).map(function (l) { return l.tag; }))) +
        '. Tag an entry with them and they come alive. Add your own ladders in <code>js/data/ladder.js</code>.</p>';
    }

    html += '</div>';
    root.innerHTML = html;

    U.on(root.querySelector('.page'), 'click', '[data-log-item]', function (ev, btn) {
      const bits = btn.getAttribute('data-log-item').split('|');
      App.ui.sheet.open('form', { draft: App.reco.draftFor(bits[0], bits[1]) });
    });
  }

  App.views.delve = { render: render };
})(App);
