'use strict';

(function (App) {
  const U = App.util;

  function chip() {
    const btn = document.getElementById('btn-who');
    const mark = document.getElementById('who-mark');
    const name = document.getElementById('who-name');
    if (!btn) return;
    const profile = App.profiles.current();
    btn.hidden = !profile;
    if (!profile) return;
    mark.textContent = App.profiles.initials(profile.name);
    name.textContent = profile.name;
    btn.setAttribute('aria-label', 'Diary: ' + profile.name + '. Switch diary.');
  }

  function cardHtml(p) {
    const n = App.profiles.countFor(p.id);
    const isCurrent = App.profiles.id() === p.id;
    return '<li class="who-card' + (isCurrent ? ' is-current' : '') + '">' +
      '<button type="button" class="who-open" data-use="' + U.esc(p.id) + '">' +
        '<span class="who-tile" style="--hue:' + U.hashHue(p.name) + '" aria-hidden="true">' + U.esc(App.profiles.initials(p.name)) + '</span>' +
        '<span class="who-main">' +
          '<span class="who-title"' + U.langAttr(p.name) + '>' + U.esc(p.name) + '</span>' +
          '<span class="who-meta">' + U.plural(n, 'entry') + ' &middot; opened ' + U.esc(U.fmtDay(p.last_used || p.created)) + '</span>' +
        '</span>' +
        (isCurrent ? '<span class="badge badge-ongoing">current</span>' : '<span class="who-go">Open</span>') +
      '</button>' +
      (isCurrent ? '<button type="button" class="icon-btn icon-btn-danger" data-drop="' + U.esc(p.id) + '" title="Sign out of this diary" aria-label="Sign out of this diary">&times;</button>' : '') +
    '</li>';
  }

  function render(root) {
    const list = App.profiles.all();
    let html = '<div class="page page-people">' +
      '<header class="page-head"><h2>Whose diary?</h2>' +
      '<p class="page-sub">Each name here gets an empty diary of its own \u2014 entries, tags and suggestions never cross over.</p></header>';

    if (list.length) {
      html += '<ul class="who-list">' + list.map(cardHtml).join('') + '</ul>';
    } else {
      html += '<p class="people-none">No diaries on this browser yet. Make the first one below \u2014 a name in Chinese works as well as one in English.</p>';
    }

    html += '<section class="section who-new">' +
      '<header class="section-head"><h2>Start a diary</h2>' +
      '<p class="section-note">A name is all that is needed \u2014 English or Chinese. It stays on this machine.</p></header>' +
      '<form class="who-form" id="who-form" novalidate>' +
        '<label class="field"><span class="field-label">Name</span>' +
          '<input type="text" id="who-input" name="name" maxlength="40" autocomplete="off" placeholder="You, or whoever reads it" aria-label="Diary name"></label>' +
        '<label class="check"><input type="checkbox" id="who-samples"><span>Add a dozen sample entries so there is something to look at</span></label>' +
        '<div class="who-form-foot">' +
          '<button type="submit" class="btn btn-primary">Create and open</button>' +
          '<span class="people-note">Nothing is uploaded. A new diary starts empty unless you tick the box.</span>' +
        '</div>' +
        '<p class="form-error" id="who-error" hidden></p>' +
      '</form></section>';

    if (list.length) {
      html += '<p class="people-honest">These are shelves, not accounts. Anyone with this browser can open any of them, so do not use this to hide anything from someone who shares the machine. Backups are per diary: export from one, import into another, and the entries move.</p>';
    }

    root.innerHTML = html;
    chip();
    wirePage(root.querySelector('.page'));
  }

  function create(name, withSamples) {
    const res = App.profiles.create(name, withSamples);
    if (res.error) return res;
    App.ui.lastView = 'diary';
    App.ui.toast('Diary \u201c' + res.profile.name + '\u201d created.', 'ok');
    App.ui.go('#/diary');
    return res;
  }

  function wirePage(page) {
    if (!page) return;
    U.on(page, 'click', '[data-use]', function (ev, btn) {
      const id = btn.getAttribute('data-use');
      if (App.profiles.id() !== id) {
        App.profiles.use(id);
        App.ui.lastView = 'diary';
        App.ui.toast('Now in \u201c' + App.profiles.current().name + '\u201d.', 'ok');
      }
      App.ui.go('#/diary');
    });
    U.on(page, 'click', '[data-drop]', function (ev, btn) {
      ev.stopPropagation();
      App.profiles.leave();
      App.ui.toast('Signed out. The entries stay put.', 'info');
      App.ui.go('#/people');
    });
    U.on(page, 'submit', '#who-form', function (ev, form) {
      ev.preventDefault();
      const input = document.getElementById('who-input');
      const samples = document.getElementById('who-samples');
      const err = document.getElementById('who-error');
      const res = create(input.value, !!(samples && samples.checked));
      if (res.error) {
        if (err) { err.textContent = res.error; err.hidden = false; }
        input.focus();
      }
    });
    const input = document.getElementById('who-input');
    if (input) input.focus();
  }

  App.views.people = { render: render, chip: chip };
  App.ui.whoChip = chip;
})(App);
