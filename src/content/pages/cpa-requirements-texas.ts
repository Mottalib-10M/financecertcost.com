import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-requirements-texas',
  group: 'cpa',
  order: 53,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in Texas', state: 3, lock: 'state', hours: 120, years: 2, when: 0 } },
  mini: { kind: 'mini:cpa-total', props: { title: 'Step 2: what the exam and Texas board fees cost', state: 3, lock: 'state' } },
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-florida'],
  sources: ['tx_cert', 'tx_elig', 'va_boa'],
  slug: 'texas-cpa-requirements',
  nav: 'Texas CPA requirements',
  card: 'Pathway A and Pathway B since August 1, 2026, the experience each one asks, and the $15 per-section board fee.',
  title: 'Texas CPA Requirements: Pathway A and Pathway B Explained',
  description: 'Texas CPA requirements since August 1, 2026: Pathway A with 150 hours and 12 months, Pathway B with 120 hours and 24 months, the ethics rules and board fees.',
  h1: 'Texas CPA requirements: Pathway A or Pathway B',
  intro: 'Texas offers two routes to the CPA license: Pathway A with 150 college semester hours and 1 year of experience, Pathway B with 120 hours, usually a bachelor’s degree, and 2 years. Type your hours and years of experience to see which one you fit.',
  resume: (h) => {
    const T = h.P.cpa.states.TX;
    return `The Texas State Board of Public Accountancy (TSBPA) now offers two routes to the CPA certificate. Pathway A is for candidates with at least 150 semester hours of college coursework and asks for ${T.now.expMonths} calendar months of full-time experience, or at least ${h.num(T.now.partTimeHours)} hours of part-time work over no more than ${T.now.partTimeYears} consecutive years. Pathway B, in effect since ${h.date(T.next.from)}, is for candidates with at least 120 semester hours and asks for ${T.next.expMonths} months full-time, or ${h.num(T.next.partTimeHours)} part-time hours over no more than ${T.next.partTimeYears} years. Both require a board-approved ${T.ethicsCourseHours}-semester-hour ethics course and a pass on the board’s exam on its Rules of Professional Conduct. TSBPA charges a ${h.m(T.perSection)} eligibility fee for each exam section applied for and ${h.m(T.certificate)} to issue the certificate; the section fees themselves are paid to NASBA.`;
  },
  faqs: (h) => [
    { q: 'What is Pathway B for the Texas CPA?', a: `A route to the Texas CPA certificate that took effect on ${h.date(h.P.cpa.states.TX.next.from)}. It accepts candidates with at least 120 semester hours instead of 150, in exchange for ${h.P.cpa.states.TX.next.expMonths} months of full-time experience, or ${h.num(h.P.cpa.states.TX.next.partTimeHours)} part-time hours over up to four years. The exam, the ethics course and the ethics exam are the same as on Pathway A.` },
    { q: 'How long do I have to test after Texas approves my eligibility?', a: `${h.P.cpa.states.TX.windowDays} days. TSBPA says approval opens a ${h.P.cpa.states.TX.windowDays}-day window in which to pay NASBA, schedule and sit the section, with no extensions. Applying for one section at a time, when you are ready for it, keeps an unused window from costing you a fee.` },
    { q: 'What does the Texas board charge a CPA candidate?', a: `${h.m(h.P.cpa.states.TX.perSection)} per section applied for, nonrefundable, and ${h.m(h.P.cpa.states.TX.certificate)} to issue the certificate. The application of intent fee and the license fee were not stated on the pages we read, so they are not in the total; check them on the board’s fee schedule.` },
  ],
  body: (h) => {
    const T = h.P.cpa.states.TX;
    const t = h.E.cpaTotal({ state: 'TX', retakes: 0, prep: 0 });
    const t1 = h.E.cpaTotal({ state: 'TX', retakes: 1, prep: 0 });
    const rows = [['Education', '150 semester hours', '120 semester hours'], ['Full-time experience', `${T.now.expMonths} calendar months`, `${T.next.expMonths} calendar months`], ['Part-time experience', `${h.num(T.now.partTimeHours)} hours within ${T.now.partTimeYears} years`, `${h.num(T.next.partTimeHours)} hours within ${T.next.partTimeYears} years`], ['In effect', 'already in force', `since ${h.date(T.next.from)}`]];
    return `
<h2>The two pathways</h2>
${h.table(['', 'Pathway A', 'Pathway B'], rows, `${h.src('tx_cert', 'TSBPA, CPA certification')}, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>Pathway B is not a shortcut: the year saved in school is spent at work before the certificate. For a graduate who would take a paid job anyway, it moves the cost from tuition to time.</p>
${h.box('Financial aid', '<p>The Texas board runs an Examination Fee Financial Aid program that reimburses the exam section fees (paid to NASBA) to eligible candidates. Its conditions are on the board’s site.</p>', 'tip')}

<h2>The steps and their fees</h2>
<ol>
<li><strong>Application of intent.</strong> Texas candidates first file an application of intent, which lapses after two years if no section is sat. The fee amount was not stated on the page we read and is not shown.</li>
<li><strong>Eligibility application.</strong> ${h.m(T.perSection)} per section applied for, nonrefundable, according to the ${h.src('tx_elig', 'eligibility page')}. Approval opens a ${T.windowDays}-day window, with no extensions.</li>
<li><strong>NASBA section fee.</strong> ${h.m2(h.P.cpa.sectionFee)} per section as of ${h.date(h.P.cpa.sectionFeeFrom)} (Virginia board figure; the fee is set by NASBA). TSBPA says it receives none of it.</li>
<li><strong>Ethics.</strong> A board-approved ${T.ethicsCourseHours}-semester-hour ethics course, and an exam on the Rules of Professional Conduct, sent after you apply.</li>
<li><strong>Certificate.</strong> ${h.m(T.certificate)} to issue it; the license fee follows.</li>
</ol>

<h2>What the exam costs in Texas</h2>
<p>The Step 2 calculator above starts on Texas: it shows the same exam fees as the CPA exam cost page, ${h.m(t.exams)}, and adds the Texas board fees to them.</p>
<p>Because the ${h.m(T.perSection)} fee is charged per section applied for, each retake costs it again: a retake costs ${h.m2(h.E.cpaRetakePrice('TX'))} in Texas, the section fee to NASBA and the board’s fee. With the four sections passed the first time, a candidate pays ${h.m(t.exams)} to NASBA and ${h.m(T.perSection * t.sittings)} to the board, plus ${h.m(T.certificate)} for the certificate; with one retake, ${h.m(t1.exams)} to NASBA and ${h.m(T.perSection * t1.sittings)} to the board. Type the retakes you expect in the Step 2 calculator.</p>

<h2>Who should pick which</h2>
<p>A candidate who already has 150 hours gains nothing from Pathway B. One at 120 hours chooses between thirty more hours of coursework with a year of experience and two years of experience without them. The tool lets you try both profiles; the ${h.a('cpa-requirements', 'five-state comparison')} shows that ${h.a('cpa-requirements-florida', 'Florida')}, by contrast, still has no 120-hour route.</p>
<h2>Part-time experience</h2>
<p>Both pathways accept part-time work, measured in hours over a maximum period: ${h.num(T.now.partTimeHours)} hours within ${T.now.partTimeYears} consecutive years on Pathway A, ${h.num(T.next.partTimeHours)} hours within ${T.next.partTimeYears} years on Pathway B. A candidate working twenty hours a week logs about a thousand hours a year, so Pathway A’s part-time route takes about two years and Pathway B’s about four, in both cases right at the limit. Anyone below that pace should plan on full-time work for at least part of the period.</p>
<p>The tool above starts with an example, 120 hours and two years of experience, a profile Pathway B accepts; type your own figures. The date you apply does not change the result in Texas, since both pathways are open.</p>
`;
  },
});
