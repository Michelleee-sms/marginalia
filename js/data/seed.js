'use strict';

window.SEED_ENTRIES = [
  {
    type: 'book',
    title: 'The Dispossessed',
    original_title: 'An Ambiguous Utopia',
    year: 1974,
    creators: [{ role: 'author', name: 'Ursula K. Le Guin' }],
    rating: 5,
    finished_at: '2026-06-02',
    genres: ['science fiction', 'political'],
    tags: ['utopia', 'anarchism', 'anthropological-sf', 'hard-sf'],
    notes: 'The subtitle does all the work. Two worlds, both broken in opposite ways, and the book refuses to pick a winner. What stayed with me is the physics seminar scene — an idea arriving forty years late because nobody would fund it. Bureaucracy without a single bureaucrat in sight.',
    quotes: ['You cannot buy the revolution. You cannot only make it. You cannot have it. You can only be the revolution, which is never finished.']
  },
  {
    type: 'book',
    title: 'Invisible Cities',
    original_title: 'Le città invisibili',
    year: 1972,
    creators: [{ role: 'author', name: 'Italo Calvino' }],
    rating: 5,
    finished_at: '2026-06-28',
    genres: ['fiction', 'experimental'],
    tags: ['city', 'memory', 'structure', 'prose-poetry'],
    notes: 'Fifty-five short chapters framed as one conversation, arranged in a pattern I only noticed on re-reading the table of contents. Read three cities a night. The one made of desires, Valdrada, is the one I keep describing to people.',
    quotes: ['Hell of the living: those who are here and no longer see it.']
  },
  {
    id: 'seed-roadside-picnic',
    type: 'book',
    title: 'Roadside Picnic',
    original_title: 'Пикник на обочине',
    year: 1972,
    creators: [
      { role: 'author', name: 'Arkady Strugatsky' },
      { role: 'author', name: 'Boris Strugatsky' }
    ],
    rating: 4,
    finished_at: '2026-07-19',
    genres: ['science fiction'],
    tags: ['weird-fiction', 'zone', 'soviet-science-fiction', 'allegory'],
    notes: 'The aliens never show up. That is the entire joke and the entire horror — we are the ants whose hill got a picnic cleaned up after. The Zone is an economic opportunity long before it is a mystery.',
    quotes: []
  },
  {
    type: 'film',
    title: 'Stalker',
    original_title: 'Сталкер',
    year: 1979,
    creators: [{ role: 'director', name: 'Andrei Tarkovsky' }],
    rating: 5,
    finished_at: '2026-08-22',
    genres: ['drama', 'science fiction'],
    tags: ['weird-fiction', 'slow-cinema', 'zone', 'faith'],
    adaptation_of: 'seed-roadside-picnic',
    notes: 'Four hours of walking that somehow feels shorter than the novel. The room is not the point; the argument in the doorway is. Completely changed how I read the book afterwards — the Zone here has weather.',
    quotes: ['Hope becomes a danger in a place where wishes come true.']
  },
  {
    type: 'book',
    title: 'The Long Goodbye',
    original_title: '',
    year: 1953,
    creators: [{ role: 'author', name: 'Raymond Chandler' }],
    rating: 4,
    finished_at: '2026-09-06',
    genres: ['crime', 'fiction'],
    tags: ['noir', 'voice', 'city', 'disillusionment'],
    notes: 'Marlowe keeps a friendship he has to earn twice and a case he barely solves. The Los Angeles of it is the real subject, and Chandler writes the weather like a verdict.',
    quotes: ['It was a blonde. A blonde to make a bishop kick a hole in a stained-glass window.']
  },
  {
    type: 'film',
    title: 'Chinatown',
    original_title: '',
    year: 1974,
    creators: [
      { role: 'director', name: 'Roman Polanski' },
      { role: 'writer', name: 'Robert Towne' }
    ],
    rating: 5,
    finished_at: '2026-09-30',
    genres: ['crime', 'drama'],
    tags: ['noir', 'city', 'corruption', 'disillusionment'],
    notes: 'Water as the real plot. Everything Gittes touches makes it worse, and the film refuses to forgive him for trying. That ending still lands because it is about systems, not villains.',
    quotes: ['Forget it, Jake. It\u2019s Chinatown.']
  },
  {
    type: 'film',
    title: 'In the Mood for Love',
    original_title: '\u82B1\u6837\u5E74\u534E',
    year: 2000,
    creators: [{ role: 'director', name: 'Wong Kar-wai' }],
    rating: 5,
    finished_at: '2026-10-14',
    genres: ['romance', 'drama'],
    tags: ['memory', 'longing', 'restraint', 'colour', 'modern-china'],
    notes: 'A film about an affair that never happens, cut together out of refusals. The corridor, the noodle shop, that repeated cello line. Shot in 18 months with no finished script and it plays like architecture.',
    quotes: ['He remembered the age of memories, when he would often think of those days of his life.']
  },
  {
    type: 'book',
    title: 'Never Let Me Go',
    original_title: '',
    year: 2005,
    creators: [{ role: 'author', name: 'Kazuo Ishiguro' }],
    rating: 4,
    finished_at: '2026-10-29',
    genres: ['fiction', 'science fiction'],
    tags: ['dystopia', 'memory', 'restraint', 'ethics'],
    notes: 'The horror is that nobody rebels, and the book treats that as the most realistic thing about it. Hailsham\u2019s art classes are a compliance machine dressed as a childhood. The galloon in the field, on repeat.',
    quotes: ['We took away your art because we thought it would reveal your souls. Or to put it more finely, we did it to prove you had souls at all.']
  },
  {
    id: 'seed-androids',
    type: 'book',
    title: 'Do Androids Dream of Electric Sheep?',
    original_title: '',
    year: 1968,
    creators: [{ role: 'author', name: 'Philip K. Dick' }],
    rating: 4,
    finished_at: '2026-11-12',
    genres: ['science fiction'],
    tags: ['what-is-human', 'empathy', 'dystopia', 'noir'],
    notes: 'Messier and weirder than the film, with the whole Mercerism religion left in. The empathy test is the thing: a society measuring the one quality it cannot fake-proof. Wants a real toad more than a real person.',
    quotes: []
  },
  {
    type: 'film',
    title: 'Blade Runner',
    original_title: '',
    year: 1982,
    creators: [
      { role: 'director', name: 'Ridley Scott' },
      { role: 'writer', name: 'Hampton Fancher' }
    ],
    rating: 5,
    finished_at: '2026-11-18',
    genres: ['science fiction', 'neo-noir'],
    tags: ['what-is-human', 'noir', 'city', 'dystopia'],
    adaptation_of: 'seed-androids',
    notes: 'Rewatched the final cut straight after the novel. It throws away the religion and keeps the rain, which is the right trade. Roy\u2019s speech was improvised by the actor and it outgrew the film.',
    quotes: ['All those moments will be lost in time, like tears in rain.']
  },
  {
    id: 'seed-to-live',
    type: 'book',
    title: '活着',
    original_title: 'To Live',
    year: 1993,
    creators: [{ role: 'author', name: '余华' }],
    rating: 5,
    finished_at: '2026-10-05',
    genres: ['fiction'],
    tags: ['modern-china', 'restraint', 'memory'],
    notes: '福贵讲自己的一生，从头到尾没有一句控诉。我读到一半就停下来，怕后面更狠，结果后面只是更平静。这种写法比任何呐喊都难。第二遍想读原文的句子节奏，第一遍光顾着难受了。',
    quotes: ['「以时间为单位，我的生活是一幕幕悲剧；以年代为单位，我的生活是一幕幕喜剧。」']
  },
  {
    type: 'film',
    title: '活着',
    original_title: 'To Live',
    year: 1994,
    creators: [
      { role: 'director', name: '张艺谋' },
      { role: 'writer', name: '芦苇' }
    ],
    rating: 4,
    finished_at: '2026-10-08',
    genres: ['drama', 'history'],
    tags: ['modern-china', 'memory', 'restraint'],
    adaptation_of: 'seed-to-live',
    notes: 'Adds the shadow-puppet box, which the novel does not have, and it becomes the film\u2019s spine. The last shot returns to it, and the story closes as a performance rather than as a life. I thought the ending was softer than the novel\u2019s until I counted who is still alive in each.',
    quotes: []
  },
  {
    id: 'seed-three-body',
    type: 'book',
    title: '三体',
    original_title: 'The Three-Body Problem',
    year: 2008,
    creators: [{ role: 'author', name: '刘慈欣' }],
    rating: 4,
    finished_at: '2026-07-05',
    genres: ['science fiction'],
    tags: ['modern-china', 'hard-sf', 'dystopia'],
    notes: 'The Cultural Revolution frame is not decoration \u2014 it is the argument for why someone would answer the signal. The science is a delivery system for a moral position. Ye Wenjie at the lake is the whole book in one scene.',
    quotes: ['「给岁月以文明，而不是给文明以岁月。」']
  },
  {
    type: 'series',
    title: '三体',
    original_title: 'Three-Body',
    year: 2023,
    creators: [{ role: 'director', name: '杨磊' }],
    rating: 3,
    finished_at: '2026-11-15',
    genres: ['science fiction', 'drama'],
    tags: ['modern-china', 'hard-sf', 'dystopia', 'long-form'],
    adaptation_of: 'seed-three-body',
    notes: '腾讯版拍得老实：多做实验台，少做奇观，还保留了另一个版本删掉的 1967 年。忠于字面反而成了问题——原书的怪在想法里，一集电视剧装不下一个段落能装下的东西。重读小说之后紧接着看，对它不公平。',
    quotes: []
  },
  {
    type: 'film',
    title: '霸王别姬',
    original_title: 'Farewell My Concubine',
    year: 1993,
    creators: [
      { role: 'director', name: '陈凯歌' },
      { role: 'writer', name: '芦苇' }
    ],
    rating: 5,
    finished_at: '2026-11-06',
    genres: ['drama', 'history'],
    tags: ['modern-china', 'memory', 'longing'],
    notes: 'Fifty years of a country watched through one role that nobody is allowed to stop playing. The rehearsal-footage scene inside the film is the cruellest thing in it. I have now seen it twice and both times I arrive at the final act already tired.',
    quotes: ['「说好了一辈子，差一年、一个月、一天、一个时辰，都不算一辈子。」']
  },
  {
    type: 'series',
    title: '漫长的季节',
    original_title: 'The Long Season',
    year: 2023,
    creators: [
      { role: 'director', name: '辛爽' },
      { role: 'writer', name: '于小千' }
    ],
    rating: 5,
    finished_at: '2026-07-27',
    genres: ['crime', 'drama'],
    tags: ['modern-china', 'memory', 'restraint', 'long-form'],
    notes: '东北的秋天拍得像一封长信。案子是引子，真正讲的是那些人怎么在一个被改掉的时代里活下去。范伟最后那场雪我停了很久，前三集的慢全都有了回报。',
    quotes: ['「往前看，别回头。」']
  },
  {
    type: 'series',
    title: 'The Wire',
    original_title: '',
    year: 2002,
    creators: [
      { role: 'creator', name: 'David Simon' },
      { role: 'writer', name: 'George Pelecanos' }
    ],
    rating: 5,
    finished_at: '2026-06-15',
    genres: ['crime', 'drama'],
    tags: ['city', 'corruption', 'disillusionment', 'long-form'],
    notes: 'Five seasons of one city drawn as an org chart: the docks, the trade, the council, the schools, the newsroom. Every institution fails in the same sentence structure, and nobody in it is stupid. Four episodes a week is the only honest way through it.',
    quotes: ['That is how it goes. Part of the deal.']
  },
  {
    type: 'series',
    title: 'Chernobyl',
    original_title: '',
    year: 2019,
    creators: [
      { role: 'creator', name: 'Craig Mazin' },
      { role: 'director', name: 'Johan Renck' }
    ],
    rating: 4,
    finished_at: '2026-08-09',
    genres: ['drama', 'history'],
    tags: ['dystopia', 'corruption', 'memory', 'long-form'],
    notes: 'Five episodes, and the horror is a meeting where everyone in the room already knows. The courtroom shape of the last one is a risk that mostly pays off, though it says out loud what the first three hours had already shown. I stopped after the roof and came back a week later; Legasov is worse the second time.',
    quotes: ['What is the cost of lies? It is not that we mistake the lies for the truth. It is that if we hear enough lies, then we no longer recognize the truth at all.']
  },
  {
    type: 'book',
    title: 'Austerlitz',
    original_title: '',
    year: 1992,
    creators: [{ role: 'author', name: 'W. G. Sebald' }],
    rating: null,
    status: 'ongoing',
    finished_at: '2026-11-20',
    genres: ['fiction', 'essay'],
    tags: ['memory', 'city', 'drift'],
    notes: 'Forty pages in, mostly about a railway station and an asylum. Long sentences with no photographs in this edition, which I suspect is doing something to the pacing.',
    quotes: []
  }
];
