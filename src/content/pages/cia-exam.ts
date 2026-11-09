import { definePage } from '../../lib/guide-types';
import * as E from '../../lib/engine/certs';
import { formatMoney, formatNumber } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cia-exam',
  group: 'more',
  order: 20,
  tool: { kind: 'mini:cia-total' },
  related: ['frm-exam', 'enrolled-agent-exam', 'home'],
  sources: ['iia_cia', 'iia_2027'],
  slug: 'cia-exam-cost',
  nav: 'CIA exam cost',
  card: 'Application and three exam parts at member and non-member prices, for 2026 and from January 4, 2027.',
  title: 'CIA Exam Cost: 2026 Fees and the New 2027 Price List',
  description: 'CIA exam cost for members and non-members of The IIA: the application and the three parts at 2026 prices and from January 4, 2027, with retakes and prep added.',
  h1: 'CIA exam cost: member and non-member, 2026 and 2027',
  intro: `If each of the three parts is passed the first time, the CIA (Certified Internal Auditor) costs ${$(E.ciaTotal({ member: true, year: '2026', extraSittings: 0, prep: 0 }).total)} in fees at 2026 prices for a member of The Institute of Internal Auditors (The IIA) and ${$(E.ciaTotal({ member: false, year: '2026', extraSittings: 0, prep: 0 }).total)} for a non-member. Add retakes and prep below.`,
  resume: (h) => {
    const a = h.P.cia.y2026, b = h.P.cia.y2027;
    const tot = (t: typeof a, k: 0 | 1) => t.application[k] + t.p1[k] + t.p2[k] + t.p3[k];
    return `The Certified Internal Auditor (CIA) designation is granted by The Institute of Internal Auditors (The IIA). Candidates pay an application fee and then a fee for each of the three exam parts, and both depend on IIA membership. At 2026 prices, a member pays ${h.m(a.application[0])} to apply, ${h.m(a.p1[0])} for Part 1 and ${h.m(a.p2[0])} for each of Parts 2 and 3, ${h.m(tot(a, 0))} in all; a non-member pays ${h.m(tot(a, 1))}. The IIA’s 2027 price list applies from ${h.date(b.from)}: ${h.m(tot(b, 0))} for a member and ${h.m(tot(b, 1))} for a non-member, so the member total rises while the non-member application fee falls. Candidates have ${h.P.cia.eligibilityYears} years from acceptance into the program to complete it. This site could not read a pass rate per part on The IIA’s pages, so retakes are entered by hand.`;
  },
  faqs: (h) => [
    { q: 'How much does the CIA exam cost in 2027?', a: `From ${h.date(h.P.cia.y2027.from)}, The IIA lists ${h.m(h.P.cia.y2027.application[0])} to apply for members and ${h.m(h.P.cia.y2027.application[1])} for non-members, ${h.m(h.P.cia.y2027.p1[0])} or ${h.m(h.P.cia.y2027.p1[1])} for Part 1, and ${h.m(h.P.cia.y2027.p2[0])} or ${h.m(h.P.cia.y2027.p2[1])} for each of Parts 2 and 3. The member total rises, the non-member application falls.` },
    { q: 'Is IIA membership worth it for the CIA exam?', a: `On exam fees alone, membership saves ${h.m((h.P.cia.y2026.application[1] + h.P.cia.y2026.p1[1] + h.P.cia.y2026.p2[1] + h.P.cia.y2026.p3[1]) - (h.P.cia.y2026.application[0] + h.P.cia.y2026.p1[0] + h.P.cia.y2026.p2[0] + h.P.cia.y2026.p3[0]))} at 2026 prices. Whether it pays depends on the membership dues where you join, which this site has not read; compare the two before you apply, and count any retakes, since each part also costs less for a member.` },
    { q: 'How long do I have to pass the CIA exam?', a: `The IIA gives candidates ${h.P.cia.eligibilityYears} years from acceptance into the CIA program to complete the program requirements. A part you retake is paid again, so plan the order of the parts and leave room for a retake well inside that period rather than at its end.` },
  ],
  body: (h) => {
    const a = h.P.cia.y2026, b = h.P.cia.y2027;
    const rows = [['Application', a.application, b.application], ['Part 1', a.p1, b.p1], ['Part 2', a.p2, b.p2], ['Part 3', a.p3, b.p3]].map(([l, x, y]) => [l as string, h.m((x as number[])[0]), h.m((x as number[])[1]), h.m((y as number[])[0]), h.m((y as number[])[1])]);
    return `
<h2>The two price lists</h2>
${h.table(['Fee', 'Member, 2026', 'Non-member, 2026', `Member, from ${h.date(b.from)}`, `Non-member, from ${h.date(b.from)}`], rows, `${h.src('iia_cia', 'The IIA, CIA program')} and ${h.src('iia_2027', 'certification pricing for 2027')}, read on ${h.read}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The change of ${h.date(b.from)} raises every member price and every non-member exam part, but lowers the non-member application from ${h.m(a.application[1])} to ${h.m(b.application[1])}.</p>

<h2>What retakes add to the exam cost</h2>
<p>Each part retaken is paid again. The calculator values a retake at the average of the three part fees in the price list you chose, since you may not know in advance which part you will need to retake. We could not read part-by-part pass rates on The IIA’s pages, so the calculator does not assume any; type the number of retakes you want to plan for.</p>

<h2>What the CIA covers</h2>
<p>The CIA is the IIA’s designation for internal auditors. Its three parts move from the essentials of internal auditing to the practice of engagements and to business knowledge. The IIA publishes the syllabus of each part; this site does not summarize it because it changes with the program and the IIA’s outline is the reference.</p>
${h.box('Dates in the totals', `<p>If your plans span ${h.date(b.from)}, run the calculator with both price lists, and check with The IIA which one applies to each payment.</p>`, 'tip')}

<h2>Compared with the other credentials</h2>
<p>A CIA candidate who is an IIA member and passes each part at the first try spends less in exam fees than on any other credential on this site. The first-try floors of the CPA exam, the CFP® exam and the ${h.a('enrolled-agent-exam', 'enrolled agent route')} are close behind. The ${h.a('frm-exam', 'FRM')}, the other risk-focused designation here, costs more per part. The ${h.a('home', 'comparator')} sets them side by side.</p>
<h2>Member or non-member: the arithmetic</h2>
<p>At 2026 prices, the gap between the member and non-member totals for the application and three parts is ${h.m((a.application[1] + a.p1[1] + a.p2[1] + a.p3[1]) - (a.application[0] + a.p1[0] + a.p2[0] + a.p3[0]))}. On the 2027 list it is ${h.m((b.application[1] + b.p1[1] + b.p2[1] + b.p3[1]) - (b.application[0] + b.p1[0] + b.p2[0] + b.p3[0]))}, because member prices rise more than non-member prices. Each retake widens the gap again, since every part costs less for a member. Membership dues are set by The IIA and by its local institutes and were not read for this site, so the calculator cannot tell you whether joining pays: subtract the dues you would pay over your exam period from the gap, and the sign of the result is the answer.</p>
<p>The ${h.P.cia.eligibilityYears} years from acceptance are the other constraint. A candidate who needs several retakes should leave room for them inside that period, and price each one at the list in force at the time.</p>
`;
  },
});
