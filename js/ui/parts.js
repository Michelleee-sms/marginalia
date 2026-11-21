'use strict';

(function (App) {
  const U = App.util;

  App.ui.toast = function (message, kind) {
    const host = document.getElementById('toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast toast-' + (kind || 'info');
    el.textContent = message;
    host.appendChild(el);
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 320);
    }, kind === 'bad' ? 6000 : 3600);
  };

  App.ui.tile = function (entry, size) {
    const hue = U.hashHue(entry.title + (entry.year || ''));
    const cls = 'tile tile-' + (size || 'md') + ' tile-' + U.cleanKind(entry.type);
    const style = '--hue:' + hue + ';';
    const code = '<span class="tile-code">' + U.esc(U.initials(entry.title)) + '</span>';
    if (U.cleanKind(entry.type) === 'film') {
      return '<div class="' + cls + '" style="' + style + '" aria-hidden="true">' + code + '<span class="tile-reel"></span></div>';
    }
    if (U.cleanKind(entry.type) === 'series') {
      return '<div class="' + cls + '" style="' + style + '" aria-hidden="true">' + code + '<span class="tile-play"></span><span class="tile-reel"></span></div>';
    }
    return '<div class="' + cls + '" style="' + style + '" aria-hidden="true"><span class="tile-spine"></span>' + code + '</div>';
  };

  App.ui.stars = function (rating, suffix) {
    if (rating === null || rating === undefined) return '<span class="stars stars-none">' + (suffix || 'not rated') + '</span>';
    let out = '<span class="stars" title="' + rating + ' of 5">';
    for (let i = 1; i <= 5; i++) out += '<span class="star' + (i <= rating ? ' on' : '') + '">&#9733;</span>';
    return out + '</span>';
  };

  App.ui.typeLabel = function (type) { return U.kindLabel(type); };

  App.ui.byline = function (entry) {
    const names = entry.creators.map(function (c) { return c.name; });
    const bits = [];
    if (names.length) bits.push('<span' + U.langAttr(names.join(' ')) + '>' + U.esc(U.list(names)) + '</span>');
    if (entry.year) bits.push(entry.year);
    bits.push(App.ui.typeLabel(entry.type));
    return bits.join(' &middot; ');
  };

  App.ui.chips = function (tags, kind) {
    if (!tags || !tags.length) return '';
    return '<ul class="chips chips-' + (kind || 'tag') + '">' + tags.map(function (t) {
      const safe = U.esc(t);
      const lang = U.langAttr(t);
      const href = kind === 'tag' ? ' href="#/library?tag=' + encodeURIComponent(t) + '"' : '';
      return '<li class="chip">' + (href ? '<a' + href + lang + '>' + safe + '</a>' : '<span' + lang + '>' + safe + '</span>') + '</li>';
    }).join('') + '</ul>';
  };

  App.ui.card = function (entry, opts) {
    const o = opts || {};
    const notes = entry.notes.trim();
    const ongoing = entry.status === 'ongoing';
    return '' +
      '<article class="card' + (ongoing ? ' is-ongoing' : '') + (o.compact ? ' card-compact' : '') + '" data-card="' + U.esc(entry.id) + '">' +
        '<a class="card-body" href="#/e/' + U.esc(entry.id) + '">' +
          '<div class="card-head">' +
            App.ui.tile(entry, o.compact ? 'sm' : 'md') +
            '<div class="card-id">' +
              '<h3 class="card-title"' + U.langAttr(entry.title) + '>' + U.esc(entry.title) +
                (entry.original_title ? ' <span class="card-orig"' + U.langAttr(entry.original_title) + '>' + U.esc(entry.original_title) + '</span>' : '') +
              '</h3>' +
              '<p class="card-by">' + App.ui.byline(entry) + '</p>' +
              '<p class="card-rate">' + App.ui.stars(entry.rating) + (ongoing ? ' <span class="badge badge-ongoing">in progress</span>' : '') + '</p>' +
            '</div>' +
          '</div>' +
          (notes && !o.compact ? '<div class="card-notes">' + U.para(notes, U.langAttr(notes)) + '</div>' : '') +
          (entry.quotes.length && !o.compact ? '<blockquote class="card-quote"' + U.langAttr(entry.quotes[0]) + '>' + U.esc(entry.quotes[0]) + '</blockquote>' : '') +
          (!o.compact ? App.ui.chips(entry.tags) : '') +
        '</a>' +
        '<div class="card-tools">' +
          '<button type="button" class="icon-btn" data-edit="' + U.esc(entry.id) + '" title="Edit" aria-label="Edit ' + U.esc(entry.title) + '">&#9998;</button>' +
          '<button type="button" class="icon-btn icon-btn-danger" data-del="' + U.esc(entry.id) + '" title="Delete" aria-label="Delete ' + U.esc(entry.title) + '">&times;</button>' +
        '</div>' +
      '</article>';
  };

  App.ui.recoRow = function (res) {
    const e = res.entry;
    return '<li class="reco">' +
      '<a class="reco-link" href="#/e/' + U.esc(e.id) + '">' +
        App.ui.tile(e, 'xs') +
        '<span class="reco-main">' +
          '<span class="reco-title"' + U.langAttr(e.title) + '>' + U.esc(e.title) + '</span>' +
          '<span class="reco-meta">' + App.ui.byline(e) + ' ' + App.ui.stars(e.rating) + '</span>' +
        '</span>' +
      '</a>' +
      (res.reason ? '<span class="reco-why">' + U.esc(res.reason.text) + '</span>' : '') +
      '</li>';
  };

  App.ui.ladderItems = function (items, tag) {
    return '<ul class="ladder-list">' + items.map(function (d) {
      const it = d.item;
      const kindLabel = U.kindLabel(it.kind);
      let tail;
      if (d.logged) {
        tail = '<a class="ladder-logged" href="#/e/' + U.esc(d.loggedId) + '">logged' + (d.loggedRating ? ' &middot; ' + d.loggedRating + '\u2605' : '') + '</a>';
      } else {
        tail = '<button type="button" class="btn btn-tiny" data-log-item="' + U.esc(tag) + '|' + U.esc(it.title) + '">Log this</button>';
      }
      return '<li class="ladder-item' + (d.logged ? ' is-logged' : '') + '">' +
        '<div class="ladder-item-head"><strong' + U.langAttr(it.title) + '>' + U.esc(it.title) + '</strong>' +
          '<span class="ladder-by"' + U.langAttr(it.by || '') + '>' + U.esc(it.by || '') + (it.year ? ', ' + it.year : '') + ' &middot; ' + kindLabel + '</span></div>' +
        '<p class="ladder-why">' + U.esc(it.why) + '</p>' +
        '<div class="ladder-item-tail">' + tail + '</div>' +
      '</li>';
    }).join('') + '</ul>';
  };

  App.ui.ladderGroups = function (ladder, opts) {
    const o = opts || {};
    const groups = ladder.groups.map(function (g) {
      const items = o.unloggedOnly ? g.items.filter(function (d) { return !d.logged; }) : g.items;
      if (!items.length) return '';
      return '<div class="rung">' +
        '<h5 class="rung-label rung-' + g.level + '">' + U.esc(g.label) + '</h5>' +
        App.ui.ladderItems(items, ladder.tag) +
      '</div>';
    }).join('');
    return groups;
  };

  App.ui.section = function (title, body, note) {
    return '<section class="section">' +
      '<header class="section-head"><h2>' + U.esc(title) + '</h2>' + (note ? '<p class="section-note">' + U.esc(note) + '</p>' : '') + '</header>' +
      body +
    '</section>';
  };

  App.ui.empty = function (title, body, action) {
    return '<div class="empty"><h3>' + U.esc(title) + '</h3><p>' + body + '</p>' + (action || '') + '</div>';
  };

  App.ui.dayGroups = function (entries) {
    const groups = [];
    const index = {};
    entries.forEach(function (e) {
      const k = e.finished_at;
      if (!index[k]) { index[k] = { day: k, items: [] }; groups.push(index[k]); }
      index[k].items.push(e);
    });
    return groups;
  };
})(App);
