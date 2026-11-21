'use strict';

(function (App) {
  const U = App.util;

  function entryValue(e) {
    if (e.rating === null) return e.status === 'ongoing' ? 0.15 : 0.25;
    return (e.rating - 3) / 2;
  }

  function decay(e) {
    const d = U.parseDay(e.finished_at);
    if (!d) return 1;
    const days = Math.max(0, (Date.now() - d.getTime()) / 86400000);
    return 0.55 + 0.45 * Math.exp(-days / 420);
  }

  App.reco.affinity = function (field) {
    const key = field || 'tags';
    const map = {};
    const entries = App.store.all();
    entries.forEach(function (e) {
      (e[key] || []).forEach(function (t) {
        const k = key === 'tags' ? t : U.norm(t);
        if (!map[k]) map[k] = { tag: k, weight: 0, count: 0, entries: [] };
        map[k].weight += entryValue(e) * decay(e) + 0.12;
        map[k].count += 1;
        map[k].entries.push(e);
      });
    });
    return Object.keys(map).map(function (k) {
      const rec = map[k];
      rec.weight = Math.round(rec.weight * 1000) / 1000;
      rec.entries.sort(function (a, b) { return a.finished_at < b.finished_at ? 1 : -1; });
      return rec;
    }).sort(function (a, b) { return b.weight - a.weight || b.count - a.count || (a.tag < b.tag ? -1 : 1); });
  };

  App.reco.idf = function () {
    const entries = App.store.all();
    const n = entries.length || 1;
    const df = {};
    entries.forEach(function (e) {
      U.uniq(e.tags).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
    });
    const out = {};
    Object.keys(df).forEach(function (t) { out[t] = Math.log(1 + n / df[t]); });
    return out;
  };

  App.reco.creatorIndex = function () {
    const map = {};
    App.store.all().forEach(function (e) {
      e.creators.forEach(function (c) {
        const k = U.norm(c.name);
        if (!k) return;
        if (!map[k]) map[k] = { name: c.name, role: c.role, entries: [] };
        map[k].entries.push(e);
      });
    });
    return map;
  };

  App.reco.topCreators = function (limit) {
    const idx = App.reco.creatorIndex();
    return Object.keys(idx)
      .map(function (k) { return idx[k]; })
      .filter(function (c) { return c.entries.length > 1; })
      .sort(function (a, b) { return b.entries.length - a.entries.length; })
      .slice(0, limit || 6);
  };

  function zeroKinds() {
    const out = {};
    U.KINDS.forEach(function (k) { out[k.value] = 0; });
    return out;
  }

  App.reco.summary = function () {
    const entries = App.store.all();
    const rated = entries.filter(function (e) { return e.rating !== null; });
    const byKind = zeroKinds();
    const byMonth = {};
    entries.forEach(function (e) {
      const kind = U.cleanKind(e.type);
      byKind[kind] += 1;
      const k = String(e.finished_at || '').slice(0, 7);
      if (!k) return;
      if (!byMonth[k]) byMonth[k] = zeroKinds();
      byMonth[k][kind] += 1;
    });
    const dist = [0, 0, 0, 0, 0];
    rated.forEach(function (e) { dist[e.rating - 1] += 1; });
    return {
      total: entries.length,
      byKind: byKind,
      ongoing: entries.filter(function (e) { return e.status === 'ongoing'; }).length,
      rated: rated.length,
      average: rated.length ? Math.round((rated.reduce(function (s, e) { return s + e.rating; }, 0) / rated.length) * 10) / 10 : null,
      notesWritten: entries.filter(function (e) { return e.notes.trim().length > 0; }).length,
      quotes: entries.reduce(function (s, e) { return s + e.quotes.length; }, 0),
      months: Object.keys(byMonth).sort(),
      byMonth: byMonth,
      dist: dist,
      affinity: App.reco.affinity(),
      distinctTags: App.reco.affinity().length
    };
  };
})(App);
