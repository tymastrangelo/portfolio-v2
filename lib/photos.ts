// My photographs, grouped by trip or place, picked from my Photos library.
// Every frame carries its own place, which is the only caption a photo gets
// anywhere on the site.
//
// Adding photos: resize them into
// public/moments/<folder>/ (1800px long edge, EXIF stripped so GPS never
// ships), then add frames here. ar is the file's native aspect ratio (w/h),
// date comes from the original's EXIF (leave it off when there was none),
// video: true is a muted looping clip, focus is an optional object-position
// for when the frame is cropped (the home cover).

export type Frame = {
  src: string
  alt: string
  place: string
  date?: string
  ar: string
  video?: boolean
  focus?: string
}

export type Trip = {
  slug: string
  title: string
  place: string
  /** One line for the top of the trip page, in my words */
  line?: string
  cover: string
  frames: Frame[]
}

const ANTIGUA = 'Antigua, Guatemala'
const ACATENANGO = 'Acatenango, Guatemala'
const MARCO = 'Marco Island, Florida'
const ELON = 'Elon, North Carolina'

export const trips: Trip[] = [
  {
    slug: "guatemala",
    title: "Guatemala",
    place: "Acatenango and Antigua",
    line: "Two days up Acatenango over spring break, watching the volcano next door erupt.",
    cover: "/moments/guatemala/guatemala-02.jpg",
    frames: [
      { src: "/moments/guatemala/summit-sunrise.jpg", alt: "The sun rising beside Volcán de Agua with hikers silhouetted", place: "Acatenango, Guatemala", date: "March 27, 2026", ar: "2400/1800" },
      { src: "/moments/guatemala/guatemala-02.jpg", alt: "Fuego volcano sending up a column of ash at dawn", place: "Acatenango, Guatemala", date: "March 27, 2026", ar: "1800/1350" },
      { src: "/moments/guatemala/fuego-above-clouds.jpg", alt: "Volcán de Fuego smoking above a sea of clouds", place: "Acatenango, Guatemala", date: "March 27, 2026", ar: "2200/1238" },
      { src: "/moments/guatemala/guatemala-04.jpg", alt: "Fuego erupting at night, lava glowing above distant city lights", place: "Acatenango, Guatemala", date: "March 27, 2026", ar: "1800/1350" },
      { src: "/moments/guatemala/volcano-through-pines.jpg", alt: "A volcano above the clouds seen through the pines", place: "Acatenango, Guatemala", date: "March 27, 2026", ar: "1800/1013" },
      { src: "/moments/guatemala/rooftop-breakfast.jpg", alt: "Breakfast on an Antigua rooftop with a volcano on the horizon", place: "Antigua, Guatemala", date: "March 26, 2026", ar: "1350/1800" },
      { src: "/moments/guatemala/basecamp-dog.mp4", alt: "A dog rolling in the dirt at basecamp", place: "Acatenango, Guatemala", ar: "16/9", video: true },
      { src: "/moments/guatemala/fuego-erupting.mp4", alt: "Volcán de Fuego pushing out a smoke plume in daylight", place: "Acatenango, Guatemala", ar: "16/9", video: true },
    ],
  },
  {
    slug: "greece",
    title: "Greece, Türkiye and Italy",
    place: "Santorini, Mykonos, Ephesus, Rome and Sorrento",
    cover: "/moments/greece/greece-01.jpg",
    frames: [
      { src: "/moments/greece/greece-01.jpg", alt: "Family by a blue domed church with pink bougainvillea", place: "Santorini, Greece", date: "June 25, 2024", ar: "1350/1800" },
      { src: "/moments/greece/greece-02.jpg", alt: "White houses stacked down the cliff above the caldera", place: "Santorini, Greece", date: "June 25, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-03.jpg", alt: "Family selfie on a ship deck above a turquoise harbor", place: "Civitavecchia, Italy", date: "June 23, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-04.jpg", alt: "White windmill with a thatched roof and a blue gate", place: "Mykonos, Greece", date: "June 27, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-05.jpg", alt: "Sunset over the caldera with a lit cruise ship below", place: "Santorini, Greece", date: "June 25, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-07.jpg", alt: "Library of Celsus ruins in bright sun", place: "Ephesus, Türkiye", date: "June 26, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-08.jpg", alt: "Sorrento's cliffs and harbor from above", place: "Sorrento, Italy", date: "June 29, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-09.jpg", alt: "Whitewashed house with blue railings and a shady tree", place: "Mykonos, Greece", date: "June 27, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-10.jpg", alt: "Family in front of the Trevi Fountain in a crowd", place: "Rome, Italy", date: "June 21, 2024", ar: "1800/1350" },
      { src: "/moments/greece/greece-11.jpg", alt: "Wooden sailboat in green water off Mykonos town", place: "Mykonos, Greece", date: "June 27, 2024", ar: "1800/1350" },
    ],
  },
  {
    slug: "elon",
    title: "Elon",
    place: "Elon University",
    cover: "/moments/elon/elon-01.jpg",
    frames: [
      { src: "/moments/elon/elon-01.jpg", alt: "Five students in matching white polos behind the big ELON letters", place: "Elon University", date: "August 21, 2026", ar: "1350/1800" },
      { src: "/moments/elon/elon-03.jpg", alt: "Three friends in suits outside a white-columned brick building", place: "Elon University", date: "March 7, 2026", ar: "1350/1800" },
      { src: "/moments/elon/elon-04.jpg", alt: "Campus building glowing at dusk under bare trees", place: "Elon University", date: "February 10, 2025", ar: "1800/1350" },
      { src: "/moments/elon/elon-05.jpg", alt: "Big group selfie with friends crowded together, peace signs up", place: "Elon University", date: "February 27, 2026", ar: "1800/1350" },
      { src: "/moments/elon/elon-06.jpg", alt: "Five students in maroon Phoenix shirts by a mascot mural", place: "Elon University", date: "August 19, 2026", ar: "1350/1800" },
      { src: "/moments/elon/elon-07.jpg", alt: "Three friends in suits posing under a brick archway", place: "Elon University", date: "April 30, 2026", ar: "1350/1800" },
      { src: "/moments/elon/elon-08.jpg", alt: "Student government table on the lawn with members behind it", place: "Elon University", date: "September 2, 2026", ar: "1800/1350" },
      { src: "/moments/elon/elon-09.jpg", alt: "Students in hard hats and safety vests touring a construction site", place: "Elon University", date: "September 25, 2026", ar: "1800/1350" },
      { src: "/moments/elon/elon-11.jpg", alt: "Friends holding up bingo cards on stage at a campus event", place: "Elon University", date: "September 4, 2026", ar: "1800/1350" },
      { src: "/moments/elon/elon-12.jpg", alt: "Student government members piled into a truck bed with a cooler", place: "Elon, North Carolina", date: "August 21, 2026", ar: "1350/1800" },
    ],
  },
  {
    slug: "spain",
    title: "Spain",
    place: "Barcelona, Tarragona and Montserrat",
    cover: "/moments/spain/spain-01.jpg",
    frames: [
      { src: "/moments/spain/spain-01.jpg", alt: "Eight friends leaning together on a stone wall under pine trees", place: "Park Güell, Barcelona", date: "November 24, 2024", ar: "1800/1350" },
      { src: "/moments/spain/spain-02.jpg", alt: "Rooftops running down to the Mediterranean", place: "Tarragona, Spain", date: "November 27, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-04.jpg", alt: "Sun setting through clouds over water and old pier posts", place: "Barcelona, Spain", date: "November 24, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-05.jpg", alt: "Three friends at a railing above the harbor", place: "Barcelona, Spain", date: "November 26, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-06.jpg", alt: "Narrow old town street with iron balconies and a lamp", place: "Tarragona, Spain", date: "November 27, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-07.jpg", alt: "Floodlit soccer stadium at night seen from the stands", place: "Barcelona, Spain", date: "November 26, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-09.jpg", alt: "Looking down a narrow street between old town rooftops", place: "Tarragona, Spain", date: "November 27, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-10.jpg", alt: "Group walking up a foggy path toward a stone arch", place: "Montserrat, Spain", date: "November 25, 2024", ar: "1350/1800" },
      { src: "/moments/spain/spain-11.jpg", alt: "Black and white cat sitting in sunlit stone ruins", place: "Tarragona, Spain", date: "November 27, 2024", ar: "1350/1800" },
    ],
  },
  {
    slug: "islands",
    title: "Bahamas and Key West",
    place: "Key West and the Bahamas",
    cover: "/moments/islands/islands-02.jpg",
    frames: [
      { src: "/moments/islands/islands-02.jpg", alt: "Jet ski crossing clear turquoise water", place: "Bahamas", date: "June 13, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-04.jpg", alt: "Nurse shark gliding through shallow turquoise water", place: "Bahamas", date: "June 12, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-05.jpg", alt: "Café patio with yellow umbrellas, potted plants and a rooster", place: "Key West, Florida", date: "August 2, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-06.jpg", alt: "Golden clouds over a marina at dusk", place: "Key West, Florida", date: "August 1, 2024", ar: "1800/1350" },
      { src: "/moments/islands/islands-07.jpg", alt: "Swimming with nurse sharks beside a wooden dock", place: "Bahamas", date: "June 12, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-09.jpg", alt: "Rooster strutting along a brick garden path", place: "Key West, Florida", date: "August 2, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-10.jpg", alt: "Boat bow heading toward towering white clouds", place: "Key West, Florida", date: "August 1, 2024", ar: "1350/1800" },
      { src: "/moments/islands/islands-11.jpg", alt: "Three friends squeezed into a night selfie", place: "Bahamas", date: "June 13, 2024", ar: "1012/1800" },
    ],
  },
  {
    slug: "iceland",
    title: "Iceland",
    place: "Reykjavík, Snæfellsnes, Akureyri, Grímsey and the Westman Islands",
    cover: "/moments/iceland/iceland-01.jpg",
    frames: [
      { src: "/moments/iceland/iceland-01.jpg", alt: "Wide horseshoe waterfall pouring into a blue-green river", place: "Goðafoss, Iceland", date: "June 7, 2023", ar: "1800/1350" },
      { src: "/moments/iceland/iceland-02.jpg", alt: "Puffins standing on a grassy cliff edge above the sea", place: "Grímsey, Iceland", date: "June 6, 2023", ar: "1800/1350" },
      { src: "/moments/iceland/iceland-03.jpg", alt: "Waterfall feeding a rocky stream through green hills", place: "Ísafjörður, Iceland", date: "June 8, 2023", ar: "1350/1800" },
      { src: "/moments/iceland/iceland-04.jpg", alt: "Small black wooden church behind a lava stone wall", place: "Vestmannaeyjar, Iceland", date: "June 9, 2023", ar: "1350/1800" },
      { src: "/moments/iceland/iceland-05.jpg", alt: "Basalt sea stacks and a pebble cove under a gray sky", place: "Snæfellsbær, Iceland", date: "June 5, 2023", ar: "1350/1800" },
      { src: "/moments/iceland/iceland-06.jpg", alt: "Heart-shaped red traffic light below snowy mountains", place: "Akureyri, Iceland", date: "June 7, 2023", ar: "1350/1800" },
      { src: "/moments/iceland/iceland-07.jpg", alt: "Island town below green cliffs, seen from a red volcanic slope", place: "Vestmannaeyjar, Iceland", date: "June 9, 2023", ar: "1800/1350" },
      { src: "/moments/iceland/iceland-08.jpg", alt: "Glass facade of a concert hall by the harbor", place: "Reykjavík, Iceland", date: "June 4, 2023", ar: "1014/1800" },
      { src: "/moments/iceland/iceland-09.jpg", alt: "Mossy lava rock opening onto a deep sea cave", place: "Snæfellsbær, Iceland", date: "June 5, 2023", ar: "1350/1800" },
      { src: "/moments/iceland/iceland-10.jpg", alt: "Calm fjord under low clouds with mountains beyond", place: "Iceland", date: "June 5, 2023", ar: "1800/1350" },
    ],
  },
  {
    slug: "marco-island",
    title: "Marco Island",
    place: "Marco Island and Naples",
    line: "On the beach or off the back of the boat, I never skip a sunset.",
    cover: "/moments/marco-island/marco-island-10.jpg",
    frames: [
      { src: "/moments/marco-island/marco-island-10.jpg", alt: "Fiery orange sunset clouds over the Gulf and the beach", place: "Naples, Florida", date: "April 5, 2023", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-11.jpg", alt: "Sunrise clouds mirrored in a glassy bay, mangroves on the left", place: "Marco Island, Florida", date: "August 5, 2023", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-07.jpg", alt: "Glassy bay reflecting a pastel sunset and drifting clouds", place: "Marco Island, Florida", date: "August 5, 2023", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-14.jpg", alt: "Red sun touching the horizon between two channel markers", place: "Marco Island, Florida", date: "March 11, 2023", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-05.jpg", alt: "Orange and violet sunset over waves rolling onto the beach", place: "Marco Island, Florida", date: "July 23, 2025", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-15.jpg", alt: "A tern perched on a green channel marker in choppy green water", place: "Marco Island, Florida", date: "December 17, 2025", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-12.jpg", alt: "Puffy white clouds over blue water, an island and two boat wakes", place: "Marco Island, Florida", date: "September 22, 2023", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-03.jpg", alt: "Sun setting behind mangroves over a boat's churning wake", place: "Naples, Florida", date: "May 29, 2023", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-13.jpg", alt: "Sunset reflected in a still tidal pool, sea oats on the dune", place: "Marco Island, Florida", date: "December 21, 2022", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-16.jpg", alt: "Pink clouds over a mangrove lagoon, a palm frond in the corner", place: "Marco Island, Florida", date: "January 1, 2024", ar: "1800/1350" },
      { src: "/moments/marco-island/marco-island-08.jpg", alt: "A bird skimming the surf under a stormy sunset sky", place: "Marco Island, Florida", date: "June 24, 2025", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-17.jpg", alt: "Golden sunset over rippled water lapping the shore", place: "Naples, Florida", date: "January 26, 2024", ar: "1350/1800" },
      { src: "/moments/marco-island/marco-island-09.jpg", alt: "Low tide flats mirroring pink sunset clouds", place: "Marco Island, Florida", date: "April 29, 2024", ar: "1350/1800" },
    ],
  },
  {
    slug: "everywhere-else",
    title: "Everywhere Else",
    place: "Charlotte, Orlando and Nassau",
    cover: "/moments/everywhere-else/everywhere-else-01.jpg",
    frames: [
      { src: "/moments/everywhere-else/everywhere-else-01.jpg", alt: "Eight students in business clothes on the steps of a stone building", place: "Charlotte, North Carolina", date: "October 24, 2026", ar: "1350/1800" },
      { src: "/moments/everywhere-else/everywhere-else-02.jpg", alt: "Crowds on a crooked storybook street of shops", place: "Universal Orlando Resort", date: "June 26, 2026", ar: "1350/1800" },
      { src: "/moments/everywhere-else/everywhere-else-03.jpg", alt: "Palm tree leaning over a white sand beach", place: "Nassau, Bahamas", date: "December 31, 2022", ar: "1800/1350" },
      { src: "/moments/everywhere-else/everywhere-else-04.jpg", alt: "Churro held up in front of a green roller coaster", place: "Universal Orlando Resort", date: "June 27, 2026", ar: "1350/1800" },
      { src: "/moments/everywhere-else/everywhere-else-05.jpg", alt: "Group selfie in suits on a sunny brick plaza", place: "Charlotte, North Carolina", date: "October 24, 2026", ar: "1350/1800" },
      { src: "/moments/everywhere-else/everywhere-else-06.jpg", alt: "New Year's countdown concert lighting up the crowd", place: "Paradise Island, Bahamas", date: "January 1, 2023", ar: "1350/1800" },
    ],
  },
  {
    slug: "colorado",
    title: "Vail and Beaver Creek",
    place: "Vail and Beaver Creek",
    cover: "/moments/colorado/colorado-01.jpg",
    frames: [
      { src: "/moments/colorado/colorado-01.jpg", alt: "Groomed run overlooking snowy peaks under streaked clouds", place: "Vail, Colorado", date: "February 25, 2023", ar: "1800/1350" },
      { src: "/moments/colorado/colorado-03.jpg", alt: "Ski run dropping into a snowy valley lined with aspens", place: "Beaver Creek, Colorado", date: "February 19, 2021", ar: "1800/1350" },
      { src: "/moments/colorado/colorado-04.jpg", alt: "Goggled selfie with skiers waving on the slope behind", place: "Vail, Colorado", date: "February 23, 2023", ar: "1350/1800" },
      { src: "/moments/colorado/colorado-05.jpg", alt: "Wide powder bowl dotted with pines and skiers", place: "Vail, Colorado", date: "February 23, 2023", ar: "1800/1350" },
      { src: "/moments/colorado/colorado-06.jpg", alt: "Ski group under the Legendary Back Bowls sign", place: "Vail, Colorado", date: "February 23, 2023", ar: "1800/1350" },
      { src: "/moments/colorado/colorado-07.jpg", alt: "Skiers on a ridge facing a jagged snowy range", place: "Vail, Colorado", date: "February 26, 2023", ar: "1800/1350" },
    ],
  },
  {
    slug: "mountains",
    title: "North Carolina Mountains",
    place: "Grandfather Mountain and Pisgah",
    cover: "/moments/mountains/mountains-01.jpg",
    frames: [
      { src: "/moments/mountains/mountains-01.jpg", alt: "Morning clouds settled in a valley below forested ridges", place: "Pisgah, North Carolina", date: "July 14, 2023", ar: "1800/1350" },
      { src: "/moments/mountains/mountains-03.jpg", alt: "Grassy rocky slope above layers of blue ridges", place: "Grandfather Mountain, North Carolina", date: "July 18, 2023", ar: "1800/1350" },
      { src: "/moments/mountains/mountains-04.jpg", alt: "Rolling green mountains under puffy white clouds", place: "Pisgah, North Carolina", date: "July 7, 2023", ar: "1800/1350" },
      { src: "/moments/mountains/mountains-05.jpg", alt: "Hazy view over forest and a small lake from the summit", place: "Grandfather Mountain, North Carolina", date: "July 18, 2023", ar: "1800/1350" },
      { src: "/moments/mountains/mountains-06.jpg", alt: "Green ridges fading into blue haze", place: "Pisgah, North Carolina", date: "July 8, 2022", ar: "1350/1800" },
    ],
  },
]

// The home cover rotates through these, one picked per visit, strongest first.
// The first one is also what the server renders and what the share image uses.
export const coverFrames: Frame[] = [
  { src: '/moments/guatemala/trail-first-light.jpg', alt: 'Walking the volcanic trail on Acatenango at first light', place: ACATENANGO, ar: '5/8', focus: '50% 40%' },
  { src: '/moments/guatemala/summit-sunrise.jpg', alt: 'The sun rising beside Volcán de Agua with hikers silhouetted', place: ACATENANGO, ar: '4/3', focus: '50% 45%' },
  { src: '/moments/guatemala/fuego-night-eruption.jpg', alt: 'Volcán de Fuego erupting at night with lava and city lights below', place: ACATENANGO, ar: '4/3', focus: '50% 40%' },
  { src: '/moments/sunsets/naples-fire.jpg', alt: 'Vivid orange sunset over the Gulf of Mexico', place: MARCO, ar: '4/3', focus: '50% 40%' },
  { src: '/moments/greece/santorini-caldera.jpg', alt: 'Santorini caldera and whitewashed buildings over the sea', place: 'Santorini, Greece', ar: '4/3', focus: '50% 50%' },
]

export function getTrip(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug)
}
