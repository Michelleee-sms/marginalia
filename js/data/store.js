'use strict';

(function (App) {
  const U = App.util;
  const VERSION = 1;

  function key() { return App.profiles.dataKey(App.profiles.id()); }

  let state = null;
  const listeners = [];

  function normalizeEntry(raw) {
    const src = raw || {};
    const creators = Array.isArray(src.creators)
      ? src.creators
          .map(function (c) {
            if (typeof c === 'string') return { role: 'author', name: c.trim() };
            return { role: String((c && c.role) || 'author'), name: String((c && c.name) || '').trim() };
          })
          .filter(function (c) { return c.name; })
      : [];
    const cleanList = function (v) {
      const arr = Array.isArray(v) ? v : String(v || '').split(',');
      return U.uniq(arr.map(function (s) { return String(s).trim(); }).filter(Boolean));
    };
    const type = U.cleanKind(src.type);
    const rating = src.rating === null || src.rating === undefined || src.rating === '' ? null : Math.max(1, Math.min(5, Number(src.rating) || 0));

    return {
      id: src.id || U.uid('e'),
      type: type,
      title: String(src.title || '').trim() || 'Untitled',
      original_title: String(src.original_title || '').trim(),
      year: src.year ? Number(src.year) : null,
      creators: creators,
      status: src.status === 'ongoing' ? 'ongoing' : 'done',
      rating: rating,
      finished_at: U.parseDay(src.finished_at) ? src.finished_at : U.today(),
      genres: cleanList(src.genres),
      tags: cleanList(src.tags).map(function (t) { return U.norm(t); }),
      adaptation_of: src.adaptation_of || null,
      notes: String(src.notes || ''),
      quotes: (Array.isArray(src.quotes) ? src.quotes : []).map(String).filter(Boolean),
      created_at: src.created_at || new Date().toISOString(),
      updated_at: src.updated_at || src.created_at || new Date().toISOString()
    };
  }

  function buildSeed() {
    const list = (window.SEED_ENTRIES || []).map(normalizeEntry);
    const byId = {};
    list.forEach(function (e) { byId[e.id] = true; });
    return list.map(function (e) {
      if (e.adaptation_of && !byId[e.adaptation_of]) e.adaptation_of = null;
      return e;
    });
  }

  function fresh(withSample) {
    return {
      version: VERSION,
      created: U.today(),
      seeded: !!withSample,
      last_export: null,
      entries: withSample ? buildSeed() : []
    };
  }

  function persist() {
    if (!App.profiles.id()) return false;
    try {
      localStorage.setItem(key(), JSON.stringify(state));
      return true;
    } catch (err) {
      if (App.ui && App.ui.toast) App.ui.toast('Could not save: this browser\u2019s storage is full. Export a backup.', 'bad');
      return false;
    }
  }

  function emit() {
    listeners.forEach(function (fn) { fn(); });
  }

  function readSaved() {
    let raw = null;
    try { raw = localStorage.getItem(key()); } catch (err) { return null; }
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.entries)) return null;
      return {
        version: VERSION,
        created: parsed.created || U.today(),
        seeded: !!parsed.seeded,
        last_export: parsed.last_export || null,
        entries: parsed.entries.map(normalizeEntry)
      };
    } catch (err) {
      App.ui.toast('Saved data could not be read. Starting an empty diary.', 'bad');
      return null;
    }
  }

  function load() {
    if (state) return state;
    if (!App.profiles.id()) {
      state = fresh(false);
      return state;
    }
    const saved = readSaved();
    state = saved || fresh(false);
    if (!saved) persist();
    return state;
  }

  function sorted(list) {
    return list.slice().sort(function (a, b) {
      const ka = a.finished_at + (a.created_at || '');
      const kb = b.finished_at + (b.created_at || '');
      if (ka === kb) return a.id < b.id ? 1 : -1;
      return ka < kb ? 1 : -1;
    });
  }

  App.store = {
    all: function () { return sorted(load().entries); },
    raw: function () { return load().entries; },
    get: function (id) {
      return load().entries.filter(function (e) { return e.id === id; })[0] || null;
    },
    add: function (partial) {
      const entry = normalizeEntry(partial);
      load().entries.push(entry);
      persist();
      emit();
      return entry;
    },
    update: function (id, patch) {
      const entry = App.store.get(id);
      if (!entry) return null;
      const merged = normalizeEntry(Object.assign({}, entry, patch, { id: entry.id, created_at: entry.created_at }));
      Object.keys(entry).forEach(function (k) { delete entry[k]; });
      Object.keys(merged).forEach(function (k) { entry[k] = merged[k]; });
      entry.updated_at = new Date().toISOString();
      persist();
      emit();
      return entry;
    },
    remove: function (id) {
      const list = load().entries;
      const idx = list.findIndex(function (e) { return e.id === id; });
      if (idx < 0) return false;
      list.splice(idx, 1);
      list.forEach(function (e) { if (e.adaptation_of === id) e.adaptation_of = null; });
      persist();
      emit();
      return true;
    },
    pairOf: function (entry) {
      if (!entry || !entry.adaptation_of) return null;
      return App.store.get(entry.adaptation_of);
    },
    pairs: function () {
      const out = [];
      const seen = {};
      App.store.all().forEach(function (e) {
        if (!e.adaptation_of) return;
        const other = App.store.get(e.adaptation_of);
        if (!other || other.type === e.type) return;
        const key = [e.id, other.id].sort().join('|');
        if (seen[key]) return;
        seen[key] = true;
        const ordered = U.kindRank(e.type) <= U.kindRank(other.type) ? [e, other] : [other, e];
        out.push({ source: ordered[0], version: ordered[1] });
      });
      return out;
    },
    tagCounts: function () {
      const map = {};
      App.store.all().forEach(function (e) {
        e.tags.forEach(function (t) { map[t] = (map[t] || 0) + 1; });
      });
      return map;
    },
    allTags: function () { return Object.keys(App.store.tagCounts()).sort(U.compareText); },
    allGenres: function () {
      const set = {};
      App.store.all().forEach(function (e) { e.genres.forEach(function (g) { set[g] = 1; }); });
      return Object.keys(set).sort(U.compareText);
    },
    creatorNames: function () {
      const set = {};
      App.store.all().forEach(function (e) { e.creators.forEach(function (c) { set[c.name] = 1; }); });
      return Object.keys(set).sort(U.compareText);
    },
    exportText: function () {
      load();
      return JSON.stringify(state, null, 2);
    },
    markExported: function () {
      load();
      state.last_export = new Date().toISOString();
      persist();
    },
    importText: function (text) {
      let parsed;
      try { parsed = JSON.parse(text); } catch (err) { return { ok: false, error: 'That file is not valid JSON.' }; }
      if (!parsed || !Array.isArray(parsed.entries)) return { ok: false, error: 'No entries array found in that file.' };
      const incoming = parsed.entries.map(normalizeEntry);
      const mode = parsed.version === VERSION ? 'replace' : 'upgrade';
      state = {
        version: VERSION,
        created: (state && state.created) || parsed.created || U.today(),
        seeded: !!parsed.seeded,
        last_export: parsed.last_export || null,
        entries: incoming
      };
      persist();
      emit();
      return { ok: true, count: incoming.length, mode: mode };
    },
    appendSamples: function () {
      const have = {};
      load().entries.forEach(function (e) { have[e.type + '|' + U.norm(e.title)] = true; });
      const adding = buildSeed().filter(function (e) { return !have[e.type + '|' + U.norm(e.title)]; });
      state.entries = state.entries.concat(adding);
      persist();
      emit();
      return adding.length;
    },
    clear: function () {
      state = fresh(false);
      persist();
      emit();
    },
    onChange: function (fn) { listeners.push(fn); },
    meta: function () { load(); return state; },
    bootstrap: function (withSamples) {
      state = fresh(!!withSamples);
      return persist();
    },
    resetCache: function () { state = null; }
  };
})(App);
