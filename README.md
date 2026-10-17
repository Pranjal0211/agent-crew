# My portfolio, built by an AI team

You write the vision. A team of Claude Code agents plans, designs, builds, tests, reviews and commits,
one small improvement per iteration, on a branch you review.

## How it works

```
VISION.md ──► product-manager ──► designer ──► developer ──► qa ──► code-reviewer ──► commit
   (you)        picks 1 item       brief        code+tests    Playwright   diff review     on ai/* branch
                    ▲                                          Lighthouse       │
                    │            innovation (every 3rd run)        └── fail: back to developer (max 3x)
                    └── ai/BACKLOG.md ◄────── ai/LOG.md ◄────────────────────────────────┘
```

| Piece | Where |
|---|---|
| Your intent | `VISION.md` (only you edit it) |
| Team rules | `CLAUDE.md` |
| The 7 agents | `.claude/agents/` |
| One iteration, step by step | `.claude/skills/iterate/SKILL.md` |
| Testing | `tests/` (Playwright, desktop + mobile), `scripts/lighthouse.mjs` |
| The loop | `scripts/loop.sh` |
| Memory between runs | `ai/BACKLOG.md`, `ai/LOG.md` |
| Guardrails | `.claude/settings.json` (no push, no merge, no switching to main) |

## Use it

1. Edit `VISION.md` so it describes you.
2. Run one iteration interactively first, to watch it: open Claude Code here and type `/iterate`
   (from an `ai/...` branch: `git switch -c ai/first-run`).
3. Run the loop unattended:
   ```bash
   npm run loop -- 3
   ```
4. Review and merge:
   ```bash
   git log --oneline main..ai/<branch>
   npm run serve
   git switch main && git merge ai/<branch>
   ```
5. Add your own ideas any time: "add an idea: …" (uses the `propose-feature` skill).

## Later: scheduled runs
Once you trust the output, run `npm run loop` on a schedule (cron, or a Claude Code scheduled task).
Keep the branch-and-review step until you're confident.
