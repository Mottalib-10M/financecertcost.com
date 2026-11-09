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
  h1: 'Enrolled agent exam cost: the SEE, enrollment and the PTIN',
  intro: `An enrolled agent (EA) is a tax practitioner authorized by the IRS to represent taxpayers. The IRS exam, the Special Enrollment Examination (SEE), has three parts at ${$(P.ea.perPart)} each; with enrollment and one year of the tax preparer ID (PTIN), the first-try total is about ${$(3 * P.ea.perPart + P.ea.enrollment + P.ea.ptin)}. No education-hour rule applies.`,
  resume: (h) => {
    const E = h.P.ea;
    return `An enrolled agent is a tax practitioner authorized by the IRS to represent taxpayers before it. The usual route is the Special Enrollment Examination (SEE), three parts covering individuals, businesses, and representation, practices and procedures. Each part costs ${h.m(E.perPart)}, according to the IRS FAQ updated on ${h.date(E.feeFaqUpdated)}. Of that, the IRS’s own user fee is ${h.m(E.irsUserFee)}, down from ${h.m(E.irsUserFeeOld)} from ${h.date(E.userFeeFrom)}, under a final rule published in the Federal Register; the rest goes to the test vendor, ${E.vendor} since ${h.date(E.vendorFrom)}. Passing all three parts at the first try costs ${h.m(3 * E.perPart)}. Enrollment then costs ${h.m(E.enrollment)} on Form 23, and every tax preparer needs a preparer tax identification number (PTIN), ${h.m2(E.ptin)} a year. Passed parts carry over for ${E.carryoverYears} years. The IRS publishes no SEE pass rate that this site has read, so retakes are yours to enter.`;
  },
  faqs: (h) => [
    { q: 'How much does the enrolled agent exam cost?', a: `${h.m(h.P.ea.perPart)} per part, three parts, so ${h.m(3 * h.P.ea.perPart)} if each is passed at the first try. The fee includes an IRS user fee of ${h.m(h.P.ea.irsUserFee)} and the test vendor’s share. Each retake costs the full ${h.m(h.P.ea.perPart)} again, and enrollment and the PTIN come after the exam.` },
    { q: 'Why did the SEE user fee change in 2026?', a: `The IRS lowered its part of the fee from ${h.m(h.P.ea.irsUserFeeOld)} to ${h.m(h.P.ea.irsUserFee)} per part, effective ${h.date(h.P.ea.userFeeFrom)}, through a final rule in the Federal Register. User fees are set to recover the cost of the service, and the rule updated that calculation.` },
    { q: 'How long do I have to pass all three SEE parts?', a: `Each passed part stays valid for ${h.P.ea.carryoverYears} years. After passing the last part, you have ${h.P.ea.applyWithinYears} year to apply for enrollment on Form 23, according to the IRS. A part that expires has to be taken and paid again, at the fee in force then.` },
  ],
  body: (h) => {
    const E = h.P.ea;
    const rows = [3, 4, 5, 6].map((n) => { const r = h.E.eaTotal({ sittings: n, prep: 0, years: 1 }); return [n === 3 ? '3, no retake' : `${n} (${n - 3} retake${n > 4 ? 's' : ''})`, h.m(r.exams), h.m(r.irsShare), h.m(r.total)]; });
    return `
<h2>Where the ${h.m(E.perPart)} goes</h2>
<p>The SEE fee has two parts. The IRS user fee, ${h.m(E.irsUserFee)} per part since ${h.date(E.userFeeFrom)} (${h.src('fr_see', 'Federal Register, document 2026-07681')}), pays for the IRS’s side of the program. The rest, ${h.m(E.perPart - E.irsUserFee)}, is the vendor’s charge for running the exam. The vendor changed to ${E.vendor} on ${h.date(E.vendorFrom)}; the total per part listed in the ${h.src('irs_faq', 'IRS FAQ')} is ${h.m(E.perPart)}.</p>

<h2>Totals by number of attempts</h2>
${h.table(['SEE parts sat', 'Exam fees', 'IRS share, already in exam fees', 'Total with enrollment and one year of PTIN'], rows, `IRS, enrolled agents FAQ and PTIN requirements, read on ${h.read}.`, ['l', 'r', 'r', 'r'])}
<p>Three attempts is the minimum: one per part. The first row is the calculator’s starting figure. Every extra row is a retake. Because the IRS does not publish SEE pass rates that we could read, the calculator does not assume any; add the retakes you want to budget for.</p>

<h2>After the exam</h2>
<ul>
<li><strong>Enrollment.</strong> ${h.m(E.enrollment)} on Form 23, within ${E.applyWithinYears} year of passing the last part, followed by a tax compliance check (${h.src('irs_become', 'IRS, become an enrolled agent')}).</li>
<li><strong>PTIN.</strong> ${h.m2(E.ptin)} a year, renewed each year (${h.src('irs_ptin', 'IRS, PTIN requirements')}).</li>
<li><strong>Continuing education.</strong> ${E.ceHours} hours every ${E.renewYears} years, at least ${E.ceMinYear} a year, including ethics (${h.src('irs_maintain', 'IRS, maintain your status')}).</li>
</ul>
${h.box('Enrolled agent or CPA?', `<p>The two are not the same: an enrolled agent’s authority is federal and limited to tax, while a CPA is licensed by a state for accounting and audit work too. In fees, the enrolled agent route is lighter. Three SEE parts cost ${h.m(3 * E.perPart)}, close to four CPA sections at the first try, but without state board fees or education-hour rules. The IRS publishes no pass rate for its exam; the AICPA publishes one for each section of the ${h.a('cpa-exam-cost', 'CPA exam')}, linked from the ${h.a('cpa-exam-pass-rates', 'CPA pass rates page')}.</p>`, 'info')}

<h2>The line you type</h2>
<p>Review courses for the SEE are sold by many providers; this site sells none and loads no price. Type your budget once. If you expect to buy a separate course for a part you retake, include it in the amount.</p>
<h2>Planning the three parts</h2>
<p>The parts can be taken in any order and paid one at a time, so the cost is spread over the months you study. The constraint is the carryover: each passed part stays valid for ${E.carryoverYears} years, so all three have to be passed within that span, counting from the first pass. A candidate who passes Part 1 and then stalls on Part 2 for more than ${E.carryoverYears} years loses the first pass and pays ${h.m(E.perPart)} to sit it again. After the last pass, enrollment must be requested within ${E.applyWithinYears} year. Spreading three parts over a year leaves room for one or two retakes inside the window; spreading them over longer leaves less.</p>
<p>The fee change of April 2026 also matters for anyone comparing older guides: an article that quotes the SEE price before ${h.date(E.userFeeFrom)} counts the IRS user fee at ${h.m(E.irsUserFeeOld)} rather than ${h.m(E.irsUserFee)}.</p>
`;
  },
});
