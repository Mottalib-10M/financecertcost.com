import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpa-requirements',
  group: 'cpa',
  order: 40,
  tool: { kind: 'mini:cpa-eligibility' },
  related: ['cpa-requirements-new-york', 'cpa-requirements-texas', 'cpa-requirements-california', 'cpa-exam-cost'],
  sources: ['ny_120', 'ny_150', 'tx_cert', 'ca_ab1175', 'pa_snapshot', 'fl_308', 'fl_sb364'],
  slug: 'cpa-requirements',
  nav: 'CPA requirements by state',
  card: '120 or 150 hours, one or two years of experience: which licensure route five states open to you, and from when.',
  title: 'CPA Requirements by State: 120 or 150 Hours, With Dates',
  description: 'CPA requirements in California, Florida, New York, Texas and Pennsylvania: the 120-hour and 150-hour routes, the experience each needs and the date it opens.',
  h1: 'CPA requirements: the 120-hour and 150-hour routes, state by state',
  intro: 'In the five states covered here, the classic route to a CPA (certified public accountant) license is 150 college semester hours and one year of experience. New York, Texas and Pennsylvania, and California from 2027, also accept 120 hours, usually a bachelor’s degree, with two years. Type your hours and experience to see which route you fit.',
  resume: (h) => {
    const S = h.P.cpa.states;
    return `For decades, almost every state required 150 semester hours of education for a CPA license, a fifth year of study beyond a bachelor’s degree. That is changing state by state, through a second route that accepts 120 hours, usually a bachelor’s degree, in exchange for a second year of experience. Of the five states this site follows, Texas opened its Pathway B on ${h.date(S.TX.next.from)}, New York opens its 120-hour pathway on ${h.date(S.NY.next.from)}, and California’s new rules take effect on ${h.date(S.CA.next.from)}, when the 150-unit requirement is removed. Pennsylvania already licenses candidates with fewer than 150 credits who complete ${h.num(S.PA.next.expHours)} hours of experience. Florida still requires 150 hours for the license; a 2026 bill that would have changed that died in the legislature on ${h.date(S.FL.billDied)}. The tool reads these dates against the date you plan to apply.`;
  },
  faqs: (h) => [
    { q: 'Can I sit for the CPA exam with 120 credit hours?', a: `In the five states this site follows, yes. Florida law lets a candidate sit with ${h.P.cpa.states.FL.sitHours} semester hours, Pennsylvania with ${h.P.cpa.states.PA.sitCredits} credits including ${h.P.cpa.states.PA.sitAccounting} in accounting, and California with a bachelor’s degree and the required accounting and business units. The question that changed in 2026 is the license, not the exam.` },
    { q: 'Do I need 150 hours to become a CPA?', a: 'Not everywhere any more. Texas, New York and California have added or are adding a route with 120 hours and two years of experience, and Pennsylvania licenses candidates below 150 credits with twice the experience. Florida is the exception among the five: its statute still requires 150 hours for licensure.' },
    { q: 'Does the 120-hour route cost less?', a: 'In tuition, usually, since it saves a fifth year of study. In time, it costs a second year of supervised experience before the license. The exam fees and pass rates are the same on both routes, so the CPA exam cost page applies unchanged.' },
  ],
  body: (h) => {
    const S = h.P.cpa.states;
    const rows = [
      ['California', S.CA.sitUnits, `150 units and 1 year until ${h.date('2026-12-31')}; from ${h.date(S.CA.next.from)}, ${S.CA.next.rule}, and 2 years`, h.a('cpa-requirements-california', 'California rules')],
      ['Florida', `${S.FL.sitHours} semester hours`, '150 semester hours and 1 year', h.a('cpa-requirements-florida', 'Florida rules')],
      ['New York', 'see NYSED', `150 hours and 1 year; or, from ${h.date(S.NY.next.from)}, 120 hours and 2 years`, h.a('cpa-requirements-new-york', 'New York rules')],
      ['Texas', 'see TSBPA', `Pathway A: 150 hours and ${S.TX.now.expMonths} months; Pathway B from ${h.date(S.TX.next.from)}: 120 hours and ${S.TX.next.expMonths} months`, h.a('cpa-requirements-texas', 'Texas rules')],
      ['Pennsylvania', `${S.PA.sitCredits} credits, ${S.PA.sitAccounting} in accounting`, `150 credits and ${h.num(S.PA.now.expHours)} hours over ${S.PA.now.expMonths} months; or fewer than 150 and ${h.num(S.PA.next.expHours)} hours over ${S.PA.next.expMonths} months`, h.a('cpa-requirements-pennsylvania', 'Pennsylvania rules')],
    ];
    return `
<h2>CPA requirements in five states, side by side</h2>
${h.table(['State', 'To sit for the exam', 'For the license', 'Detail'], rows, `State boards and statutes, read on ${h.read}.`, ['l', 'l', 'l', 'l'])}
<p>Each row summarizes the board’s own page or the statute, linked from the state’s page on this site. Hours are semester hours (credits); each state also sets how many must be in accounting and in business subjects, and what experience counts.</p>

<h2>Dates matter: when you apply decides the rule</h2>
<p>A route is open from the date the law or the board sets, and some old routes close. New York’s 150-hour pathway under its current content rules runs until August 1, 2027; after that date, the 150-hour route follows the content of the “150E” pathway, according to ${h.src('ny_150', 'NYSED')}. California’s current rules end on December 31, 2026. That is why the tool asks when you will apply for the license, not only what you have done.</p>
${h.box('Exam credit is not a license', '<p>Passing the four sections does not make you a CPA. The license comes from the state board once education, exam and experience are all met, and each board sets how long passed sections remain valid while you complete the rest.</p>', 'warning')}

<h2>From the route to the budget</h2>
<p>The route you take changes the calendar more than the fees. Exam fees are the same on both routes, and the board fees shown on each state page do not depend on the number of credit hours. What differs is the cost of the extra education on the 150-hour route, which this site does not price, and the extra year of work before the license on the 120-hour route. A candidate weighing the two can price the coursework with their school and compare it with what a year’s delay in licensure means for them. The ${h.a('cpa-exam-cost', 'exam cost calculator')} then adds the part both routes share.</p>
<p>A CPA licensed in one state who wants to practice in another deals with mobility and reciprocity rules, which vary and are not covered here. This page and its tool are for a first license.</p>
<p>The 150-hour rule was meant to deepen the education of new CPAs. The case against it is the cost of a fifth year of study. The California Board of Accountancy’s ${h.src('ca_ab1175', 'March 2026 release')} describes the 150 total-unit requirement as one that “often necessitated a fifth year of school, viewed by many as a barrier to entry.” The trade-off adopted in most states is the same: drop the extra 30 hours and require a second year of experience.</p>
`;
  },
});
