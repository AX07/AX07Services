// The day. Facts from elfuertemarbella.com and soleomarbella.com, read 27 Nov 2026.
// Photos and mp4s load from the hotel's, Soleo's and Kena's own sites; shared/film/ holds the loops rendered by ../../film/render.mjs.
// Each activity: `fx` picks its scroll behaviour in ../day/fx.js, `len` is how much scrolling it holds (in screen heights x100).
(() => {
const U = 'https://www.elfuertemarbella.com/wp-content/uploads/';
const u = f => new URL(f, U).href;
const S = f => 'https://www.soleomarbella.com/wp-content/uploads/' + f;
const K = f => `https://www.kenanikkei.com/_next/image?url=${encodeURIComponent('/' + f)}&w=1920&q=75`;
const pics = list => list.map(([f, alt]) => ({ src: u(f), alt }));
const BOOK = 'https://booking.elfuertemarbella.com/en/';
const room = '2023/07/el-fuerte-marbella-habitacion-';
// the terrace with its palms, pool and sea moving (rendered from the hotel's photo)
const suite = { video: '/demo/el-fuerte/shared/film/room.mp4', poster: '/demo/el-fuerte/shared/film/room-0.jpg' };

window.BOOK = BOOK;
window.DAY = [
{ id: 'morning', time: '07:00', name: 'Good morning', layout: 'hero', fx: 'morning', len: 220, kicker: 'El Fuerte Marbella', title: ['A day at', 'El Fuerte'],
  text: 'The blind lifts on the pool, the palms and the Mediterranean. On the beach, five minutes from the old town.',
  view: { ...suite, alt: 'A blind opens in a junior suite, revealing the terrace, pool and sea' } },
{ id: 'move', time: '07:30', name: 'Mind and body', layout: 'bento', fx: 'bento', len: 130, kicker: 'Mind and Body', title: ['Move with the sea', 'in front of you'],
  text: 'A bright fitness studio equipped by Technogym, and an outdoor terrace facing the Mediterranean.',
  film: { src: '/demo/el-fuerte/shared/film/sea.mp4', poster: '/demo/el-fuerte/shared/film/sea-0.jpg', alt: 'Calm water below the hotel' },
  cards: pics([['2026/06/efm-mind-and-body-g5.jpg', 'A yoga pose in silhouette against the sea'], ['2026/06/efm-mind-and-body-g1.jpg', 'Yoga in the garden'], ['2026/06/efm-mind-and-body-g3.jpg', 'Running machines facing the sea'], ['2026/06/efm-mind-and-body-g4.jpg', 'Rowing with a view of the water'], ['2024/01/el-fuerte-marbella-gym-modelo-03.jpg', 'Training in the fitness studio'], ['2024/01/el-fuerte-marbella-gym-modelo-04.jpg', 'A guest in the gym']]) },
{ id: 'breakfast', time: '09:00', name: 'Breakfast', layout: 'orbit', tone: 'light', fx: 'orbit', len: 320, kicker: 'The Art of Breakfast', title: ['Breakfast,', 'in three acts'],
  text: 'A three course morning composed by the chef. Reserved 24 hours ahead, open to outside guests.',
  // three pictures for each act, in order
  ring: pics([['2025/07/el-fuerte-marbella-the-art-of-breafast-7.jpg', 'Juices and yoghurts on a striped market cart'], ['2025/07/fuerte-marbella-le-marche-1.jpg', 'A breakfast terrace over the water'], ['2025/02/07-el-fuerte-marbella-home-header.jpg', 'A table set beside a striped parasol'],
    ['2025/07/fuerte-marbella-le-marche-6.jpg', 'A guest choosing artisan bread'], ['2025/07/el-fuerte-marbella-the-art-of-breafast-4.jpg', 'A tiered stand of breakfast bites'], ['2025/07/fuerte-marbella-le-marche-5.jpg', 'The Le Marché counter'],
    ['2025/07/el-fuerte-marbella-the-art-of-breafast-6.jpg', 'Sweets served on a miniature carousel'], ['2025/07/efm-the-art-of-breakfast-foto-noria.jpg', 'Sweets on a little wheel'], ['2025/02/06-el-fuerte-marbella-home-header.jpg', 'Plates seen from above']]),
  courses: [['Roots', 'Pressed juices and artisanal granola.', u('2025/06/efm-the-art-of-breakfast-tienda-1.png')], ['Tradition', 'Breads, artisanal sausages and selected cheeses.', u('2025/06/efm-the-art-of-breakfast-noria.png')], ['Loop & Cake', 'A carousel of artisan sweets.', u('2025/06/efm-the-art-of-breakfast-tiovivo.png')]],
  popup: { label: 'Watch the breakfast film', video: u('2025/07/202507221329.mp4') } },
{ id: 'coffee', time: '10:30', name: 'Qahwa coffee', layout: 'full', fx: 'qahwa', len: 240, kicker: 'Qahwa Coffee House', title: ['A blend made', 'for this house'],
  text: 'Champion barista Adrián Fernández pairs beans from Colombia and Brazil. In the cup: chocolate, caramel and a fresh citrus edge.',
  film: { src: u('2026/02/adobestock-1666268146.mp4'), poster: u('2025/08/qahwa-coffee-fuerte-marbella-03.jpg'), alt: 'Milk poured into a coffee' },
  arches: pics([['2025/08/qahwa-coffee-fuerte-marbella-03.jpg', 'Smoothies and cake on a terrace table by the sea'], ['2025/08/qahwa-coffee-fuerte-marbella-04.jpg', 'Homemade cakes with smoothies']]) },
{ id: 'trips', time: '11:15', name: 'Days out', layout: 'full', fx: 'deck', len: 380, kicker: 'Experiences', title: ['Further along', 'the coast'],
  text: 'Days out, golf and a Saturday perfume workshop, arranged by Guest Experience.',
  items: [['Ronda', 'from €70'], ['Gibraltar', 'from €90'], ['Caminito del Rey', 'from €85'], ['Seville', 'from €95'], ['The Alhambra', 'from €105'], ['Tetouan', 'from €160'], ['Golf', 'from €160']],
  slides: pics([['2023/11/trip-to-ronda-efm-experiences.jpg', 'The bridge at Ronda'], ['2023/11/trip-to-gibraltar-efm-experiences.jpeg', 'The Rock of Gibraltar'], ['2023/11/caminito-del-rey-experiencias-efm-transfers-and-experiences.jpg', 'The Caminito del Rey walkway'], ['2023/11/trip-to-seville-efm-experiences.jpeg', 'Plaza de España in Seville'], ['2023/11/tour-alhambra-efm-experiencias.jpeg', 'The Alhambra in Granada'], ['2023/11/tetouan-efm-experiencias.jpg', 'The white city of Tetouan'], ['2024/04/los-naranjos-golf-experiencias.jpg', 'A golf course below the mountains']]) },
{ id: 'pool', time: '12:00', name: 'Pool and beach', layout: 'full', fx: 'parasols', len: 340, kicker: 'Pool and beach', title: ['Noon belongs', 'to the water'],
  text: 'Premium sunbeds by the pool or on the beach. The Day Pass starts at €79.50 per person, 11:00 to 19:00, with half returned as credit at Bar Levante.',
  slides: pics([['2025/02/05-el-fuerte-marbella-home-header.jpg', 'Striped parasols beside the pool'], ['2025/02/03-el-fuerte-marbella-home-header.jpg', 'The pool seen from above'], ['2026/04/efm-daypass-carrusel-1.jpg', 'Sunbeds by the pool and sea'], ['2022/10/el-fuerte-marbella-vista-dron-02.jpg', 'The pool and gardens from the air'], ['2026/04/efm-daypass-carrusel-2.jpg', 'The pool below tall palms'], ['2024/04/hero-cover-1.jpg', 'Gardens and parasols above the sea']]) },
{ id: 'club', time: '13:00', name: 'The Olive Club', layout: 'full', tone: 'fun', fx: 'scrub', len: 360, kicker: 'The Olive Club, ages 4 to 12', title: ['The little ones', 'defend a fort'],
  text: 'Supervised adventures for ages 4 to 12.',
  items: [['Olé!', 'flamenco and verdiales'], ['Musical twister', 'dance steps as a game'], ['Little potters', 'clay and imagination'], ['Mini-Mediaevals', 'the story of Fort San Luis'], ['Do you recycle?', 'a quiz for the planet'], ['Plant your plant', 'grown in an eggshell'], ['Fiesta time', 'colour, craft and music'], ['The club', 'indoors and out']],
  slides: pics([['2026/01/y-ole.jpg', 'Flamenco dancing'], ['2026/01/twister-musical.jpg', 'A bright twister mat'], ['2026/01/imagina-ser-alfarero.jpg', 'Small hands making pottery'], ['2026/01/mini-medievales.jpg', 'A child exploring an old map'], ['2026/01/y-tu-reciclas.jpg', 'Sorting recycling colours'], ['2026/01/cuida-tu-huerto.jpg', 'Holding a young plant'], ['2026/01/malaka-folk-1.jpg', 'Fiesta decorations'], ['2026/04/the-olive-club-el-fuerte-marbella-4.jpg', 'The outdoor play area']]) },
{ id: 'tables', time: '14:00', name: 'Lunch', layout: 'walk', tone: 'sand', fx: 'walk', len: 560, kicker: 'The tables', title: ['Five tables', 'by the sea'],
  text: 'By the old fort, on the beach and along the Sea Side promenade.',
  places: [
    ['Levante', 'Andalusian larder, open to the world. Indoors, terraces and hammocks.', pics([['2023/07/levante-facilities-04.jpg', 'Levante terrace beside the fort wall'], ['2025/07/curry-panang-de-gambas-de-lonja-1.jpg', 'Prawn panang curry'], ['2023/07/intro-pic-2.jpg', 'Lunch for two at Levante'], ['2025/07/rigatoni-tomates-asados-al-pesto-y-burrata-1.jpg', 'Rigatoni with burrata'], ['2023/11/el-fuerte-marbella-levante-mesas-terraza-03.jpg', 'Tables on the Levante terrace']])],
    ['Soleo', 'On the beach: Almadraba tuna, Málaga fried fish, rices and the Josper grill. Seasonal.', [{ src: S('2024/07/soleo-terraza.jpg'), alt: 'The Soleo terrace on the beach' }, { src: S('2024/07/soleo-paella-marisco.jpg'), alt: 'Seafood rice' }, ...pics([['2023/11/soleo-modelo-15.jpg', 'A table on the sand']]), { src: S('2024/07/soleo-tartar-atun.jpg'), alt: 'Tuna tartare' }, ...pics([['2023/11/soleo-modelo-01.jpg', 'Beside the water at Soleo']])]],
    ['Entre Limones', 'Seasonal Andalusian cooking by Chef Alfredo Medina, with sea views.', pics([['2024/11/entre-limones-facilities-carousel-01.jpg', 'The dining room'], ['2024/11/entre-limones-carousel-01.jpg', 'A seasonal plate'], ['2024/11/entre-limones-facilities-carousel-04.jpg', 'The terrace'], ['2024/11/entre-limones-carousel-02.jpg', 'A warm dish from the kitchen'], ['2024/11/entre-limones-carousel-03.jpg', 'Cured tuna']])],
    ['Luini', 'Stone oven Neapolitan pizza, handmade pasta and creamy risotto.', pics([['2024/11/luini-carousel-02.jpg', 'Inside Luini, with a little blue car'], ['2024/11/luini-carousel-05.jpg', 'Fresh pasta'], ['2024/11/luini-carousel-03.jpg', 'A table facing the sea'], ['2024/11/luini-carousel-06.jpg', 'Pasta finished in the wheel'], ['2024/11/luini-carousel-07.jpg', 'Grilled seafood']])],
    ['Amorino', 'Organic Italian gelato, served as a flower, for the walk back.', pics([['2024/11/amorino-sea-side.png', 'Amorino gelato by the sea']])],
  ] },
{ id: 'rooms', time: '15:00', name: 'Your room', layout: 'full', fx: 'shutters', len: 380, kicker: 'Rooms and suites', title: ['An afternoon', 'behind the blinds'],
  text: 'Interiors by Jaime Beriestain, most opening onto the Mediterranean. From sea view doubles to Selected junior suites with a Spa by Clarins beauty station.',
  slides: pics([['2025/06/el-fuerte-marbella-habitacion-jacaranda-frontal-mar-03-1.jpg', 'A sitting area opening to the terrace'], [room + 'la-dama-selected-01-1.jpg', 'A suite bedroom in warm colours'], [room + 'cala-frontal-mar-selected-01-1.jpg', 'A room facing the sea'], ['2024/04/el-fuerte-marbella-habitacion-selected-junior-suite-vista-mar-frontal-terraza-04-web-1.jpg', 'A junior suite terrace'], [room + 'buganvilla-lateral-mar-01-1.jpg', 'A room with a side sea view'], ['2023/06/el-fuerte-marbella-header-rooms-page.jpg', 'A bed beside a terrace at golden hour']]) },
{ id: 'spa', time: '16:00', name: 'Spa by Clarins', layout: 'full', fx: 'steam', len: 260, kicker: 'Spa by Clarins', title: ['Water, under', 'its own stars'],
  text: 'Face and body treatments by Clarins experts, massages shaped to you, and a hydrotherapy circuit from €50.',
  film: { src: '/demo/el-fuerte/shared/film/spa.mp4', poster: '/demo/el-fuerte/shared/film/spa-0.jpg', alt: 'The spa pool, water moving under a ceiling of small lights' },
  popup: { label: 'Watch the spa film', youtube: 'MLcy3GCxlkg' } },
{ id: 'tea', time: '17:00', name: 'Afternoon tea', layout: 'tiers', tone: 'light', fx: 'tiers', len: 440, kicker: 'The afternoon tea time', title: ['Time slows', 'to a pour'],
  text: 'From organic chamomile to Yunnan pu-erh, with warm scones, pastries and savoury bites. At Levante, 16:00 to 19:00, reserved 24 hours ahead.',
  layers: pics([['2025/10/levante-the-afternoon-tea-time-el-fuerte-marbella.jpg', 'Afternoon tea laid out at Levante'], ['2025/10/afternnon-tea-fuerte-marbella-4.jpg', 'The full tea service'], ['2025/10/afternnon-tea-fuerte-marbella-1.jpg', 'Tea poured into fine china'], ['2025/10/afternnon-tea-fuerte-marbella-3.jpg', 'A golden tiered tea stand']]) },
{ id: 'events', time: '18:15', name: 'Gatherings', layout: 'plan', tone: 'teal', fx: 'plan', len: 560, kicker: 'Meetings and events', title: ['Rooms with', 'natural light'],
  text: '300 m² of meeting space in natural light. Sevilla is 215 m², Estepa 45 m² and Carmelo 40 m².',
  rooms: [['Sevilla', 'Theatre · 138'], ['Sevilla', 'Classroom · 75'], ['Sevilla', 'U-shape · 42'], ['Sevilla', 'Banquet · 96'], ['Estepa', 'Boardroom · 20'], ['Carmelo', 'Boardroom · 15'], ['Lounge', 'Coffee breaks']],
  // one set-up per line of the list: [arrangement, seats, caption, picture]
  setups: [['theatre', 138, 'theatre', '2023/11/halls-06-1.jpg'], ['school', 75, 'classroom', '2023/11/halls-07-1.jpg'], ['u', 42, 'U-shape', '2023/05/el-fuerte-marbella-salones-sevilla-01-web.jpg'], ['banquet', 96, 'banquet', '2025/07/el-fuerte-marbella-salones-sevilla-09-mice-1.jpg'],
    ['board', 20, 'boardroom', '2023/05/el-fuerte-marbella-salones-estepa-01-web.jpg'], ['board', 15, 'boardroom', '2023/10/el-fuerte-marbella-salones-carmelo-02.jpg'], ['lounge', 24, 'coffee breaks', '2023/11/halls-01.jpg']].map(([k, n, c, f], r) => ({ r, k, n, c, src: u(f) })) },
{ id: 'champagne', time: '19:30', name: 'Champagne', layout: 'full', fx: 'scrub', len: 360, kicker: 'Champagne House by Taittinger', title: ['A glass to', 'the going sun'],
  text: 'Taittinger beside Fort San Luis, with 5J ham sliced to order, oysters opened at the table and caviar. Seasonal, 19:00 to 22:00.',
  slides: pics([['2025/07/jardin-champagne-house-fuerte-marbella.jpg', 'The champagne garden facing the sea'], ['2025/07/pareja-champagne-house-fuerte-marbella.jpg', 'A couple toasting in the garden'], ['2025/07/caviar-champagne-house-fuerte-marbella.jpg', 'Champagne and caviar'], ['2025/07/pareja-campagne-taittinger.jpg', 'Sharing a bottle on the lawn'], ['2025/07/ostras-champagne-house-fuerte-marbella-2.jpg', 'Fresh oysters'], ['2025/07/caviar-jamon-champagne-house-fuerte-marbella.jpg', 'Ham and caviar'], ['2025/07/hero-champagne-house.jpg', 'The terrace above the sea at dusk']]) },
{ id: 'kena', time: '21:30', name: 'Kena rooftop', layout: 'full', fx: 'scrub', len: 360, kicker: 'Kena by Akiro', title: ['Japan meets Peru,', 'on the roof'],
  text: 'Nikkei cooking directed by chef Luis Arévalo, signature cocktails and the whole bay below.',
  slides: [...pics([['2026/06/kena-el-fuerte-marbella-instalaciones-6.jpg', 'A toast against the sunset']]), { src: K('Home ordenador.png'), alt: 'Kena tables facing the sea' }, { src: K('Visit Kena Ordenador.png'), alt: 'The rooftop restaurant' }, { src: K('Menu.png'), alt: 'Nikkei dishes shared at the table' }, ...pics([['2026/06/kena-el-fuerte-marbella-instalaciones-5.jpg', 'Dinner on the rooftop']]), { src: K('Nikkei Cuisine ordenador.png'), alt: 'A Nikkei dish on the terracotta table' }, ...pics([['2026/06/kena-el-fuerte-marbella-instalaciones-8.jpg', 'Cocktails at dusk']])] },
{ id: 'story', time: '23:00', name: 'Since 1957', layout: 'frame', tone: 'dark', len: 90, kicker: 'Before sleep', title: ['Many evenings', 'have ended here'],
  text: 'The fort that gave the house its name was ordered in 1554 to watch for pirates. The hotel opened beside it in 1957.',
  film: { src: u('2023/06/efm-720websharename-1.mp4'), poster: u('2022/09/historia-el-fuerte-marbella-01.jpg'), alt: 'A film about the history of El Fuerte', rate: .6 } },
{ id: 'night', time: '23:30', name: 'Goodnight', layout: 'end', fx: 'night', len: 260, kicker: 'Calle El Fuerte, Marbella', title: ['Sleep by', 'the sea'],
  text: 'And do it all again tomorrow.',
  view: { ...suite, alt: 'The blind closes on the evening view' } },
];
console.assert(DAY.every((a, i) => !i || a.time > DAY[i - 1].time), 'hours must ascend');
console.assert(DAY.every(a => !a.items || a.items.length === a.slides.length), 'one slide per listed item');
window.LOGO = u('2022/07/el-fuerte-logo-white.svg');
})();
