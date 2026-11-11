import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-exam-pass-rates',
  group: 'cpa',
  order: 30,
  tool: { kind: 'mini:cpa-passrate' },
  related: ['cpa-exam-sections', 'cpa-exam-cost', 'cfa-pass-rates'],
  sources: ['aicpa_rates', 'aicpa_scores', 'va_boa'],
  slug: 'cpa-exam-pass-rates',
  nav: 'CPA pass rates and score release dates',
  card: 'Where the AICPA publishes the pass rate of each section, what a rate measures, and how to turn one into tries and fees.',
  title: 'CPA Exam Pass Rates and Score Release Dates: Where to Look',
  description: 'CPA exam pass rates for AUD, FAR, REG, BAR, ISC and TCP, and score release dates: where the AICPA posts both, and how a pass rate turns into tries and fees.',
  h1: 'CPA exam pass rates and score release dates: where to read them',
  intro: 'This page does not show the CPA exam pass rates: the AICPA (American Institute of Certified Public Accountants), which writes the exam and publishes them, does not let this site copy them. What it does: turn the rate you read there into tries and fees, and say where the score release dates are.',
  avantOutil: (h) => `${h.src('aicpa_rates', 'Open the AICPA pass-rate page ↗')}, find your section’s rate, type it below. Not sure? Keep 45%, an illustration close to half.`,
  resume: (h) => `The AICPA (American Institute of Certified Public Accountants), which writes the Uniform CPA Examination, publishes a pass rate for each of the six sections on its scoring and pass rates page, updated as each quarter’s scores are released. You sit four of the six: three that everyone takes, on auditing, financial accounting and tax, and one you pick among three topics. This site does not reproduce the rates: the AICPA’s terms limit the use of its site to personal, non-commercial purposes, so the page is linked and no figure is copied. A pass rate is the share of all tries in the period that scored 75 or more, first attempts and retakes together. It turns directly into money, because every try costs the same section fee, ${h.m2(h.P.cpa.sectionFee)} as of ${h.date(h.P.cpa.sectionFeeFrom)}: a section passed by half of its candidates takes two tries on average, so about ${h.m(2 * h.P.cpa.sectionFee)} in fees. The tool above does that arithmetic for the rate you type.`,
  faqs: (h) => [
    { q: 'What score do I need to pass a CPA exam section?', a: 'A scaled score of 75 on a scale of 0 to 99. The score is not a percentage of correct answers: the AICPA converts results to its scale, weighting questions by difficulty and format. A pass rate is the share of candidates who reached 75 in the period.' },
    { q: 'When are CPA exam scores released?', a: 'On target dates the AICPA posts on its score release page, and which it says may change. The three sections everyone takes are scored all year, usually a few weeks after the test. The three topics you pick from are given only in the first month of each quarter, with one release date late in that quarter.' },
    { q: 'Why does this site not show the CPA pass rates?', a: `Because the AICPA’s terms of use limit its material to personal, non-commercial use, and a site published by a company is not a personal use. The figures stay one click away on the AICPA’s own page. Every other number used here, such as the ${h.m2(h.P.cpa.sectionFee)} section fee, comes from a page whose use is not restricted.` },
  ],
  body: (h) => {
    const fee = h.P.cpa.sectionFee;
    const ex = [0.35, 0.45, 0.6, 0.7].map((p) => [h.pc(p, 0), h.tries(h.E.expectedSittings(p)), h.m(fee * h.E.expectedSittings(p)), h.pc(h.E.passWithin(p, 2))]);
    return `
<h2>From a CPA exam pass rate to tries and fees</h2>
<p>At a 45% pass rate, an average candidate needs about 2 to 3 tries, and about 7 in 10 have passed within two. At 70%, most pass at the first or second try. Each try costs ${h.m2(fee)}, the same section fee every time. The rates below are round illustrations chosen by this site, not AICPA figures.</p>
${h.table(['Example rate', 'Tries, on average', 'Fees, one section', 'Passed within two tries'], ex, 'Illustrations, not published figures. Section fee as listed by the Virginia Board of Accountancy.', ['r', 'r', 'r', 'r'])}
<p>Real candidates are not drawn at random: someone who fails by a few points and studies the weak areas does better on the second try than the average suggests, while someone who failed by a wide margin may do worse. The figures are right for a budget, not a forecast for one person, and your own odds may be better or worse.</p>
${h.box('A misleading comparison', '<p>A section with a higher pass rate is not necessarily easier. Pass rates depend on who chooses the section and how prepared they are, so the rate of a topic you pick says as much about the people who pick it as about the exam.</p>', 'info')}

<h2>CPA exam score release dates</h2>
<p>The AICPA posts its calendar on its score release page, linked in the sources below rather than copied. The three sections everyone takes can be sat all year and are scored a few weeks after the test. The three topics you pick from are given only in the first month of each quarter, with one release date late in that quarter. A failed section is known only on its release date, so the retake cannot be booked before then; for a section given once a quarter, it usually means waiting for the next quarter’s testing month. The AICPA also announces a different schedule from July 2027, when the exam moves to a new delivery platform.</p>

<h2>From odds to a budget</h2>
<p>Four sections passed the first time cost ${h.m(4 * fee)}. Once you have read the rates, decide how many sections you might take twice and type that number into the ${h.a('cpa-exam-cost', 'CPA cost calculator')}: it adds ${h.m2(fee)} for each, plus your state board’s fee where there is one. Like every CPA total on this site, it counts no retake until you type one.</p>
`;
  },
});
