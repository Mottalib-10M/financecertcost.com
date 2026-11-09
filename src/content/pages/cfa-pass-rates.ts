import { definePage } from '../../lib/guide-types';
import * as E from '../../lib/engine/certs';
import { pct } from '../../lib/pct';

export default definePage({
  id: 'cfa-pass-rates',
  group: 'cfa',
  order: 30,
  tool: { kind: 'mini:cfa-retake' },
  related: ['cfa-level-1', 'cfa-exam-cost', 'cfp-pass-rate', 'cpa-exam-pass-rates'],
  sources: ['cfa_results', 'cfa_policies'],
  slug: 'cfa-pass-rates',
  nav: 'CFA® pass rates',
  card: 'Pass rates of Levels I, II and III for every session since 2024, with ten-year and all-time averages.',
  title: 'CFA® Pass Rates by Level: Every Session Since 2024',
  description: 'CFA® pass rates for Levels I, II and III, session by session since February 2024, with ten-year and all-time averages from CFA Institute and the sittings due.',
  h1: 'CFA® pass rates by level and by session',
  intro: `Over the ten years 2017 to 2026, ${pct(E.cfaRate('l1', 'tenYear'))} of Level I candidates passed, ${pct(E.cfaRate('l2', 'tenYear'))} at Level II and ${pct(E.cfaRate('l3', 'tenYear'))} at Level III. The tool turns a rate into the number of sittings, or attempts, and fees to expect.`,
  resume: (h) => {
    const L = h.E.CFA_LEVELS;
    const last = L.map((l) => `${h.E.LEVEL_NAME[l]} ${h.pc(h.E.cfaRate(l, h.E.cfaLatest(l).w))} (${h.ml(h.E.cfaLatest(l).w)})`).join(', ');
    return `CFA Institute publishes the number of candidates who sat and passed each level in every session since the first exam in 1963. The latest sessions in that file give: ${last}. Over the ten years 2017 to 2026 the pooled rates are ${h.pc(h.E.cfaRate('l1', 'tenYear'))} for Level I, ${h.pc(h.E.cfaRate('l2', 'tenYear'))} for Level II and ${h.pc(h.E.cfaRate('l3', 'tenYear'))} for Level III. The rate rises from one level to the next because each level is taken only by candidates who passed the one before, not because the later exams are easier. A pass rate is a fact about all candidates of a session, first-timers and repeaters together; it says nothing about how a well-prepared candidate fares. Used with care, it gives the average number of sittings, and so of fees, a level costs.`;
  },
  faqs: (h) => [
    { q: 'Which CFA® level has the lowest pass rate?', a: `Level I, in nearly every period. Over 2017 to 2026 it is ${h.pc(h.E.cfaRate('l1', 'tenYear'))}, against ${h.pc(h.E.cfaRate('l2', 'tenYear'))} for Level II and ${h.pc(h.E.cfaRate('l3', 'tenYear'))} for Level III. Single sessions break the pattern: in May 2024, Level II passed ${h.pc(h.E.cfaRate('l2', '2024-05'))} of its candidates, far above that session’s Level I.` },
    { q: 'Does CFA Institute publish a pass rate for first-time candidates?', a: 'Not in the results file this site reads. The file gives candidates who sat and candidates who passed, by level and session, with no split between first attempts and retakes. Figures for first-timers that circulate online come from other sources, and this page does not repeat them.' },
    { q: 'Why do different sites give different CFA® pass rates?', a: 'Three common reasons: they quote different sessions, they mix the ten-year average with the all-time average, or they round differently. Some pages even give two figures for the same session. Every figure on this page comes from one file, with the session named, so you can check it in a minute.' },
  ],
  body: (h) => {
    const rows = h.E.cfaSessions.map((s) => [h.ml(s.w), ...h.E.CFA_LEVELS.map((l) => (s[l] ? h.pc(s[l]![1] / s[l]![0]) : 'not held'))]);
    const avg = h.E.CFA_LEVELS.map((l) => [h.E.LEVEL_NAME[l], h.pc(h.E.cfaRecentRate(l)), h.pc(h.E.cfaRate(l, 'tenYear')), h.pc(h.E.cfaRate(l, 'sinceStart')), h.num(h.P.cfa.tenYear[l][0])]);
    return `
<h2>Session by session</h2>
${h.table(['Session', 'Level I', 'Level II', 'Level III'], rows, `${h.src('cfa_results', 'CFA Institute, exam results 1963-2026')} (PDF), read on ${h.read}. “Not held”: level not offered in that window.`, ['l', 'r', 'r', 'r'])}
<p>Level III appears only in February and August, Level II not in February. Each figure is candidates who passed divided by candidates who sat in that window; CFA Institute counts each sitting, so a candidate who sat twice appears twice.</p>

<h2>Three ways to average</h2>
${h.table(['Level', 'Sessions since Feb 2024', '2017 to 2026', '1963 to 2026', 'Candidates who sat, 2017 to 2026'], avg, 'Pooled: total passed over total who sat.', ['l', 'r', 'r', 'r', 'r'])}
<p>The pooled averages weight each session by its number of candidates, which is what a candidate drawn at random would face. The averages since 2024 reflect the current exam format and windows; the ten-year averages smooth out unusual sessions; the all-time figures go back to a time with far fewer candidates and are shown only for context.</p>

<h2>What a pass rate does to the bill</h2>
<p>A level with a pass rate of one half costs, on average, two registrations. The tool above uses that rule: pick a level and a rate, and it gives the expected number of sittings, the chance of being through within two or three sittings, and the fees at the window you choose. It makes no claim about you. If your mock-exam scores sit well above the pass line, your odds are better than the pooled rate; if you are short of study hours, they are worse.</p>
${h.box('Retake limits', `<p>CFA Institute’s ${h.src('cfa_policies', 'policies')} allow ${h.P.cfa.maxAttemptsPerLevel} attempts per level, at most ${h.P.cfa.maxPerYear} in a calendar year, never in consecutive windows and never in windows six months or less apart. A low rate therefore costs time as well as fees.</p>`, 'tip')}

<h2>How pass rates compare with other credentials</h2>
<p>The CFA® exams pass fewer candidates than the CFP® exam, whose rates are on the ${h.a('cfp-pass-rate', 'CFP® pass rate page')}. The comparison is rough, because the candidate pools differ, but it explains most of the gap in expected retake costs between the two. For the CPA exam, whose section rates are published by the AICPA, the ${h.a('cpa-exam-pass-rates', 'CPA pass rates page')} shows how to turn the rate you read into tries and fees.</p>
<h2>Reading the trend</h2>
<p>Over the eleven sessions in the table, Level I ranged from ${h.pc(Math.min(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))} to ${h.pc(Math.max(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))}, Level II from ${h.pc(Math.min(...h.E.cfaSessions.filter((s) => s.l2).map((s) => s.l2![1] / s.l2![0])))} to ${h.pc(Math.max(...h.E.cfaSessions.filter((s) => s.l2).map((s) => s.l2![1] / s.l2![0])))} and Level III from ${h.pc(Math.min(...h.E.cfaSessions.filter((s) => s.l3).map((s) => s.l3![1] / s.l3![0])))} to ${h.pc(Math.max(...h.E.cfaSessions.filter((s) => s.l3).map((s) => s.l3![1] / s.l3![0])))}. Level II varies the most from one session to the next, Level III the least. No steady rise or fall shows across the period, so the averages are a fair guide to the next session; a single high or low figure is not. For budgeting, the choice between the three averages changes the expected program fees by a few hundred dollars at most, which the cost calculator lets you check.</p>
`;
  },
});
