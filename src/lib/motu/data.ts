// Mock data layer for MOTU. Shaped so a real backend can replace it later.

export type BabaState =
  | "meditation"
  | "talking"
  | "happy"
  | "proud"
  | "confused"
  | "disappointed"
  | "angry"
  | "excited"
  | "celebrating"
  | "searching"
  | "shocked";

export type CharacterState =
  | "idle"
  | "walking"
  | "searching"
  | "celebrating"
  | "meditating"
  | "confused"
  | "exhausted"
  | "digging";

export interface Mission {
  id: string;
  code: string;
  title: string;
  official: string;
  reward: number;
  motivationGain: number;
  difficulty: "TRIVIAL" | "MODERATE" | "HARD" | "LEGENDARY";
  time: string;
  required: number;
  characterState: CharacterState;
  baba: string;
}

export const MISSIONS: Mission[] = [
  {
    id: "m01",
    code: "MISSION 01",
    title: "SEARCH UNDER YOUR BED",
    official: "LOCALIZED SUBTERRANEAN BEDROOM INVESTIGATION",
    reward: 100,
    motivationGain: 4,
    difficulty: "TRIVIAL",
    time: "2 min",
    required: 1,
    characterState: "searching",
    baba: "Apne bistar ke neeche khoj karo, vats. Shayad tumhari motivation wahin tapasya kar rahi ho.",
  },
  {
    id: "m02",
    code: "MISSION 02",
    title: "OPEN YOUR WARDROBE",
    official: "TEXTILE CONTAINMENT UNIT BREACH PROTOCOL",
    reward: 75,
    motivationGain: 3,
    difficulty: "TRIVIAL",
    time: "1 min",
    required: 1,
    characterState: "searching",
    baba: "Almari kholo, balak. Kapdon ke peeche bhi rahasya chhupe hote hain.",
  },
  {
    id: "m03",
    code: "MISSION 03",
    title: "FIND SOMETHING BLUE",
    official: "CHROMATIC WAVELENGTH ACQUISITION TASK (450–495 NM)",
    reward: 50,
    motivationGain: 2,
    difficulty: "TRIVIAL",
    time: "3 min",
    required: 2,
    characterState: "searching",
    baba: "Neela rang shanti ka pratik hai, hey veer. Dhoondo.",
  },
  {
    id: "m04",
    code: "MISSION 04",
    title: "WALK TOWARDS YOUR FRIEND",
    official: "BILATERAL MOTIVATION CONVERGENCE MANOEUVRE",
    reward: 250,
    motivationGain: 9,
    difficulty: "HARD",
    time: "27 min",
    required: 18,
    characterState: "walking",
    baba: "Apne mitra ki aur prasthan karo. Tumhari motivations milne wali hain.",
  },
  {
    id: "m05",
    code: "MISSION 05",
    title: "GO OUTSIDE",
    official: "EXTERNAL ATMOSPHERE EXPOSURE TRIAL",
    reward: 150,
    motivationGain: 7,
    difficulty: "MODERATE",
    time: "11 min",
    required: 12,
    characterState: "walking",
    baba: "Bahar jao, priya shishya. Suraj tumhein pehchanta hi nahi ab.",
  },
  {
    id: "m06",
    code: "MISSION 06",
    title: "DIG A HOLE",
    official: "UNAUTHORISED GEOLOGICAL EXCAVATION DIRECTIVE",
    reward: 300,
    motivationGain: 12,
    difficulty: "HARD",
    time: "45 min",
    required: 34,
    characterState: "digging",
    baba: "Gaddha khodo, he praani. Kyun? Yeh prashn mat poochho.",
  },
  {
    id: "m07",
    code: "MISSION 07",
    title: "FIND YOUR LOST SOCK",
    official: "SINGULAR HOSIERY REUNIFICATION CAMPAIGN",
    reward: 500,
    motivationGain: 18,
    difficulty: "LEGENDARY",
    time: "∞",
    required: 61,
    characterState: "searching",
    baba: "Yeh mahaan karya hai, yoddha. Aaj tak koi safal nahi hua.",
  },
];

