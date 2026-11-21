'use strict';

(function (App) {
  const U = App.util;
  const sheet = function () { return document.getElementById('sheet'); };
  const scrim = function () { return document.getElementById('scrim'); };

  let current = null;
  let lastFocus = null;
  let hideTimer = null;

  function parseList(text) {
    return U.uniq(String(text || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean));
  }

  function creditsToText(creators, type) {
    const defaultRole = U.kindRole(type);
    return (creators || []).map(function (c) {
      return (!c.role || c.role === defaultRole) ? c.name : c.role + ': ' + c.name;
    }).join('\n');
  }

  function parseCredits(text, type) {
    return String(text || '').split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (line) {
      const m = /^([^:：]{1,18})[:：]\s*(.+)$/.exec(line);
      if (m && /^[\p{L}\p{N} \-]+$/u.test(m[1].trim())) return { role: U.norm(m[1]), name: m[2].trim() };
      return { role: U.kindRole(type), name: line };
    });
  }

  function field(name, label, input, hint) {
    return '<label class="field"><span class="field-label">' + U.esc(label) + '</span>' + input +
      (hint ? '<span class="field-hint">' + U.esc(hint) + '</span>' : '') + '</label>';
  }

  function optionList(values, selected) {
    return values.map(function (v) {
      const val = typeof v === 'object' ? v.value : v;
      const text = typeof v === 'object' ? v.label : v;
      return '<option value="' + U.esc(val) + '"' + (String(val) === String(selected) ? ' selected' : '') + '>' + U.esc(text) + '</option>';
    }).join('');
  }

  function viewHtml(entry) {
    const pair = App.store.pairOf(entry);
    const related = App.reco.related(entry, { limit: 5 });
    const delve = App.reco.delveForEntry(entry, 2);
    const ongoing = entry.status === 'ongoing';

    let html = '<header class="sheet-head">' +
      '<div class="sheet-kicker">' + U.fmtDay(entry.finished_at) + (ongoing ? ' &middot; in progress' : '') + '</div>' +
      '<h2 id="sheet-heading" class="sheet-title"' + U.langAttr(entry.title) + '>' + U.esc(entry.title) + '</h2>' +
      (entry.original_title ? '<p class="sheet-orig"' + U.langAttr(entry.original_title) + '>' + U.esc(entry.original_title) + '</p>' : '') +
      '<p class="sheet-by">' + App.ui.byline(entry) + '</p>' +
      '<p class="sheet-stars">' + App.ui.stars(entry.rating) + '</p>' +
      '<div class="sheet-actions">' +
        '<button type="button" class="btn btn-tiny" data-form="' + U.esc(entry.id) + '">Edit</button>' +
        (ongoing ? '<button type="button" class="btn btn-tiny" data-finish="' + U.esc(entry.id) + '">Mark as finished</button>' : '') +
        '<button type="button" class="btn btn-tiny btn-danger" data-del="' + U.esc(entry.id) + '">Delete</button>' +
      '</div>' +
    '</header><div class="sheet-body">';

    html += entry.notes.trim() ? '<div class="sheet-notes">' + U.para(entry.notes, U.langAttr(entry.notes)) + '</div>'
      : '<p class="sheet-notes empty-note">No note yet. Open Edit and write what you actually thought.</p>';

    if (entry.quotes.length) {
      html += '<div class="sheet-quotes">' + entry.quotes.map(function (q) { return '<blockquote' + U.langAttr(q) + '>' + U.esc(q) + '</blockquote>'; }).join('') + '</div>';
    }

    if (entry.genres.length || entry.tags.length) {
      html += '<div class="sheet-chips">' + App.ui.chips(entry.genres, 'genre') + App.ui.chips(entry.tags, 'tag') + '</div>';
    }

    html += '<dl class="facts">' +
      '<div><dt>Logged</dt><dd>' + U.esc(U.fmtDay(entry.finished_at)) + '</dd></div>' +
      '<div><dt>Credits</dt><dd>' + (entry.creators.length ? entry.creators.map(function (c) { return '<span' + U.langAttr(c.role + ' ' + c.name) + '>' + U.esc(c.role) + ' &mdash; ' + U.esc(c.name) + '</span>'; }).join('<br>') : '&mdash;') + '</dd></div>' +
      (pair ? '<div><dt>' + U.esc(U.kindRank(pair.type) < U.kindRank(entry.type) ? 'Source ' + U.kind(pair.type).sourceWord : 'Adapted as') + '</dt><dd><a href="#/e/' + U.esc(pair.id) + '"' + U.langAttr(pair.title) + '>' + U.esc(pair.title) + '</a> &middot; ' + App.ui.stars(pair.rating) + '</dd></div>' : '') +
    '</dl>';

    if (related.length) {
      html += '<h3 class="sheet-h3">Close in your own diary</h3><ul class="reco-list">' + related.map(App.ui.recoRow).join('') + '</ul>';
    }

    if (delve.length) {
      html += '<h3 class="sheet-h3">Dig deeper from here</h3>';
      delve.forEach(function (d) {
        html += '<div class="ladder ladder-inline"><h4 class="ladder-title">' + U.esc(d.ladder.title) +
          ' <span class="ladder-tag">' + U.esc(d.ladder.tag) + '</span></h4>' +
          '<p class="ladder-q">' + U.esc(d.ladder.question) + '</p>' +
          App.ui.ladderGroups(d.ladder, { unloggedOnly: true }) + '</div>';
      });
    }

    return html + '</div>';
  }

  function adaptationPeers(type, excludeId) {
    return App.store.all().filter(function (x) { return x.type !== U.cleanKind(type) && x.id !== excludeId; });
  }

  function adaptationHtml(peers, selected) {
    return '<option value="">&mdash; none &mdash;</option>' + optionList(peers.map(function (o) {
      return { value: o.id, label: o.title + (o.year ? ' (' + o.year + ')' : '') };
    }), selected || '');
  }

  function formHtml(src, isNew) {
    const e = Object.assign({
      type: 'book', title: '', original_title: '', year: '', creators: [], status: 'done',
      rating: null, finished_at: U.today(), genres: [], tags: [], adaptation_of: null, notes: '', quotes: []
    }, src || {});
    const peers = adaptationPeers(e.type, e.id);
    const tagOptions = App.store.allTags().map(function (t) { return '<option value="' + U.esc(t) + '"></option>'; }).join('');
    const genreOptions = App.store.allGenres().map(function (t) { return '<option value="' + U.esc(t) + '"></option>'; }).join('');

    const stars = [1, 2, 3, 4, 5].map(function (n) {
      return '<label class="star-pick"><input type="radio" name="rating" value="' + n + '"' + (e.rating === n ? ' checked' : '') + '><span aria-hidden="true">&#9733;</span><span class="sr-only">' + n + '</span></label>';
    }).join('') + '<button type="button" class="btn btn-tiny star-clear" data-clear-rating>none</button>';

    return '<header class="sheet-head"><div class="sheet-kicker">' + (isNew ? 'New entry' : 'Edit entry') + '</div>' +
      '<h2 id="sheet-heading">' + (isNew ? 'Add to the diary' : U.esc(e.title)) + '</h2></header>' +
      '<form class="sheet-body form" id="entry-form" novalidate>' +
      '<div class="form-row form-row-split">' +
        field('type', 'Kind',
          '<div class="segmented segmented-kind">' + U.KINDS.map(function (k) {
            return '<label><input type="radio" name="type" value="' + k.value + '"' + (e.type === k.value ? ' checked' : '') + '><span>' + k.chip + '</span></label>';
          }).join('') + '</div>') +
        field('finished_at', 'Date', '<input type="date" name="finished_at" value="' + U.esc(e.finished_at) + '">') +
      '</div>' +
      '<div class="form-row">' +
        field('title', 'Title', '<input type="text" name="title" id="f-title" value="' + U.esc(e.title) + '" autocomplete="off" placeholder="What you read or watched" required>') +
        '<button type="button" class="btn btn-tiny form-lookup" id="btn-lookup">Find details</button>' +
      '</div>' +
      '<div id="lookup-results" class="lookup-results" hidden></div>' +
      '<div class="form-row form-row-split">' +
        field('original_title', 'Original title', '<input type="text" name="original_title" value="' + U.esc(e.original_title) + '" placeholder="if different">') +
        field('year', 'Year', '<input type="text" name="year" inputmode="numeric" value="' + U.esc(e.year || '') + '" placeholder="1974">') +
      '</div>' +
      field('creators', 'Credits', '<textarea name="creators" rows="2" placeholder="One per line. Add a role only when it is not the main one&#10;Andrei Tarkovsky&#10;writer: Robert Towne">' + U.esc(creditsToText(e.creators, e.type)) + '</textarea>',
        'One per line. Role goes before a colon; it defaults to author, director or creator. Chinese names and roles work: 导演: 张艺谋.') +
      '<div class="form-row form-row-split">' +
        field('rating', 'Rating', '<div class="star-picker" id="star-picker">' + stars + '</div>') +
        field('status', 'Status', '<div class="segmented"><label><input type="radio" name="status" value="done"' + (e.status === 'done' ? ' checked' : '') + '><span>Finished</span></label>' +
          '<label><input type="radio" name="status" value="ongoing"' + (e.status === 'ongoing' ? ' checked' : '') + '><span>In progress</span></label></div>') +
      '</div>' +
      field('notes', 'Notes', '<textarea name="notes" rows="7" placeholder="Write it like a diary, not like a review. Who were you with, what did it remind you of, which bit lost you.">' + U.esc(e.notes) + '</textarea>') +
      field('quotes', 'Lines you want to keep', '<textarea name="quotes" rows="3" placeholder="One quotation per line">' + U.esc((e.quotes || []).join('\n')) + '</textarea>') +
      '<div class="form-row form-row-split">' +
        field('tags', 'Tags', '<input type="text" name="tags" list="tag-suggest" value="' + U.esc(e.tags.join(', ')) + '" placeholder="noir, city, memory" autocomplete="off"><datalist id="tag-suggest">' + tagOptions + '</datalist>',
          'Lower case, comma separated. Chinese tags work too (\u8bb0\u5fc6, \u57ce\u5e02). These drive every suggestion.') +
        field('genres', 'Genres', '<input type="text" name="genres" list="genre-suggest" value="' + U.esc(e.genres.join(', ')) + '" autocomplete="off"><datalist id="genre-suggest">' + genreOptions + '</datalist>') +
      '</div>' +
      field('adaptation_of', 'The other version of this',
        '<select name="adaptation_of">' + adaptationHtml(peers, e.adaptation_of) + '</select>',
        peers.length ? 'The book, film or series in your diary that this one adapts, either way round. The order is worked out from the kinds.' : 'Nothing of another kind in the diary yet to link to.') +
      '<p class="form-error" id="form-error" hidden></p>' +
      '<div class="form-foot">' +
        '<button type="submit" class="btn btn-primary">' + (isNew ? 'Save entry' : 'Update entry') + '</button>' +
        '<button type="button" class="btn btn-quiet" data-close>Cancel</button>' +
      '</div>' +
      '</form>';
  }

  function open(kind, payload) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    lastFocus = document.activeElement;
    const id = typeof payload === 'string' ? payload : (payload && payload.id) || null;
    const draft = (payload && typeof payload === 'object' && payload.draft) ? payload.draft : null;
    current = { kind: kind, id: id, draft: draft };
    render();
    sheet().hidden = false;
    scrim().hidden = false;
    document.body.classList.add('sheet-open');
    requestAnimationFrame(function () {
      sheet().classList.add('in');
      const target = sheet().querySelector('input, textarea, select, button');
      if (target) target.focus();
    });
  }

  function close() {
    if (!current) return;
    current = null;
    sheet().classList.remove('in');
    document.body.classList.remove('sheet-open');
    hideTimer = setTimeout(function () {
      hideTimer = null;
      sheet().hidden = true;
      sheet().innerHTML = '';
      scrim().hidden = true;
    }, 180);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    if ((location.hash || '').indexOf('#/e/') === 0) location.hash = '#/' + (App.ui.lastView || 'diary');
  }

  function render() {
    if (!current) return;
    if (current.kind === 'view') {
      const entry = App.store.get(current.id);
      if (!entry) { close(); return; }
      sheet().innerHTML = viewHtml(entry);
      sheet().scrollTop = 0;
      return;
    }
    if (current.kind === 'panel') {
      sheet().innerHTML = '<header class="sheet-head"><h2 id="sheet-heading">' + U.esc(current.title) + '</h2></header><div class="sheet-body">' + current.html + '</div>';
      sheet().scrollTop = 0;
      return;
    }
    const entry = current.id ? App.store.get(current.id) : null;
    sheet().innerHTML = formHtml(entry || current.draft || null, !entry);
    sheet().scrollTop = 0;
  }

  function openPanel(title, html) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    lastFocus = document.activeElement;
    current = { kind: 'panel', title: title, html: html };
    render();
    sheet().hidden = false;
    scrim().hidden = false;
    document.body.classList.add('sheet-open');
    requestAnimationFrame(function () { sheet().classList.add('in'); });
  }

  function readForm(root) {
    const fd = new FormData(root);
    const type = U.cleanKind(fd.get('type'));
    const ratingRaw = fd.get('rating');
    return {
      type: type,
      title: String(fd.get('title') || '').trim(),
      original_title: String(fd.get('original_title') || '').trim(),
      year: String(fd.get('year') || '').trim(),
      creators: parseCredits(fd.get('creators'), type),
      status: fd.get('status') === 'ongoing' ? 'ongoing' : 'done',
      rating: ratingRaw ? Number(ratingRaw) : null,
      finished_at: String(fd.get('finished_at') || U.today()),
      genres: parseList(fd.get('genres')),
      tags: parseList(fd.get('tags')).map(U.norm),
      adaptation_of: String(fd.get('adaptation_of') || '') || null,
      notes: String(fd.get('notes') || ''),
      quotes: String(fd.get('quotes') || '').split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean)
    };
  }

  function wire(root) {
    U.on(root, 'change', '[name=type]', function (ev, input) {
      const form = input.closest('#entry-form');
      const sel = form && form.querySelector('[name=adaptation_of]');
      if (!sel) return;
      const peers = adaptationPeers(input.value, current && current.id);
      const keep = peers.some(function (o) { return o.id === sel.value; }) ? sel.value : '';
      sel.innerHTML = adaptationHtml(peers, keep);
    });

    U.on(root, 'submit', '#entry-form', function (ev, form) {
      ev.preventDefault();
      const data = readForm(form);
      const err = document.getElementById('form-error');
      if (!data.title) {
        if (err) { err.textContent = 'A title is the one thing I need.'; err.hidden = false; }
        const t = form.querySelector('[name=title]');
        if (t) t.focus();
        return;
      }
      if (current && current.id) {
        App.store.update(current.id, data);
        const id = current.id;
        App.ui.toast('Entry updated.', 'ok');
        open('view', id);
      } else {
        const made = App.store.add(data);
        App.ui.toast('Logged.', 'ok');
        close();
        location.hash = '#/e/' + made.id;
      }
    });

    root.addEventListener('click', function (ev) {
      const clear = ev.target.closest('[data-clear-rating]');
      if (clear) {
        root.querySelectorAll('#star-picker input').forEach(function (i) { i.checked = false; });
        return;
      }
      const editBtn = ev.target.closest('[data-form]');
      if (editBtn) { open('form', { id: editBtn.getAttribute('data-form') }); return; }

      const finish = ev.target.closest('[data-finish]');
      if (finish) {
        App.store.update(finish.getAttribute('data-finish'), { status: 'done' });
        App.ui.toast('Marked finished. Add a rating while you are here.', 'ok');
        return;
      }

      const del = ev.target.closest('[data-del]');
      if (del) {
        const id = del.getAttribute('data-del');
        const e = App.store.get(id);
        if (!e) return;
        if (!window.confirm('Delete \u201c' + e.title + '\u201d from the diary? This cannot be undone.')) return;
        App.store.remove(id);
        close();
        App.ui.toast('Deleted.', 'ok');
        return;
      }

      const logItem = ev.target.closest('[data-log-item]');
      if (logItem) {
        const bits = logItem.getAttribute('data-log-item').split('|');
        const draft = App.reco.draftFor(bits[0], bits[1]);
        close();
        setTimeout(function () { open('form', { draft: draft }); }, 60);
        return;
      }

      const lookup = ev.target.closest('#btn-lookup');
      if (lookup) doLookup(root);
    });
  }

  function doLookup(form) {
    const out = document.getElementById('lookup-results');
    const title = form.querySelector('[name=title]');
    const type = (form.querySelector('[name=type]:checked') || {}).value || 'book';
    if (!out || !title) return;
    if (!navigator.onLine) {
      out.hidden = false;
      out.innerHTML = '<p class="lookup-note">You are offline. OpenLibrary is the only external call in this app, and everything else works without it.</p>';
      return;
    }
    out.hidden = false;
    out.innerHTML = '<p class="lookup-note">Searching OpenLibrary&hellip;</p>';
    App.enrich.search(title.value, type).then(function (res) {
      if (!res.results.length) { out.innerHTML = '<p class="lookup-note">' + U.esc(res.note) + '</p>'; return; }
      out.innerHTML = '<p class="lookup-note">Pick one to fill the form:</p><ul class="lookup-list">' + res.results.map(function (r, i) {
        return '<li><button type="button" data-pick="' + i + '">' + U.esc(r.title) +
          '<span class="lookup-meta">' + U.esc(U.list(r.creators.map(function (c) { return c.name; }))) + (r.year ? ', ' + r.year : '') + '</span></button></li>';
      }).join('') + '</ul>';
      U.on(out, 'click', '[data-pick]', function (ev, btn) {
        const r = res.results[Number(btn.getAttribute('data-pick'))];
        if (!r) return;
        title.value = r.title;
        if (r.year) form.querySelector('[name=year]').value = r.year;
        form.querySelector('[name=creators]').value = creditsToText(r.creators, type);
        out.innerHTML = '<p class="lookup-note">Filled from OpenLibrary. Check the year before saving.</p>';
      });
    });
  }

  App.ui.sheet = {
    open: open,
    close: close,
    openPanel: openPanel,
    render: render,
    isOpen: function () { return !!current; },
    currentId: function () { return current ? current.id : null; },
    wire: wire
  };

  wire(document.getElementById('sheet'));
})(App);
