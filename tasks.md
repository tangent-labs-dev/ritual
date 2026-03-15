Good refinements. Let me lock in the final plan before building:

---

## ✅ Updated Feature Decisions

### Schedule Types (3 only)
| Type | Example |
|---|---|
| **Daily** | Every single day |
| **Specific days** | `M · W · F` — custom day selection |

No time-of-day, no reminders. Just day-level tracking.

---

### The Quote / Inspiration Element

Instead of a random motivational quote widget (which feels noisy), here's a more intentional approach that fits the minimal UX:

**A single rotating "anchor phrase"** — shown on the `Today` screen, below the date, above the habit list. Subtle, small, muted. Not the focus of the screen, just a quiet presence.

Two options — pick one:

**Option A — Stoic/philosophical one-liners** (timeless, not hustle-culture)
> *"The impediment to action advances action."*
> *"Lose an hour in the morning, chase it all day."*
> *"Small deeds done are better than great deeds planned."*

**Option B — Curated static list bundled in the app** (no API, fully offline, open source friendly)
A hand-picked list of ~100 quotes baked into the app. One per day, cycles based on the day of the year. No internet needed, no randomness — same quote all day so it feels intentional.

**Option B is the better fit** — it's local-only, consistent, and feels like the app "chose" it for you today rather than rolling dice.

**Placement:** Between the date header and the habit list. One line max, italic, muted color. If the quote is too long, it truncates gracefully. No attribution author shown inline — maybe a tiny `— Marcus Aurelius` in an even smaller muted caption below.

---

## 🗂️ Final Screen & Feature Summary

```/dev/null/final-plan.txt#L1-30
SCREENS
├── Today
│   ├── Date header (Day, full date)
│   ├── Daily quote (static, day-indexed, offline)
│   ├── Progress bar (thin, accent color)
│   ├── Habit list (checkbox + name + streak)
│   └── Grouped by none — flat list, sorted by user order
│
├── Habits (Manage)
│   ├── All habits list (name + schedule chips)
│   ├── Drag to reorder
│   ├── Swipe to delete
│   └── FAB [ + ] to add
│
├── Add / Edit Habit (modal)
│   ├── Name input
│   ├── Schedule: [ Daily ] or [ Custom days ]
│   │   └── If custom: M T W T F S S day picker
│   └── Save / Cancel
│
├── Habit Detail (push)
│   ├── Name + current streak
│   ├── 12-week heatmap grid
│   └── Stats row: current streak / best streak / 30d rate
│
├── Stats
│   ├── Hero: perfect days this month
│   ├── Per-habit completion bars
│   └── Weekly rhythm bar chart
│
└── Settings
    ├── Theme: Light / Dark / System
    ├── Export JSON
    └── Reset all data
```

---

Want me to start building now? I'll go in this order:
1. **Design tokens** — theme, colors, typography, spacing
2. **SQLite data layer** — schema + typed hooks
3. **Today screen** — the daily loop with quotes
4. **Add/Edit modal** — so habits can be created
5. Everything else after
