/**
 * Step 2 of the state pages: the state's cost as one static result, in place of the CPA calculator repeated from the
 * CPA cost page (rule 3 of 2026-11-10: “no mini-calculator repeated from one page to another: a link is enough”).
 * Every figure comes from the engine.
 */
import type { Helpers } from './helpers';
import type { StateCode } from './engine/certs';

export function etape2(h: Helpers, s: StateCode): string {
  const t = h.E.cpaTotal({ state: s, retakes: 0, prep: 0 });
  const name = h.E.stateName(s);
  const n = t.unread.length;
  const board = t.boardKnown > 0 ? `${h.m(t.exams)} of exam fees and ${h.m(t.boardKnown)} of ${name} board fees we could confirm` : `${h.m(t.exams)} of exam fees; no ${name} board fee could be confirmed`;
  const missing = n ? ` Not counted, because not published on the pages we read: ${t.unread.map((x) => x.replace(/^[A-Z][a-z]+( [A-Z][a-z]+)? board, /, '').replace(new RegExp(`^${name}, `), '')).join('; ')}. Check them on the board’s fee page.` : '';
  return `<p class="font-semibold">Step 2: what it costs in ${name}, if all four exam sections pass the first time</p><p class="mt-1 text-4xl font-bold tabular-nums">${h.m(t.exams + t.boardKnown)}</p><p class="mt-1">Assumes 2026 fees: ${board}. Each retake adds ${h.m2(h.E.cpaRetakePrice(s))}.${missing}</p><p class="mt-2">${h.a('cpa-exam-cost', 'Add your retakes and review course in the CPA cost calculator →')}</p>`;
}
