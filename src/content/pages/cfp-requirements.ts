import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import * as E from '../../lib/engine/certs';
import { formatMoney, formatNumber } from '../../lib/format';

export default definePage({
  id: 'cfp-requirements',
  group: 'cfp',
  order: 40,
  tool: { kind: 'mini:cfp-experience' },
  related: ['cfp-certification-cost', 'cfp-exam-dates', 'cfp-pass-rate'],
  sources: ['cfp_experience', 'cfp_final', 'cfp_renewal', 'cfp_marks'],
  slug: 'cfp-certification-requirements',
  nav: 'CFP® certification requirements',
  card: 'Education, exam, experience and ethics: how long the 6,000 or 4,000 hours take at your pace, and what renewal asks.',
  title: 'CFP® Certification Requirements: Hours, Education, Ethics',
  description: 'CFP® certification requirements: a degree and coursework, the exam, 6,000 hours of experience or 4,000 as an apprentice, ethics, and the renewal rules after.',
  h1: 'CFP® certification requirements: the four steps and the hours',
  intro: `CFP® certification asks for ${formatNumber(P.cfp.experience.standard, 0)} hours of experience, or ${formatNumber(P.cfp.experience.apprenticeship, 0)} on the apprenticeship pathway: about ${formatNumber(E.monthsForHours(P.cfp.experience.standard, 40) / 12, 1)} years at 40 hours a week. Type your own weekly hours to see how long it takes you.`,
  resume: (h) => {
    const X = h.P.cfp.experience;
    return `CFP Board grants CFP® certification to candidates who meet four requirements, often called education, examination, experience and ethics. Education means a bachelor’s degree and CFP Board coursework from a registered program. The exam is the CFP® exam, offered three times a year. Experience is ${h.num(X.standard)} hours of professional experience related to the financial planning process on the standard pathway, or ${h.num(X.apprenticeship)} hours on the apprenticeship pathway, which carries additional requirements; it can be gained before or after the exam. Ethics means agreeing to CFP Board’s standards and passing its background check. At forty hours a week, ${h.num(X.standard)} hours take about ${h.num1(h.E.monthsForHours(X.standard, 40) / 12)} years and ${h.num(X.apprenticeship)} about ${h.num1(h.E.monthsForHours(X.apprenticeship, 40) / 12)}. After certification, CFP® professionals renew every year and complete ${h.P.cfp.ceHours} hours of continuing education every ${h.P.cfp.ceYears} years.`;
  },
  faqs: (h) => [
    { q: 'Can I take the CFP® exam before I have the experience?', a: 'Yes. CFP Board says experience may be gained before or after the exam. You can sit the exam first and complete the hours afterward, but you cannot use the CFP® marks until every requirement is met and you have been certified.' },
    { q: 'What is the CFP® apprenticeship pathway?', a: `A shorter experience route of ${h.num(h.P.cfp.experience.apprenticeship)} hours instead of ${h.num(h.P.cfp.experience.standard)}, open to candidates whose work meets additional requirements set by CFP Board. Check the conditions on CFP Board’s experience page before counting on it, since an hour that does not qualify for the apprenticeship may still count toward the standard pathway.` },
    { q: 'What does CFP® certification renewal require?', a: `Every year, the renewal application and the ${h.m(h.P.cfp.annual)} certification fee by your expiration date, or a ${h.m(h.P.cfp.lateRenewal)} late fee. Every two years, ${h.P.cfp.ceHours} hours of continuing education including a ${h.P.cfp.ceEthics}-hour CFP Board ethics course, prorated for new professionals in their first cycle.` },
  ],
  body: (h) => {
    const X = h.P.cfp.experience;
    const paces = [20, 30, 40, 50].map((w) => [`${w} hours a week`, h.num1(h.E.monthsForHours(X.standard, w) / 12), h.num1(h.E.monthsForHours(X.apprenticeship, w) / 12)]);
    return `
<h2>The four requirements</h2>
<ol>
<li><strong>Education.</strong> A bachelor’s degree and CFP Board coursework, according to CFP Board’s ${h.src('cfp_final', 'final steps page')}.</li>
<li><strong>Examination.</strong> The CFP® exam, in one of three windows a year. See ${h.a('cfp-exam-dates', 'exam dates')} and ${h.a('cfp-pass-rate', 'pass rates')}.</li>
<li><strong>Experience.</strong> ${h.num(X.standard)} hours on the standard pathway or ${h.num(X.apprenticeship)} on the apprenticeship pathway, per the ${h.src('cfp_experience', 'experience requirement page')}.</li>
<li><strong>Ethics.</strong> Commitment to CFP Board’s code and standards and a background review.</li>
</ol>
<p>Once all four are met, CFP Board asks for the ${h.m(h.P.cfp.application)} application fee and a prorated first certification fee, to be paid within six months.</p>

<h2>How long the experience takes</h2>
${h.table(['Pace', 'Standard pathway, years', 'Apprenticeship, years'], paces, 'Computed at 52 working weeks a year; only hours that CFP Board counts as qualifying should be included.', ['l', 'r', 'r'])}
<p>CFP Board counts many kinds of work, from engaging with clients directly to supporting the financial planning process or teaching related courses. Hours can be reported at any time through the candidate account, so a candidate can see where they stand long before applying.</p>
${h.box('Use of the marks', `<p>Until certification, a candidate may not use the CFP® marks. CFP Board’s ${h.src('cfp_marks', 'guidelines')} require the mark in capitals with ®, followed by an approved noun: a person is a “CFP® professional”, never the bare letters.</p>`, 'warning')}

<h2>Keeping the certification</h2>
<p>Renewal comes every year, with the ${h.m(h.P.cfp.annual)} fee due by the expiration date on your CFP Board account; paying late adds ${h.m(h.P.cfp.lateRenewal)} and can lead to losing the right to the marks, according to the ${h.src('cfp_renewal', 'renewal policies')}. Continuing education runs on a two-year cycle: ${h.P.cfp.ceHours} hours, ${h.P.cfp.ceEthics} of them in a pre-approved CFP Board ethics course. Over ten certified years, the fees alone come to ${h.m(10 * h.P.cfp.annual)}, before any CE course costs. The ${h.a('cfp-certification-cost', 'cost calculator')} adds them for the number of years you choose.</p>
<h2>Order of the steps</h2>
<p>The four requirements do not have to be met in a fixed order, but two depend on each other. The exam requires the coursework to be verified by the deadline of the window you choose; certification requires all four. In practice, most of the calendar is set by the experience requirement. At forty qualifying hours a week, the standard pathway takes close to three years and the apprenticeship pathway about two. Someone who starts logging hours while still taking the coursework, and sits the exam in the meantime, can reach certification soon after the last hour is logged. Someone who waits to start work until after the exam adds the whole experience period to the end.</p>
<p>The money follows the same order: education first, the exam fee at each registration, then the application and the first prorated certification fee within six months of meeting every requirement, then the annual fee for as long as you hold the marks.</p>
`;
  },
});
