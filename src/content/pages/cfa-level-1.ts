import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import * as E from '../../lib/engine/certs';
import { formatMoney, formatNumber } from '../../lib/format';
import { pct } from '../../lib/pct';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cfa-level-1',
  group: 'cfa',
  order: 20,
  tool: { kind: 'mini:cfa-level1' },
  related: ['cfa-exam-cost', 'cfa-pass-rates', 'cfa-exam-dates'],
  sources: ['cfa_pricing', 'cfa_results', 'cfa_exam', 'cfa_policies'],
  slug: 'cfa-level-1-exam',
  nav: 'CFA® Level I exam',
  card: 'Level I fee by window, its pass rate session by session, and the number of sittings that rate implies.',
  title: 'CFA® Level I Exam 2026: Fee, Pass Rate and Retake Odds',
  description: 'CFA® Level I exam in 2026: the early and standard fee, the pass rate of each session since 2024, the expected number of sittings and your odds within two tries.',
  h1: 'CFA® Level I exam: fee, pass rate and the odds of a retake',
  intro: `CFA® Level I costs ${$(P.cfa.fees.l1.early)} with early registration and ${$(P.cfa.fees.l1.standard)} standard. Over 2017 to 2026, ${pct(E.cfaRate('l1', 'tenYear'))} of candidates passed, so an average candidate sits it about ${formatNumber(E.expectedSittings(E.cfaRate('l1', 'tenYear')), 1)} times: about ${$(P.cfa.fees.l1.early * E.expectedSittings(E.cfaRate('l1', 'tenYear')))} in fees at the early price.`,
  resume: (h) => {
    const last = h.E.cfaLatest('l1'); const p = h.E.cfaRate('l1', last.w); const ten = h.E.cfaRate('l1', 'tenYear');
    return `Level I is the first of the three CFA® Program exams and the one with the lowest pass rate. It is a multiple-choice exam of ${h.num1(h.P.cfa.examHours)} hours, offered in ${h.P.cfa.offered.l1.map(h.mn).join(', ')}. Registration costs ${h.m(h.P.cfa.fees.l1.early)} early or ${h.m(h.P.cfa.fees.l1.standard)} standard for exams from ${h.P.cfa.newPricingFrom}. In the ${h.ml(last.w)} session, ${h.num(last.l1![0])} candidates sat Level I and ${h.pc(p)} passed. Over the ten years 2017 to 2026 the rate was ${h.pc(ten)}, which means an average candidate needs about ${h.num1(h.E.expectedSittings(ten))} sittings and pays the Level I fee that many times. Results arrive ${h.P.cfa.resultsWeeks.min} to ${h.P.cfa.resultsWeeks.max} weeks after the window, and a retake cannot be booked in the very next window. The calculator turns any of these rates into a fee bill for your own window and timing.`;
  },
  faqs: (h) => [
    { q: 'What is the CFA® Level I pass rate?', a: `It changes with each session. CFA Institute’s results file gives ${h.pc(h.E.cfaRate('l1', h.E.cfaLatest('l1').w))} for ${h.ml(h.E.cfaLatest('l1').w)} and between ${h.pc(Math.min(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))} and ${h.pc(Math.max(...h.E.cfaSessions.filter((s) => s.l1).map((s) => s.l1![1] / s.l1![0])))} for the sessions since February 2024. The ten-year figure, all candidates pooled, is ${h.pc(h.E.cfaRate('l1', 'tenYear'))}, and that is the rate the cost calculator uses by default.` },
    { q: 'How soon can I retake Level I after failing?', a: 'Not in the next window. CFA Institute’s policies say a retake must wait for a window more than six months after the one you failed, so a candidate who fails in February can come back in November at the earliest, and one who fails in November can come back in August. The calendar tool on the exam dates page works this out for each month.' },
    { q: 'Can I take Level I as many times as I like?', a: `No. CFA Institute caps attempts at ${h.P.cfa.maxAttemptsPerLevel} per level, with no more than ${h.P.cfa.maxPerYear} in one calendar year. Each attempt is a new registration at the fee of the window you pick, so the cap also caps what Level I alone can cost: ${h.m(h.P.cfa.maxAttemptsPerLevel * h.P.cfa.fees.l1.standard)} at the standard price.` },
  ],
  body: (h) => {
    const sess = h.E.cfaSessions.filter((s) => s.l1).map((s) => [h.ml(s.w), h.num(s.l1![0]), h.num(s.l1![1]), h.pc(s.l1![1] / s.l1![0])]);
    const n = (p: number) => h.num1(h.E.expectedSittings(p));
    const sim = [0.35, 0.4, 0.45, 0.5, 0.6].map((p) => [h.pc(p), n(p), h.pc(h.E.passWithin(p, 2)), h.m(h.P.cfa.fees.l1.early * h.E.expectedSittings(p)), h.m(h.P.cfa.fees.l1.standard * h.E.expectedSittings(p))]);
    return `
<h2>Every Level I session since February 2024</h2>
${h.table(['Session', 'Candidates who sat', 'Passed', 'Pass rate'], sess, `${h.src('cfa_results', 'CFA Institute, exam results 1963-2026')}, read on ${h.read}.`, ['l', 'r', 'r', 'r'])}
<p>The spread is narrower than the headlines suggest. Most sessions land in the low to mid forties; the lowest of the period is a single session, not a trend. When you read a figure elsewhere, check which session it comes from and whether it counts first-time candidates only or everyone who sat, as CFA Institute’s file does.</p>

<h2>From a pass rate to a Level I budget</h2>
<p>Treat each sitting as a fresh draw with the same chance of success. The average number of sittings is then 1 divided by that chance, and the chance of being done within two sittings is 1 minus the square of the chance of failing. Applied to a range of rates:</p>
${h.table(['Pass rate', 'Expected sittings', 'Passed within two', 'Expected fees, early', 'Expected fees, standard'], sim, 'Computed from the Level I fees of CFA Institute.', ['r', 'r', 'r', 'r', 'r'])}
<p>The assumption is plain on purpose. Your own chance is not the pooled rate: candidates who complete a full study plan pass more often than those who sit underprepared, and repeat candidates are mixed into the same figure. Treat the result as the bill of a typical candidate, then move the rate up or down to see how much it matters.</p>

<h2>The Level I exam format, in brief</h2>
<p>CFA Institute describes Level I on its ${h.src('cfa_exam', 'exam page')} as a computer-based multiple-choice exam of ${h.num1(h.P.cfa.examHours)} hours taken at a test center. The curriculum, the topic weights and the candidate body of knowledge are published by CFA Institute for each exam year; this site does not summarize them, because they change and the official outline is the only one that binds the exam. Results are released ${h.P.cfa.resultsWeeks.min} to ${h.P.cfa.resultsWeeks.max} weeks after the testing window closes.</p>

<h2>Early or standard: the cheapest decision you control</h2>
<p>Registering early saves ${h.m(h.P.cfa.fees.l1.standard - h.P.cfa.fees.l1.early)} on Level I, and the saving repeats with each retake. A candidate who expects two sittings and registers late both times pays ${h.m(2 * (h.P.cfa.fees.l1.standard - h.P.cfa.fees.l1.early))} more than one who registers early both times, for the same exam. The ${h.a('cfa-exam-cost', 'three-level calculator')} shows the effect over the whole program.</p>
<h2>Reading your own odds</h2>
<p>The results file says nothing about who passes, only how many. Your own position depends on things it cannot see: the hours you can put in before the window, how you score on full practice exams taken under timed conditions, and how much of the material you already use at work. That is why the tool lets you set the pass rate yourself. Try a rate ten points above the pooled figure and ten points below it: the gap between the two fee bills is the value, in registration fees alone, of being better prepared than the average candidate, before counting the months a retake adds to the program.</p>
`;
  },
});
