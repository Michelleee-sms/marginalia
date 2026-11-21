'use strict';

window.App = {
  util: {},
  data: {},
  reco: {},
  ui: {},
  views: {}
};

(function (App) {
  const U = App.util;
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  U.esc = function (value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
  };

  U.uid = function (prefix) {
    return (prefix || 'e') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  U.clone = function (value) {
    return JSON.parse(JSON.stringify(value));
  };

  U.norm = function (text) {
    return String(text === null || text === undefined ? '' : text).trim().toLowerCase().replace(/\s+/g, ' ');
  };

  U.pad = function (n) { return String(n).padStart(2, '0'); };

  U.isoDay = function (date) {
    return date.getFullYear() + '-' + U.pad(date.getMonth() + 1) + '-' + U.pad(date.getDate());
  };

  U.today = function () { return U.isoDay(new Date()); };

  U.parseDay = function (iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  };

  U.dayLabel = function (iso) {
    const d = U.parseDay(iso);
    if (!d) return 'Undated';
    const today = new Date();
    const diff = Math.round((U.parseDay(U.isoDay(today)) - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff > 1 && diff < 7) return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const sameYear = d.getFullYear() === today.getFullYear();
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: sameYear ? undefined : 'numeric' });
  };

  U.fmtDay = function (iso) {
    const d = U.parseDay(iso);
    return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  };

  U.monthLabel = function (key) {
    const d = U.parseDay(key + '-01');
    return d ? d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : key;
  };

  U.list = function (items, conj) {
    const clean = (items || []).filter(Boolean);
    if (clean.length <= 1) return clean.join('');
    if (clean.length === 2) return clean[0] + ' ' + (conj || 'and') + ' ' + clean[1];
    return clean.slice(0, -1).join(', ') + ', ' + (conj || 'and') + ' ' + clean[clean.length - 1];
  };

  const IRREGULAR_PLURALS = { entry: 'entries', series: 'series' };

  U.plural = function (n, one, many) {
    const plural = many || IRREGULAR_PLURALS[one] || one + 's';
    return n + ' ' + (n === 1 ? one : plural);
  };

  // One list decides label, default credit role and which side of an adaptation
  // link is the source: earlier kinds are the source, later ones are the version.
  const KINDS = [
    { value: 'book', label: 'book', plural: 'books', chip: 'Book', title: 'Books', role: 'author', sourceWord: 'novel' },
    { value: 'film', label: 'film', plural: 'films', chip: 'Film', title: 'Films', role: 'director', sourceWord: 'film' },
    { value: 'series', label: 'series', plural: 'series', chip: 'Series', title: 'Series', role: 'creator', sourceWord: 'series' }
  ];

  U.KINDS = KINDS;
  U.cleanKind = function (type) {
    const hit = KINDS.filter(function (k) { return k.value === type; })[0];
    return hit ? hit.value : 'book';
  };
  U.kind = function (type) {
    const want = U.cleanKind(type);
    return KINDS.filter(function (k) { return k.value === want; })[0];
  };
  U.kindLabel = function (type) { return U.kind(type).label; };
  U.kindTitle = function (type) { return U.kind(type).title; };
  U.kindPlural = function (type) { return U.kind(type).plural; };
  U.kindChip = function (type) { return U.kind(type).chip; };
  U.kindRole = function (type) { return U.kind(type).role; };
  U.kindRank = function (type) {
    let rank = 0;
    KINDS.forEach(function (k, i) { if (k.value === U.cleanKind(type)) rank = i; });
    return rank;
  };
  U.pairRelation = function (from, to) {
    return U.kindRank(to) > U.kindRank(from)
      ? 'the ' + U.kindLabel(to) + ' made from this'
      : 'the ' + U.kind(to).sourceWord + ' this was made from';
  };
  U.otherKinds = function (type) {
    const want = U.cleanKind(type);
    return KINDS.filter(function (k) { return k.value !== want; });
  };

  U.uniq = function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); };

  U.hashHue = function (text) {
    let h = 0;
    const s = String(text || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
    return h % 360;
  };

  U.initials = function (text) {
    const words = String(text || '').replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  U.on = function (root, type, selector, handler) {
    root.addEventListener(type, function (event) {
      const target = event.target.closest(selector);
      if (target && root.contains(target)) handler(event, target);
    });
  };

  U.para = function (text, attrs) {
    const blocks = String(text || '').trim().split(/\n{2,}/).filter(Boolean);
    if (!blocks.length) return '';
    const attr = attrs || '';
    return blocks.map(function (b) {
      return '<p' + attr + '>' + U.esc(b).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  };

  U.artString = function (text) {
    return String(text || '').replace(/[&<>]/g, function (c) { return ESCAPES[c]; });
  };

  U.download = function (filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  };

  U.stableSort = function (arr, cmp) {
    return arr.map(function (v, i) { return [v, i]; })
      .sort(function (a, b) { return cmp(a[0], b[0]) || a[1] - b[1]; })
      .map(function (p) { return p[0]; });
  };

  // Orders Latin alphabetically and Chinese by pinyin, so one shelf can hold both.
  U.collator = (function () {
    try { return new Intl.Collator('zh-Hans-CN', { numeric: true, sensitivity: 'base' }); }
    catch (err) { return { compare: function (a, b) { return a < b ? -1 : a > b ? 1 : 0; } }; }
  })();

  U.compareText = function (a, b) {
    return U.collator.compare(String(a === null || a === undefined ? '' : a), String(b === null || b === undefined ? '' : b));
  };

  U.CJK = /[\u3400-\u4dbf\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/;

  U.isCJK = function (text) { return U.CJK.test(String(text || '')); };

  U.langAttr = function (text) { return U.isCJK(text) ? ' lang="zh-Hans"' : ''; };

  U.slug = function (text) {
    return String(text || '').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'diary';
  };
})(App);