export const METRICS = [
  { label: "Motivation Signal", value: "2.1 dB", tone: "alert" },
  { label: "Motivation Battery", value: "3%", tone: "alert" },
  { label: "Motivation Temperature", value: "11.4 °K", tone: "signal" },
  { label: "Motivation Stability", value: "UNSTABLE", tone: "warn" },
  { label: "Procrastination Index", value: "98.3", tone: "alert" },
  { label: "Bed Gravity", value: "94 m/s²", tone: "warn" },
  { label: "Social Battery", value: "12%", tone: "warn" },
  { label: "Motivation Velocity", value: "-12.7%", tone: "alert" },
] as const;

export const SEARCH_LOCATIONS = [
  "Under your bed",
  "Inside your wardrobe",
  "Inside your bag",
  "Behind your sofa",
  "Inside your fridge",
  "Under your books",
  "Inside your phone",
  "At the library",
  "Outside",
  "Unknown",
];

export const SCAN_OBJECTS = [
  { name: "OLD SOCK", confidence: 98 },
  { name: "PHONE CHARGER", confidence: 92 },
  { name: "PILE OF CLOTHES", confidence: 88 },
  { name: "DUST COLONY", confidence: 87 },
  { name: "EXPIRED SNACK", confidence: 71 },
  { name: "ONE (1) EARPHONE", confidence: 64 },
  { name: "ASSIGNMENT (UNOPENED)", confidence: 55 },
  { name: "MOTIVATION SIGNAL", confidence: 3 },
];

export const FALSE_ALARMS = [
  "It was a sock.",
  "It was your charger.",
  "It was a pile of clothes.",
  "It was absolutely nothing.",
  "You were standing on it.",
];

export interface Friend {
  id: string;
  name: string;
  motivation: number;
  distance: string;
  status: string;
  x: number;
  y: number;
}

export const FRIENDS: Friend[] = [
  { id: "f1", name: "Ananya", motivation: 61, distance: "2.4 km", status: "MOTIVATED (SUSPICIOUS)", x: 68, y: 32 },
  { id: "f2", name: "Rehan", motivation: 12, distance: "0.8 km", status: "HORIZONTAL", x: 32, y: 58 },
  { id: "f3", name: "Kabir", motivation: 44, distance: "5.1 km", status: "PRETENDING TO STUDY", x: 78, y: 70 },
  { id: "f4", name: "Meera", motivation: 88, distance: "11.7 km", status: "DONATING MOTIVATION", x: 20, y: 24 },
];

export interface Skin {
  id: string;
  name: string;
  cost: number;
  blurb: string;
  emoji: string;
  anim: string;
}

export const SKINS: Skin[] = [
  { id: "monk", name: "Motivation Monk", cost: 0, blurb: "Default vessel. Mildly enlightened.", emoji: "🧘", anim: "animate-breathe" },
  { id: "astronaut", name: "Astronaut", cost: 400, blurb: "Floating in space. Same productivity.", emoji: "🧑‍🚀", anim: "animate-float" },
  { id: "ninja", name: "Ninja", cost: 600, blurb: "Avoids tasks silently.", emoji: "🥷", anim: "animate-drift" },
  { id: "student", name: "Student", cost: 250, blurb: "Permanently 3 deadlines behind.", emoji: "🎓", anim: "animate-float" },
  { id: "alien", name: "Alien", cost: 900, blurb: "Does not understand Mondays.", emoji: "👽", anim: "animate-breathe" },
  { id: "business", name: "Businessperson", cost: 750, blurb: "Attends meetings about motivation.", emoji: "💼", anim: "animate-float" },
  { id: "baba", name: "Baba", cost: 2000, blurb: "Floating meditation. Spiritually unproductive.", emoji: "🧙", anim: "animate-float" },
  { id: "potato", name: "Potato", cost: 500, blurb: "Rolling. Absolutely no tactical advantage.", emoji: "🥔", anim: "animate-drift" },
  { id: "sleepwalker", name: "Sleepwalker", cost: 350, blurb: "Completes missions while unconscious.", emoji: "🛌", anim: "animate-breathe" },
];

