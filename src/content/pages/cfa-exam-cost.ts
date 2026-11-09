import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import * as E from '../../lib/engine/certs';
import { formatMoney } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cfa-exam-cost',
  group: 'cfa',
  order: 10,
  tool: { kind: 'mini:cfa-total' },
  related: ['cfa-level-1', 'cfa-pass-rates', 'cfa-exam-dates', 'home'],
  sources: ['cfa_pricing', 'cfa_program', 'cfa_results', 'cfa_policies'],
  slug: 'cfa-exam-cost',
  nav: 'CFA® exam cost',
  card: 'Registration fees for the three levels, the retakes the pass rates make likely, your prep and your dues, in one total.',
  title: 'CFA® Exam Cost 2026: Three Levels, Retakes and Dues',
  description: 'CFA® exam cost in 2026: early and standard fees for Levels I, II and III, expected retakes from CFA Institute pass rates, prep spending and dues, totaled.',
  h1: 'CFA® exam cost: the three levels, retakes included',
  intro: `The three CFA® exams cost about ${$(E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).exams)} in fees once the average retakes are counted, with early registration; ${$(P.cfa.programTotal.low)} only if each is passed the first time. Change the settings to see your own figure.`,
  resume: (h) => {
    const f = h.P.cfa.fees; const r = h.E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
    return `The CFA® Program has three exams, and CFA Institute charges a registration fee for each one. For exams from ${h.P.cfa.newPricingFrom}, Levels I and II cost ${h.m(f.l1.early)} with early registration and ${h.m(f.l1.standard)} with standard registration; Level III costs ${h.m(f.l3.early)} or ${h.m(f.l3.standard)}. The one-time enrollment fee of ${h.m(h.P.cfa.enrollmentOld)} was removed on ${h.date(h.P.cfa.enrollmentRemoved)}, so a candidate who passes every level at the first try with early registration pays ${h.m(h.P.cfa.programTotal.low)} in exam fees. Most candidates do not: over the ten years to 2026, ${h.pc(h.E.cfaRate('l1', 'tenYear'))} of Level I candidates passed. Counting each level’s fee once per expected try at those rates gives ${h.m(r.total)} at early prices, the figure this site uses for the CFA® Program. Review courses and annual dues come on top, and you type them yourself, so the total stays your own.`;
  },
  faqs: (h) => [
    { q: 'Is there still a CFA® Program enrollment fee?', a: `No. CFA Institute announced in December 2024 that the one-time enrollment fee of ${h.m(h.P.cfa.enrollmentOld)}, which every new candidate paid with the first Level I registration, would end, and it was removed on ${h.date(h.P.cfa.enrollmentRemoved)}. Guides that still add it to the total are counting a fee that no longer exists. What remains is one registration fee per exam sitting, early or standard.` },
    { q: 'Do I pay again if I fail a CFA® exam?', a: `Yes. Each sitting is a new registration at the price of the window you choose, early or standard, so a failed level costs its full fee a second time. CFA Institute allows at most ${h.P.cfa.maxAttemptsPerLevel} attempts per level, and no more than ${h.P.cfa.maxPerYear} in a calendar year. Moving an exam to another window is not a retake: it costs a ${h.m(h.P.cfa.reschedule)} rescheduling fee where it is allowed.` },
    { q: 'Why are dues not loaded in the calculator?', a: 'Once you are a charterholder, you pay annual membership dues to CFA Institute and usually to a local society. We could not read a current dues schedule on CFA Institute’s own site, and local society dues vary, so the calculator leaves the amount at zero and asks you to type the figure from your own invoice rather than show one we have not checked.' },
  ],
  body: (h) => {
    const f = h.P.cfa.fees; const L = h.E.CFA_LEVELS;
    const fees = L.map((l) => [h.E.LEVEL_NAME[l], h.m(h.P.cfa.fees2025[l].early), h.m(h.P.cfa.fees2025[l].standard), h.m(f[l].early), h.m(f[l].standard)]);
    const ten = h.E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
    const std = h.E.cfaTotal({ window: 'standard', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
    const rows = ten.rows.map((x) => [h.E.LEVEL_NAME[x.level], h.pc(x.p), h.num2(x.sittings), h.m(x.examCost)]);
    return `
<h2>Registration fees by level and window</h2>
<p>CFA Institute sets two prices for each exam: an early registration fee and a higher standard registration fee for candidates who register later in the window. From ${h.P.cfa.newPricingFrom} the difference is ${h.m(f.l1.standard - f.l1.early)} at every level; in 2025 it was ${h.m(h.P.cfa.fees2025.l1.standard - h.P.cfa.fees2025.l1.early)}. Prices rose for exams from ${h.P.cfa.newPricingFrom}, the same press release that ended the enrollment fee.</p>
${h.table(['Level', 'Early, 2025', 'Standard, 2025', 'Early, from 2026', 'Standard, from 2026'], fees, `${h.src('cfa_pricing', 'CFA Institute press release of December 18, 2024')}, read on ${h.read}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Paying early on all three exams saves ${h.m(3 * (f.l1.standard - f.l1.early))} against paying the standard fee three times. That gap grows with every retake, because a retake is a new registration with the same two prices.</p>

<h2>Why the expected total is higher than the price list</h2>
<p>The ${h.src('cfa_program', 'program page')} prices the three levels for a candidate who never fails: ${h.m(h.P.cfa.programTotal.low)} with early registration. CFA Institute’s own ${h.src('cfa_results', 'results file')} shows that this is the exception: fewer than half of Level I candidates pass in a given session. A sitting is one attempt at an exam. When four candidates in ten pass, an average candidate sits the exam two and a half times; when half pass, twice. The table applies that rule with the ten-year pass rate of each level and the early registration fee, as the calculator does.</p>
${h.table(['Level', 'Pass rate, 2017 to 2026', 'Average attempts', 'Expected fees, early registration'], rows, 'CFA Institute exam results file. Average attempts: 1 divided by the pass rate; an average over all candidates, not a part of an exam.', ['l', 'r', 'r', 'r'])}
<p>The sum, ${h.m(ten.exams)}, is the figure the calculator shows: ${h.tries(ten.rows.reduce((a, x) => a + x.sittings, 0))} across the three levels. Registering at the standard fee instead adds ${h.m(f.l1.standard - f.l1.early)} to every try (${h.m(std.exams)} for the same tries). Either is the fee bill of an average candidate over the three levels, not of you. A candidate who studies more than average does better than the pooled rate, and one who sits with little preparation does worse. Switch the pass rate setting to “No retake (first try)” to see the price list again.</p>

<h2>Prep and dues: the two lines you type</h2>
<p>Review courses, question banks and mock exams are often the largest line, and their price depends on the provider and the package. This site sells none of them and loads no price: type what you plan to spend per sitting, and the calculator multiplies it by the expected number of sittings, since a retake usually means paying for materials again. Membership fees (dues) start once you hold the CFA® title, the charter. Type your yearly amount in the last field; a field for the number of years to count then appears below it.</p>
${h.box('What is not in the total', '<p>Travel to a test center, time off work, and the rescheduling fee if you move an exam to another window. None of these are fees CFA Institute charges for the exam itself, so they are left out rather than estimated.</p>', 'info')}

<h2>When the money is paid</h2>
<p>Each fee is paid when you register for a level, so the bill is spread over the time it takes to pass: at least one window per level, and usually more. The ${h.a('cfa-exam-dates', 'exam dates page')} shows which months each level is offered, and the ${h.a('cfa-pass-rates', 'pass rates page')} lists every session since February 2024, level by level.</p>
<p>One practical consequence: a budget that assumes no retake is a budget for the best case. Plan for the expected figure and treat anything below it as savings.</p>
`;
  },
});
