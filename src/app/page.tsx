"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Place = {
  id: string;
  name: string;
  vibe: string;
  neighborhood: string;
  price: 1 | 2 | 3 | 4;
  tags: string[];
  address: string;
  description: string;
};

function priceToDollarSigns(price: 1 | 2 | 3 | 4) {
  return "$".repeat(price);
}

function vibeToSlug(vibe: string) {
  return vibe
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function slugToVibe(slug: string, vibes: string[]) {
  const normalized = slug.trim().toLowerCase();
  return vibes.find((v) => vibeToSlug(v) === normalized) ?? null;
}

const FAVORITES_KEY = "vah_favorites_v1";

// ✅ Wrapper component (no useSearchParams here)
export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient />
    </Suspense>
  );
}

function HomeFallback() {
  return (
    <main className="min-h-screen bg-[#0B0B10] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Loading vibe-a-holic
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Pick the vibe.</h1>
          <p className="mt-2 text-white/70">
            Getting everything ready for you…
          </p>
        </div>
      </section>
    </main>
  );
}

// ✅ Client component (safe to use useSearchParams)
function HomeClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activePlace, setActivePlace] = useState<Place | null>(null);

  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 1600);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  async function copyShareLink() {
    if (!selectedVibe) return showToast("Pick a vibe first.");
    const slug = vibeToSlug(selectedVibe);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?vibe=${encodeURIComponent(slug)}`
        : "";
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied.");
    } catch {
      showToast("Couldn’t copy link.");
    }
  }


  const places: Place[] = useMemo(
    () => [
      // FIRST DATE
      {
        id: "el-vez-first-date",
        name: "El Vez",
        vibe: "First Date",
        neighborhood: "Midtown Village",
        price: 2,
        tags: ["fun", "loud", "margs", "high-energy"],
        address: "121 S 13th St, Philadelphia, PA",
        description:
          "A first-date cheat code when you want the night to feel like something’s happening. Bright vibe, strong drinks, and a menu that’s easy to share. Perfect if you want conversation with a little background buzz so it never feels awkward or too quiet.",
      },
      {
        id: "harp-and-crown-first-date",
        name: "Harp & Crown",
        vibe: "First Date",
        neighborhood: "Center City",
        price: 3,
        tags: ["cocktails", "speakeasy feel", "games", "dim"],
        address: "1525 Sansom St, Philadelphia, PA",
        description:
          "Great when you want ‘impressive but not trying too hard.’ Start with drinks upstairs, then wander—there’s usually something fun going on and the space feels elevated. The lighting and layout make it easy to keep things flowing if you’re nervous.",
      },
      {
        id: "good-dog-first-date",
        name: "Good Dog Bar",
        vibe: "First Date",
        neighborhood: "Center City",
        price: 2,
        tags: ["cozy", "casual", "beer", "comfort food"],
        address: "224 S 15th St, Philadelphia, PA",
        description:
          "Warm, low-pressure, and always a safe pick if you want a relaxed first date. The food is familiar, the vibe is friendly, and you can actually hear each other. Perfect when you want the night to be about the person, not the production.",
      },
      {
        id: "jg-skyhigh-first-date",
        name: "JG SkyHigh",
        vibe: "First Date",
        neighborhood:
          "Center City (Four Seasons Hotel Philadelphia at the Comcast Center)",
        price: 4,
        tags: ["views", "wow factor", "dress-up", "cocktails"],
        address: "One N 19th St, Philadelphia, PA 19103",
        description:
          "If you want an instant ‘this is a moment’ date. Skyline views, polished vibe, and a reason to dress up. It’s more of a ‘special first date’ option—best for when you already have good chemistry and want a memorable night.",
      },

      // DATE NIGHT
      {
        id: "parc-date-night",
        name: "Parc",
        vibe: "Date Night",
        neighborhood: "Rittenhouse",
        price: 3,
        tags: ["classic", "romantic", "people-watching"],
        address: "227 S 18th St, Philadelphia, PA",
        description:
          "A classic date-night move: warm lighting, buzzing energy, and the kind of place that feels instantly ‘grown.’ It’s ideal when you want a full dinner, a slower pace, and a vibe that makes the night feel a little more serious—in a good way.",
      },
      {
        id: "barbuzzo-date-night",
        name: "Barbuzzo",
        vibe: "Date Night",
        neighborhood: "Midtown Village",
        price: 2,
        tags: ["pasta", "cozy", "share plates", "good value"],
        address: "110 S 13th St, Philadelphia, PA",
        description:
          "Perfect when you want intimate but not stiff. The menu is built for sharing, the room feels warm, and you’ll leave feeling like you picked the spot on purpose. Great for ‘cute night out’ without turning it into a huge splurge.",
      },
      {
        id: "bistro-la-minette-date-night",
        name: "Bistro La Minette",
        vibe: "Date Night",
        neighborhood: "Queen Village",
        price: 3,
        tags: ["French", "candlelit", "quiet", "romantic"],
        address: "623 S 6th St, Philadelphia, PA",
        description:
          "This is for candlelight, slow conversation, and the kind of date where you’re not rushing anything. It feels tucked away and intentional. If you want romance without the touristy vibe, this is the lane.",
      },
      {
        id: "talulas-garden-date-night",
        name: "Talula’s Garden",
        vibe: "Date Night",
        neighborhood: "Washington Square",
        price: 3,
        tags: ["pretty", "seasonal", "wine", "soft vibe"],
        address: "210 W Washington Square, Philadelphia, PA",
        description:
          "A clean, pretty date-night spot with calm energy that still feels special. Seasonal menu, great for a longer dinner, and the overall vibe says ‘thoughtful’ without being extra. Ideal for an elevated weeknight date.",
      },

      // SPECIAL OCCASION
      {
        id: "suraya-special-occasion",
        name: "Suraya",
        vibe: "Special Occasion",
        neighborhood: "Fishtown",
        price: 3,
        tags: ["wow-factor", "ambiance", "share-plates"],
        address: "1528 Frankford Ave, Philadelphia, PA",
        description:
          "When you want the night to feel like an event. The space is beautiful, the food is meant to be shared, and everything feels elevated from the moment you sit down. Great for birthdays, celebrations, or a ‘we need something big’ night.",
      },
      {
        id: "vernick-special-occasion",
        name: "Vernick Food & Drink",
        vibe: "Special Occasion",
        neighborhood: "Rittenhouse",
        price: 4,
        tags: ["fine dining", "impressive", "polished", "chef-y"],
        address: "2031 Walnut St, Philadelphia, PA",
        description:
          "A high-end pick that feels intentional and memorable. This is the lane for ‘we’re celebrating’ or ‘I want to impress.’ Expect a polished experience where the food is the centerpiece and the vibe is calm and confident.",
      },
      {
        id: "zahav-special-occasion",
        name: "Zahav",
        vibe: "Special Occasion",
        neighborhood: "Old City",
        price: 4,
        tags: ["iconic", "celebration", "feast", "group-friendly"],
        address: "237 St James Pl, Philadelphia, PA",
        description:
          "A special-occasion dinner that feels like a win before you even order. Great for groups or couples who want a full experience. It’s one of those nights where you leave thinking ‘yeah… that was worth it.’",
      },
      {
        id: "jean-georges-special-occasion",
        name: "Jean-Georges Philadelphia",
        vibe: "Special Occasion",
        neighborhood: "Center City",
        price: 4,
        tags: ["views", "luxury", "dress-up", "big night"],
        address: "60 N 17th St, Philadelphia, PA",
        description:
          "For a true ‘big night out’ vibe—elevated service, skyline views, and a polished feel from start to finish. This is for milestones, anniversaries, or when you want the night to feel cinematic.",
      },

      // CHILL
      {
        id: "harpers-garden-chill",
        name: "Harper’s Garden",
        vibe: "Chill",
        neighborhood: "Center City",
        price: 2,
        tags: ["cute", "easy", "hang", "patio-ish"],
        address: "31 S 18th St, Philadelphia, PA",
        description:
          "A relaxed spot where you can actually breathe. Great for a casual hang, a low-key drink, or a ‘we’re not trying to do the most’ night. Friendly energy and an easy pace—perfect for catching up.",
      },
      {
        id: "frankford-hall-chill",
        name: "Frankford Hall",
        vibe: "Chill",
        neighborhood: "Fishtown",
        price: 2,
        tags: ["beer garden", "group-friendly", "games", "open-air"],
        address: "1210 Frankford Ave, Philadelphia, PA",
        description:
          "Chill energy with plenty of space—ideal for groups or a casual date where you don’t want anything formal. Grab drinks, play games, and just exist. It’s the type of spot that turns into an all-night hang.",
      },
      {
        id: "middle-child-clubhouse-chill",
        name: "Middle Child Clubhouse",
        vibe: "Chill",
        neighborhood: "Fishtown",
        price: 2,
        tags: ["casual", "fun", "food + drinks", "no pressure"],
        address: "1232 N Front St, Philadelphia, PA",
        description:
          "A ‘cool but approachable’ hang where the energy stays light. Great for grabbing a bite and a drink without making it a whole mission. The vibe feels social, but still easy enough to keep it casual.",
      },
      {
        id: "spruce-street-harbor-chill",
        name: "Spruce Street Harbor Park",
        vibe: "Chill",
        neighborhood: "Waterfront",
        price: 1,
        tags: ["outdoor", "views", "walk-around", "summer vibe"],
        address: "301 S Christopher Columbus Blvd, Philadelphia, PA",
        description:
          "A chill option when you want something more activity-based than sit-down. Walk around, snack, hang by the water, and keep it easy. Perfect for ‘we want to do something, but nothing stressful.’",
      },

      // BRUNCH
      {
        id: "green-eggs-brunch",
        name: "Green Eggs Cafe",
        vibe: "Brunch",
        neighborhood: "Gayborhood",
        price: 2,
        tags: ["big portions", "comfort", "sweet"],
        address: "212 S 13th St, Philadelphia, PA",
        description:
          "If you want brunch that feels like a reward. Big plates, sweet options, and that classic ‘we’re going to be full after this’ energy. Great for weekend plans where the goal is comfort + vibes, not minimalism.",
      },
      {
        id: "cafe-lift-brunch",
        name: "Cafe Lift",
        vibe: "Brunch",
        neighborhood: "Callowhill",
        price: 2,
        tags: ["cute", "reliable", "coffee", "casual"],
        address: "428 N 13th St, Philadelphia, PA",
        description:
          "A solid brunch move when you want it to feel cozy and put-together without being extra. Great coffee, approachable menu, and the kind of place that works for dates, friends, or solo brunch days.",
      },
      {
        id: "sabrinas-brunch",
        name: "Sabrina’s Cafe",
        vibe: "Brunch",
        neighborhood: "Grad Hospital",
        price: 2,
        tags: ["comfort", "stacked plates", "classic brunch"],
        address: "227 N 34th St, Philadelphia, PA",
        description:
          "Classic Philly brunch energy: big plates, strong ‘I’m hungry’ vibes, and a menu that covers everything. Great for groups and the kind of spot that feels like a ritual when you want a proper weekend brunch.",
      },
      {
        id: "the-love-brunch",
        name: "The Love",
        vibe: "Brunch",
        neighborhood: "Rittenhouse",
        price: 3,
        tags: ["pretty", "date brunch", "seasonal", "polished"],
        address: "130 S 18th St, Philadelphia, PA",
        description:
          "Brunch for when you want it to feel a little nicer. The vibe is polished but still warm, making it perfect for a brunch date or a celebratory weekend. Feels like ‘we planned this’ without being stiff.",
      },

      // COFFEE & WORK
      {
        id: "la-colombe-coffee-work",
        name: "La Colombe",
        vibe: "Coffee & Work",
        neighborhood: "Fishtown",
        price: 1,
        tags: ["laptop-friendly", "good coffee", "bright"],
        address: "1335 Frankford Ave, Philadelphia, PA",
        description:
          "A go-to when you want to lock in. Bright space, reliable coffee, and the right vibe for getting work done without feeling like you’re in a library. Ideal for study sessions or casual laptop time.",
      },
      {
        id: "elixr-coffee-work",
        name: "Elixr Coffee",
        vibe: "Coffee & Work",
        neighborhood: "Rittenhouse",
        price: 2,
        tags: ["clean", "focused", "espresso", "minimal"],
        address: "207 S Sydenham St, Philadelphia, PA",
        description:
          "Great for a focused work block when you want a clean, modern space and strong coffee. Calm vibe, consistent drinks, and it feels like the kind of place where you’ll actually get things done.",
      },
      {
        id: "rival-bros-coffee-work",
        name: "Rival Bros Coffee",
        vibe: "Coffee & Work",
        neighborhood: "Fitler Square",
        price: 2,
        tags: ["casual", "good beans", "easy", "local"],
        address: "2400 Lombard St, Philadelphia, PA",
        description:
          "Easy, local, and comfortable—perfect for ‘I need to sit down and handle a few things.’ Great when you want something calm but not silent. A solid default when you’re not sure where to work.",
      },
      {
        id: "kfar-coffee-work",
        name: "K’Far Cafe",
        vibe: "Coffee & Work",
        neighborhood: "Rittenhouse",
        price: 2,
        tags: ["pastries", "nice vibe", "coffee + snack", "bright"],
        address: "110 S 19th St, Philadelphia, PA",
        description:
          "Coffee-and-work, but with better snacks and a nicer feel. Good for a longer session where you want to treat yourself a bit. Great pastries, solid coffee, and a vibe that makes studying feel less painful.",
      },
      {
        id: "alchemy-coffee-work",
        name: "Alchemy Coffee",
        vibe: "Coffee & Work",
        neighborhood: "Center City",
        price: 1,
        tags: ["rich coffee", "friendly", "breakfast sandwiches"],
        address: "119 S 21st St, Philadelphia, PA 19103",
        description:
          "Premier coffee with friendly workers in the heart of the city. Plays good music for that working-friendly vibe.",
      },

      // BEST OF BOTH WORLDS
      {
        id: "dizengoff-best-of-both",
        name: "Dizengoff",
        vibe: "Best of Both Worlds",
        neighborhood: "Center City",
        price: 2,
        tags: ["nice but affordable", "quick", "versatile", "date-friendly"],
        address: "1625 Sansom St, Philadelphia, PA",
        description:
          "A perfect ‘best of both worlds’ pick: it feels cool and intentional, but it won’t wreck your budget. You can do a quick bite or make it part of a longer night out. Great for dates, solo meals, or a casual link-up with friends.",
      },
      {
        id: "dandelion-best-of-both",
        name: "The Dandelion",
        vibe: "Best of Both Worlds",
        neighborhood: "Rittenhouse",
        price: 2,
        tags: ["cozy", "nice vibes", "comfort", "easy win"],
        address: "124 S 18th St, Philadelphia, PA",
        description:
          "It feels nicer than a basic bar, but it’s still approachable and comfortable. Great for a date, a friend hang, or even a solo meal when you want somewhere that feels warm and safe. Versatile, reliable, and always a good vibe.",
      },
      {
        id: "tria-best-of-both",
        name: "Tria Cafe",
        vibe: "Best of Both Worlds",
        neighborhood: "Rittenhouse",
        price: 2,
        tags: ["wine", "small plates", "versatile", "low-key nice"],
        address: "123 S 18th St, Philadelphia, PA",
        description:
          "A flexible spot that can be a chill drink, a small-plates dinner, or the start of a longer night. It feels ‘nice’ without being formal, and it works for dates, friends, or even a quick solo stop when you want a calm vibe.",
      },
      {
        id: "middle-child-best-of-both",
        name: "Middle Child",
        vibe: "Best of Both Worlds",
        neighborhood: "Washington Square",
        price: 2,
        tags: ["good value", "cool", "quick", "always solid"],
        address: "248 S 11th St, Philadelphia, PA",
        description:
          "A true best-of-both-worlds move: cool enough to impress, affordable enough to repeat, and flexible enough to fit any plan. Grab a quick bite, take it to-go, or make it a casual date. It’s one of those places that just works.",
      },

      // HAPPY HOUR
      {
        id: "middle-child-happy-hour",
        name: "Middle Child",
        vibe: "Happy Hour",
        neighborhood: "Washington Square",
        price: 2,
        tags: ["good value", "cool", "quick", "always solid"],
        address: "248 S 11th St, Philadelphia, PA",
        description:
          "A true best-of-both-worlds move: cool enough to impress, affordable enough to repeat, and flexible enough to fit any plan. Grab a quick bite, take it to-go, or make it a casual link-up.",
      },
      {
        id: "oyster-house-happy-hour",
        name: "Oyster House",
        vibe: "Happy Hour",
        neighborhood: "Rittenhouse Row",
        price: 2,
        tags: ["dive", "classy", "oysters", "no reservations"],
        address: "1516 Sansom St, Philadelphia, PA 19102",
        description:
          "Happy hour Thursday–Friday from 4pm–6pm with $2 oysters.",
      },
      {
        id: "wilder-happy-hour",
        name: "Wilder",
        vibe: "Happy Hour",
        neighborhood: "Logan Square",
        price: 2,
        tags: ["classy", "seafood", "mocktails"],
        address: "2009 Sansom Street, Philadelphia, PA 19103",
        description:
          "Great for non-alcoholic drinkers. Happy hour specials from 4:30pm–6:30pm and a strong mocktail lineup.",
      },
      {
        id: "good-dog-happy-hour",
        name: "Good Dog Bar",
        vibe: "Happy Hour",
        neighborhood: "Center City",
        price: 2,
        tags: ["dive", "inexpensive", "feels like home", "great food"],
        address: "224 S 15th St, Philadelphia, PA 19102",
        description:
          "Happy hour Monday–Friday from 3pm–6pm: half off all draughts, $5 mixed drinks, $6 wines, and half off small bites.",
      },
    ],
    []
  );

  const vibes = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => set.add(p.vibe));
    return Array.from(set);
  }, [places]);

  const vibeOrder = [
    "First Date",
    "Date Night",
    "Special Occasion",
    "Chill",
    "Brunch",
    "Coffee & Work",
    "Best of Both Worlds",
    "Happy Hour",
  ];

  const vibeButtons = useMemo(() => {
    const extras = vibes.filter((v) => !vibeOrder.includes(v));
    return vibeOrder.concat(extras);
  }, [vibes]);

  // Load favorites (local only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  // Save favorites (local only)
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Read vibe from URL (?vibe=first-date)
  useEffect(() => {
    const slug = params.get("vibe");
    if (!slug) return;
    const vibe = slugToVibe(slug, vibes);
    if (vibe) setSelectedVibe(vibe);
  }, [params, vibes]);

  // Write vibe to URL when selected
  useEffect(() => {
    if (!selectedVibe) return;
    const slug = vibeToSlug(selectedVibe);
    router.replace(`/?vibe=${encodeURIComponent(slug)}`, { scroll: false });
  }, [selectedVibe, router]);

  const filteredPlaces = useMemo(() => {
    if (!selectedVibe) return [];
    const s = search.trim().toLowerCase();

    return places
      .filter((p) => p.vibe === selectedVibe)
      .filter((p) => {
        if (!s) return true;
        return (
          p.name.toLowerCase().includes(s) ||
          p.neighborhood.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s)) ||
          p.description.toLowerCase().includes(s)
        );
      });
  }, [places, search, selectedVibe]);

  const favoriteCount = Object.keys(favorites).length;

  return (
    <main className="min-h-screen bg-[#0B0B10] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1619951007086-ab6ef9affbf1?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        {/* Dark + warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0B0B10]" />
        {/* subtle glow */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          {/* Top nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-lg font-semibold">
                V
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-white">
                  vibe-a-holic
                </div>
                <div className="text-xs text-white/70">
                  Philadelphia • curated by vibe
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-xs text-white/70">
                Favorites:{" "}
                <span className="font-semibold text-white">
                  {favoriteCount}
                </span>
              </div>
              <button
                onClick={copyShareLink}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur hover:bg-white/10"
              >
                Share
              </button>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Calm, curated Philly picks, sorted by vibe
          </div>

          <h1 className="mt-10 text-5xl font-semibold tracking-tight md:text-6xl">
            Pick the vibe. Find the spot.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Comforting, trustworthy picks for whatever you’re feeling. First
            dates, cozy nights, study sessions, and low-key hangs. No noise, just
            good options.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/50">
                  🔎
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search (e.g. fishtown, cozy, brunch, cocktails)…"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-11 py-4 text-white placeholder:text-white/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                />
              </div>
              <p className="mt-2 text-xs text-white/60">
                Tip: pick a vibe first, then search to narrow it down.
              </p>

              {/* How it works */}
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/75 backdrop-blur">
                <div className="font-medium text-white">How it works</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Choose a vibe (First Date, Chill, Brunch, etc.)</li>
                  <li>Use search to narrow by neighborhood, tags, or mood</li>
                  <li>Save favorites so you always have a plan ready</li>
                </ul>
              </div>

              {/* Trust chips */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {[
                  "Curated, not random",
                  "Easy to pick from",
                  "Great for dates + friends",
                  "Favorites saved locally",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/75 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const first = vibeButtons[0] ?? null;
                  setSelectedVibe(first);
                  setActivePlace(null);
                  document.getElementById("picker")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="rounded-2xl bg-amber-500 px-5 py-4 text-sm font-semibold text-black shadow-sm transition hover:bg-amber-400"
              >
                Explore
              </button>

              <button
                onClick={() => {
                  setSelectedVibe(null);
                  setActivePlace(null);
                  setSearch("");
                  router.replace("/", { scroll: false });
                  showToast("Cleared.");
                }}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick vibes */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["First Date", "Chill", "Brunch", "Happy Hour"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setSelectedVibe(v);
                  setActivePlace(null);
                  document.getElementById("picker")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur hover:bg-white/10"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-[#0B0B10] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Left / Picker */}
            <div id="picker" className="md:col-span-4">
              <div className="sticky top-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Pick Your Vibe</h2>
                    <p className="mt-1 text-sm text-white/70">
                      Tap one to see a small, curated list.
                    </p>
                  </div>

                  {selectedVibe && (
                    <button
                      onClick={() => {
                        setSelectedVibe(null);
                        setActivePlace(null);
                        setSearch("");
                        router.replace("/", { scroll: false });
                        showToast("Cleared filters.");
                      }}
                      className="text-sm font-medium text-white/70 underline hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {vibeButtons.map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => {
                        setSelectedVibe(vibe);
                        setActivePlace(null);
                      }}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-medium transition backdrop-blur",
                        selectedVibe === vibe
                          ? "border-amber-300/50 bg-amber-400/10 text-amber-100"
                          : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/70">
                    {selectedVibe ? (
                      <>
                        Showing:{" "}
                        <span className="font-semibold text-white">
                          {selectedVibe}
                        </span>{" "}
                        • {filteredPlaces.length} result
                        {filteredPlaces.length === 1 ? "" : "s"}
                      </>
                    ) : (
                      <>Pick a vibe to unlock the list.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right / Results */}
            <div className="md:col-span-8">
              {!selectedVibe && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-sm backdrop-blur">
                  <h3 className="text-2xl font-semibold">
                    Let’s find the right place
                  </h3>
                  <p className="mt-2 text-white/70">
                    Pick a vibe on the left and we’ll show a small, curated list so
                    it’s easy to choose.
                  </p>
                </div>
              )}

              {selectedVibe && (
                <div>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold">
                        Places for {selectedVibe}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        Click a card for details + address.
                      </p>
                    </div>

                    <div className="text-sm text-white/70">
                      {search.trim() ? (
                        <>
                          Filter:{" "}
                          <span className="font-medium text-white">
                            “{search.trim()}”
                          </span>
                        </>
                      ) : (
                        <>No filter</>
                      )}
                    </div>
                  </div>

                  {filteredPlaces.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-sm backdrop-blur">
                      <p className="text-white/80">
                        No matches. Try a different search or clear filters.
                      </p>
                    </div>
                  )}

                  {filteredPlaces.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {filteredPlaces.map((place) => {
                        const isFav = !!favorites[place.id];
                        return (
                          <button
                            key={place.id}
                            onClick={() => setActivePlace(place)}
                            className="group text-left"
                          >
                            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:shadow-lg">
                              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent opacity-60" />

                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h4 className="text-lg font-semibold text-white">
                                    {place.name}
                                  </h4>
                                  <p className="mt-1 text-sm text-white/70">
                                    {place.neighborhood} •{" "}
                                    {priceToDollarSigns(place.price)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/80">
                                    {place.vibe}
                                  </span>
                                  <span
                                    className={[
                                      "shrink-0 rounded-full border px-2 py-1 text-xs",
                                      isFav
                                        ? "border-amber-300/60 bg-amber-400/10 text-amber-100"
                                        : "border-white/10 bg-white/5 text-white/80",
                                    ].join(" ")}
                                  >
                                    {isFav ? "★" : "☆"}
                                  </span>
                                </div>
                              </div>

                              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">
                                {place.description}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {place.tags.map((t) => (
                                  <span
                                    key={`${place.id}-${t}`}
                                    className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/75"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-5 text-xs font-medium text-white/60 transition group-hover:text-white/80">
                                View details →
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0B0B10] py-10 text-center text-sm text-white/60">
        Built in Philly • vibe-a-holic
        <br />
        <span className="text-xs">
          Favorites are saved on your device (nothing is uploaded).
        </span>
      </footer>

      {/* Details Modal */}
      {activePlace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActivePlace(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0F1117] text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/10 bg-black/20 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{activePlace.name}</h2>
                  <p className="mt-1 text-sm text-white/70">
                    {activePlace.neighborhood} •{" "}
                    {priceToDollarSigns(activePlace.price)} • {activePlace.vibe}
                  </p>
                </div>

                <button
                  onClick={() => setActivePlace(null)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-relaxed text-white/80">
                {activePlace.description}
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-white">Address:</span>{" "}
                  {activePlace.address}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Saved places stay on this device (no account needed).
                </p>
              </div>

              <p className="mt-3 text-sm text-white/70">
                Tip: If you’re unsure, start with something comfortable, cozy
                spots tend to feel easiest for first dates and catch-ups.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activePlace.tags.map((t) => (
                  <span
                    key={`${activePlace.id}-modal-${t}`}
                    className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/75"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activePlace.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  Open in Maps
                </a>

                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(activePlace.address);
                      showToast("Address copied.");
                    } catch {
                      showToast("Couldn’t copy.");
                    }
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
                >
                  Copy address
                </button>

                <button
                  className={[
                    "rounded-2xl border bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10",
                    favorites[activePlace.id]
                      ? "border-amber-300/60"
                      : "border-white/10",
                  ].join(" ")}
                  onClick={() => {
                    toggleFavorite(activePlace.id);
                    showToast(
                      favorites[activePlace.id]
                        ? "Removed from favorites."
                        : "Saved to favorites."
                    );
                  }}
                >
                  {favorites[activePlace.id] ? "Saved ★" : "Save ☆"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
          {toast}
        </div>
      )}
    </main>
  );
}
