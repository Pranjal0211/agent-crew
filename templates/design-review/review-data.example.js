// Example data for review.html. The Designer writes design/<task>/review-data.js in this shape.
window.REVIEW = {
  task: '002',
  title: 'A design system for Agent Office',
  version: 2,
  model: 'Opus (no design system yet)',
  // For the owner, in everyday words: what they're looking at.
  inShort: 'Three ways Agent Office could look and feel. Pick one, mix them, or ask for something else.',
  // The decision in one sentence.
  question: 'Which overall look should every future screen follow?',
  // Only from version 2 on: what changed because of the owner's feedback.
  changes: ['Option B now uses warmer colors, as you asked', 'Dropped option C'],
  // The owner's earlier words, copied exactly from decision.md.
  history: [{ version: 1, feedback: 'B is close but feels cold. A is too busy.' }],
  // One entry per direction. file is relative to review.html.
  options: [
    { id: 'A', name: 'Office floor plan', idea: 'Agents sit at desks on a top-down floor; the busy one glows.', file: 'v2/option-a.html' },
    { id: 'B', name: 'Employee badges', idea: 'Each agent is an ID badge on a lanyard wall, status as a stamp.', file: 'v2/option-b.html' },
  ],
};
