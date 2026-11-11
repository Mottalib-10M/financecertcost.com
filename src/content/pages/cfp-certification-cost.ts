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
  intro: `The CFP® (CERTIFIED FINANCIAL PLANNER®) certification cost in CFP Board’s fees is about ${$(E.cfpTotal({ window: 'early', education: 0, prep: 0, years: 0, basis: 'latest' }).exams + P.cfp.application)}, average retakes included, then ${$(P.cfp.annual)} a year. A bachelor’s degree and courses approved by CFP Board are also required; add what your school charges.`,
  resume: (h) => {
    const r = h.E.cfpTotal({ window: 'standard', education: 0, prep: 0, years: 1, basis: 'latest' });
    return `CFP Board charges for three things on the way to CFP® certification and one thing after it. The CFP® exam costs ${h.m(h.P.cfp.exam.early)} with early registration (CFP Board says “early bird”), ${h.m(h.P.cfp.exam.standard)} standard and ${h.m(h.P.cfp.exam.late)} late. After passing, the certification application costs ${h.m(h.P.cfp.application)}, and certified professionals pay an annual certification fee of ${h.m(h.P.cfp.annual)}. The exam is passed more often than the CFA® or CPA exams: in ${h.ml(h.E.cfpLatest().w)}, ${h.pc(r.p1)} of first-time candidates and ${h.pc(r.pr)} of repeat candidates passed, per CFP Board statistics. Using both rates, an average candidate needs ${h.tries(r.sittings)}. The education program a CFP Board-registered school charges is usually the largest single cost, and it is not set by CFP Board; type yours into the calculator with any review course, and choose how many certified years to count in the total.`;
  },
  faqs: (h) => [
    { q: 'How much is the CFP® exam?', a: `${h.m(h.P.cfp.exam.early)} for early registration (“early bird”), ${h.m(h.P.cfp.exam.standard)} for standard registration and ${h.m(h.P.cfp.exam.late)} for late registration, for the October to November 2026 window on CFP Board’s registration page. Each retake is a new registration at the price of the deadline you meet.` },
    { q: 'What is the CFP® certification annual fee?', a: `${h.m(h.P.cfp.annual)} a year, paid to CFP Board to keep the right to call yourself a CFP® professional. Renewing late adds a ${h.m(h.P.cfp.lateRenewal)} fee. Certified professionals also complete ${h.P.cfp.ceHours} hours of continuing education every ${h.P.cfp.ceYears} years, ${h.P.cfp.ceEthics} of them on CFP Board’s ethics standards.` },
    { q: 'Why does the calculator use two pass rates?', a: 'Because CFP Board publishes them separately and they differ by about ten points or more. A candidate’s first attempt has the first-time rate; any later attempt has the lower repeat rate. The retakes counted are the chance of failing the first time, spread over as many repeat attempts as the repeat rate makes likely.' },
  ],
  body: (h) => {
    const rows = (['early', 'standard', 'late'] as const).map((w) => { const r = h.E.cfpTotal({ window: w, education: 0, prep: 0, years: 0, basis: 'latest' }); return [w === 'early' ? 'Early (early bird)' : w === 'standard' ? 'Standard' : 'Late', h.m(r.fee), h.m(r.exams), h.m(r.certification), h.m(r.total)]; });
    return `
<h2>CFP® certification cost by registration deadline</h2>
${h.table(['Registration', 'Exam fee', 'Exam fees with usual retakes', 'Application', 'To get certified, before school'], rows, `CFP Board fee pages. Retakes from the ${h.ml(h.E.cfpLatest().w)} pass rates. The yearly certification fee, ${h.m(h.P.cfp.annual)}, comes after.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The three exam prices are ${h.m(h.P.cfp.exam.standard - h.P.cfp.exam.early)} apart, and each deadline is posted on CFP Board’s registration page well before the window opens. Registering early on the first try and on any retake is the one saving fully in your hands. The late fee is the price of waiting: ${h.m(h.P.cfp.exam.late - h.P.cfp.exam.early)} more than the early fee for the same exam, at every try.</p>

<h2>Retakes, from CFP Board’s own figures</h2>
<p>In ${h.ml(h.E.cfpLatest().w)}, ${h.pc(h.E.cfpRate(h.E.cfpLatest(), 'first'))} of first-time candidates passed, and ${h.pc(h.E.cfpRate(h.E.cfpLatest(), 'repeat'))} of those on a retake, so the calculator uses both rates. Most candidates pass at the first try; those who fail pay the exam fee again, at the price of the deadline they meet. CFP Board gives the exam in three windows a year (the next ones: ${h.P.cfp.windows.slice(1).map((w) => w.test).join(' and ')}), so a retake also means a few months of waiting before the next try. Averaged over all candidates, retakes add ${h.m(h.E.cfpTotal({ window: 'early', education: 0, prep: 0, years: 0, basis: 'latest' }).retakes)} at the early price.</p>

<h2>The school program and the yearly fee</h2>
<p>CFP® certification asks for a bachelor’s degree and courses approved by CFP Board, taken at a school that sets its own price: type it in the calculator. Then the yearly fee runs as long as you keep the title: after ten years it adds up to ${h.m(10 * h.P.cfp.annual)}, more than any fee paid on the way in. Renewing late adds ${h.m(h.P.cfp.lateRenewal)}, and certified professionals complete ${h.P.cfp.ceHours} hours of continuing education every ${h.P.cfp.ceYears} years, ${h.P.cfp.ceEthics} of them on ethics, from providers whose prices this site does not track.</p>
<p>A worked example: a candidate who registers early, passes at the usual rate and counts five certified years pays the exam fees, the ${h.m(h.P.cfp.application)} application and five yearly fees, ${h.m(5 * h.P.cfp.annual)}: ${h.m(h.E.cfpTotal({ window: 'early', education: 0, prep: 0, years: 5, basis: 'latest' }).total)} before the school program and any review course. Set the years field in the calculator to your own horizon to see the total move.</p>
${h.box('About the first year’s fee', '<p>CFP Board prorates the first certification fee according to when you certify. The calculator counts a full year for each year you choose, which keeps the total on the safe side.</p>', 'info')}
<p>Before certification you also need ${h.num(h.P.cfp.experience.standard)} hours of work experience, or ${h.num(h.P.cfp.experience.apprenticeship)} on the apprenticeship pathway. The ${h.a('cfp-requirements', 'requirements page')} shows how long that takes and lists every step before you can call yourself a CFP® professional.</p>
`;
  },
});
