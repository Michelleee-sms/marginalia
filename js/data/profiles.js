'use strict';

(function (App) {
  const U = App.util;
  const LIST_KEY = 'marginalia.profiles';
  const CUR_KEY = 'marginalia.current';
  const PREFIX = 'marginalia.data.';
  const LEGACY_KEY = 'marginalia.v1';

  function ok(p) { return !!p && typeof p.id === 'string' && typeof p.name === 'string'; }

  function readList() {
    let raw = null;
    try { raw = localStorage.getItem(LIST_KEY); } catch (err) { return []; }
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(ok) : [];
    } catch (err) { return []; }
  }

  function writeList(list) {
    try { localStorage.setItem(LIST_KEY, JSON.stringify(list)); return true; }
    catch (err) { App.ui.toast('Could not save the diary list: storage is unavailable.', 'bad'); return false; }
  }

  // A single-diary install from before profiles existed becomes one diary, not a loss.
  function migrate() {
    const list = readList();
    if (list.length) return;
    let legacy = null;
    try { legacy = localStorage.getItem(LEGACY_KEY); } catch (err) { return; }
    if (!legacy) return;
    const profile = { id: U.uid('p'), name: 'Main diary', created: U.today(), last_used: U.today() };
    try {
      localStorage.setItem(PREFIX + profile.id, legacy);
      writeList([profile]);
      localStorage.removeItem(LEGACY_KEY);
    } catch (err) { /* leave the legacy key alone; the old build still reads it */ }
  }

  function touch(id) {
    const list = readList();
    list.forEach(function (p) { if (p.id === id) p.last_used = U.today(); });
    writeList(list);
  }

  App.profiles = {
    all: function () {
      migrate();
      return readList().sort(function (a, b) { return (a.last_used < b.last_used ? 1 : a.last_used > b.last_used ? -1 : 0); });
    },
    get: function (id) {
      return readList().filter(function (p) { return p.id === id; })[0] || null;
    },
    current: function () {
      const id = App.profiles.id();
      return id ? App.profiles.get(id) : null;
    },
    id: function () {
      migrate();
      let id = null;
      try { id = localStorage.getItem(CUR_KEY); } catch (err) { return null; }
      if (!id) return null;
      return App.profiles.get(id) ? id : null;
    },
    dataKey: function (id) { return PREFIX + id; },
    nameTaken: function (name) {
      const want = U.norm(name);
      return readList().some(function (p) { return U.norm(p.name) === want; });
    },
    create: function (name, withSamples) {
      const clean = String(name || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!clean) return { error: 'Give the diary a name.' };
      if (App.profiles.nameTaken(clean)) return { error: 'A diary called \u201c' + clean + '\u201d already exists here.' };
      const profile = { id: U.uid('p'), name: clean, created: U.today(), last_used: U.today() };
      const list = readList();
      list.push(profile);
      if (!writeList(list)) return { error: 'Storage is unavailable in this browser.' };
      try { localStorage.setItem(CUR_KEY, profile.id); } catch (err) {}
      App.store.bootstrap(!!withSamples);
      return { profile: profile };
    },
    use: function (id) {
      if (!App.profiles.get(id)) return false;
      try { localStorage.setItem(CUR_KEY, id); } catch (err) { return false; }
      touch(id);
      App.store.resetCache();
      return true;
    },
    leave: function () {
      try { localStorage.removeItem(CUR_KEY); } catch (err) {}
      App.store.resetCache();
    },
    remove: function (id) {
      const list = readList().filter(function (p) { return p.id !== id; });
      writeList(list);
      try { localStorage.removeItem(PREFIX + id); } catch (err) {}
      let cur = null;
      try { cur = localStorage.getItem(CUR_KEY); } catch (err) {}
      if (cur === id) {
        try { localStorage.removeItem(CUR_KEY); } catch (err) {}
      }
      App.store.resetCache();
      return list.length;
    },
    countFor: function (id) {
      let raw = null;
      try { raw = localStorage.getItem(PREFIX + id); } catch (err) { return 0; }
      if (!raw) return 0;
      try {
        const parsed = JSON.parse(raw);
        return parsed && Array.isArray(parsed.entries) ? parsed.entries.length : 0;
      } catch (err) { return 0; }
    },
    initials: function (name) { return U.initials(name); }
  };
})(App);
