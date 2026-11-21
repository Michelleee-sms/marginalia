'use strict';

(function (App) {
  const U = App.util;

  function sharedValues(a, b) {
    const out = [];
    (a.tags || []).forEach(function (t) { if ((b.tags || []).indexOf(t) >= 0) out.push(t); });
    return out;
  }

  function sharedCreators(a, b) {
    const out = [];
    (a.creators || []).forEach(function (ca) {
      (b.creators || []).forEach(function (cb) {
        if (U.norm(ca.name) === U.norm(cb.name)) out.push(ca);
      });
    });
    return out;
  }

  function scorePair(a, b, idf, affinityMap) {
    const shared = sharedValues(a, b);
    const denom = Math.sqrt(Math.max(1, (a.tags || []).length) * Math.max(1, (b.tags || []).length));
    let raw = 0;
    let tagPart = 0;
    shared.forEach(function (t) {
      const w = (idf[t] || 1) * (0.6 + 0.5 * Math.max(0, (affinityMap[t] || 0)));
      tagPart += w;
      raw += w;
    });
    raw = (tagPart / denom) * 2.4;

    const gens = (a.genres || []).filter(function (g) { return (b.genres || []).indexOf(g) >= 0; });
    if (gens.length) raw += Math.min(0.8, 0.4 * gens.length);

    const people = sharedCreators(a, b);
    if (people.length) raw += 3.2 + 0.6 * (people.length - 1);

    let reason = null;
    let priority = 0;

    if (a.adaptation_of === b.id || b.adaptation_of === a.id) {
      raw += 7; priority = 5; reason = { kind: 'pair', text: U.pairRelation(a, b) };
    }

    if (people.length && priority < 4) {
      priority = 4;
      const role = (people[0].role || 'author');
      reason = { kind: 'creator', text: 'same ' + role + ': ' + people[0].name };
    }

    const strongestTag = shared.slice().sort(function (x, y) { return (idf[y] || 0) - (idf[x] || 0); })[0];
    if (priority < 3 && strongestTag) {
      priority = 3;
      const extra = shared.length > 1 ? ' and ' + (shared.length - 1) + ' more' : '';
      reason = { kind: 'tag', text: 'shares \u2018' + strongestTag + '\u2019' + extra };
    } else if (priority === 3 && shared.length > 1) {
      reason = { kind: 'tag', text: 'shares \u2018' + strongestTag + '\u2019 and ' + (shared.length - 1) + ' more' };
    }

    if (priority < 3 && gens.length) {
      priority = 2;
      reason = { kind: 'genre', text: 'both ' + gens[0] };
    }

    if (a.type === b.type) raw *= 0.94;
    raw *= 0.72 + 0.11 * (b.rating === null ? 3 : b.rating);
    if (b.status === 'ongoing') raw *= 0.9;

    return { score: raw, shared: shared, reason: reason };
  }

  App.reco.related = function (entry, opts) {
    const options = opts || {};
    const limit = options.limit || 5;
    const idf = App.reco.idf();
    const affMap = {};
    App.reco.affinity().forEach(function (r) { affMap[r.tag] = r.weight; });

    return App.store.all()
      .filter(function (e) { return e.id !== entry.id; })
      .map(function (e) {
        const s = scorePair(entry, e, idf, affMap);
        return { entry: e, score: Math.round(s.score * 100) / 100, shared: s.shared, reason: s.reason };
      })
      .filter(function (r) { return r.score > 0.45 && r.reason && r.reason.kind !== 'genre'; })
      .sort(function (a, b) { return b.score - a.score || (a.entry.finished_at < b.entry.finished_at ? 1 : -1); })
      .slice(0, limit);
  };

  App.reco.alsoFromShelf = function (limit) {
    const entries = App.store.all().filter(function (e) { return e.status !== 'ongoing'; });
    if (entries.length < 2) return [];
    const idf = App.reco.idf();
    const affMap = {};
    App.reco.affinity().forEach(function (r) { affMap[r.tag] = r.weight; });

    const best = {};
    entries.forEach(function (a) {
      entries.forEach(function (b) {
        if (a.id === b.id) return;
        const s = scorePair(a, b, idf, affMap);
        if (!s.reason || s.reason.kind === 'genre' || s.score <= 0.45) return;
        if (b.status === 'ongoing') return;
        if (!best[b.id] || best[b.id].score < s.score) best[b.id] = { entry: b, score: s.score, reason: s.reason, from: a };
      });
    });
    return Object.keys(best).map(function (k) { return best[k]; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 4);
  };
})(App);
