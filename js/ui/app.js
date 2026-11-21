'use strict';

(function (App) {
  const U = App.util;
  const MAIN_VIEWS = ['diary', 'library', 'delve', 'patterns'];

  App.ui.lastView = 'diary';

  function el(id) { return document.getElementById(id); }

  function parseHash() {
    const raw = String(location.hash || '').replace(/^#\/?/, '');
    const split = raw.split('?');
    const parts = split[0].split('/');
    const params = new URLSearchParams(split[1] || '');
    return { name: parts[0] || 'diary', id: parts[1] || null, params: params };
  }

  function setActive(name) {
    document.querySelectorAll('#tabs a').forEach(function (a) {
      const on = a.getAttribute('data-route') === name;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function setChromeVisible(shown) {
    ['tabs', 'btn-log', 'btn-menu'].forEach(function (id) {
      const node = el(id);
      if (node) node.hidden = !shown;
    });
    const who = el('btn-who');
    if (who) who.hidden = !shown || !App.profiles.current();
  }

  function renderMain(name) {
    const root = el('view');
    const hasProfile = !!App.profiles.current();
    setChromeVisible(hasProfile);
    if (hasProfile) App.views.people.chip();
    if (!hasProfile || name === 'people') {
      App.views.people.render(root);
      setActive('');
      const who = el('btn-who');
      if (who) who.hidden = true;
      renderColophon();
      return;
    }
    const view = App.views[name] || App.views.diary;
    view.render(root);
    setActive(name);
    renderColophon();
  }

  function route() {
    const h = parseHash();
    if (h.name === 'people') {
      if (App.ui.sheet.isOpen()) App.ui.sheet.close();
      renderMain('people');
      window.scrollTo(0, 0);
      return;
    }
    if (!App.profiles.current()) {
      renderMain('people');
      return;
    }
    if (h.name === 'e' && h.id && App.store.get(h.id)) {
      renderMain(App.ui.lastView);
      App.ui.sheet.open('view', h.id);
      return;
    }
    if (h.name === 'e') { location.hash = '#/diary'; return; }

    const name = MAIN_VIEWS.indexOf(h.name) >= 0 ? h.name : 'diary';
    App.ui.lastView = name;
    if (name === 'library') {
      const patch = {};
      if (h.params.get('tag')) patch.tag = h.params.get('tag');
      if (h.params.get('q')) patch.q = h.params.get('q');
      if (Object.keys(patch).length) App.views.library.setFilter(patch);
    }
    if (App.ui.sheet.isOpen()) App.ui.sheet.close();
    renderMain(name);
    window.scrollTo(0, 0);
  }

  function renderColophon() {
    const host = el('colophon');
    if (!App.profiles.current()) {
      host.innerHTML = '<span>Nothing is stored until you name a diary.</span>' +
        '<span class="colo-dot">&middot;</span><span>every diary on this browser stays separate</span>';
      return;
    }
    const meta = App.store.meta();
    const n = meta.entries.length;
    const last = meta.last_export ? U.fmtDay(meta.last_export.slice(0, 10)) : 'never';
    host.innerHTML = '<span>' + U.plural(n, 'entry') + ' in \u201c' + U.esc(App.profiles.current().name) + '\u201d, stored in this browser only</span>' +
      '<span class="colo-dot">&middot;</span><span>last backup: ' + U.esc(last) + '</span>' +
      '<span class="colo-dot">&middot;</span><span>Marginalia makes one optional network call, to OpenLibrary, and only when you press Find details</span>';
  }

  App.ui.refresh = function () {
    if (!App.profiles.current()) { renderMain('people'); return; }
    renderMain(App.ui.lastView);
    if (App.ui.sheet.isOpen()) App.ui.sheet.render();
  };

  function exportBackup() {
    const who = App.profiles.current();
    const text = App.store.exportText();
    U.download('marginalia-' + U.slug(who ? who.name : 'diary') + '-' + U.today() + '.json', text);
    App.store.markExported();
    App.ui.toast('Backup downloaded. Put it in a folder that syncs, like OneDrive.', 'ok');
  }

  function importBackup(file) {
    const held = App.store.meta().entries.length;
    const who = App.profiles.current();
    if (held && !window.confirm('Import replaces the ' + U.plural(held, 'entry') + ' already in \u201c' +
      (who ? who.name : 'this diary') + '\u201d with what is in this file. Continue?')) return;
    const reader = new FileReader();
    reader.onload = function () {
      const res = App.store.importText(String(reader.result));
      if (!res.ok) { App.ui.toast(res.error, 'bad'); return; }
      App.ui.toast('Imported ' + U.plural(res.count, 'entry') + '.', 'ok');
    };
    reader.onerror = function () { App.ui.toast('That file could not be read.', 'bad'); };
    reader.readAsText(file);
  }

  function aboutPanel() {
    const html = '<p class="lead">A diary first, a recommender second. Everything lives in this browser.</p>' +
      '<h3>Where the data is</h3><p>Each diary you name gets its own slot in <code>localStorage</code> on this machine, for this browser profile. Nothing is shared between them, and a new one starts empty. Clearing site data deletes everything, so use <em>Export a backup</em> before you switch browsers or machines &mdash; and keep it somewhere that survives: save the file into a folder that already syncs, OneDrive or Dropbox, and treat that as the copy you trust. Restore by importing the same file into the diary you want it in &mdash; it replaces what is there. Two devices hold two diaries until one imports the other&rsquo;s file, so export before you stop working and import where you resume.</p>' +
      '<h3>One address</h3><p>The diary lives wherever you open it from, per browser. If you use the hosted page, use <em>that</em> address on every device; entries made while opening the local folder are stored separately from entries made on the hosted page. The same goes for a private window, which forgets the shelf when you close it.</p>' +
      '<h3>Several people, one browser</h3><p>The name in the top bar is the diary you are writing in. <em>Switch diary</em> goes back to the picker. These are separate shelves, not accounts: anyone using this browser can open any of them, and there is no password because a password stored in the page would be as readable as the entries. For anything you truly want private, keep your own browser profile and export your own backups.</p>' +
      '<h3>Chinese titles, names and notes</h3><p>Any field accepts Chinese. Write \u6d3b\u7740 as the title and <em>To Live</em> as the original title, or the other way round \u2014 both show up and both are searchable. Tags can be Chinese too (\u8bb0\u5fc6, \u57ce\u5e02), and a credit line may use a Chinese role: <code>\u5bfc\u6f14: \u5f20\u827a\u8b00</code>. Sort order is pinyin-aware, so one shelf can hold \u4e09\u4f53 next to <i>Blade Runner</i>.</p>' +
      '<h3>How the suggestions work</h3><p>Three purely local calculations, in order of trust:</p><ul>' +
        '<li><b>Shared tags and credits</b>, weighted by how rare the tag is in your own diary. A shared <code>zone</code> tag counts for more than a shared <code>fiction</code> one, and a shared author outranks both.</li>' +
        '<li><b>Taste weight</b>, which is your rating minus the middle, decayed over roughly a year, plus a small bonus for volume. Unrated entries still register, faintly.</li>' +
        '<li><b>The ladders</b>, which are written by hand in <code>js/data/ladder.js</code>. Each is a tag, a question, and three rungs \u2014 Wider, Deeper, The hard turn. Edit that file to make the recommendations yours.</li>' +
      '</ul><p>No model scores anything here, so nothing drifts between visits and the reasoning is always stated in plain words on the card.</p>' +
      '<h3>The one network call</h3><p>The <em>Find details</em> button in the entry form queries OpenLibrary for a book title, year and authors. It is optional, it sends only what you typed, and films and series skip it entirely because a keyed source would mean storing a key in the page. Everything else works with the network off.</p>' +
      '<h3>Shortcuts</h3><p><kbd>N</kbd> new entry &middot; <kbd>/</kbd> search the library &middot; <kbd>Esc</kbd> close.</p>';
    App.ui.sheet.openPanel('How this works', html);
  }

  App.ui.go = function (hash) {
    if (String(location.hash) === hash) route();
    else location.hash = hash;
  };

  function wireChrome() {
    el('btn-log').addEventListener('click', function () { App.ui.sheet.open('form', { draft: null }); });
    el('btn-who').addEventListener('click', function () { App.ui.go('#/people'); });

    const menu = el('menu');
    const btnMenu = el('btn-menu');
    btnMenu.addEventListener('click', function (ev) {
      ev.stopPropagation();
      menu.hidden = !menu.hidden;
      btnMenu.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('click', function () { menu.hidden = true; btnMenu.setAttribute('aria-expanded', 'false'); });

    U.on(menu, 'click', '[data-menu]', function (ev, btn) {
      const what = btn.getAttribute('data-menu');
      menu.hidden = true;
      btnMenu.setAttribute('aria-expanded', 'false');
      if (what === 'export') exportBackup();
      if (what === 'import') el('file-input').click();
      if (what === 'about') aboutPanel();
      if (what === 'switch') App.ui.go('#/people');
      if (what === 'forget') {
        const who = App.profiles.current();
        if (!who) return;
        const n = App.store.all().length;
        if (!window.confirm('Delete the diary \u201c' + who.name + '\u201d and its ' + U.plural(n, 'entry') + '? Export a backup first if you might want them.')) return;
        App.profiles.remove(who.id);
        App.ui.toast('Diary deleted.', 'ok');
        App.ui.go('#/people');
      }
      if (what === 'sample') {
        const added = App.store.appendSamples();
        App.ui.toast(added ? added + ' sample entries added.' : 'You already have every sample entry.', added ? 'ok' : 'info');
      }
      if (what === 'wipe') {
        const n = App.store.all().length;
        if (!n) { App.ui.toast('Nothing to delete.', 'info'); return; }
        if (!window.confirm('Delete all ' + n + ' entries? Export a backup first if you might want them.')) return;
        App.store.clear();
        location.hash = '#/diary';
        App.ui.toast('Diary emptied.', 'ok');
      }
    });

    el('file-input').addEventListener('change', function (ev) {
      const f = ev.target.files && ev.target.files[0];
      if (f) importBackup(f);
      ev.target.value = '';
    });

    el('scrim').addEventListener('click', function () { App.ui.sheet.close(); });

    document.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-close]')) { ev.preventDefault(); App.ui.sheet.close(); }
    });

    document.addEventListener('keydown', function (ev) {
      const active = document.activeElement || document.body;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName);
      if (ev.key === 'Escape') { App.ui.sheet.close(); menu.hidden = true; return; }
      if (typing || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (!App.profiles.current()) return;
      if (ev.key === 'n' || ev.key === 'N') { ev.preventDefault(); App.ui.sheet.open('form', { draft: null }); }
      if (ev.key === '/') {
        ev.preventDefault();
        if (App.ui.lastView !== 'library') { location.hash = '#/library'; return; }
        const q = document.getElementById('lib-q');
        if (q) q.focus();
      }
    });

    window.addEventListener('hashchange', route);
    App.store.onChange(function () { App.ui.refresh(); });
  }

  function boot() {
    wireChrome();
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(App);
