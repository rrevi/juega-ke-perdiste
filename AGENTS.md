# Project Guidelines

## Testing & Verification
- **Run tests after code changes**: Always run the test suite (`npm test`) whenever you finish making code changes.
- **Fix any failing tests**: If any tests fail, resolve and fix the failures immediately before proceeding.
## Git & Version Control
- **Never git commit without explicit permission**: Always ask the user and receive their explicit confirmation before creating any git commits.
- **Verify before git commit**: Never commit changes to git while tests are failing. Ensure all tests pass cleanly before creating a git commit.

## Mobile-First Layout & Thumb-Zone Ergonomics
- **Bottom-anchored primary actions**: Primary interaction controls (such as score input buttons, CTAs, and action footers) must stay anchored to the bottom of the mobile viewport (`margin-top: auto; position: sticky; bottom: 0;`), resting above safe area insets (`padding-bottom: max(12px, env(safe-area-inset-bottom))`) for effortless one-handed thumb reach.
- **Never float footers in empty states**: When content is sparse or empty, the action footer must remain pinned at the bottom of the screen, never floating in the upper or middle third.
- **Independent scroll & dynamic viewport**: Use `min-height: 100dvh; min-height: 100vh;` on app root containers and `min-height: 0;` on flex ancestors so middle content (scorecards, tables) can independently scroll (`overflow-y: auto; overscroll-behavior: contain;`) without dislodging the sticky header or bottom thumb action footer.

## Copy & Domino Microcopy Standards
- **Authentic domino terminology**: Use traditional, concise terms: `"Anotar +X pts"` (not generic "Guardar"), `"Nuevo juego"` (not "Nueva partida" or "Reiniciar aplicación"), `"Meta"` / `"Meta de puntos"`, and `"Marcador final"`.
- **Zero filler words**: Strip unnecessary adverbs and bureaucratic filler (omit `"aún"`, `"rápidos"`, `"registradas"`, `"permitido"`, `"el juego de Dominó"`). Keep microcopy punchy, friendly, and clean.
