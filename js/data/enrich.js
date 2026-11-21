'use strict';

(function (App) {
  const U = App.util;
  const BASE = 'https://openlibrary.org/search.json';

  function withTimeout(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, ms);
    return fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }, function (err) {
        clearTimeout(timer);
        throw err;
      });
  }

  App.enrich = {
    onlineSource: 'OpenLibrary',

    // Books only. Films and series need a keyed source (TMDB), deliberately left out of this local build.
    search: function (query, type) {
      if (U.cleanKind(type) !== 'book') return Promise.resolve({ results: [], note: 'No film or series lookup in the local build \u2014 enter details by hand.' });
      const q = String(query || '').trim();
      if (q.length < 2) return Promise.resolve({ results: [], note: 'Type at least two words.' });
      const url = BASE + '?q=' + encodeURIComponent(q) + '&limit=6&fields=key,title,author_name,first_publish_year';
      return withTimeout(url, 7000).then(function (data) {
        const results = (data.docs || []).map(function (d) {
          return {
            title: d.title,
            year: d.first_publish_year || null,
            creators: (d.author_name || []).slice(0, 3).map(function (n) { return { role: 'author', name: n }; })
          };
        }).filter(function (r) { return r.title; });
        return { results: results, note: results.length ? '' : 'Nothing came back \u2014 check the spelling or fill it in by hand.' };
      }, function () {
        return { results: [], note: 'Could not reach OpenLibrary. Everything still works filled in by hand.' };
      });
    }
  };
})(App);
