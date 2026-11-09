import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-requirements-pennsylvania',
  group: 'cpa',
  order: 54,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in Pennsylvania', state: 4, hours: 120, years: 2, when: 0 } },
  mini: { kind: 'mini:cpa-total', props: { title: 'Step 2: what the exam and Pennsylvania board fees cost', state: 4 } },
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-new-york'],
  sources: ['pa_snapshot', 'va_boa'],
  slug: 'pennsylvania-cpa-requirements',
  nav: 'Pennsylvania CPA requirements',
  card: '120 credits to sit, 150 credits and 1,600 hours or fewer credits and 3,200 hours to license, and a $65 license.',
  title: 'Pennsylvania CPA Requirements: Credits, Hours and Fees',
  description: 'Pennsylvania CPA requirements: 120 credits to sit for the exam, then 150 credits and 1,600 hours or fewer credits and 3,200 hours, the $65 license and CPE.',
  h1: 'Pennsylvania CPA requirements: two routes measured in hours of work',
  intro: 'Pennsylvania licenses CPAs with 150 college credits and 1,600 hours of experience over at least 12 months, or with a bachelor’s degree and 3,200 hours over 24 months. Type your credits and years of full-time work to see which route you meet.',
  resume: (h) => {
    const PA = h.P.cpa.states.PA;
    return `The Pennsylvania State Board of Accountancy lets a candidate sit for the CPA exam with ${PA.sitCredits} semester credits, including ${PA.sitAccounting} in accounting, and offers two routes to the license. A candidate with 150 credits needs ${h.num(PA.now.expHours)} hours of experience over at least ${PA.now.expMonths} months. A candidate with a bachelor’s degree but fewer than 150 credits needs ${h.num(PA.next.expHours)} hours over at least ${PA.next.expMonths} months. Unlike Texas, New York and California, Pennsylvania did not have to open the lower-credit route in 2026: it is already part of its rules. Once licensed, a Pennsylvania CPA completes ${PA.cpe} hours of continuing professional education every ${PA.cpeYears} years. The board lists ${h.m(PA.license)} for the initial license and ${h.m(PA.renewal)} for renewal. The exam application fee was not on the snapshot we read and is left out of the totals on this page.`;
  },
  faqs: (h) => [
    { q: 'Can I get a Pennsylvania CPA license without 150 credits?', a: `Yes. With a bachelor’s degree and fewer than 150 credits, the board asks for ${h.num(h.P.cpa.states.PA.next.expHours)} hours of experience over at least ${h.P.cpa.states.PA.next.expMonths} months, twice the ${h.num(h.P.cpa.states.PA.now.expHours)} hours asked of candidates with 150 credits. Both routes require passing all four exam sections.` },
    { q: 'How much does a Pennsylvania CPA license cost?', a: `The board’s snapshot lists ${h.m(h.P.cpa.states.PA.license)} for the initial license and ${h.m(h.P.cpa.states.PA.renewal)} for renewal. The exam section fees are separate and paid to NASBA, ${h.m2(h.P.cpa.sectionFee)} each as of ${h.date(h.P.cpa.sectionFeeFrom)}, and they make up most of what a candidate pays on the way to the license.` },
    { q: 'How many CPE hours does Pennsylvania require?', a: `${h.P.cpa.states.PA.cpe} hours every ${h.P.cpa.states.PA.cpeYears} years, according to the board’s licensure snapshot. Any subject requirements inside that total are set by the board’s rules; check them before each renewal period. The renewal fee listed on the snapshot is ${h.m(h.P.cpa.states.PA.renewal)}, and course costs come on top.` },
  ],
  body: (h) => {
    const PA = h.P.cpa.states.PA;
    const t = h.E.cpaTotal({ state: 'PA', retakes: 0, prep: 0 });
    const t1 = h.E.cpaTotal({ state: 'PA', retakes: 1, prep: 0 });
    const rows = [['150 credits or more', `${h.num(PA.now.expHours)} hours`, `at least ${PA.now.expMonths} months`], ['Bachelor’s degree, under 150 credits', `${h.num(PA.next.expHours)} hours`, `at least ${PA.next.expMonths} months`]];
    return `
<h2>The two routes to the license</h2>
${h.table(['Education', 'Experience', 'Over'], rows, `${h.src('pa_snapshot', 'Pennsylvania State Board of Accountancy, CPA licensure snapshot')}, read on ${h.read}.`, ['l', 'r', 'r'])}
<p>The tool converts years into hours at the rate the board uses for its route: one year for the 150-credit route, two for the other. If your work is part-time, count your actual hours against the table rather than relying on years.</p>

<h2>Sitting for the exam</h2>
<p>The board asks for ${PA.sitCredits} credits, ${PA.sitAccounting} of them in accounting, before you sit. That is the same bar as a bachelor’s degree with an accounting concentration, so a graduate with enough accounting credits can begin the four sections right away and build experience in parallel.</p>

<h2>What the license costs over time</h2>
<p>The fees the board lists are modest: ${h.m(PA.license)} for the license and ${h.m(PA.renewal)} at each renewal. The exam is where the money goes: ${h.m(t.exams)} in section fees for the four sections passed the first time, which with the license comes to ${h.m(t.total)} before review materials, and ${h.m2(h.P.cpa.sectionFee)} more for each section retaken (${h.m(t1.total)} with one retake). Type your retakes in the Step 2 calculator above. Continuing education is a recurring cost after that: ${PA.cpe} hours every ${PA.cpeYears} years, from providers whose prices this site does not track.</p>
${h.box('Not shown', '<p>The exam application fee charged by the board or its exam administrator was not on the page we read. The Step 2 calculator marks it “not read” instead of guessing.</p>', 'info')}

<h2>Pennsylvania next to its neighbor</h2>
<p>${h.a('cpa-requirements-new-york', 'New York')} opens its 120-hour pathway on November 21, 2026, with two years of experience. Pennsylvania’s lower-credit route reaches a similar place in hours: ${h.num(PA.next.expHours)} hours is roughly two years of full-time work. The ${h.a('cpa-requirements', 'five-state comparison')} sets the routes side by side.</p>
<h2>Hours, not years</h2>
<p>Counting experience in hours has a practical effect: the pace of your work matters as well as its length. A candidate on the lower-credit route who works fifty qualifying hours a week reaches ${h.num(PA.next.expHours)} hours in about sixty-four weeks of work, but the board also sets a minimum period of ${PA.next.expMonths} months, so the calendar, not the hours, sets the date. On the 150-credit route, ${h.num(PA.now.expHours)} hours over at least ${PA.now.expMonths} months works the same way. Part-time workers face the opposite constraint: at twenty hours a week, ${h.num(PA.next.expHours)} hours take more than three years. The tool counts years of full-time work; adjust what you type if your hours differ.</p>
<p>The board’s snapshot is the reference for both routes; read it again before you apply.</p>
`;
  },
});
