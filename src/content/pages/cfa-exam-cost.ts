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
  related: ['cfa-level-1', 'cfa-pass-rates', 'cfa-exam-dates', 'cpa-exam-cost', 'home'],
  sources: ['cfa_pricing', 'cfa_program', 'cfa_results', 'cfa_policies'],
  slug: 'cfa-exam-cost',
  nav: 'CFA® exam cost',
  card: 'Registration fees for the three levels, the retakes the pass rates make likely, your prep and your dues, in one total.',
  title: 'CFA® Exam Cost 2026: Three Levels, Retakes and Dues',
  description: 'CFA® exam cost in 2026: early and standard fees for Levels I, II and III, expected retakes from CFA Institute pass rates, prep spending and dues, totaled.',
  h1: 'CFA® exam cost: the three levels, retakes included',
  intro: `The three CFA® (Chartered Financial Analyst®) exams, for investment analysts, cost about ${$(E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).exams)} in fees once the average retakes are counted, with early registration; ${$(P.cfa.programTotal.low)} only if each is passed the first time. Change any setting to see your own figure.`,
  resume: (h) => {
    const f = h.P.cfa.fees; const r = h.E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
    return `The CFA® Program has three exams, and CFA Institute charges a registration fee for each one. For exams from ${h.P.cfa.newPricingFrom}, Levels I and II cost ${h.m(f.l1.early)} with early registration and ${h.m(f.l1.standard)} with standard registration; Level III costs ${h.m(f.l3.early)} or ${h.m(f.l3.standard)}. The one-time enrollment fee of ${h.m(h.P.cfa.enrollmentOld)} was removed on ${h.date(h.P.cfa.enrollmentRemoved)}, so a candidate who passes every level at the first try with early registration pays ${h.m(h.P.cfa.programTotal.low)} in exam fees. Most candidates do not: over the ten years to 2026, ${h.pc(h.E.cfaRate('l1', 'tenYear'))} of Level I candidates passed. Counting each level’s fee once per expected try at those rates gives ${h.m(r.total)} at early prices, the figure this site uses for the CFA® Program on every page. Review courses and yearly dues come on top; you type them yourself, so the total stays your own.`;
  },
  faqs: (h) => [
    { q: 'Is there still a CFA® Program enrollment fee?', a: `No. CFA Institute announced in December 2024 that the one-time enrollment fee of ${h.m(h.P.cfa.enrollmentOld)}, which every new candidate paid with the first Level I registration, would end, and it was removed on ${h.date(h.P.cfa.enrollmentRemoved)}. Guides that still add it to the total are counting a fee that no longer exists. What remains is one registration fee per exam sitting, early or standard.` },
    { q: 'Do I pay again if I fail a CFA® exam?', a: `Yes. Each sitting is a new registration at the price of the window you choose, early or standard, so a failed level costs its full fee a second time. CFA Institute allows at most ${h.P.cfa.maxAttemptsPerLevel} attempts per level, and no more than ${h.P.cfa.maxPerYear} in a calendar year. Moving an exam to another window is not a retake: it costs a ${h.m(h.P.cfa.reschedule)} rescheduling fee where it is allowed.` },
    { q: 'Why are dues not loaded in the calculator?', a: 'Once you hold the CFA® title, you pay yearly membership fees (dues) to CFA Institute and usually to a local society. We could not read a current dues schedule on CFA Institute’s own site, and local society dues vary, so the calculator leaves the amount at zero and asks you to type the figure from your own invoice rather than show one we have not checked.' },
  ],
  body: (h) => {
    const f = h.P.cfa.fees; const L = h.E.CFA_LEVELS;
    const ten = h.E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
    const rows = L.map((l) => { const x = ten.rows.find((r) => r.level === l)!; return [h.E.LEVEL_NAME[l], h.m(f[l].early), h.m(f[l].standard), h.pc(x.p), h.m(x.examCost)]; });
    return `
<h2>CFA® exam cost by level: price list and usual retakes</h2>
<p>A window is the few weeks in which an exam can be taken. You register before it: early, at the lower price, or later at the standard price, ${h.m(f.l1.standard - f.l1.early)} more. A retake is a new registration at the same two prices.</p>
${h.table(['Level', 'Early', 'Standard', 'Pass rate, 2017 to 2026', 'Expected fees, early'], rows, 'CFA Institute price list for exams from February 2026 and its exam results file. Expected fees: the early fee times the average number of tries at that pass rate.', ['l', 'r', 'r', 'r', 'r'])}
<p>Registering at the standard price on all three levels adds ${h.m(3 * (f.l1.standard - f.l1.early))} to the price list. With the usual retakes, it adds ${h.m(h.E.cfaTotal({ window: 'standard', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).exams - ten.exams)}, because each retake is paid at the price you choose again. There is no enrollment fee any more: CFA Institute removed the ${h.m(h.P.cfa.enrollmentOld)} one-time fee on ${h.date(h.P.cfa.enrollmentRemoved)}, so a guide that still adds it counts a fee that no longer exists.</p>
<p><strong>Fewer than half of Level I candidates pass.</strong> When four candidates in ten pass, an average candidate sits the exam two to three times. That is why the calculator shows ${h.m(ten.exams)}, not ${h.m(ten.firstTry)}: plan for the expected figure and treat anything below it as savings. A budget that assumes no retake is a budget for the best case.</p>

<h2>The two lines you type: review course and dues</h2>
<p>Review courses, practice exams and books are often the largest line. This site sells none and loads no price. In the calculator, pick the rough guess (as much as the exam fees) or type your own total for the three levels; it is added once. Yearly membership fees (dues) start only once you hold the CFA® title; leave that field empty until then.</p>

<h2>When the money is paid</h2>
<p>Each fee is paid when you register for a level, so the bill is spread over the years it takes to pass. Level I is offered in ${h.P.cfa.offered.l1.map((x) => h.mn(x)).join(', ')}; Level II in ${h.P.cfa.offered.l2.map((x) => h.mn(x)).join(', ')}; Level III in ${h.P.cfa.offered.l3.map((x) => h.mn(x)).join(' and ')}. A failed level cannot be taken again in the next window, nor in one six months or less later, and CFA Institute allows at most ${h.P.cfa.maxAttemptsPerLevel} tries per level, ${h.P.cfa.maxPerYear} in a calendar year. So each retake adds months as well as a fee. Moving an exam to another window is not a retake: it costs a ${h.m(h.P.cfa.reschedule)} rescheduling fee where it is allowed. Travel and time off work are not counted. The ${h.a('cfa-exam-dates', 'exam dates page')} shows the months each level is offered, and the ${h.a('cfa-pass-rates', 'pass rates page')} lists every session since February 2024.</p>
`;
  },
});
