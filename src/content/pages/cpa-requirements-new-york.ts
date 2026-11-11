import { definePage } from '../../lib/guide-types';
import { etape2 } from '../../lib/etape2';

export default definePage({
  id: 'cpa-requirements-new-york',
  group: 'cpa',
  order: 52,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in New York', state: 2, lock: 'state', hours: 120, years: 2, when: 1 } },
  apresOutil: (h) => etape2(h, 'NY'),
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-pennsylvania'],
  sources: ['ny_120', 'ny_150', 'va_boa'],
  slug: 'new-york-cpa-requirements',
  nav: 'New York CPA requirements',
  card: 'The 120-hour pathway from November 21, 2026, the 150-hour deadlines of 2027 and the $427 license fee.',
  title: 'New York CPA Requirements: 120-Hour Pathway From Nov 2026',
  description: 'New York CPA requirements: the 120-hour pathway with two years of experience from November 21, 2026, the 150-hour deadlines of 2027 and the $427 license fee.',
  h1: 'New York CPA requirements: the 120-hour pathway and the 2027 deadlines',
  intro: 'New York CPA (certified public accountant) requirements gain a second route on November 21, 2026: from that date, the state accepts 120 college semester hours, usually a bachelor’s degree, with two years of experience, alongside the 150-hour route with one year. Type your hours and experience and pick when you will apply.',
  resume: (h) => {
    const N = h.P.cpa.states.NY;
    return `New York’s Office of the Professions, part of the State Education Department (NYSED), licenses CPAs under Article 149 of the Education Law. Every applicant must be of good moral character, at least ${N.age} years old, and meet the education, examination and experience requirements. From ${h.date(N.next.from)}, a new 120-semester-hour pathway opens, paired with two years of full-time experience or the part-time equivalent. The 150-semester-hour pathway with one year of experience remains, but its current version is phased out on August 1, 2027: applicants must complete the whole licensing process before that date, and NYSED asks for all materials by ${h.date(N.now.fileBy)}. After August 1, 2027, the 150-hour route follows the course content of the “150E” pathway. The fee for licensure and the first registration is ${h.m(N.license)}, paid with Form 1. The exam application fee was not read and is not shown.`;
  },
  faqs: (h) => [
    { q: 'When does the New York 120-hour CPA pathway start?', a: `On ${h.date(h.P.cpa.states.NY.next.from)}. From that date, NYSED accepts applicants with 120 semester hours in the required content areas, provided they document two years of full-time experience or the part-time equivalent, on top of passing the exam and meeting the age and character rules.` },
    { q: 'What happens to the New York 150-hour pathway in 2027?', a: `Its current version is phased out on August 1, 2027. NYSED says applicants on it must complete education, exam and experience before that date and should submit all materials by ${h.date(h.P.cpa.states.NY.now.fileBy)}. Those who do not finish in time must meet the 150E pathway, whose registered programs are listed separately.` },
    { q: 'How much is a New York CPA license?', a: `${h.m(h.P.cpa.states.NY.license)} for licensure and the first registration, payable to the NYS Education Department with Form 1. NYSED notes that fees are subject to change and that the fee due is the one in law when your application is received, so check it before you file.` },
  ],
  body: (h) => {
    const N = h.P.cpa.states.NY;
    const t = h.E.cpaTotal({ state: 'NY', retakes: 0, prep: 0 });
    const t1 = h.E.cpaTotal({ state: 'NY', retakes: 1, prep: 0 });
    const rows = [['Before ' + h.date(N.next.from), '150 hours and 1 year only'], [`${h.date(N.next.from)} to July 31, 2027`, '150 hours and 1 year, or 120 hours and 2 years'], ['From August 1, 2027', '150E pathway and 1 year, or 120 hours and 2 years']];
    return `
<h2>Which pathway on which date</h2>
${h.table(['Application completed', 'Routes open'], rows, `${h.src('ny_150', 'NYSED, 150-hour requirements')} and ${h.src('ny_120', '120-hour pathway')}, read on ${h.read}.`, ['l', 'l'])}
<p>The dates change the answer for the same person. A candidate with 150 hours and one year of experience who completes the file in June 2027 is licensed under the current 150-hour rules; the same candidate in September 2027 needs coursework that meets the 150E content. A candidate with 120 hours and two years cannot use the new pathway before ${h.date(N.next.from)}.</p>

<h2>Experience: one year or two</h2>
<p>Experience is verified by a supervisor on Form 4B. On the 150-hour pathway, one year of full-time experience or its part-time equivalent is required; on the 120-hour pathway, two. The supervisor and the kind of work that qualify are set out in NYSED’s instructions for Form 4B.</p>

<h2>What a New York CPA license costs</h2>
<p>New York adds ${h.m(N.license)} for the license and first registration. With the four sections passed the first time, ${h.m(t.exams)} in section fees, the total read for New York is ${h.m(t.total)} before any review course; each section retaken adds the ${h.m2(h.P.cpa.sectionFee)} section fee again, so one retake brings it to ${h.m(t1.total)}. The ${h.a('cpa-exam-cost', 'CPA cost calculator')} adds the number of retakes you type. The exam application fee charged on the way in was not on the pages we read, and is left out.</p>
${h.box('Plan backward from the deadline', `<p>If you are on the 150-hour route and want to stay on the current content rules, the practical deadline is ${h.date(N.now.fileBy)}, the date by which NYSED asks for all materials.</p>`, 'warning')}
<p>For the four other states, see the ${h.a('cpa-requirements', 'comparison of licensure routes')}; ${h.a('cpa-requirements-pennsylvania', 'Pennsylvania')} has offered a lower-credit route for longer.</p>
<p>A graduate who stops at a bachelor’s degree with the required accounting and business content gains the most: from ${h.date(N.next.from)}, two years of work replace the fifth year of study. A candidate already enrolled in a 150-hour program gains little, except the option of a second route if the program runs late. And a candidate who planned to finish the current 150-hour pathway in late 2027 should check the 150E content before assuming the old rules still apply.</p>
<p>NYSED counts hours in content areas. For the 150-hour pathway, its page lists, among others, 33 semester hours in accounting with at least one course in each of financial accounting and reporting, cost or managerial accounting, taxation, and auditing and attestation, and 36 hours in general business. Graduates of a NYSED-registered licensure-qualifying program, or of an AACSB-accredited master’s in accounting for the current 150-hour route, meet the requirement directly; others have their transcripts reviewed.</p>
`;
  },
});
