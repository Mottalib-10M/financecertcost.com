import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import * as E from '../../lib/engine/certs';
import { formatMoney } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cpa-exam-cost',
  group: 'cpa',
  order: 10,
  tool: { kind: 'mini:cpa-total' },
  related: ['cpa-exam-sections', 'cpa-exam-pass-rates', 'cpa-requirements', 'enrolled-agent-exam', 'cfa-exam-cost'],
  sources: ['va_boa', 'aicpa_exam', 'aicpa_rates', 'ca_cbt', 'tx_elig', 'ny_150', 'pa_snapshot'],
  slug: 'cpa-exam-cost',
  nav: 'CPA exam cost',
  card: 'Four section fees, the retakes you expect to pay and the state board fees we could read, in one total.',
  title: 'CPA Exam Cost 2026: Section Fees, Retakes and State Fees',
  description: 'CPA exam cost in 2026: the section fee paid to NASBA, what each retake adds, and the board fees of five states we could confirm, added up in one total.',
  h1: 'CPA exam cost: four sections, your retakes and your state board',
  intro: `The CPA (Certified Public Accountant) exam has four sections at ${formatMoney(P.cpa.sectionFee, 2)} each: ${$(E.cpaTotal({ state: null, retakes: 0, prep: 0 }).exams)} if all four pass the first time, before state board fees. Each section you retake is paid again. Type how many retakes you expect and pick your state to add its fees.`,
  avantOutil: (h) => `In Texas, California, New York, Florida or Pennsylvania? ${h.a('cpa-requirements', 'See your state’s rules')}. No college degree? ${h.a('enrolled-agent-exam', 'The enrolled agent, tax, asks for none')}.`,
  resume: (h) => {
    const r = h.E.cpaTotal({ state: null, retakes: 0, prep: 0 });
    return `The CPA exam (Uniform CPA Examination) has four sections: three that every candidate takes, on auditing, financial accounting and tax, and a fourth that the candidate picks among three topics: business analysis, information systems, or tax planning. Each section is paid separately, at the same price whichever fourth topic you pick. As of ${h.date(h.P.cpa.sectionFeeFrom)}, the fee is ${h.m2(h.P.cpa.sectionFee)} per section, the same in every state, so four sections passed at the first try cost ${h.m(r.exams)} in exam fees alone. That is the CPA figure used on every page of this site. A failed section is paid again at the same fee, so every retake adds ${h.m2(h.P.cpa.sectionFee)}, plus a board fee in some states. The accountants’ institute that writes the exam publishes a pass rate for each section; the retakes counted here are the ones you type. State boards add application and license fees on top, and the review course you buy is usually the largest line of all.`;
  },
  faqs: (h) => [
    { q: 'How much does each CPA exam section cost?', a: `${h.m2(h.P.cpa.sectionFee)} per section as of ${h.date(h.P.cpa.sectionFeeFrom)}, the amount the Virginia Board of Accountancy lists and that candidates pay when a section is scheduled. Every state uses the same exam, but application and license fees differ from state to state, so the section fee is only part of what you pay.` },
    { q: 'Do I pay the section fee again if I fail?', a: `Yes. A failed section has to be paid and scheduled again, at the fee in force at the time. Some boards also charge for each new try: California charges a ${h.m(h.P.cpa.states.CA.examRepeat!)} repeat application fee, and Texas its ${h.m(h.P.cpa.states.TX.perSection)} fee for each section. The calculator counts both from the number of retakes you type.` },
    { q: 'Does the CPA calculator use pass rates?', a: `No. The AICPA, the accountants’ institute that writes the exam, publishes a pass rate for each section, but its terms limit the use of its site to personal, non-commercial purposes, so this site links to them and copies no figure. Not sure how many retakes to type? Leave 0, then try 1: each one adds ${h.m2(h.P.cpa.sectionFee)}.` },
  ],
  body: (h) => {
    // “$0” next to “ask the board” read as free (3rd round): no confirmed fee is said in words.
    const states = h.E.STATES.map((s) => { const r = h.E.cpaTotal({ state: s, retakes: 0, prep: 0 }); return [h.E.stateName(s), h.m(r.exams + r.boardKnown), r.boardKnown > 0 ? h.m(r.boardKnown) : 'none confirmed', h.m2(h.E.cpaRetakePrice(s))]; });
    const first = h.E.cpaTotal({ state: null, retakes: 0, prep: 0 });
    return `
<h2>CPA exam cost in five states</h2>
<p>The exam and its section fee are the same everywhere; the state board fees around it are not. The table counts the four sections passed the first time and adds only the board fees we read on the board’s own site.</p>
${h.table(['State', 'Total, first try', 'Board fees counted', 'One retake costs'], states, 'Section fee as listed by the Virginia Board of Accountancy; board fees from each board’s site or statute. Fees a board does not publish are not counted.', ['l', 'r', 'r', 'r'])}
<p>What the boards charge: California ${h.m(h.P.cpa.states.CA.examFirst!)} for a first exam application and ${h.m(h.P.cpa.states.CA.examRepeat!)} for each repeat; Texas ${h.m(h.P.cpa.states.TX.perSection)} for each section applied for and ${h.m(h.P.cpa.states.TX.certificate)} for the certificate; New York ${h.m(h.P.cpa.states.NY.license)} for the license and first registration; Pennsylvania ${h.m(h.P.cpa.states.PA.license)} for the first license. Florida’s board fees could not be confirmed on its own site.</p>
${h.box('Same section fee in every state', `<p>The section fee is collected by the national association of state boards (NASBA), not by your board. We read the amount, ${h.m2(h.P.cpa.sectionFee)} as of ${h.date(h.P.cpa.sectionFeeFrom)}, on the Virginia board’s fee page, which lists it. If your board shows a different amount when you pay, the board’s figure is the one that counts.</p>`, 'warning')}
<p>Each state page, from ${h.a('cpa-requirements-california', 'California')} to ${h.a('cpa-requirements-pennsylvania', 'Pennsylvania')}, lists the fees we could not confirm. In another state, check your board’s fee page before you budget.</p>

<h2>The two lines you type: retakes and review course</h2>
<p>The calculator starts at zero retakes and shows “Starting point” until you type a number, because nobody can know it in advance. Not sure? Type 1, then 2: one retake brings the exam fees to ${h.m(h.E.cpaTotal({ state: null, retakes: 1, prep: 0 }).exams)}, two to ${h.m(h.E.cpaTotal({ state: null, retakes: 2, prep: 0 }).exams)}. The review course often costs more than all the exam fees together. This site sells none and loads no price: pick the rough guess in the calculator, as much as the exam fees, or type your own amount. If you expect to buy more material for a retake, include it in the amount you type.</p>

<h2>Compared with the other credentials</h2>
<p>At the first try, the CPA exam fees, ${h.m(first.exams)}, are close to the three parts of the IRS exam for an ${h.a('enrolled-agent-exam', 'enrolled agent')}, which asks for no college degree, and well under the three CFA® exams, about ${h.m(h.E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).exams)} with the usual retakes on the ${h.a('cfa-exam-cost', 'CFA® cost page')}. A last check before you budget: the fee schedule of your own board, which may differ from the five states shown here.</p>
`;
  },
});
