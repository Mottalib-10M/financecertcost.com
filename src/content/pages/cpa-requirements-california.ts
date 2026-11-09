import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-requirements-california',
  group: 'cpa',
  order: 50,
  tool: { kind: 'mini:cpa-eligibility', props: { title: 'Step 1: which licensure route fits you in California', state: 0, lock: 'state', when: 2 } },
  mini: { kind: 'mini:cpa-total', props: { title: 'Step 2: what the exam and California board fees cost', state: 0, lock: 'state' } },
  related: ['cpa-requirements', 'cpa-exam-cost', 'cpa-requirements-new-york'],
  sources: ['ca_cbt', 'ca_ab1175', 'va_boa'],
  slug: 'california-cpa-requirements',
  nav: 'California CPA requirements',
  card: 'The rules before and after AB 1175 takes effect on January 1, 2027, and the CBA exam application fees.',
  title: 'California CPA Requirements: AB 1175 Rules From 2027',
  description: 'California CPA requirements before and after AB 1175 takes effect on January 1, 2027: degree, units, experience, the CBA exam application fees and what changes.',
  h1: 'California CPA requirements: the rules change on January 1, 2027',
  intro: 'California CPA requirements change with the new year: until December 31, 2026, the state asks for 150 semester units and one year of experience; from January 1, 2027, a bachelor’s degree with an accounting concentration and two years. Type your units and experience and pick the date you will apply.',
  resume: (h) => {
    const C = h.P.cpa.states.CA;
    return `California licenses more CPAs than any other state, and its rules are about to change. Until December 31, 2026, the California Board of Accountancy requires 150 semester units of education and one year of experience for the license. On ${h.date(C.next.from)}, the provisions of Assembly Bill 1175 take effect: in the board’s words, the new rules “focus on the degree earned and remove the 150 total-unit requirement,” and a second year of accounting experience is required. To sit for the exam, the board asks for ${C.sitUnits}. The CBA charges ${h.m(C.examFirst!)} for a first exam application and ${h.m(C.examRepeat!)} for each repeat application, on top of the section fees paid to NASBA, ${h.m2(h.P.cpa.sectionFee)} each. The California license fee was not confirmed on the board’s pages we read, so this site does not show it.`;
  },
  faqs: (h) => [
    { q: 'What changes for California CPA candidates in 2027?', a: `From ${h.date(h.P.cpa.states.CA.next.from)}, Assembly Bill 1175 replaces the 150 total-unit requirement with a degree-based rule and requires two years of accounting experience instead of one. The board also mentions added flexibility for candidates with an advanced degree and for career changers; ask the CBA how it applies to your file.` },
    { q: 'How much is the California CPA exam application?', a: `${h.m(h.P.cpa.states.CA.examFirst!)} for a first-time application and ${h.m(h.P.cpa.states.CA.examRepeat!)} for a repeat application, according to the CBA’s exam application instructions. The section fees are separate and paid to NASBA, ${h.m2(h.P.cpa.sectionFee)} per section as of ${h.date(h.P.cpa.sectionFeeFrom)}, so the application is a small part of the exam bill.` },
    { q: 'I have 150 units and one year of experience. Should I apply before 2027?', a: 'If you meet every current requirement, including the exam, applying under the current rules before they end on December 31, 2026 avoids the second year of experience the new rules require. If you are not ready, check with the board how a pending file is treated; this site does not model the transition.' },
  ],
  body: (h) => {
    const C = h.P.cpa.states.CA;
    const t = h.E.cpaTotal({ state: 'CA', retakes: 0, prep: 0 });
    const t1 = h.E.cpaTotal({ state: 'CA', retakes: 1, prep: 0 });
    const rows = [['Education for the license', '150 semester units', C.next.rule], ['Experience', `${C.now.expYears} year`, `${C.next.expYears} years`], ['In force', `until ${h.date('2026-12-31')}`, `from ${h.date(C.next.from)}`]];
    return `
<h2>California CPA requirements before and after AB 1175</h2>
${h.table(['', 'Current rules', 'AB 1175 rules'], rows, `${h.src('ca_ab1175', 'California Board of Accountancy, news release of March 23, 2026')}, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>The change is the one most states are making: fewer required units, more required experience. For a student finishing a four-year degree in 2026 or later, it removes the need for a fifth year of school; for someone already at 150 units, it adds a year of work before the license unless the file is complete under the current rules.</p>

<h2>Sitting for the exam in California</h2>
<p>Exam eligibility is separate from licensure. The board asks for ${C.sitUnits}. Applications go to the CBA, which charges ${h.m(C.examFirst!)} the first time and ${h.m(C.examRepeat!)} for a repeat application, according to its ${h.src('ca_cbt', 'application instructions')}. Once approved, you pay NASBA for each section you schedule.</p>

<h2>What the exam costs a California candidate</h2>
<p>With the four sections passed the first time, a California candidate pays ${h.m(t.exams)} in section fees and ${h.m(t.boardKnown)} for the first CBA exam application. Each section retaken adds the section fee again and, by this site’s estimate of one repeat application per retake, ${h.m(h.P.cpa.states.CA.examRepeat!)} to the CBA: ${h.m2(h.E.cpaRetakePrice('CA'))} a retake, so ${h.m(t1.exams + t1.boardKnown)} with one. The repeat count is an estimate: the CBA instructions tell you when a repeat application is due. The second calculator above adds the retakes you type and a review course.</p>
${h.box('Not shown: the license fee', '<p>The CBA charges fees for the license itself. We could not confirm their current amount on the pages we read, so they are left out of the total rather than guessed. Check the CBA’s fee schedule before you budget.</p>', 'warning')}

<h2>Experience: what counts</h2>
<p>The board sets which work qualifies and who may verify it. Under the current rules one year is required; under the rules that start on January 1, 2027, two. If you plan your career around the license, count backward from the date you want to hold it: the tool converts your years of experience against the rule in force on the date you apply. The ${h.a('cpa-requirements', 'five-state comparison')} shows how California’s new rule compares with ${h.a('cpa-requirements-new-york', 'New York')} and ${h.a('cpa-requirements-texas', 'Texas')}, which made the same move in 2026.</p>
<p>A last point on timing: the date that counts is the one the board applies to your file, so ask the CBA how it treats an application in progress on January 1, 2027.</p>
`;
  },
});
