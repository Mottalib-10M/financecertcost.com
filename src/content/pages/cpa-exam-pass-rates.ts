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
  intro: 'CPA exam pass rates, section by section, and score release dates are published by the AICPA (American Institute of Certified Public Accountants), which writes the exam. Its terms do not let this site copy the rates: read yours there, type it here.',
  avantOutil: (h) => `${h.src('aicpa_rates', 'Open the AICPA pass-rate page ↗')}, find your section’s rate, type it below.`,
  resume: (h) => `The AICPA (American Institute of Certified Public Accountants), which writes the Uniform CPA Examination, publishes cumulative pass rates for each of the six sections (you sit four: the three Core sections and one Discipline of your choice) on its scoring and pass rates page, updated as each quarter’s scores are released. This site does not reproduce them: the AICPA’s terms limit the use of its site to personal, non-commercial purposes, so the page is linked and no figure is copied. A pass rate is the share of all sittings in the period that scored 75 or more, counting first attempts and retakes together. It converts directly into money, because every sitting costs the same section fee, ${h.m2(h.P.cpa.sectionFee)} as of ${h.date(h.P.cpa.sectionFeeFrom)}: a section passed by half of its candidates takes two sittings on average, so about ${h.m(2 * h.P.cpa.sectionFee)} in fees. The tool above does that arithmetic for the rate you type, and the cost calculator adds the retakes you expect to the four section fees.`,
  faqs: (h) => [
    { q: 'What score do I need to pass a CPA exam section?', a: 'A scaled score of 75 on a scale of 0 to 99. The score is not a percentage of correct answers: the AICPA converts results to its scale, weighting questions by difficulty and format. A pass rate is the share of candidates who reached 75 in the period.' },
    { q: 'Are CPA pass rates for first-time candidates published?', a: 'Not on the AICPA page this site links to. Its cumulative figures pool everyone who sat a section in the period, first attempt or retake. Rates for first-timers that circulate elsewhere come from other sources, often a review provider, and are not repeated here.' },
    { q: 'How many times can I fail a CPA section?', a: 'The pages this site read give no cap on attempts; ask your state board if you are unsure. In practice, time is the limit: each board sets how long a passed section stays valid while you finish the others, and each new attempt is a new fee. The tool shows how the odds build up over the tries you budget for.' },
    { q: 'When are CPA exam scores released?', a: 'On target dates the AICPA posts on its score release page, and which it says may change. Core sections are scored on a rolling basis through the year, usually a few weeks after the AICPA receives the exam file from Prometric, the company that runs the test centers. Discipline sections, given only in the first month of each quarter, have one target release date per quarter, late in that quarter.' },
    { q: 'Why does this site not show the CPA pass rates?', a: `Because the AICPA’s terms of use limit its material to personal, non-commercial use, and a site published by a company is not a personal use. The figures stay one click away on the AICPA’s own page, which also gives the quarterly detail. Every other number used here, such as the ${h.m2(h.P.cpa.sectionFee)} section fee, comes from a page whose use is not restricted.` },
  ],
  body: (h) => {
    const fee = h.P.cpa.sectionFee;
    const ex = [0.35, 0.45, 0.6, 0.7].map((p) => [h.pc(p, 0), h.num2(h.E.expectedSittings(p)), h.m(fee * h.E.expectedSittings(p)), h.pc(h.E.passWithin(p, 2)), h.pc(h.E.passWithin(p, 3))]);
    return `
<h2>Where the rates are published</h2>
<p>Pass rates are published by the AICPA on its ${h.src('aicpa_rates', 'CPA Exam scoring and pass rates page')}: a cumulative figure for each of the six sections (you sit four: the three Core sections, Auditing (AUD), Financial Accounting (FAR) and Taxation and Regulation (REG), plus one of the three Disciplines, Business Analysis (BAR), Information Systems (ISC) or Tax Compliance (TCP)), for the current year to date and for past years, with the quarterly detail. Open it next to this page and type the rate of the section you are planning for into the tool above.</p>
<p>The CPA totals elsewhere on this site count no retake on their own: you type the number of sections you expect to retake, after reading the rates there.</p>

<h2>CPA exam score release dates</h2>
<p>The AICPA posts its calendar on its ${h.src('aicpa_scores', 'score release dates page')}: target dates, which it says can change, linked here rather than copied. Two rules explain it. The three Core sections (AUD, FAR and REG) can be taken all year and are scored on a rolling basis: the target date depends on the day the AICPA receives your exam file from Prometric, the company that runs the test centers, so a score usually arrives a few weeks after the test. The three Discipline sections (BAR, ISC and TCP) are given only in the first month of each quarter, and each of those testing months has one target release date, late in the same quarter.</p>
<p>The calendar matters for the budget too. A failed section is known only on its release date, so the retake cannot be booked before then; for a Discipline section, it usually means waiting for the next quarter’s testing month. The AICPA also announces a different schedule from July 2027, when the exam moves to a new delivery platform, with one release date for each testing period.</p>

<h2>From a rate to tries and fees</h2>
<p>In plain words: at a 45% pass rate, an average candidate needs about 2 tries, and about 7 in 10 have passed within two tries. At 70%, most pass at the first or second try. Each try costs the section fee, ${h.m2(fee)}. The table shows the same arithmetic for round example rates; they are illustrations, not AICPA figures.</p>
${h.table(['Example rate', 'Average tries', 'Average fees, one section', 'Passed within two', 'Passed within three'], ex, `Example rates chosen by this site, not published figures. Section fee ${h.m2(fee)}, the same in every state, as listed by the ${h.src('va_boa', 'Virginia Board of Accountancy')}, read on ${h.read}.`, ['r', 'r', 'r', 'r', 'r'])}
<p>Real candidates are not independent draws: someone who fails by a few points and studies the weak areas does better on the second try than the pooled rate suggests, while someone who failed by a wide margin may do worse. The figures are the right ones for a budget, not a forecast for one person.</p>
${h.box('A misleading comparison', '<p>A section with a higher pass rate is not necessarily easier. Pass rates depend on who chooses the section and how prepared they are, so the rate of a Discipline says as much about the people who pick it as about the exam.</p>', 'info')}

<h2>From odds to a budget</h2>
<p>Every sitting costs a section fee, ${h.m2(fee)} as of ${h.date(h.P.cpa.sectionFeeFrom)}, so four sections passed the first time cost ${h.m(4 * fee)}. Once you have read the rates, decide how many sections you might have to take twice and type that number into the ${h.a('cpa-exam-cost', 'cost calculator')}: it adds ${h.m2(fee)} for each, plus your state board’s fee for a new try where there is one. The ${h.a('cpa-exam-sections', 'sections page')} explains what the six sections cover. For the other finance exams, whose bodies publish rates this site can use, see the ${h.a('cfa-pass-rates', 'CFA® pass rates')} by session.</p>
<h2>Using the rates to plan an order</h2>
<p>Because the sections are paid and scheduled one at a time, the pass rates can help decide where to start. One approach is to begin with a section close to your recent coursework, to bank a pass early; another is to start with the section whose rate is the lowest, so that a retake has time to fit within your board’s credit window. The rates do not settle that choice, but they show which sections carry the most risk of a second fee.</p>
`;
  },
});
