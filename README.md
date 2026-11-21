# ¶ Marginalia

A diary of the books you read, the films you watched and the series you kept up with — and suggestions on where to dig next, worked out only from your own notes.

Open `index.html` in a browser. There is no build step, no server and no dependencies.

## What it does

- **Log entries** in three kinds (book, film, series) with title, original title, year, credits, date, rating, status, genres, tags, notes and lines you want to keep.
- **Quick add** for a one-line entry; *More fields* moves the same text into the full form.
- **Find details** queries OpenLibrary for book titles. It is the only network call in the app; films and series are filled in by hand on purpose, because a keyed source would mean storing a key in the page.
- **Four views**: Diary (by day), Library (search and filter), Delve (suggestions), Patterns (counts from your own history).
- **Several diaries, one browser.** Each name you give is a separate shelf. A new diary starts empty. These are not accounts and there is no password — anyone using this browser profile can open any of them.
- **Chinese works too.** Any field accepts Chinese titles, names, roles and tags. Sorting is pinyin-aware, so 三体 sits next to *Blade Runner* on one shelf.

## Where the data is

`localStorage` on your machine, keyed per diary (`marginalia.data.<id>`). Nothing leaves the browser except the optional OpenLibrary search. Use **Export a backup** for a JSON file and **Import from backup** to restore it into any diary.

## How the suggestions work

Three local calculations, in order of trust:

1. **Shared tags and credits**, weighted by how rare a tag is in your own diary (inverse document frequency) and by how many entries you share.
2. **Taste weight**: your rating minus the middle, decayed over roughly a year, plus a small bonus for volume. Unrated entries still register, faintly.
3. **The ladders**: hand-written reading paths in `js/data/ladder.js`. Each is a tag, a question, and three rungs — Wider, Deeper, The hard turn. Edit that file to make the recommendations yours; the app never scores anything with a model, so nothing drifts between visits and every reason is stated in plain words on the card.

## Layout

```
index.html
css/app.css
js/core.js              utilities, kind registry
js/data/store.js        localStorage per diary, normalisation, export/import
js/data/profiles.js     diary picker state
js/data/seed.js         sample entries
js/data/ladder.js       the ladders
js/data/enrich.js       OpenLibrary search
js/reco/                affinity, related(), delve reasoning
js/ui/                  views, entry form, quick add, sheet
```

## Shortcuts

`N` new entry · `/` search the library · `Esc` close.
