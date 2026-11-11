import { definePage } from '../../lib/guide-types';
import { etape2 } from '../../lib/etape2';

export default definePage({
  id: 'cpa-requirements-texas',
  group: 'cpa',
  order: 53,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in Texas', state: 3, lock: 'state', hours: 120, years: 2, when: 0 } },
  apresOutil: (h) => etape2(h, 'TX'),
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-florida'],
  sources: ['tx_cert', 'tx_elig', 'va_boa'],
  slug: 'texas-cpa-requirements',
  nav: 'Texas CPA requirements',
  card: 'Pathway A and Pathway B since August 1, 2026, the experience each one asks, and the $15 per-section board fee.',
  title: 'Texas CPA Requirements: Pathway A and Pathway B Explained',
  description: 'Texas CPA requirements since August 1, 2026: Pathway A with 150 hours and 12 months, Pathway B with 120 hours and 24 months, the ethics rules and board fees.',
  h1: 'Texas CPA requirements: Pathway A or Pathway B',
  intro: 'Texas offers two routes to the CPA (certified public accountant) license: Pathway A with 150 college semester hours and 1 year of experience, Pathway B with 120 hours, usually a bachelor’s degree, and 2 years. Type your hours and years of experience to see which one you fit. In another state, see the CPA requirements page.',
  resume: (h) => {
    const T = h.P.cpa.states.TX;
    return `The Texas State Board of Public Accountancy, the Texas board, now offers two routes to the CPA certificate. Pathway A is for candidates with at least 150 semester hours of college coursework and asks for ${T.now.expMonths} calendar months of full-time experience, or at least ${h.num(T.now.partTimeHours)} hours of part-time work over no more than ${T.now.partTimeYears} consecutive years. Pathway B, in effect since ${h.date(T.next.from)}, is for candidates with at least 120 semester hours and asks for ${T.next.expMonths} months full-time, or ${h.num(T.next.partTimeHours)} part-time hours over no more than ${T.next.partTimeYears} years. Both require a board-approved ${T.ethicsCourseHours}-semester-hour ethics course and a pass on the board’s exam on its Rules of Professional Conduct. The board charges a ${h.m(T.perSection)} eligibility fee for each exam section applied for and ${h.m(T.certificate)} to issue the certificate; the section fees themselves are paid to the national association of state boards (NASBA).`;
  },
  faqs: (h) => [
    { q: 'What is Pathway B for the Texas CPA?', a: `A route to the Texas CPA certificate that took effect on ${h.date(h.P.cpa.states.TX.next.from)}. It accepts candidates with at least 120 semester hours instead of 150, in exchange for ${h.P.cpa.states.TX.next.expMonths} months of full-time experience, or ${h.num(h.P.cpa.states.TX.next.partTimeHours)} part-time hours over up to four years. The exam, the ethics course and the ethics exam are the same as on Pathway A.` },
    { q: 'How long do I have to test after Texas approves my eligibility?', a: `${h.P.cpa.states.TX.windowDays} days. The Texas board says approval opens a ${h.P.cpa.states.TX.windowDays}-day window in which to pay the section fee, schedule and sit the section, with no extensions. Applying for one section at a time, when you are ready for it, keeps an unused window from costing you a fee.` },
    { q: 'What does the Texas board charge a CPA candidate?', a: `${h.m(h.P.cpa.states.TX.perSection)} per section applied for, nonrefundable, and ${h.m(h.P.cpa.states.TX.certificate)} to issue the certificate. The fee for the first form (the application of intent) and the license fee were not stated on the pages we read, so they are not in the total; check them on the board’s fee schedule.` },
  ],
  body: (h) => {
    const T = h.P.cpa.states.TX;
    const rows = [['College credit', '150 semester hours', '120 semester hours'], ['Full-time work experience', `${T.now.expMonths} months`, `${T.next.expMonths} months`], ['Part-time instead', `${h.num(T.now.partTimeHours)} hours within ${T.now.partTimeYears} years`, `${h.num(T.next.partTimeHours)} hours within ${T.next.partTimeYears} years`], ['Open', 'yes', `since ${h.date(T.next.from)}`]];
    return `
<h2>Texas CPA requirements: the two pathways</h2>
${h.table(['', 'Pathway A', 'Pathway B'], rows, 'Texas State Board of Public Accountancy, CPA certification page.', ['l', 'l', 'l'])}
<p>Pathway B is not a shortcut: the year saved in school is spent at work before the certificate. A candidate who already has 150 hours gains nothing from it; one at 120 hours chooses between thirty more hours of coursework with one year of work, and two years of work without them. Both pathways also ask for a ${T.ethicsCourseHours}-semester-hour ethics course and a short exam on the board’s rules of conduct.</p>
${h.box('Financial aid', '<p>The Texas board runs a financial aid program that pays back the exam section fees to eligible candidates. Its conditions are on the board’s site.</p>', 'tip')}

<h2>The steps and their fees</h2>
<ol>
<li><strong>First form, the application of intent.</strong> It lapses after two years if no section is sat. Its fee is not published on the page we read.</li>
<li><strong>Eligibility.</strong> ${h.m(T.perSection)} for each section you apply for. You then have ${T.windowDays} days to sit it, with no extension: apply for one section at a time.</li>
<li><strong>Exam section fee.</strong> ${h.m2(h.P.cpa.sectionFee)} per section, the same in every state, paid to the national association of state boards (NASBA), not to Texas.</li>
<li><strong>Ethics course and exam.</strong> The course is taken at a school the board approves; the exam on the board’s rules of conduct is sent to you after you apply.</li>
<li><strong>The certificate</strong>, ${h.m(T.certificate)}; the license fee follows, and it is not published on the page we read.</li>
</ol>

<h2>Part-time work, retakes and other states</h2>
<p>Both pathways accept part-time work, counted in hours over a maximum period: ${h.num(T.now.partTimeHours)} hours within ${T.now.partTimeYears} years on Pathway A, ${h.num(T.next.partTimeHours)} hours within ${T.next.partTimeYears} years on Pathway B. At twenty hours a week, about a thousand hours a year, both routes take right up to their limit; below that pace, plan on full-time work for part of the period.</p>
<p>Because the ${h.m(T.perSection)} board fee is charged for each section you apply for, a retake pays it again: one retake costs ${h.m2(h.E.cpaRetakePrice('TX'))} in Texas, the section fee and the board’s fee. The tool above starts with an example, 120 hours and two years of experience, which Pathway B accepts; type your own figures. The date you apply does not change the result in Texas, since both pathways are open.</p>
<p>The ${h.a('cpa-requirements', 'five-state comparison')} sets Texas next to California, New York, Florida and Pennsylvania; ${h.a('cpa-requirements-florida', 'Florida')}, for one, still has no 120-hour route.</p>
`;
  },
});
