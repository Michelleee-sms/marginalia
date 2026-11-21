'use strict';

(function (App) {
  const U = App.util;

  const state = { q: '', type: 'all', tag: '', sort: 'recent', status: 'all' };

  function apply(entries) {
    let out = entries.slice();
    if (state.type !== 'all') out = out.filter(function (e) { return e.type === state.type; });
    if (state.status !== 'all') out = out.filter(function (e) { return state.status === 'ongoing' ? e.status === 'ongoing' : e.status !== 'ongoing'; });
    if (state.tag) out = out.filter(function (e) { return e.tags.indexOf(state.tag) >= 0; });
    if (state.q) {
      const q = U.norm(state.q);
      out = out.filter(function (e) {
        return U.norm(e.title).indexOf(q) >= 0 || U.norm(e.original_title).indexOf(q) >= 0 ||
          U.norm(e.notes).indexOf(q) >= 0 || e.tags.join(' ').indexOf(q) >= 0 ||
          e.genres.join(' ').indexOf(q) >= 0 || U.norm(e.creators.map(function (c) { return c.name; }).join(' ')).indexOf(q) >= 0;
      });
    }
    const cmp = {
      recent: function (a, b) { return a.finished_at < b.finished_at ? 1 : a.finished_at > b.finished_at ? -1 : 0; },
      oldest: function (a, b) { return a.finished_at > b.finished_at ? 1 : a.finished_at < b.finished_at ? -1 : 0; },
      rating: function (a, b) { return (b.rating === null ? -1 : b.rating) - (a.rating === null ? -1 : a.rating); },
      title: function (a, b) { return U.compareText(a.title, b.title); },
      year: function (a, b) { return (b.year || 0) - (a.year || 0); }
    }[state.sort];
    return U.stableSort(out, cmp);
  }

  function toolbar(topTags) {
    return '<div class="lib-tools">' +
      '<input type="search" id="lib-q" class="lib-q" placeholder="Search titles, notes, people" value="' + U.esc(state.q) + '" aria-label="Search the diary">' +
      '<div class="segmented seg-filter">' +
        ['all'].concat(U.KINDS.map(function (k) { return k.value; })).map(function (t) {
          return '<label><input type="radio" name="lib-type" value="' + t + '"' + (state.type === t ? ' checked' : '') + '><span>' + (t === 'all' ? 'All' : U.kindTitle(t)) + '</span></label>';
        }).join('') +
      '</div>' +
      '<select id="lib-sort" class="lib-sort" aria-label="Sort">' +
        [['recent', 'Most recent'], ['oldest', 'Oldest first'], ['rating', 'Highest rated'], ['title', 'Title A\u2013Z / pinyin'], ['year', 'Year made']].map(function (o) {
          return '<option value="' + o[0] + '"' + (state.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') +
      '</select>' +
      '<select id="lib-status" class="lib-sort" aria-label="Status">' +
        [['all', 'Finished + ongoing'], ['done', 'Finished only'], ['ongoing', 'In progress']].map(function (o) {
          return '<option value="' + o[0] + '"' + (state.status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') +
      '</select>' +
    '</div>' +
    '<div class="tagbar">' +
      '<button type="button" class="chip chip-btn' + (state.tag ? '' : ' on') + '" data-tag="">All tags</button>' +
      topTags.map(function (t) {
        return '<button type="button" class="chip chip-btn' + (state.tag === t.tag ? ' on' : '') + '" data-tag="' + U.esc(t.tag) + '">' + U.esc(t.tag) + ' <b>' + t.count + '</b></button>';
      }).join('') +
    '</div>';
  }

  function rowHtml(e) {
    return '<li class="shelf-row">' +
      '<a class="shelf-link" href="#/e/' + U.esc(e.id) + '">' + App.ui.tile(e, 'sm') +
        '<span class="shelf-main">' +
          '<span class="shelf-title"' + U.langAttr(e.title) + '>' + U.esc(e.title) + (e.original_title ? ' <i' + U.langAttr(e.original_title) + '>' + U.esc(e.original_title) + '</i>' : '') + '</span>' +
          '<span class="shelf-meta">' + App.ui.byline(e) + ' &middot; ' + U.esc(U.fmtDay(e.finished_at)) + '</span>' +
          '<span class="shelf-tags">' + App.ui.chips(e.tags.slice(0, 6)) + '</span>' +
        '</span>' +
      '</a>' +
      '<span class="shelf-rate">' + App.ui.stars(e.rating) + '</span>' +
      '<button type="button" class="icon-btn" data-edit="' + U.esc(e.id) + '" aria-label="Edit">&#9998;</button>' +
    '</li>';
  }

  function render(root) {
    const entries = App.store.all();
    const counts = App.store.tagCounts();
    const topTags = Object.keys(counts).map(function (t) { return { tag: t, count: counts[t] }; })
      .sort(function (a, b) { return b.count - a.count || (a.tag < b.tag ? -1 : 1); }).slice(0, 18);
    const rows = apply(entries);

    let html = '<div class="page page-library">' +
      '<header class="page-head"><h2>Library</h2><p class="page-sub">Everything you have logged, in the order you want it.</p></header>';

    if (!entries.length) {
      html += App.ui.empty('Nothing to shelve yet', 'Add your first entry from the <a href="#/diary">diary</a>.');
      root.innerHTML = html;
      return;
    }

    html += toolbar(topTags);

    if (!rows.length) {
      html += '<p class="lib-none">No entry matches those filters. <button type="button" class="linklike" data-clear-filters>Clear them</button>.</p>';
    } else {
      html += '<p class="lib-count">' + U.plural(rows.length, 'entry') + '</p><ul class="shelf">' +
        rows.map(rowHtml).join('') + '</ul>';
    }

    html += '</div>';
    root.innerHTML = html;
    const page = root.querySelector('.page');

    const q = document.getElementById('lib-q');
    if (q) q.addEventListener('input', function () { state.q = q.value; refreshList(root); });
    U.on(page, 'click', '[data-tag]', function (ev, btn) {
      state.tag = btn.getAttribute('data-tag');
      App.ui.refresh();
    });
    U.on(page, 'change', '[name=lib-type]', function (ev, input) { state.type = input.value; App.ui.refresh(); });
    U.on(page, 'change', '#lib-sort', function (ev, sel) { state.sort = sel.value; App.ui.refresh(); });
    U.on(page, 'change', '#lib-status', function (ev, sel) { state.status = sel.value; App.ui.refresh(); });
    U.on(page, 'click', '[data-clear-filters]', function () {
      state.q = ''; state.type = 'all'; state.tag = ''; state.sort = 'recent'; state.status = 'all';
      App.ui.refresh();
    });
    U.on(page, 'click', '[data-edit]', function (ev, btn) { App.ui.sheet.open('form', { id: btn.getAttribute('data-edit') }); });
  }

  function refreshList(root) {
    const list = root.querySelector('.shelf');
    const count = root.querySelector('.lib-count');
    if (!list) { App.ui.refresh(); return; }
    const rows = apply(App.store.all());
    if (count) count.textContent = U.plural(rows.length, 'entry');
    list.innerHTML = rows.map(rowHtml).join('');
  }

  App.views.library = { render: render, state: state, setFilter: function (patch) { Object.assign(state, patch); } };
})(App);
