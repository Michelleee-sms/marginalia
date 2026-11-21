'use strict';

window.LADDERS = {
  noir: {
    tag: 'noir',
    title: 'The case was never the point',
    question: 'You log detective stories where the mystery dissolves into the city, the money and the weather.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'Red Harvest', by: 'Dashiell Hammett', year: 1929, why: 'Chandler learned from this. No psychology, just a narrator walking into a rotten town and accelerating the rot.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'Double Indemnity', by: 'Billy Wilder', year: 1944, why: 'The grammar of the whole thing in one script: voiceover that tells you from the first minute that it ends badly.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'The Killer Inside Me', by: 'Jim Thompson', year: 1952, why: 'Turns the camera around. First-person from inside the skull, and the prose itself is the unreliable evidence.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'In a Lonely Place', by: 'Nicholas Ray', year: 1950, why: 'Noir turning on its own author. The violence is all in how a man describes a scene he has not written yet.' },
      { level: 2, label: 'Deeper', kind: 'series', title: 'Mare of Easttown', by: 'Brad Ingelsby', year: 2021, why: 'Seven episodes of a case that is really about a town\u2019s grief. Everyone in it has read the same faces for thirty years.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Black Dahlia', by: 'James Ellroy', year: 1987, why: 'Archive-as-obsession: the case is a document problem, and the sentences are telegram wires. Not comfortable.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'Mulholland Drive', by: 'David Lynch', year: 2001, why: 'Takes the private-eye structure apart and rebuilds it as a dream that knows it is being dreamed.' }
    ]
  },

  city: {
    tag: 'city',
    title: 'The city as a text you can read',
    question: 'Streets keep doing narrative work in what you choose.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'The Death and Life of Great American Cities', by: 'Jane Jacobs', year: 1961, why: 'Eye-level, furious, and it reads like a detective story about planning. Changes how you walk home.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'Playtime', by: 'Jacques Tati', year: 1967, why: 'Modernist city as farce. Find the plot by losing it on purpose — the set is the joke.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'Berlin Alexanderplatz', by: 'Alfred D\u00f6blin', year: 1929, why: 'The city as montage: adverts, weather reports and scripture cut into one ex-con\u2019s week.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'High and Low', by: 'Akira Kurosawa', year: 1963, why: 'A house on a hill becomes a class diagram. The first hour is nearly all one room.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Arcades Project', by: 'Walter Benjamin', year: 1982, why: 'Not a book, a quarry. Nineteenth-century Paris through quotations and fragments, deliberately unfinished.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'Man with a Movie Camera', by: 'Dziga Vertov', year: 1929, why: 'A city edited into existence with no titles, no actors, no plot. Go back after Benjamin.' },
      { level: 3, label: 'The hard turn', kind: 'series', title: 'Berlin Alexanderplatz', by: 'Rainer Werner Fassbinder', year: 1980, why: 'Fourteen hours of D\u00f6blin filmed as a fever dream. If the novel is a quarry, this is the quarry at night.' }
    ]
  },

  memory: {
    tag: 'memory',
    title: 'Memory that will not stay in the past',
    question: 'You keep landing on narrators who cannot trust their own recollection.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'The Remains of the Day', by: 'Kazuo Ishiguro', year: 1989, why: 'Same machinery as Never Let Me Go, no sci-fi in it. A man editing his life until the edits are all that is left.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'Hiroshima, My Love', by: 'Alain Resnais', year: 1959, why: 'Two hours in a hotel room where remembering and witnessing are the same tense.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'Swann\u2019s Way', by: 'Marcel Proust', year: 1913, why: 'The source. Start with the madeleine and the first two hundred pages; it is a book about attention, not about France.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'Andrei Rublev', by: 'Andrei Tarkovsky', year: 1966, why: 'Memory as national survival, in chapters that keep breaking. The bell sequence is the payoff for the patience.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'Shoah', by: 'Claude Lanzmann', year: 1985, why: 'Nine hours, no archive footage at all. Testimony and landscape only. A decision about representation that forces you to argue with it.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Rings of Saturn', by: 'W. G. Sebald', year: 1995, why: 'You have Austerlitz going; this one is the same method with a coastline and a moth collection.' }
    ]
  },

  dystopia: {
    tag: 'dystopia',
    title: 'Dystopias that do not announce themselves',
    question: 'Your worst worlds are polite, administrative and quietly voluntary.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'We', by: 'Yevgeny Zamyatin', year: 1924, why: 'The one Orwell answered. Mathematics as a constitution, and a narrator who cannot phrase a rebellion.' },
      { level: 1, label: 'Wider', kind: 'book', title: 'The Handmaid\u2019s Tale', by: 'Margaret Atwood', year: 1985, why: 'Control through vocabulary and ritual. Read the Historical Notes appendix — the twist is that it became a conference paper.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'Alphaville', by: 'Jean-Luc Godard', year: 1965, why: 'A dystopia enforced by a dictionary. Words for love and conscience have been deleted, so nobody can think them.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'The Dispossessed', by: 'Ursula K. Le Guin', year: 1974, why: 'Already logged, and worth rereading against this list: it is the answer to every book above.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Ones Who Walk Away from Omelas', by: 'Ursula K. Le Guin', year: 1973, why: 'Six pages that delete the apparatus and leave only the bargain. Best short argument in the genre.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'The Trial', by: 'Orson Welles', year: 1962, why: 'Bureaucracy as weather. Welles never explains anything and neither does the world.' }
    ]
  },

  'what-is-human': {
    tag: 'what-is-human',
    title: 'The question behind the android',
    question: 'You are circling empathy as a measurable thing.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'Klara and the Sun', by: 'Kazuo Ishiguro', year: 2021, why: 'The Dick question from the polite side: a narrator whose devotion is proof of a soul we cannot verify.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'Her', by: 'Spike Jonze', year: 2013, why: 'No hardware, no rebellion. Just a relationship with an entity that outgrows the terms of it.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'Solaris', by: 'Stanis\u0142aw Lem', year: 1961, why: 'Contact with a mind you cannot model, only be humiliated by. Dick wrote a hostile review of it; read both.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'Ghost in the Shell', by: 'Mamoru Oshii', year: 1995, why: 'Identity without a body, staged as plumbing and processions. Direct ancestor of everything after Blade Runner.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'Blindsight', by: 'Peter Watts', year: 2006, why: 'Consciousness argued down to an evolutionary liability. Nasty, rigorous, and it will make you re-read your own notes.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'A Perfect Vacuum', by: 'Stanis\u0142aw Lem', year: 1971, why: 'Reviews of books that do not exist. The philosophical argument smuggled in entirely as criticism.' }
    ]
  },

  'weird-fiction': {
    tag: 'weird-fiction',
    title: 'Places with rules you are never told',
    question: 'The Zone, the anomaly, the area that is economically interesting before it is mysterious.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'Annihilation', by: 'Jeff VanderMeer', year: 2014, why: 'The Zone as ecology you cannot narrate honestly. Short, and Area X never explains itself.' },
      { level: 1, label: 'Wider', kind: 'book', title: 'The City & The City', by: 'China Mi\u00e9ville', year: 2009, why: 'A crime novel where the anomaly is a training in not seeing. Pairs perfectly with Chinatown.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'The Mirror', by: 'Andrei Tarkovsky', year: 1975, why: 'Your Stalker notes apply here doubled. Memory edited by association instead of plot.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'The Steradian Cylinder', by: 'Alex Garland', year: 2024, why: 'Late Strugatsky energy: an institution, a forbidden floor and a wish that costs the reader.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'House of Leaves', by: 'Mark Z. Danielewski', year: 2000, why: 'Spatial impossibility moved into typography. Footnotes attacking the text they annotate.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'Souls on Fire: Stories of the Zone', by: 'Arkady and Boris Strugatsky', year: 1989, why: 'The other Zone stories. Picnic was the doorway; these are the rest of the rooms.' }
    ]
  },

  'slow-cinema': {
    tag: 'slow-cinema',
    title: 'Duration as the subject',
    question: 'You watch long takes without reaching for your phone, and write about it.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'film', title: 'Late Spring', by: 'Yasujir\u014d Ozu', year: 1949, why: 'The stillest camera there is. Two people in a house saying almost nothing about a decision already made.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'Perfect Days', by: 'Wim Wenders', year: 2023, why: 'Slow cinema cleaned of difficulty. A toilet attendant, cassette tapes, and trees photographed until they mean something.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'Au Hasard Balthazar', by: 'Robert Bresson', year: 1966, why: 'Duration and grace through a donkey. The famous final minute earns every hour before it.' },
      { level: 2, label: 'Deeper', kind: 'film', title: 'Jeanne Dielman, 23 quai du Commerce', by: 'Chantal Akerman', year: 1975, why: 'Three and a half hours of domestic time, filmed as evidence. The deviation from routine is the whole plot.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'S\u00e1t\u00e1ntang\u00f3', by: 'B\u00e9la Tarr', year: 1994, why: 'Seven and a half hours, in one village, waiting for a man who may not come. Book the whole day and the open one after.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Rings of Saturn', by: 'W. G. Sebald', year: 1995, why: 'Literature with the same relationship to walking and time. Reads like a Tarkovsky film in prose.' }
    ]
  },

  restraint: {
    tag: 'restraint',
    title: 'Everything unsaid, precisely arranged',
    question: 'You respond to books and films where feeling arrives through what is withheld.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'Convenience Store', by: 'Sayuri Shimazaki', year: 2016, why: 'Short, flat, clinical, and quietly savage. The narration is the cage.' },
      { level: 1, label: 'Wider', kind: 'film', title: 'A Single Man', by: 'Tom Ford', year: 2009, why: 'One day, one grief, dressed in exquisite surfaces. Adapted from Isherwood, who did the same trick on purpose.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'Stoner', by: 'John Williams', year: 1965, why: 'A life of nothing much, written so well it is unbearable. Rejected in 1965, rediscovered fifty years later.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'My Brilliant Friend', by: 'Elena Ferrante', year: 2011, why: 'Restraint under maximum pressure. The friendship is narrated as an accounting of injuries.' },
      { level: 3, label: 'The hard turn', kind: 'film', title: 'A Ghost Story', by: 'David Lowery', year: 2017, why: 'The sheet, the pie, the decades. Pushes the method past comfort into something structural.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Lost Daughter', by: 'Elena Ferrante', year: 2006, why: 'Ninety pages that refuse to reassure you about a single character. Ferrante\u2019s purest argument.' }
    ]
  },

  utopia: {
    tag: 'utopia',
    title: 'Building the better world, then indicting it',
    question: 'Your utopia is the one with an ambiguous subtitle.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: 'Herland', by: 'Charlotte Perkins Gilman', year: 1915, why: 'A working model, told through three visiting men who misunderstand all of it. Lighter and sharper than it sounds.' },
      { level: 1, label: 'Wider', kind: 'book', title: 'News from Nowhere', by: 'William Morris', year: 1890, why: 'The answer to Bellamy, and to every planned utopia. Crafts, weather, no government worth noticing.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'The Left Hand of Darkness', by: 'Ursula K. Le Guin', year: 1969, why: 'The same anthropological method as The Dispossessed applied to gender. The envoy learns nothing for most of the book.' },
      { level: 2, label: 'Deeper', kind: 'book', title: 'Ecotopia', by: 'Ernest Callenbach', year: 1975, why: 'Written as a field report from a seceded Pacific Northwest. Dry, specific, and full of the boring logistics utopias skip.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'Seeing Like a State', by: 'James C. Scott', year: 1998, why: 'Not fiction, and the harshest companion to your Le Guin shelf: why legibility kills planned societies. Read the Forestry chapters first.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: 'The Dispossessed', by: 'Ursula K. Le Guin', year: 1974, why: 'Reread it after Scott. The wall on the moon is the argument about institutions you will now see everywhere.' }
    ]
  },

  'modern-china': {
    tag: 'modern-china',
    title: 'One century, told from inside the household',
    question: 'You choose histories that arrive through a family, a job and a dinner table rather than through the headlines.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'book', title: '许三观卖血记', by: '余华', year: 1995, why: 'Same cold century as 活着, but with a plan. The repetitions in the sentences are the only armour the character can afford.' },
      { level: 1, label: 'Wider', kind: 'film', title: '小武', by: '贾樟柯', year: 1997, why: 'A pickpocket in a county town being demolished around him. Felt, not directed \u2014 the karaoke scenes do the documentary work.' },
      { level: 2, label: 'Deeper', kind: 'book', title: '蛙', by: '莫言', year: 2009, why: 'Family obligation used as a lens on one-child policy. The last third is a play inside the novel, which is the point.' },
      { level: 2, label: 'Deeper', kind: 'film', title: '牯岭街少年杀人事件', by: '杨德昌', year: 1991, why: 'Four hours, Taipei 1960, a boy nobody in the film has time for. The most precise social novel Chinese cinema has.' },
      { level: 2, label: 'Deeper', kind: 'series', title: '平原上的摩西', by: '张大磊', year: 2023, why: '六集，从双雪涛的短篇里长出来。厂、雪、和一层层压住的话，慢得像回忆本身。' },
      { level: 3, label: 'The hard turn', kind: 'film', title: '悲情城市', by: '侯孝贤', year: 1989, why: 'Long takes, offscreen violence, a family that loses its voices one by one. Watch it after 霸王别姬 and the difference in method becomes the argument.' },
      { level: 3, label: 'The hard turn', kind: 'book', title: '金瓶梅', by: '兰陵笑笑生', year: 1610, why: 'The ancestor of every household-as-history on this list. Read an annotated modern translation first; the 20th-century novels above are downstream of it.' }
    ]
  },

  'long-form': {
    tag: 'long-form',
    title: 'The novel, hour by hour',
    question: 'You will spend a season on a structure, which is a reading habit wearing television clothes.',
    rungs: [
      { level: 1, label: 'Wider', kind: 'series', title: 'The Corner', by: 'David Simon', year: 2000, why: 'Five episodes on the same Baltimore streets before The Wire turned them into an org chart. Written with a reporter, and it shows.' },
      { level: 1, label: 'Wider', kind: 'series', title: 'North & South', by: 'Susannah Grant', year: 1985, why: 'Gaskell at full length: four families arguing about industry for six hours. The closest television gets to a 19th-century serial.' },
      { level: 2, label: 'Deeper', kind: 'series', title: 'Middlemarch', by: 'Andrew Davies', year: 1994, why: 'A novel already about a whole town, adapted without being shortened into a plot. Eight hours that move at exactly the right speed.' },
      { level: 2, label: 'Deeper', kind: 'series', title: 'Our Friends in the North', by: 'Peter Flannery', year: 1996, why: 'Newcastle from 1964 to 1997 through five people. The jumps between decades do to a life what history books do to a century.' },
      { level: 3, label: 'The hard turn', kind: 'series', title: 'The Staircase', by: 'Jean-Xavier de Lestrade', year: 2002, why: 'A documentary crew films a murder trial and then cannot stop filming for twenty years. The evidence changes shape while you watch.' }
    ]
  }
};

window.LADDER_ORDER = ['noir', 'city', 'memory', 'dystopia', 'what-is-human', 'weird-fiction', 'slow-cinema', 'restraint', 'utopia', 'modern-china', 'long-form'];
