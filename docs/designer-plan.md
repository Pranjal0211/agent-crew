# Plan: the Designer and design approval

Status: **approved by the owner** (2026-10-19). Being built step by step.

## The goal in one line
The crew works on its own, but **you make every important visual decision**: no design is ever approved
except by your own words, and nothing visual is built until you approve it.

## The round, with design added

```
/round <project>
   │
   ├─ 0. Team lead: any designs waiting for you? → show them first
   │
   ├─ 1. Planner picks a task ─────────── marks it: Needs design? yes/no · Big change? yes/no
   │
   ├─ 2. Needs design?
   │     ├─ no  ──────────────────────────────────────────────┐
   │     └─ yes → Designer makes prototypes                   │
   │              → Team lead shows them to you  ⏸            │
   │              → you: approve / change / reject            │
   │                 (no limit on rounds of changes)          │
   │              → while you think, the crew picks a         │
   │                non-visual task and continues ───────────►│
   │                                                          ▼
   ├─ 3. Builder builds (only if the design is approved, or no design was needed)
   ├─ 4. Tester checks: works? matches the approved design?
   │        fail → back to Builder (max 2 more tries, then stop and tell you)
   └─ 5. Tester saves (commit) on pass · Team lead logs the round
```

## Task card statuses

`ready` → (`designing` → `awaiting approval` ⇄ `changes requested` → `design approved`) → `built` → `passed` / `failed`

Tasks that don't need design skip the bracket.

## What the Designer makes

- **Clickable prototypes:** real HTML pages that use the project's actual colors, fonts and code style,
  viewable at phone (375px) and desktop (1280px) size. No written-only design notes.
- **Big change** (new page, new layout, new look, or no design system yet): **2–3 directions** (A, B, C),
  each different in a meaningful way, each with one plain line on what it's going for.
- **Small change:** one design.
- **Screenshots** of every prototype at both sizes, taken with the Tester's browser tool, so the Builder and
  Tester have an exact picture to match.

### Where it all lives (inside the project)
```
design/
  system/                  ← the approved design system (colors, fonts, parts), once approved
  002-<task>/
    v1/  option-a.html  option-b.html  notes.md
    v2/  option-b.html  notes.md        ← after your feedback
    review.html                         ← side-by-side page you look at
    decision.md                         ← your words, written only from your reply
```
Prototypes and decisions are **kept in git** (they're small and are the history of your choices).
Prototype screenshots go to the git-ignored `.agent-shots/` and clean themselves up like test screenshots.

## How you review and approve

1. The Team lead opens `review.html` in the browser pane beside this chat: all options, phone and desktop.
2. You reply in chat, in your own words: "approve B", "B but warmer colors", "none of these, try …".
3. The Team lead copies **your exact words** and the date into `decision.md`.
   - "Approve" → `design approved`; the approved version becomes the source of truth.
   - Anything else → `changes requested`; the Designer makes the next version (v2, v3, … no limit).
4. **Approval safety:**
   - Agents never write approval; only the Team lead, quoting your reply in this chat.
   - The Builder refuses to start without `decision.md` saying approved.
   - (Later: a Claude Code hook can block any agent from writing `decision.md`, enforcing this technically.)

## While you're deciding
The design task waits as `awaiting approval`. The Team lead asks the Planner for the best task that does
**not** need design and runs it. When you start the next `/round`, pending designs are shown first.

## Choosing the Designer's model (Team lead decides)

| Use **Opus** when | Use **Sonnet** when |
|---|---|
| No approved design system yet | The change follows the approved system |
| New page, major redesign, new look | Small parts: a label, a card, spacing, colors within the system |
| 2–3 directions are needed | One design is enough |
| You rejected or heavily changed the last version twice | Applying clear, specific feedback |

The card records the model and the reason, e.g. `Design model: Opus (no design system yet)`.

## The Designer's instructions (outline)

1. **Read** the task card, `VISION.md`, the approved design system (if any), and past design decisions.
2. **Look** at the page as it is now (browser tool screenshots at both sizes).
3. **Think in directions:** for a big change, pick 2–3 genuinely different approaches, not 3 color swaps.
4. **Build prototypes** in `design/NNN/vN/`, reusing the project's real styles, and take screenshots.
5. **Make `review.html`:** options side by side, each with its one-line idea, plus what changed since the last version.
6. **Hand over** to the Team lead to present. Never mark anything approved.
- Rules: follow the design system unless the task is to change it; never invent content; keep prototypes
  self-contained (no build step); big open questions (like the "office look") become directions you choose between.

## Changes to the other agents

| Agent | Change |
|---|---|
| **Planner** | Marks each card `Needs design: yes/no` and `Big change: yes/no`; can pick "non-visual only" when asked |
| **Builder** | Refuses to start a design task without approval; copies the approved prototype exactly |
| **Tester** | Adds a "matches the approved design" check: its screenshots vs. the approved prototype's, side by side |
| **Team lead** | New `/round` command: runs the round, picks the Designer's model, pauses for you, keeps going with non-visual work, updates the live dashboard |

## The first real job
**Task: a design system for Agent Office.** Opus, 2–3 directions, including your open question
(office floor plan vs. employee badges vs. something else). You pick one; every later design follows it.

## Build order (each step explained to you and committed separately)
1. Designer agent + review page template
2. Approval steps (decision file, Builder gate)
3. Planner and Tester changes
4. Team lead `/round` command
5. First real run: the Agent Office design system, with you approving

## Known limits in V1
- You need to be in this app to review (the browser pane). A shareable link can come later.
- Approval safety is a rule, not yet a technical lock (hook comes later).
- Screenshot matching is by eye (the Tester looks at both), not pixel-perfect comparison.
