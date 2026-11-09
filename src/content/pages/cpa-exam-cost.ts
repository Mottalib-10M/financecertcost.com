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
  resume: (h) => {
    const r = h.E.cpaTotal({ state: null, retakes: 0, prep: 0 });
    return `The Uniform CPA Examination has four sections: three Core sections that every candidate takes (Auditing and Attestation, AUD; Financial Accounting and Reporting, FAR; Taxation and Regulation, REG) and one Discipline section the candidate chooses among Business Analysis and Reporting (BAR), Information Systems and Controls (ISC) and Tax Compliance and Planning (TCP). Each section is paid separately, at the same price whichever Discipline you choose. As of ${h.date(h.P.cpa.sectionFeeFrom)}, the examination fee is ${h.m2(h.P.cpa.sectionFee)} per section, according to the Virginia Board of Accountancy, so four sections passed at the first sitting cost ${h.m(r.exams)} in exam fees alone. That is the CPA figure used across this site. A failed section is paid again at the same fee, so every retake adds ${h.m2(h.P.cpa.sectionFee)}, plus a board fee in some states. Pass rates for each section are published by the AICPA; the retakes counted here are the ones you type. State boards add application, eligibility and license fees on top, and the review course you buy is usually the largest line of all.`;
  },
  faqs: (h) => [
    { q: 'How much does each CPA exam section cost?', a: `${h.m2(h.P.cpa.sectionFee)} per section as of ${h.date(h.P.cpa.sectionFeeFrom)}, the amount the Virginia Board of Accountancy lists and that candidates pay to NASBA when a section is scheduled. Every board uses the same exam, but application and eligibility fees differ from state to state, so the price of a section is only part of what you pay.` },
    { q: 'Do I pay the section fee again if I fail?', a: `Yes. A failed section has to be paid and scheduled again, at the fee in force at the time. Some boards also charge for each new attempt: California charges a ${h.m(h.P.cpa.states.CA.examRepeat!)} repeat application fee, and Texas its eligibility fee for each section. The calculator counts both from the number of retakes you type.` },
    { q: 'Why are some state fees marked “ask the board”?', a: 'Because we could not confirm them on the board’s own site. Florida’s board site refused our requests, and the California license fee and some application fees elsewhere were not on the pages we read. Rather than guess, the line is left out of the total and marked “not counted: ask the board”, so you know to check it with the board before you budget.' },
    { q: 'Does the CPA calculator use pass rates?', a: `No. The AICPA publishes cumulative pass rates for each section, but its terms limit the use of its site to personal, non-commercial purposes, so this site links to them and copies no figure. Read them there, decide how many sections you might retake, and type that number: each one adds ${h.m2(h.P.cpa.sectionFee)} to the total.` },
  ],
  body: (h) => {
    const sec = ['AUD', 'FAR', 'REG', 'BAR', 'ISC', 'TCP'] as const;
    const rows = sec.map((s) => [`${s}, ${h.E.SECTION_NAME[s]}`, h.E.CORE.includes(s) ? 'Core, everyone' : 'Discipline, pick one', `${h.P.cpa.sectionHours} hours`, h.m2(h.P.cpa.sectionFee)]);
    // “$0” next to “ask the board” read as free (3rd round): no confirmed fee is said in words.
    const states = h.E.STATES.map((s) => { const r = h.E.cpaTotal({ state: s, retakes: 0, prep: 0 }); return [h.E.stateName(s), h.m(r.exams), r.boardKnown > 0 ? h.m(r.boardKnown) : 'none confirmed', h.m2(h.E.cpaRetakePrice(s)), r.unread.length ? r.unread.join('; ') : 'none']; });
    const first = h.E.cpaTotal({ state: null, retakes: 0, prep: 0 });
    return `
<h2>Section by section</h2>
<p>Each section is a ${h.P.cpa.sectionHours}-hour exam and costs the same. A sitting is one attempt at a section: you pay for three Core rows and one Discipline row, and again for any section you retake.</p>
${h.table(['Section', 'Part', 'Length', 'Fee for each try'], rows, `Section fee ${h.m2(h.P.cpa.sectionFee)}, the same in every state and paid to NASBA (the National Association of State Boards of Accountancy). NASBA’s site refused our requests, so the amount was read where the ${h.src('va_boa', 'Virginia Board of Accountancy')} lists it, on its fee page, on ${h.read}.`, ['l', 'l', 'r', 'r'])}
<p>Four tries, one per section, come to ${h.m(first.exams)}. Pass rates for each section are published by the AICPA on its ${h.src('aicpa_rates', 'scoring and pass rates page')}. If you expect to need a second try at one or two sections, type that number in the calculator: one retake brings the exam fees to ${h.m(h.E.cpaTotal({ state: null, retakes: 1, prep: 0 }).exams)}, two to ${h.m(h.E.cpaTotal({ state: null, retakes: 2, prep: 0 }).exams)}.</p>

<h2>What the five state boards add</h2>
<p>The exam is the same everywhere; the fees around it are not. The table counts the four sections passed the first time and adds only the board fees we read on the board’s own site or in its statute. The “One retake” line is what a retake costs in that state: the section fee again, plus the board’s fee for a new try where it charges one. The calculator starts with no state chosen, so its first total leaves board fees out.</p>
${h.table(['State', 'Section fees, first try', 'Board fees counted', 'One retake', 'Not counted: ask the board'], states, 'California Board of Accountancy, NYSED, Texas State Board of Public Accountancy, Pennsylvania State Board of Accountancy; Florida Statutes. Read on ' + h.read + '.', ['l', 'r', 'r', 'r', 'l'])}
<p>California charges ${h.m(h.P.cpa.states.CA.examFirst!)} for a first exam application and ${h.m(h.P.cpa.states.CA.examRepeat!)} for each repeat application. Texas charges ${h.m(h.P.cpa.states.TX.perSection)} per section in eligibility fees and ${h.m(h.P.cpa.states.TX.certificate)} to issue the certificate. New York’s licensure fee, which includes the first registration, is ${h.m(h.P.cpa.states.NY.license)}; Pennsylvania’s initial license is ${h.m(h.P.cpa.states.PA.license)}. The state pages, from ${h.a('cpa-requirements-california', 'California')} to ${h.a('cpa-requirements-pennsylvania', 'Pennsylvania')}, give the rules behind each figure.</p>

<h2>The lines you type: retakes and prep</h2>
<p>Two figures depend on you, and the calculator asks for both. The first is the number of sections you think you will retake. It starts at zero and the result says “Example” until you type it, because nobody can know it in advance: read the AICPA’s rates, weigh them against your own preparation, and set aside the fee for the sections you are least sure of. The second is the review course, which often costs more than all the exam fees together, with prices that vary widely between providers and packages. This site sells no course and loads no price. Type what you plan to spend, once, and the calculator adds it as it is. If you expect to buy more material for a retake, include it in the amount you type.</p>
${h.box('Same section fee in every state', `<p>The section fee is the same in every state. It is collected by NASBA (the National Association of State Boards of Accountancy), not by your board; we read the amount, ${h.m2(h.P.cpa.sectionFee)} as of ${h.date(h.P.cpa.sectionFeeFrom)}, on the Virginia board’s fee page, which lists it. If your board shows a different amount when you pay, the board’s figure is the one that counts.</p>`, 'warning')}

<h2>Compared with the other credentials</h2>
<p>At the first try, the CPA exam fees are close to the enrolled agent’s three SEE parts, set out on the ${h.a('enrolled-agent-exam', 'enrolled agent page')}, and well under the three CFA® exams, whose retakes the ${h.a('cfa-exam-cost', 'CFA® cost page')} counts from published pass rates. The ${h.a('home', 'comparator')} sets the six credentials side by side with the same CPA figure as the calculator above, ${h.m(first.exams)} for four sections passed the first time; type your retakes there too and it adds ${h.m2(h.P.cpa.sectionFee)} for each.</p>
<p>A last check before you budget: the fee schedule of your own board, which may differ from the five states shown here.</p>
`;
  },
});