export interface StoreItem {
  id: string;
  name: string;
  cost: number;
  blurb: string;
  emoji: string;
}

export const STORE_ITEMS: StoreItem[] = [
  { id: "premium", name: "PREMIUM MOTIVATION", cost: 999, blurb: "Contains no actual motivation.", emoji: "✨" },
  { id: "scanner", name: "GOLDEN SCANNER", cost: 1500, blurb: "Scans 0.7% more accurately.", emoji: "📡" },
  { id: "babamode", name: "BABA MODE", cost: 2000, blurb: "Become spiritually unproductive.", emoji: "🧙" },
  { id: "potatoskin", name: "POTATO SKIN", cost: 500, blurb: "Absolutely no tactical advantage.", emoji: "🥔" },
  { id: "insurance", name: "MOTIVATION INSURANCE", cost: 999, blurb: "Terms and conditions do not exist.", emoji: "📜" },
  { id: "theme", name: "NEBULA MAP THEME", cost: 1200, blurb: "Your lost motivation, but purple.", emoji: "🌌" },
];

export interface Achievement {
  id: string;
  name: string;
  blurb: string;
  emoji: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-loss", name: "FIRST LOSS", blurb: "You lost your motivation.", emoji: "💨" },
  { id: "false-alarm", name: "FALSE ALARM", blurb: "Found a sock instead.", emoji: "🧦" },
  { id: "under-the-bed", name: "UNDER THE BED", blurb: "Successfully searched under your bed.", emoji: "🛏️" },
  { id: "donor", name: "MOTIVATION DONOR", blurb: "Donated motivation.", emoji: "❤️" },
  { id: "procrastinator", name: "PROFESSIONAL PROCRASTINATOR", blurb: "Ignored 10 missions.", emoji: "🕰️" },
  { id: "hoarder", name: "MOTIVATION HOARDER", blurb: "Reached 100%.", emoji: "🏦" },
  { id: "signal", name: "SIGNAL DETECTED", blurb: "Found motivation.", emoji: "📶" },
  { id: "never-there", name: "IT WAS NEVER THERE", blurb: "Completed the ultimate useless achievement.", emoji: "🕳️" },
];

export const CASE_EVIDENCE = [
  { time: "08:02", text: "Attended 8 AM class (physically)", weight: 12 },
  { time: "09:41", text: "Saw assignment. Closed assignment.", weight: 64 },
  { time: "09:42", text: "Opened Instagram", weight: 91 },
  { time: "10:15", text: "Opened YouTube 'for 5 minutes'", weight: 88 },
  { time: "12:04", text: "Returned to bed for 'a moment'", weight: 97 },
  { time: "all day", text: "Checked phone 37 times", weight: 79 },
];

export const SUSPECTS = [
  { name: "BED", guilt: 97 },
  { name: "PHONE", guilt: 91 },
  { name: "MONDAY", guilt: 84 },
  { name: "ASSIGNMENT", guilt: 62 },
  { name: "SLEEP", guilt: 55 },
  { name: "INTERNET", guilt: 88 },
];

export const USELESS_STATS = [
  { label: "BED GRAVITY", value: 94, unit: "%" },
  { label: "MONDAY RESISTANCE", value: 87, unit: "%" },
  { label: "SCROLL EXPOSURE", value: 4.28, unit: "h", display: "4h 17m" },
  { label: "ASSIGNMENT AVOIDANCE", value: 98.3, unit: "%" },
  { label: "MOTIVATION VELOCITY", value: -12.7, unit: "%" },
  { label: "CHANCE OF DOING WORK TODAY", value: 4.6, unit: "%" },
];

export const GLOBAL_STATS = [
  { label: "TOTAL MOTIVATION LOST TODAY", value: 8472921, suffix: "%" },
  { label: "MOTIVATION RECOVERED", value: 12, suffix: "%" },
  { label: "FALSE ALARMS", value: 47281, suffix: "" },
  { label: "SOCKS FOUND", value: 8, suffix: "" },
  { label: "MOTIVATION DONATED", value: 1927, suffix: "%" },
];

