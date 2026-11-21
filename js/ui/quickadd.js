'use strict';

(function (App) {
  const U = App.util;

  const html = function () {
    const stars = [1, 2, 3, 4, 5].map(function (n) {
      return '<button type="button" class="qa-star" data-qa-rate="' + n + '" aria-label="Rate ' + n + '">&#9733;</button>';
    }).join('');
    return '<form class="quickadd" id="quickadd" autocomplete="off">' +
      '<div class="qa-row qa-row-top">' +
        '<div class="segmented seg-qa">' +
          U.KINDS.map(function (k, i) {
            return '<label><input type="radio" name="qa-type" value="' + k.value + '"' + (i === 0 ? ' checked' : '') + '><span>' + k.chip + '</span></label>';
          }).join('') +
        '</div>' +
        '<input class="qa-title" type="text" name="qa-title" id="qa-title" placeholder="Finished The Left Hand of Darkness tonight&hellip;" aria-label="Title">' +
        '<input class="qa-by" type="text" name="qa-by" placeholder="by / directed by" aria-label="Creator">' +
      '</div>' +
      '<div class="qa-row qa-row-mid">' +
        '<textarea class="qa-note" name="qa-note" rows="2" placeholder="A line for future you. How did it land? What did it connect to?" aria-label="Note"></textarea>' +
      '</div>' +
      '<div class="qa-row qa-row-bot">' +
        '<div class="qa-stars" id="qa-stars">' + stars + '<button type="button" class="btn btn-tiny" data-qa-clear>no rating</button></div>' +
        '<input class="qa-tags" type="text" name="qa-tags" list="qa-tag-list" placeholder="tags, comma separated" aria-label="Tags">' +
        '<datalist id="qa-tag-list">' + App.store.allTags().map(function (t) { return '<option value="' + U.esc(t) + '"></option>'; }).join('') + '</datalist>' +
        '<button type="submit" class="btn btn-primary qa-save">Log it</button>' +
        '<button type="button" class="btn btn-quiet" data-qa-more="1" id="qa-more">More fields</button>' +
      '</div>' +
    '</form>';
  };

  function paintStars(value) {
    const host = document.getElementById('qa-stars');
    if (!host) return;
    host.querySelectorAll('.qa-star').forEach(function (b) {
      b.classList.toggle('on', Number(b.getAttribute('data-qa-rate')) <= value);
    });
  }

  function wire(root) {
    let rating = 0;
    const form = root.querySelector('#quickadd');
    if (!form) return;

    U.on(form, 'click', '[data-qa-rate]', function (ev, btn) {
      const n = Number(btn.getAttribute('data-qa-rate'));
      rating = rating === n ? 0 : n;
      paintStars(rating);
    });
    U.on(form, 'click', '[data-qa-clear]', function () { rating = 0; paintStars(0); });
    U.on(form, 'click', '[data-qa-more]', function () {
      App.ui.sheet.open('form', { draft: {
        type: (form.querySelector('[name=qa-type]:checked') || {}).value || 'book',
        title: form.querySelector('[name=qa-title]').value,
        notes: form.querySelector('[name=qa-note]').value,
        creators: (form.querySelector('[name=qa-by]').value || '').trim() ? [{ role: U.kindRole(type), name: form.querySelector('[name=qa-by]').value.trim() }] : [],
        tags: form.querySelector('[name=qa-tags]').value.split(',').map(function (s) { return U.norm(s); }).filter(Boolean),
        genres: [], original_title: '', year: '', status: 'done',
        rating: rating || null, finished_at: U.today(), quotes: [], adaptation_of: null
      } });
    });

    form.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target.tagName !== 'TEXTAREA') {
        ev.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const title = form.querySelector('[name=qa-title]').value.trim();
      const note = form.querySelector('[name=qa-note]').value.trim();
      if (!title && !note) {
        App.ui.toast('Give it a title first.', 'bad');
        form.querySelector('[name=qa-title]').focus();
        return;
      }
      const type = (form.querySelector('[name=qa-type]:checked') || {}).value || 'book';
      const by = form.querySelector('[name=qa-by]').value.trim();
      const made = App.store.add({
        type: type,
        title: title || 'Untitled',
        creators: by ? [{ role: U.kindRole(type), name: by }] : [],
        rating: rating || null,
        notes: note,
        tags: form.querySelector('[name=qa-tags]').value.split(',').map(U.norm).filter(Boolean),
        finished_at: U.today(),
        status: 'done'
      });
      rating = 0;
      App.ui.toast('Logged \u201c' + (made.title.length > 30 ? made.title.slice(0, 30) + '\u2026' : made.title) + '\u201d', 'ok');
      setTimeout(function () {
        const t = document.getElementById('qa-title');
        if (t) { t.value = ''; t.focus(); }
        const n = document.querySelector('.qa-note');
        if (n) n.value = '';
        const tg = document.querySelector('.qa-tags');
        if (tg) tg.value = '';
        paintStars(0);
      }, 10);
    });
  }

  App.ui.quickadd = { html: html, wire: wire };
})(App);
