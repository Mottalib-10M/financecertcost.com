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
  intro: `CFA® (Chartered Financial Analyst®) pass rates over the ten years 2017 to 2026: ${pct(E.cfaRate('l1', 'tenYear'))} of Level I candidates passed, ${pct(E.cfaRate('l2', 'tenYear'))} at Level II and ${pct(E.cfaRate('l3', 'tenYear'))} at Level III. The tool turns a rate into the number of tries and fees to expect.`,
  resume: (h) => {
    const L = h.E.CFA_LEVELS;
    const last = L.map((l) => `${h.E.LEVEL_NAME[l]} ${h.pc(h.E.cfaRate(l, h.E.cfaLatest(l).w))} (${h.ml(h.E.cfaLatest(l).w)})`).join(', ');
    return `CFA Institute publishes the number of candidates who sat and passed each level in every session since the first exam in 1963. The latest sessions in that file give: ${last}. Over the ten years 2017 to 2026 the rates, all candidates counted together, are ${h.pc(h.E.cfaRate('l1', 'tenYear'))} for Level I, ${h.pc(h.E.cfaRate('l2', 'tenYear'))} for Level II and ${h.pc(h.E.cfaRate('l3', 'tenYear'))} for Level III. The rate rises from one level to the next because each level is taken only by candidates who passed the one before, not because the later exams are easier. A pass rate is a fact about all candidates of a session, first-timers and repeaters together; it says nothing about how a well-prepared candidate fares. Used with care, it gives the average number of sittings, and so of fees, a level costs.`;
  },
  faqs: (h) => [
    { q: 'Which CFA® level has the lowest pass rate?', a: `Level I, in nearly every period. Over 2017 to 2026 it is ${h.pc(h.E.cfaRate('l1', 'tenYear'))}, against ${h.pc(h.E.cfaRate('l2', 'tenYear'))} for Level II and ${h.pc(h.E.cfaRate('l3', 'tenYear'))} for Level III. Single sessions break the pattern: in May 2024, Level II passed ${h.pc(h.E.cfaRate('l2', '2024-05'))} of its candidates, far above that session’s Level I.` },
    { q: 'Does CFA Institute publish a pass rate for first-time candidates?', a: 'Not in the results file this site reads. The file gives candidates who sat and candidates who passed, by level and session, with no split between first attempts and retakes. Figures for first-timers that circulate online come from other sources, and this page does not repeat them.' },
    { q: 'Why do different sites give different CFA® pass rates?', a: 'Three common reasons: they quote different sessions, they mix the ten-year average with the all-time average, or they round differently. Some pages even give two figures for the same session. Every figure on this page comes from one file, with the session named, so you can check it in a minute.' },
  ],
  body: (h) => {
    const rows = h.E.cfaSessions.map((s) => [h.ml(s.w), ...h.E.CFA_LEVELS.map((l) => (s[l] ? h.pc(s[l]![1] / s[l]![0]) : 'not held'))]);
    const avg = h.E.CFA_LEVELS.map((l) => [h.E.LEVEL_NAME[l], h.pc(h.E.cfaRecentRate(l)), h.pc(h.E.cfaRate(l, 'tenYear')), h.pc(h.E.cfaRate(l, 'sinceStart'))]);
    return `
<h2>What a pass rate does to the bill</h2>
<p>A level that passes half of its candidates costs, on average, two registrations. The tool above applies that rule to the level and rate you pick. It makes no claim about you: if your practice-exam scores sit well above the pass line, your odds are better; if you are short of study hours, they are worse. A rate is a fact about everyone who sat, first-timers and repeaters together.</p>
${h.box('Retake limits', `<p>CFA Institute allows ${h.P.cfa.maxAttemptsPerLevel} tries per level, at most ${h.P.cfa.maxPerYear} in a calendar year, never in back-to-back windows and never six months or less apart. A low rate therefore costs time as well as fees.</p>`, 'tip')}

<h2>CFA® pass rates by level, session by session</h2>
${h.table(['Session', 'Level I', 'Level II', 'Level III'], rows, 'CFA Institute exam results file. “Not held”: level not offered in that window.', ['l', 'r', 'r', 'r'])}
<p>Level III is offered only in February and August, Level II not in February. Each figure is the candidates who passed divided by those who sat that session: 40% means four candidates in ten passed. A candidate who sat twice is counted twice, once in each session.</p>
<p>What this means for one candidate at Level I: at the ten-year rate, about ${Math.round(10 * h.E.passWithin(h.E.cfaRate('l1', 'tenYear'), 2))} candidates in 10 are through within two tries, and about ${Math.round(10 * h.E.passWithin(h.E.cfaRate('l1', 'tenYear'), 3))} in 10 within three. Each try is paid at the price of the window you register for.</p>

<h2>Averages over longer periods</h2>
${h.table(['Level', 'Since Feb 2024', '2017 to 2026', '1963 to 2026'], avg, 'All candidates of the period counted together.', ['l', 'r', 'r', 'r'])}
<p>The ten-year column smooths out unusual sessions: it is the one the ${h.a('cfa-exam-cost', 'CFA® cost page')} uses. Changing it moves the expected fees for the three levels by a few hundred dollars at most.</p>
<p>Over the eleven sessions in the table, Level I ranged from ${h.pc(Math.min(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))} to ${h.pc(Math.max(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))}. No steady rise or fall shows across the period, so the averages are a fair guide to the next session; a single high or low figure is not. The rate rises from one level to the next because each level is taken only by candidates who passed the one before, not because the later exams are easier.</p>
<p>The CFA® exams pass fewer candidates than the CFP® exam, whose rates are on the ${h.a('cfp-pass-rate', 'CFP® pass rate page')}. The comparison is rough, because the candidates differ, but it explains most of the gap in retake costs between the two. For the CPA exam, the ${h.a('cpa-exam-pass-rates', 'CPA pass rates page')} shows how to turn the rate the accountants’ institute publishes into tries and fees.</p>
`;
  },
});
