import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-exam-sections',
  group: 'cpa',
  order: 20,
  tool: { kind: 'mini:cpa-discipline' },
  related: ['cpa-exam-pass-rates', 'cpa-exam-cost', 'cpa-requirements'],
  sources: ['aicpa_exam', 'va_boa', 'aicpa_rates'],
  slug: 'cpa-exam-sections',
  nav: 'CPA exam sections',
  card: 'The three Core sections and the three Disciplines, what each one covers, and the section fees you still have to pay.',
  title: 'CPA Sections: Core, Disciplines and the Fees for Each Try',
  description: 'CPA exam sections explained: the AUD, FAR and REG Core, the BAR, ISC and TCP Disciplines, what each one covers and what the four cost, retakes included.',
  h1: 'CPA exam sections: the Core, the Disciplines and the fees still to pay',
  intro: 'Three CPA exam sections are the same for everyone: Auditing (AUD), Financial accounting (FAR) and Tax and regulation (REG). You choose the fourth among Business analysis (BAR), Information systems (ISC) and Tax compliance (TCP). Say how many you have passed to see the section fees left to pay.',
  resume: (h) => `Since the CPA Evolution model took effect in 2024, every candidate sits four sections of ${h.P.cpa.sectionHours} hours each. Three form the Core and are the same for everyone: Auditing and Attestation (AUD), Financial Accounting and Reporting (FAR) and Taxation and Regulation (REG). The fourth is a Discipline the candidate chooses: Business Analysis and Reporting (BAR), Information Systems and Controls (ISC) or Tax Compliance and Planning (TCP). The choice does not change the license you receive, and it does not change the price: each section costs ${h.m2(h.P.cpa.sectionFee)} a try, so the four come to ${h.m(4 * h.P.cpa.sectionFee)} if each is passed the first time. What changes the bill is the number of retakes. Pass rates for each section are published by the AICPA; this site links to them without copying them, and lets you type the retakes you expect instead.`,
  faqs: (h) => [
    { q: 'Does my CPA Discipline section limit what I can do as a CPA?', a: 'No. The AICPA describes the Discipline as a way to show deeper skills in one area; a candidate who passes the Core and any Discipline earns the same license from the state board, with the same rights. Choose the one closest to the work you do or plan to do, since that is where your knowledge already helps.' },
    { q: 'Can I take the CPA sections in any order?', a: 'Yes. Candidates schedule each section separately and may take them in the order they prefer, within the rules of their state board on how long passed sections stay valid. Many begin with the section closest to their recent coursework, but there is no required sequence on the AICPA’s side.' },
    { q: 'Does the Discipline I choose change the CPA exam fee?', a: `No. All six sections cost the same, ${h.m2(h.P.cpa.sectionFee)} a try as of ${h.date(h.P.cpa.sectionFeeFrom)}, paid to NASBA when you schedule. Only the number of tries changes the bill, and state boards add their own fees on top, which do not depend on the Discipline either.` },
  ],
  body: (h) => `
<h2>The three Core sections</h2>
<ul>
<li><strong>AUD, Auditing and Attestation</strong>: the audit process, evidence, reporting and professional responsibilities.</li>
<li><strong>FAR, Financial Accounting and Reporting</strong>: financial statements under US GAAP, for business, government and not-for-profit entities.</li>
<li><strong>REG, Taxation and Regulation</strong>: federal taxation, business law and ethics.</li>
</ul>
<p>Topic descriptions follow the AICPA’s ${h.src('aicpa_exam', 'CPA Exam overview')}; its Blueprints give the detailed content and weights for each section, and they change from one year to the next.</p>

<h2>The three Disciplines</h2>
<ul>
<li><strong>BAR, Business Analysis and Reporting</strong>: for candidates leaning toward financial reporting and analysis.</li>
<li><strong>ISC, Information Systems and Controls</strong>: for those in systems, data and controls.</li>
<li><strong>TCP, Tax Compliance and Planning</strong>: for those who work in tax or plan to.</li>
</ul>
<p>Each Discipline costs the same ${h.m2(h.P.cpa.sectionFee)} a try and lasts ${h.P.cpa.sectionHours} hours, like the Core sections. Passing the Core and any one of the three leads to the same license.</p>

<h2>What the pass rates can and cannot tell you</h2>
<p>Pass rates are published by the AICPA on its ${h.src('aicpa_rates', 'scoring and pass rates page')}, one cumulative figure per section. This site does not copy them, since the AICPA’s terms limit their use to personal purposes; the ${h.a('cpa-exam-pass-rates', 'pass rates page')} explains how to turn the rate you read there into tries and fees. A pass rate measures the group that sits the section as much as the section itself: each Discipline is chosen mostly by people from its own field, and the AICPA does not publish rates by candidate background. A rate cannot tell you whether you would do better in one Discipline than in another.</p>
${h.box('Practical rule', '<p>Pick the Discipline that matches your job. The fee is the same whichever you pick; failing a section in a field you do not work in costs another fee and months of study.</p>', 'tip')}

<h2>Exam time and scheduling</h2>
<p>Each section is a ${h.P.cpa.sectionHours}-hour exam taken at a test center. You apply through your state board, pay the section fees to NASBA, then book each section. The money side of the whole process, board fees included, is on the ${h.a('cpa-exam-cost', 'CPA exam cost')} page; the education and experience you need for the license are on the ${h.a('cpa-requirements', 'CPA requirements')} page.</p>
<h2>A budget for the sections left</h2>
<p>The tool above counts what remains. Choose how many sections you have already passed and type the retakes you expect: each section not yet passed and each retake costs ${h.m2(h.P.cpa.sectionFee)}. With none passed and no retake, the four sections come to ${h.m(4 * h.P.cpa.sectionFee)}; with two passed and one retake expected, three tries remain, ${h.m(h.E.cpaLeft(2, 1).fees)}. Keep in mind the credit window of your board: a passed section stays valid only for a set time while you finish the others, and a section that lapses has to be paid again.</p>
`,
});