export const DAY_CURVE = [
  { t: "06:00", v: 71 },
  { t: "09:00", v: 58 },
  { t: "12:00", v: 41 },
  { t: "15:00", v: 22 },
  { t: "18:00", v: 14 },
  { t: "21:00", v: 8 },
  { t: "00:00", v: 3 },
];

export const WEEK_CURVE = [
  { t: "Mon", lost: 92, recovered: 8 },
  { t: "Tue", lost: 71, recovered: 19 },
  { t: "Wed", lost: 64, recovered: 24 },
  { t: "Thu", lost: 80, recovered: 11 },
  { t: "Fri", lost: 95, recovered: 4 },
  { t: "Sat", lost: 41, recovered: 44 },
  { t: "Sun", lost: 88, recovered: 6 },
];

export const FORECAST = [
  { t: "08:00", v: 72, mood: "Hopeful haze" },
  { t: "12:00", v: 48, mood: "Scattered doubt" },
  { t: "15:00", v: 19, mood: "Heavy drowsiness" },
  { t: "19:00", v: 9, mood: "Existential drizzle" },
  { t: "23:00", v: 2, mood: "Total motivational eclipse" },
];

export const REMINDER_OPTIONS = [
  { id: "morning", label: "Morning motivation scan", time: "07:30" },
  { id: "afternoon", label: "Afternoon motivation check", time: "14:00" },
  { id: "evening", label: "Evening recovery reminder", time: "20:30" },
  { id: "mission", label: "Mission reminder", time: "every 3h" },
  { id: "low", label: "Low motivation alert", time: "instant" },
];

export const SEED_JOURNAL = [
  { id: "j1", time: "09:00", activity: "Breakfast", level: 64, killer: "None yet", place: "Kitchen" },
  { id: "j2", time: "10:00", activity: "Lecture", level: 48, killer: "Slide 41", place: "Back bench" },
  { id: "j3", time: "12:30", activity: "Instagram", level: 18, killer: "The algorithm", place: "Corridor" },
  { id: "j4", time: "14:00", activity: "Bed", level: 3, killer: "Bed", place: "Nowhere" },
];

export const BABA_LINES = {
  greeting: "Aao balak... tumhari motivation tumse रूठी hui hai.",
  low: "Hey suputra... tumhari motivation ki jyoti bahut dheemi ho chuki hai.",
  mission: "Utho balak. Tumhara agla karya pratiksha kar raha hai.",
  falseAlarm: "Dhyaan se dekho, balak. Yeh motivation nahi... ek moza hai.",
  complete: "Wah balak! Tumne aaj apni aatma... mera matlab, motivation, thodi si punah prapt kar li.",
  ignore: "Balak... MOTU tumhara teen ghante se intezaar kar raha hai.",
  high: "Itni motivation? Vats, thodi daan kar do.",
  donate: "Seva param dharma hai, suputra.",
  friend: "Apne mitra ki aur prasthan karo. Tumhari motivations milne wali hain.",
  lost: "Tumhari motivation punah antardhaan ho gayi.",
  found: "Mil gayi, balak! Itne samay se yeh kahan chhupi thi?",
  search: "Dhyaan se khojna, balak. Motivation aksar wahi chhupti hai jahan tum jaana nahi chahte.",
  scannerFail: "Arre balak... itna bada scanner aur mila kya? MOZA.",
  forecast: "Kal ka din kathin hai, balak.",
  suspect: "Maine pehle hi kaha tha, balak. Bistar par bharosa mat karo.",
  collision: "Wah! Do bhatakti motivations aaj mil hi gayin.",
  login: "Aao suputra. Apni pehchaan batao, taaki hum tumhari motivation ko pehchaan sakein.",
  boot: "Shant ho jao, balak... hum tumhari motivation khoj rahe hain.",
};
