'use strict';

(function (App) {
  const U = App.util;

  function bars(rows, max, unit) {
    return '<ul class="bars">' + rows.map(function (r) {
      const pct = max ? Math.max(3, Math.round((r.value / max) * 100)) : 0;
      return '<li class="bar-row"><span class="bar-label">' + U.esc(r.label) + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%' + (r.hue !== undefined ? ';--hue:' + r.hue : '') + '"></span></span>' +
        '<span class="bar-value">' + U.esc(r.value + (unit || '')) + '</span></li>';
    }).join('') + '</ul>';
  }

  function monthRows(byMonth) {
    const out = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + U.pad(d.getMonth() + 1);
      const rec = byMonth[key] || {};
      const counts = {};
      let total = 0;
      U.KINDS.forEach(function (k) {
        counts[k.value] = rec[k.value] || 0;
        total += counts[k.value];
      });
      out.push({
        key: key,
        label: d.toLocaleDateString('en-GB', { month: 'short' }) + (d.getMonth() === 0 || i === 11 ? ' ' + d.getFullYear() : ''),
        counts: counts,
        total: total
      });
    }
    return out;
  }

  function render(root) {
    const s = App.reco.summary();
    const entries = App.store.all();

    if (!entries.length) {
      root.innerHTML = '<div class="page"><header class="page-head"><h2>Patterns</h2></header>' +
        App.ui.empty('No shape yet', 'This page reads your own history: how your taste clusters, where it drifts, what you rate higher than you expected.') + '</div>';
      return;
    }

    const months = monthRows(s.byMonth);
    const maxMonth = Math.max.apply(null, months.map(function (m) { return m.total; }).concat([1]));

    let html = '<div class="page page-patterns">' +
      '<header class="page-head"><h2>Patterns</h2><p class="page-sub">Everything on this page is counted from your entries. No averages from anywhere else.</p></header>' +
      '<div class="stat-grid">' +
        stat(s.total, 'entries') + U.KINDS.map(function (k) { return stat(s.byKind[k.value], k.plural); }).join('') +
        stat(s.average === null ? '\u2014' : s.average, 'mean rating') +
        stat(s.distinctTags, 'distinct tags') + stat(s.notesWritten, 'notes written') +
      '</div>';

    html += App.ui.section('Twelve months', '<div class="month-chart">' + months.map(function (m) {
      const h = Math.round((m.total / maxMonth) * 100);
      const tip = U.list(U.KINDS.map(function (k) { return m.counts[k.value] ? U.plural(m.counts[k.value], k.label, k.plural) : ''; }).filter(Boolean));
      return '<div class="mcol" title="' + U.esc(m.label + ': ' + (tip || 'nothing logged')) + '">' +
        '<div class="mbar" style="height:' + Math.max(2, h) + '%">' +
          U.KINDS.slice().reverse().map(function (k) {
            return m.counts[k.value] ? '<span class="mseg mseg-' + k.value + '" style="flex:' + m.counts[k.value] + '"></span>' : '';
          }).join('') +
        '</div><span class="mlabel">' + U.esc(m.label.split(' ')[0]) + '</span></div>';
    }).join('') + '</div>' +
      '<p class="legend">' + U.KINDS.map(function (k) { return '<span class="dot dot-' + k.value + '"></span>' + k.plural; }).join(' ') + ' &middot; ' +
      U.plural(months.filter(function (m) { return m.total; }).length, 'active month', 'active months') + '</p>');

    const maxDist = Math.max.apply(null, s.dist.concat([1]));
    html += App.ui.section('How you actually rate', bars([5, 4, 3, 2, 1].map(function (n) {
      const v = s.dist[n - 1];
      return { label: n + '\u2605', value: v, hue: 120 - (5 - n) * 22 };
    }), maxDist), s.rated + ' of ' + s.total + ' entries carry a rating. Unrated ones still count towards your tags, just gently.');

    const aff = s.affinity.slice(0, 14);
    const maxAff = Math.max.apply(null, aff.map(function (a) { return a.weight; }).concat([0.001]));
    html += App.ui.section('What your taste leans on', bars(aff.map(function (a) {
      return { label: a.tag + ' (' + a.count + ')', value: Math.round(a.weight * 100) / 100, hue: U.hashHue(a.tag) };
    }), maxAff), 'Weight is your rating deviation, decayed over time, plus a little for sheer volume. Negative means you logged it and did not enjoy it.');

    const creators = App.reco.topCreators(8);
    if (creators.length) {
      html += App.ui.section('Repeats', '<ul class="person-list">' + creators.map(function (c) {
        return '<li><a href="#/library?q=' + encodeURIComponent(c.name) + '"><b>' + U.esc(c.name) + '</b> ' +
          '<span class="person-roles">' + U.esc(U.list(U.uniq(c.entries.map(function (e) { return e.creators.filter(function (x) { return U.norm(x.name) === U.norm(c.name); }).map(function (x) { return x.role; }); })))) + '</span></a>' +
          '<span class="person-items">' + c.entries.map(function (e) { return U.esc(e.title) + (e.rating ? ' ' + e.rating + '\u2605' : ''); }).join(' &middot; ') + '</span></li>';
      }).join('') + '</ul>', 'Names that show up more than once. This is the strongest signal the recommender uses.');
    }

    const bestRated = entries.filter(function (e) { return e.rating === 5; });
    if (bestRated.length) {
      html += App.ui.section('Your five-star shelf', '<div class="stack stack-tight">' + bestRated.slice(0, 6).map(function (e) { return App.ui.card(e, { compact: true }); }).join('') + '</div>');
    }

    html += '</div>';
    root.innerHTML = html;
  }

  function stat(value, label) {
    return '<div class="stat"><b>' + U.esc(String(value)) + '</b><span>' + U.esc(label) + '</span></div>';
  }

  App.views.patterns = { render: render };
})(App);
