'use strict';

(function (App) {
  const U = App.util;

  function ladders() { return window.LADDERS || {}; }

  function loggedTitles() {
    const set = {};
    App.store.all().forEach(function (e) {
      set[U.norm(e.title)] = e;
      if (e.original_title) set[U.norm(e.original_title)] = e;
    });
    return set;
  }

  function decorate(item, logged) {
    const key = U.norm(item.title);
    const hit = logged[key] || null;
    return {
      item: item,
      logged: !!hit,
      loggedId: hit ? hit.id : null,
      loggedRating: hit ? hit.rating : null
    };
  }

  function rungSummary(items) {
    const order = [1, 2, 3];
    const labels = { 1: 'Wider', 2: 'Deeper', 3: 'The hard turn' };
    return order.map(function (lvl) {
      return {
        level: lvl,
        label: labels[lvl],
        items: items.filter(function (d) { return d.item.level === lvl; })
      };
    }).filter(function (g) { return g.items.length; });
  }

  App.reco.ladderFor = function (tag) {
    const lad = ladders()[U.norm(tag)];
    if (!lad) return null;
    const logged = loggedTitles();
    const items = lad.rungs.map(function (r) { return decorate(r, logged); });
    return {
      tag: lad.tag,
      title: lad.title,
      question: lad.question,
      total: items.length,
      remaining: items.filter(function (d) { return !d.logged; }).length,
      groups: rungSummary(items)
    };
  };

  App.reco.allLadders = function () {
    const order = window.LADDER_ORDER || Object.keys(ladders());
    return order.map(App.reco.ladderFor).filter(Boolean);
  };

  function ladderScore(tag, idf, affMap, ownTags) {
    const lad = ladders()[tag];
    if (!lad) return 0;
    let s = (affMap[tag] || 0) * 1.2 + (idf[tag] || 0) * 0.6;
    if (ownTags && ownTags.indexOf(tag) >= 0) s += 2.5;
    return s;
  }

  App.reco.delveForEntry = function (entry, limit) {
    const idf = App.reco.idf();
    const affMap = {};
    App.reco.affinity().forEach(function (r) { affMap[r.tag] = r.weight; });
    const tags = Object.keys(ladders());
    return tags
      .map(function (t) {
        const matched = (entry.tags || []).filter(function (x) { return x === t; });
        return { ladder: App.reco.ladderFor(t), matched: matched, score: ladderScore(t, idf, affMap, entry.tags) };
      })
      .filter(function (r) { return r.matched.length && r.ladder.remaining > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 2);
  };

  App.reco.threads = function (limit) {
    const aff = App.reco.affinity();
    return aff
      .map(function (rec) { return { rec: rec, ladder: App.reco.ladderFor(rec.tag) }; })
      .filter(function (r) { return r.ladder && r.rec.count >= 2; })
      .sort(function (a, b) { return b.rec.weight - a.rec.weight; })
      .slice(0, limit || 3);
  };

  App.reco.openDoors = function (limit) {
    const aff = App.reco.affinity();
    return aff
      .filter(function (rec) {
        if (rec.count !== 1) return false;
        const e = rec.entries[0];
        return e && e.rating !== null && e.rating >= 4 && App.reco.ladderFor(rec.tag);
      })
      .map(function (rec) { return { rec: rec, ladder: App.reco.ladderFor(rec.tag) }; })
      .slice(0, limit || 3);
  };

  App.reco.exhausted = function () {
    return App.reco.allLadders().filter(function (l) { return l.remaining === 0; });
  };

  App.reco.ladderToDraft = function (item, tag) {
    const type = U.cleanKind(item.kind);
    return {
      type: type,
      title: item.title,
      year: item.year,
      creators: item.by ? [{ role: U.kindRole(type), name: item.by }] : [],
      tags: tag ? [tag] : [],
      status: 'done',
      notes: ''
    };
  };

  App.reco.draftFor = function (tag, title) {
    const ladder = App.reco.ladderFor(tag);
    if (!ladder) return null;
    const want = U.norm(title);
    let found = null;
    ladder.groups.forEach(function (g) {
      g.items.forEach(function (d) { if (!found && U.norm(d.item.title) === want) found = d.item; });
    });
    return found ? App.reco.ladderToDraft(found, ladder.tag) : null;
  };
})(App);
