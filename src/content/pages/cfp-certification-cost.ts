import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import * as E from '../../lib/engine/certs';
import { formatMoney } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cfp-certification-cost',
  group: 'cfp',
  order: 10,
  tool: { kind: 'mini:cfp-total' },
  related: ['cfp-exam-dates', 'cfp-pass-rate', 'cfp-requirements', 'home'],
  sources: ['cfp_registration', 'cfp_final', 'cfp_stats', 'cfp_renewal', 'cfp_marks'],
  slug: 'cfp-certification-cost',
  nav: 'CFP® certification cost',
  card: 'Exam fee by deadline, expected retakes from first-time and repeat pass rates, application and yearly certification fee.',
  title: 'CFP® Certification Cost 2026: Exam, Retakes, Annual Fee',
  description: 'CFP® certification cost in 2026: the exam fee by registration deadline, retakes from CFP Board pass rates, the $250 application and $575 annual fee, totaled.',
  h1: 'CFP® certification cost: from the exam to the yearly fee',
  intro: `CFP Board’s fees come to about ${$(E.cfpTotal({ window: 'early', education: 0, prep: 0, years: 0, basis: 'latest' }).exams + P.cfp.application)} to get certified, average retakes included, then ${$(P.cfp.annual)} a year. A bachelor’s degree and CFP Board coursework are also required; add what your school charges.`,
  resume: (h) => {
    const r = h.E.cfpTotal({ window: 'standard', education: 0, prep: 0, years: 1, basis: 'latest' });
    return `CFP Board charges for three things on the way to CFP® certification and one thing after it. The CFP® exam costs ${h.m(h.P.cfp.exam.early)} with early bird registration, ${h.m(h.P.cfp.exam.standard)} standard and ${h.m(h.P.cfp.exam.late)} late. After passing, the certification application costs ${h.m(h.P.cfp.application)}, and certified professionals pay an annual certification fee of ${h.m(h.P.cfp.annual)}. The exam is passed more often than the CFA® or CPA exams: in ${h.ml(h.E.cfpLatest().w)}, ${h.pc(r.p1)} of first-time candidates and ${h.pc(r.pr)} of repeat candidates passed, per CFP Board statistics. Using both rates, an average candidate needs ${h.tries(r.sittings)}. The education program a CFP Board-registered school charges is usually the largest single cost, and it is not set by CFP Board; type yours into the calculator with any review course, and choose how many certified years to count in the total.`;
  },
  faqs: (h) => [
    { q: 'How much is the CFP® exam?', a: `${h.m(h.P.cfp.exam.early)} for early bird registration, ${h.m(h.P.cfp.exam.standard)} for standard registration and ${h.m(h.P.cfp.exam.late)} for late registration, for the October to November 2026 window on CFP Board’s registration page. Each retake is a new registration at the price of the deadline you meet.` },
    { q: 'What is the CFP® certification annual fee?', a: `${h.m(h.P.cfp.annual)} a year, paid to CFP Board to keep the right to use the CFP® marks. Renewing late adds a ${h.m(h.P.cfp.lateRenewal)} fee. Certified professionals also complete ${h.P.cfp.ceHours} hours of continuing education every ${h.P.cfp.ceYears} years, ${h.P.cfp.ceEthics} of them on CFP Board’s ethics standards.` },
    { q: 'Why does the calculator use two pass rates?', a: 'Because CFP Board publishes them separately and they differ by about ten points or more. A candidate’s first attempt has the first-time rate; any later attempt has the lower repeat rate. The retakes counted are the chance of failing the first time, spread over as many repeat attempts as the repeat rate makes likely.' },
  ],
  body: (h) => {
    const rows = (['early', 'standard', 'late'] as const).map((w) => { const r = h.E.cfpTotal({ window: w, education: 0, prep: 0, years: 0, basis: 'latest' }); return [w === 'early' ? 'Early bird' : w === 'standard' ? 'Standard' : 'Late', h.m(r.fee), h.m(r.exams), h.m(r.certification), h.m(r.total)]; });
    return `
<h2>CFP Board fees, all deadlines</h2>
${h.table(['Registration', 'Exam fee', 'Expected exam fees', 'Application', 'To get certified, before education'], rows, `${h.src('cfp_registration', 'CFP Board, exam registration')} and ${h.src('cfp_final', 'final steps')}, read on ${h.read}. Expected attempts from the ${h.ml(h.E.cfpLatest().w)} pass rates. The yearly certification fee, ${h.m(h.P.cfp.annual)}, comes after.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The three exam prices are ${h.m(h.P.cfp.exam.standard - h.P.cfp.exam.early)} apart. Registering early on the first attempt and on any retake is the one saving fully in your hands.</p>

<h2>Retakes, from CFP Board’s own figures</h2>
<p>CFP Board’s ${h.src('cfp_stats', 'historical exam statistics')} split each session into first-time and repeat candidates. Repeat candidates pass less often, so a model with a single rate understates retakes. The calculator uses both: the first attempt at the first-time rate, any further attempt at the repeat rate. With the latest rates, an average candidate sits the exam about one and a half times: once, plus half a retake on average. Choose “Sessions since March 2023” to smooth out one unusual session.</p>

<h2>The education requirement is the big line</h2>
<p>CFP Board’s education requirement has two parts: a bachelor’s degree and CFP Board coursework, taken through a registered program. Programs are run by universities and private providers at prices CFP Board does not set, so no amount is loaded: type yours. Once education, exam, experience and ethics are all met, CFP Board asks for the application fee and the first certification fee within six months.</p>
${h.box('About the first year’s fee', '<p>CFP Board prorates the first certification fee according to when you certify. The calculator counts a full year for each year you choose, which keeps the total on the safe side.</p>', 'info')}


<h2>Where to go next</h2>
<p>The ${h.a('cfp-exam-dates', 'exam dates page')} lists each window’s deadlines, the ${h.a('cfp-pass-rate', 'pass rate page')} every session since 2023, and the ${h.a('cfp-requirements', 'requirements page')} the experience hours you need before you can use the marks.</p>
<h2>A worked example</h2>
<p>Take a candidate who registers at the standard deadline, pays a school for the education program and a review course, and wants to see five years ahead. The exam part of the bill is the standard fee times the expected sittings; the certification part is the application plus five annual fees, ${h.m(h.P.cfp.application + 5 * h.P.cfp.annual)}; the education and the review are whatever the school and the provider charge. Over a long career the annual fee overtakes everything else: after ten certified years it adds up to ${h.m(10 * h.P.cfp.annual)}, more than any single line paid on the way in. Renewing late each time would add ${h.m(h.P.cfp.lateRenewal)} a year on top. The calculator starts at zero certified years, so its first figure is the cost of getting certified; set the years field to your own horizon to see the total move.</p>
<details><summary>What the yearly fee pays for, and why this site writes “CFP® professional”</summary>
<p>The annual fee buys the right to use the CFP® certification marks. CFP Board’s ${h.src('cfp_marks', 'guidelines')} say the mark is always written in capitals with the ® symbol and followed by a noun such as certification, professional or exam. That is why this site writes “CFP® professional” and never uses the letters alone as a title.</p>
</details>
`;
  },
});
