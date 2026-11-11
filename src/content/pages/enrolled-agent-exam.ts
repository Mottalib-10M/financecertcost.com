import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'enrolled-agent-exam',
  group: 'more',
  order: 10,
  tool: { kind: 'mini:ea-total' },
  related: ['cpa-exam-cost', 'cia-exam', 'home'],
  sources: ['irs_faq', 'fr_see', 'irs_become', 'irs_maintain', 'irs_ptin'],
  slug: 'enrolled-agent-exam-cost',
  nav: 'Enrolled agent exam cost',
  card: 'Three SEE parts at $317, the IRS user fee cut in April 2026, Form 23 enrollment and the PTIN, totaled.',
  title: 'Enrolled Agent Exam Cost 2026: SEE Fee, Enrollment, PTIN',
  description: 'Enrolled agent exam cost in 2026: $317 per SEE part after the IRS user fee fell to $66, the $140 enrollment on Form 23, the PTIN and continuing education.',
  h1: 'Enrolled agent exam cost: the IRS exam, enrollment and the tax preparer ID',
  intro: `An enrolled agent (EA) is a tax preparer approved by the IRS to represent taxpayers. The IRS exam has three parts at ${$(P.ea.perPart)} each; with enrollment and one year of tax preparer ID, the total if you pass each part the first time is ${$(3 * P.ea.perPart + P.ea.enrollment + P.ea.ptin)}. No college degree is required.`,
  resume: (h) => {
    const E = h.P.ea;
    return `An enrolled agent is a tax practitioner authorized by the IRS to represent taxpayers before it. The usual route is the IRS exam, the Special Enrollment Examination (SEE), three parts covering individuals, businesses, and representation, practices and procedures. Each part costs ${h.m(E.perPart)}, according to the IRS FAQ updated on ${h.date(E.feeFaqUpdated)}. Of that, the IRS’s own share is ${h.m(E.irsUserFee)}, down from ${h.m(E.irsUserFeeOld)} since ${h.date(E.userFeeFrom)}; the rest goes to the company that runs the test, ${E.vendor} since ${h.date(E.vendorFrom)}. Passing all three parts at the first try costs ${h.m(3 * E.perPart)}. Enrollment then costs ${h.m(E.enrollment)} on the IRS form, and every tax preparer needs a tax preparer ID (PTIN, preparer tax identification number), ${h.m2(E.ptin)} a year. Passed parts carry over for ${E.carryoverYears} years. The IRS publishes no SEE pass rate that this site has read, so retakes are yours to enter.`;
  },
  faqs: (h) => [
    { q: 'How much does the enrolled agent exam cost?', a: `${h.m(h.P.ea.perPart)} per part, three parts, so ${h.m(3 * h.P.ea.perPart)} if each is passed at the first try. The fee includes the IRS’s own share, ${h.m(h.P.ea.irsUserFee)}, and the share of the company that runs the test. Each retake costs the full ${h.m(h.P.ea.perPart)} again, and enrollment and the tax preparer ID come after the exam.` },
    { q: 'Do I need a college degree to become an enrolled agent?', a: `No. The IRS asks for no college degree and no set number of college credits. You pass its three-part exam, ${h.m(h.P.ea.perPart)} a part, then apply for enrollment and pass a check that your own taxes are in order. That is why the enrolled agent is the one credential on this site open without a degree.` },
    { q: 'How long do I have to pass all three SEE parts?', a: `Each passed part stays valid for ${h.P.ea.carryoverYears} years. After passing the last part, you have ${h.P.ea.applyWithinYears} year to apply for enrollment on the IRS form (Form 23), according to the IRS. A part that expires has to be taken and paid again, at the fee in force then.` },
  ],
  body: (h) => {
    const E = h.P.ea;
    const rows = [3, 4, 5, 6].map((n) => { const r = h.E.eaTotal({ sittings: n, prep: 0, years: 1 }); return [n === 3 ? '3 exams sat, no retake' : `${n} exams sat (${n - 3} retake${n > 4 ? 's' : ''})`, h.m(r.exams), h.m(r.total)]; });
    return `
<h2>Enrolled agent exam cost by number of exams sat</h2>
${h.table(['Exams sat', 'Exam fees', 'Total with enrollment and one year of tax preparer ID'], rows, 'IRS enrolled agent questions and answers, and its tax preparer ID page.', ['l', 'r', 'r'])}
<p>Each ${h.m(E.perPart)} part has two shares. The IRS keeps ${h.m(E.irsUserFee)}, down from ${h.m(E.irsUserFeeOld)} since ${h.date(E.userFeeFrom)}; the rest, ${h.m(E.perPart - E.irsUserFee)}, pays the company that runs the test, ${E.vendor} since ${h.date(E.vendorFrom)}. Nothing more is charged for the exam itself, whatever part you sit. A guide written before April 2026 may still quote the older, higher IRS share.</p>
<p>Three exams is the minimum: one per part, taken in any order and paid one at a time. The first row is the calculator’s starting figure; every extra row is one retake at ${h.m(E.perPart)}. The IRS publishes no pass rate for its exam, so the calculator counts only the retakes you type. Not sure how many? Count one retake to be on the safe side: it adds ${h.m(E.perPart)}.</p>
${h.box('Enrolled agent or CPA?', `<p>An enrolled agent may represent taxpayers before the IRS, in every state, but only on tax. A CPA (certified public accountant) is licensed by a state for accounting and audit work too, and most states ask for about five years of college. In fees, the enrolled agent route is lighter: ${h.m(3 * E.perPart)} for the three parts, close to the ${h.m(4 * h.P.cpa.sectionFee)} of the ${h.a('cpa-exam-cost', 'CPA exam')}, with no state board fee and no college degree required.</p>`, 'info')}

<h2>After the exam: enrollment, tax preparer ID and training</h2>
<ul>
<li><strong>Enrollment.</strong> ${h.m(E.enrollment)} on the IRS form (Form 23), within ${E.applyWithinYears} year of passing the last part, then a check that your own taxes are in order.</li>
<li><strong>Tax preparer ID (PTIN).</strong> ${h.m2(E.ptin)} a year, renewed each year.</li>
<li><strong>Continuing education.</strong> ${E.ceHours} hours every ${E.renewYears} years, at least ${E.ceMinYear} a year, including ethics.</li>
</ul>

<h2>Planning the three parts</h2>
<p>The parts can be taken in any order and paid one at a time, so the cost is spread over the months you study. Each passed part stays valid for ${E.carryoverYears} years: a part that expires has to be paid again, ${h.m(E.perPart)}. After the last pass, enrollment must be requested within ${E.applyWithinYears} year. Spreading the three parts over a year leaves room for one or two retakes inside the ${E.carryoverYears}-year span; spreading them over longer leaves less. Review courses come on top; this site sells none. Not sure what to count? The calculator offers a rough guess: as much as the exam fees.</p>
`;
  },
});
