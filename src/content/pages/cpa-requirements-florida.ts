import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-requirements-florida',
  group: 'cpa',
  order: 51,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in Florida', state: 1, lock: 'state', hours: 120, years: 2 } },
  mini: { kind: 'mini:cpa-total', props: { title: 'Step 2: what the exam and Florida board fees cost', state: 1, lock: 'state' } },
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-texas'],
  sources: ['fl_306', 'fl_308', 'fl_sb364', 'va_boa'],
  slug: 'florida-cpa-requirements',
  nav: 'Florida CPA requirements',
  card: '120 hours to sit for the exam, 150 hours and one year for the license, and the 2026 bill that did not pass.',
  title: 'Florida CPA Requirements 2026: 120 to Sit, 150 to License',
  description: 'Florida CPA requirements in 2026: 120 semester hours to sit for the exam, 150 hours and one year of experience for the license, and why SB 364 changed nothing.',
  h1: 'Florida CPA requirements: 120 hours for the exam, 150 for the license',
  intro: 'Florida still requires 150 semester hours and one year of experience for the CPA license; 120 hours are enough to sit for the exam. Type your hours and years to see where you stand.',
  resume: (h) => {
    const F = h.P.cpa.states.FL;
    return `Florida sets its CPA requirements in its state law, not only in board rules. A candidate may take the licensure examination after completing ${F.sitHours} semester hours, or 180 quarter hours, from an accredited college or university, with a concentration in accounting and business courses specified by the Board of Accountancy, and on showing good moral character. The license itself requires at least 150 semester hours, including a bachelor’s or higher degree, and one year of work experience verified by a licensed CPA. A 2026 bill would have revised the education and experience requirements; it died in the legislature on ${h.date(F.billDied)}, so the 150-hour rule stands. The Florida board’s own site refused our requests, so its application and license fees are not shown here: the calculator marks them “not read”.`;
  },
  faqs: (h) => [
    { q: 'Can I take the CPA exam in Florida with 120 hours?', a: `Yes. Florida law lets a candidate sit for the exam with ${h.P.cpa.states.FL.sitHours} semester hours or 180 quarter hours, with the accounting and business concentration the board sets by rule. The license still requires 150 hours, so the remaining 30 can be completed while you take the exam.` },
    { q: 'Did Florida pass a 120-hour CPA license law in 2026?', a: `No. CS/SB 364, which would have revised the education and work experience requirements for the license, died in messages in the House on ${h.date(h.P.cpa.states.FL.billDied)}. Section 473.308 still requires 150 semester hours and one year of experience, as it did before the 2026 session.` },
    { q: 'What experience counts for a Florida CPA license?', a: 'Section 473.308 requires one year of work that involves accounting, attest, compilation, management advisory, financial advisory, tax or consulting skills, gained in government, industry, academia or public practice, as a substantial part of your duties, and verified by a CPA licensed in a US state or territory.' },
  ],
  body: (h) => {
    const t = h.E.cpaTotal({ state: 'FL', retakes: 0, prep: 0 });
    const t1 = h.E.cpaTotal({ state: 'FL', retakes: 1, prep: 0 });
    return `
<h2>The CPA requirements in Florida’s statute</h2>
<ul>
<li><strong>To sit for the exam</strong> (${h.src('fl_306', 'section 473.306')}): ${h.P.cpa.states.FL.sitHours} semester hours or 180 quarter hours from an accredited college or university, with the accounting and business concentration set by board rule, and good moral character.</li>
<li><strong>For the license</strong> (${h.src('fl_308', 'section 473.308')}): passing the exam, at least 150 semester hours including a bachelor’s or higher degree with a concentration in accounting and business, one year of verified work experience, and good moral character.</li>
</ul>
<p>The board, not the statute, decides which courses and how many hours make up the accounting and business concentration. That detail sits in its rules, which this site has not been able to read on the board’s site.</p>

<h2>The bill that did not pass</h2>
<p>In the 2026 session, ${h.src('fl_sb364', 'CS/SB 364')} proposed, among other things, to revise the education and work experience requirements for a CPA license, with an effective date of July 1, 2026. Its last action, on ${h.date(h.P.cpa.states.FL.billDied)}, was “Died in Messages” in the House. Other states moved the other way in the same year: from January 1, 2027, Florida will be the only one of the five states on this site where a candidate with 120 hours and two years of experience cannot be licensed.</p>

<h2>Exam fees for a Florida candidate</h2>
<p>The section fees are the same as anywhere: ${h.m2(h.P.cpa.sectionFee)} per section as of ${h.date(h.P.cpa.sectionFeeFrom)}, so ${h.m(t.exams)} for the four sections if each is passed the first time, and ${h.m2(h.E.cpaRetakePrice('FL'))} more for each section retaken (no Florida fee for a new try was confirmed). Type the retakes you expect in the second calculator above: it adds them. Florida’s own application and license fees must be added too; that calculator lists them as not read.</p>
${h.box('Why the Florida fees are missing', '<p>The Florida Department of Business and Professional Regulation site returned an access error to every request we made. We do not copy fees from third-party sites, so those lines stay empty until they can be read at the source.</p>', 'warning')}

<h2>Planning the gap between 120 and 150</h2>
<p>A student who reaches 120 hours can begin the exam right away. The tool above starts with 120 hours and two years of experience to show the result: no route to the license, short 30 hours. The missing hours can be earned through further coursework while you sit for the sections. The ${h.a('cpa-requirements', 'five-state comparison')} shows how ${h.a('cpa-requirements-texas', 'Texas')}, for example, now licenses the same profile.</p>
`;
  },
});
