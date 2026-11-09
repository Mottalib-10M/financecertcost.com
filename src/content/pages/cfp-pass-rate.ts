import { definePage } from '../../lib/guide-types';
import * as E from '../../lib/engine/certs';
import { pct } from '../../lib/pct';

export default definePage({
  id: 'cfp-pass-rate',
  group: 'cfp',
  order: 30,
  tool: { kind: 'mini:cfp-attempts' },
  related: ['cfp-certification-cost', 'cfp-exam-dates', 'cfa-pass-rates'],
  sources: ['cfp_stats', 'cfp_registration'],
  slug: 'cfp-exam-pass-rate',
  nav: 'CFP® exam pass rate',
  card: 'Overall, first-time and repeat pass rates for every CFP® exam window since March 2023, and the sittings they imply.',
  title: 'CFP® Exam Pass Rate: First-Time and Repeat, Since 2023',
  description: 'CFP® exam pass rate for every window since March 2023: overall, first-time and repeat candidates from CFP Board statistics, and the expected sittings and fees.',
  h1: 'CFP® exam pass rate, first-time and repeat',
  intro: `In ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(E.cfpLatest().w.slice(5)) - 1]} ${E.cfpLatest().w.slice(0, 4)}, the latest CFP® exam session in CFP Board’s figures, ${pct(E.cfpRate(E.cfpLatest(), 'first'))} of first-time candidates passed and ${pct(E.cfpRate(E.cfpLatest(), 'repeat'))} of those retaking it. Pick a session to see what its rates mean in sittings, or attempts, and fees.`,
  resume: (h) => {
    const s = h.E.cfpLatest();
    return `CFP Board publishes, after each exam window, how many candidates sat and passed, split between first-time and repeat candidates. In ${h.ml(s.w)}, ${h.num(s.all[0])} candidates sat the CFP® exam and ${h.pc(h.E.cfpRate(s, 'all'))} passed: ${h.pc(h.E.cfpRate(s, 'first'))} of first-time candidates and ${h.pc(h.E.cfpRate(s, 'repeat'))} of repeat candidates. Across the eleven windows from March 2023 to July 2026, the pooled rates are ${h.pc(h.E.cfpPooled('all'))} overall, ${h.pc(h.E.cfpPooled('first'))} for first-timers and ${h.pc(h.E.cfpPooled('repeat'))} for repeaters. The split matters for a budget: a candidate who fails once moves to the lower repeat rate. Combining the two, an average candidate needs about ${h.num1(h.E.expectedSittings2(h.E.cfpRate(s, 'first'), h.E.cfpRate(s, 'repeat')))} sittings at the ${h.ml(s.w)} rates. That is fewer than any CFA® level or most CPA sections, and it is the figure the cost calculator on this site uses by default for the exam part of the bill.`;
  },
  faqs: (h) => [
    { q: 'What is the CFP® exam pass rate?', a: `${h.pc(h.E.cfpRate(h.E.cfpLatest(), 'all'))} overall in ${h.ml(h.E.cfpLatest().w)}, the latest window in CFP Board’s statistics, with ${h.pc(h.E.cfpRate(h.E.cfpLatest(), 'first'))} for first-time candidates. Since March 2023, the overall rate per window has stayed between ${h.pc(Math.min(...h.E.cfpSessions.map((s) => h.E.cfpRate(s, 'all'))))} and ${h.pc(Math.max(...h.E.cfpSessions.map((s) => h.E.cfpRate(s, 'all'))))}, a narrow band for an exam of this size.` },
    { q: 'Is the CFP® exam easier on a second try?', a: `No: repeat candidates pass less often. Since March 2023 their pooled rate is ${h.pc(h.E.cfpPooled('repeat'))}, against ${h.pc(h.E.cfpPooled('first'))} for first-time candidates. Those who fail include more candidates who were far from the pass mark, which pulls the repeat rate down for the group as a whole.` },
    { q: 'Why are older CFP® windows not shown?', a: 'The statistics file has two rows labeled 2023 between March 2023 and March 2022 that do not match the window order. Rather than guess which windows they belong to, this page starts at March 2023, where the labels are unambiguous.' },
  ],
  body: (h) => {
    const rows = h.E.cfpSessions.map((s) => [h.ml(s.w), h.num(s.all[0]), h.pc(h.E.cfpRate(s, 'all')), h.pc(h.E.cfpRate(s, 'first')), h.pc(h.E.cfpRate(s, 'repeat')), h.num1(h.E.expectedSittings2(h.E.cfpRate(s, 'first'), h.E.cfpRate(s, 'repeat')))]);
    const s = h.E.cfpLatest(); const p1 = h.E.cfpRate(s, 'first'), pr = h.E.cfpRate(s, 'repeat');
    return `
<h2>The exam pass rate in every window since March 2023</h2>
${h.table(['Window', 'Sat', 'Overall', 'First-time', 'Repeat', 'Expected sittings'], rows, `${h.src('cfp_stats', 'CFP Board, historical CFP® exam statistics through July 2026')} (PDF), read on ${h.read}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Overall pass rates sit in the low to high sixties throughout; the repeat rate moves more, because fewer people are in that group. The share of repeat candidates in a window shifts the overall rate even when neither group changes.</p>

<h2>How the expected sittings are computed</h2>
<p>The first attempt passes with the first-time rate. If it fails, which happens with probability 1 minus that rate, each later attempt passes with the repeat rate, so the number of further attempts averages 1 divided by the repeat rate. In ${h.ml(s.w)}: 1 + (1 − ${h.pc(p1)}) ÷ ${h.pc(pr)} = ${h.num1(h.E.expectedSittings2(p1, pr))} sittings. At the standard fee of ${h.m(h.P.cfp.exam.standard)}, that is ${h.m(h.P.cfp.exam.standard * h.E.expectedSittings2(p1, pr))} in expected exam fees.</p>
${h.box('Your odds are not the average', '<p>The rates pool every candidate. A candidate who finishes a review course and passes its practice exams stands well above the pool; one who sits without one, below it. Use the figures to budget for the average case and to see how much a retake adds.</p>', 'info')}

<h2>Compared with the other finance exams</h2>
<p>The CFP® exam passes about two candidates in three. CFA® Level I passes fewer than half, see the ${h.a('cfa-pass-rates', 'CFA® pass rates')}. The gap shows up directly in the expected fees: on the ${h.a('home', 'comparator')}, retakes add far less to the CFP® certification bill than to the CFA® Program’s.</p>
<p>For dates and deadlines of the next windows, see ${h.a('cfp-exam-dates', 'CFP® exam dates')}; for the whole bill, the ${h.a('cfp-certification-cost', 'CFP® certification cost')} calculator.</p>
<h2>Why the pooled figure is useful</h2>
<p>Any single window can surprise: a smaller group, a different mix of first-timers and repeaters, a new version of the exam. Pooling every window since March 2023 gives ${h.pc(h.E.cfpPooled('first'))} for first-time candidates and ${h.pc(h.E.cfpPooled('repeat'))} for repeat candidates, over ${h.num(h.E.cfpSessions.reduce((a, x) => a + x.all[0], 0))} sittings in all. With those rates, the expected number of sittings is ${h.num1(h.E.expectedSittings2(h.E.cfpPooled('first'), h.E.cfpPooled('repeat')))}, close to the latest window’s figure. When the two disagree by little, as here, either is a sound basis for a budget. The calculator on the cost page lets you switch between them.</p>
<h2>What a retake costs beyond the fee</h2>
<p>A failed attempt costs the registration fee again, and time: the next window is about four months away, and the education, experience and ethics requirements still have to be met before certification. For someone already working in financial planning, that delay can matter more than the fee. The chance of needing a second sitting, at the latest first-time rate, is ${h.pc(1 - p1)}; the chance of needing a third, after failing as a first-timer and once as a repeater, is ${h.pc((1 - p1) * (1 - pr))}.</p>
`;
  },
});
