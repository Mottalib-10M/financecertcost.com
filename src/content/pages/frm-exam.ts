import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'frm-exam',
  group: 'more',
  order: 30,
  tool: { kind: 'mini:frm-total' },
  related: ['cfa-exam-cost', 'cia-exam', 'home'],
  sources: ['garp_fees', 'cfa_program'],
  slug: 'frm-exam-cost',
  nav: 'FRM® exam cost',
  card: 'One-time enrollment, Part I and Part II at early or standard prices, and the 2027 windows with their deadlines.',
  title: 'FRM® Exam Cost 2027: Enrollment, Parts and Deadlines',
  description: 'FRM® exam cost for 2027: the one-time $400 enrollment, $600 early or $800 standard per part, the May, August and November windows and their deadlines.',
  h1: 'FRM® exam cost: enrollment, two parts and the 2027 windows',
  intro: `If both parts are passed the first time, the FRM® (Financial Risk Manager) costs ${$(P.frm.enrollment + 2 * P.frm.early)} with early registration and ${$(P.frm.enrollment + 2 * P.frm.standard)} at standard prices, the ${$(P.frm.enrollment)} one-time enrollment included. Add retakes and prep below.`,
  resume: (h) => {
    const F = h.P.frm; const S = F.sessions;
    return `The Financial Risk Manager (FRM®) designation is awarded by GARP, the Global Association of Risk Professionals, to candidates who pass two exams, Part I and Part II, and meet its experience requirement. The fees are simple. A new candidate pays a one-time enrollment fee of ${h.m(F.enrollment)}, then ${h.m(F.early)} per part with early registration or ${h.m(F.standard)} with standard registration, the same for both parts. Passing each part at the first try therefore costs ${h.m(F.enrollment + 2 * F.early)} with early registration and ${h.m(F.enrollment + 2 * F.standard)} with standard. For 2027, GARP lists three windows: ${S.map((s) => s.p1.split(',')[0]).join(', ')} for Part I. Early registration for May 2027 runs to ${S[0].early}, for August to ${S[1].early} and for November to ${S[2].early}. GARP’s pass rates were not read for this site, so retakes are entered by hand in the calculator.`;
  },
  faqs: (h) => [
    { q: 'How much does the FRM® exam cost?', a: `${h.m(h.P.frm.enrollment)} once to enroll, then ${h.m(h.P.frm.early)} per part with early registration or ${h.m(h.P.frm.standard)} with standard registration, according to GARP. Both parts at the first try cost ${h.m(h.P.frm.enrollment + 2 * h.P.frm.early)} to ${h.m(h.P.frm.enrollment + 2 * h.P.frm.standard)} in total, depending on how early you register for each part.` },
    { q: 'Can I take FRM® Part I and Part II in the same window?', a: `GARP’s August 2027 window lists Part I and Part II on the same days, Part I in the morning and Part II in the afternoon, which lets a candidate sit both. Check GARP’s rules on grading when both parts are taken together before you plan on it.` },
    { q: 'Do I pay the FRM® enrollment fee again for a retake?', a: 'The enrollment fee is described by GARP as one-time. A retake is paid at the exam registration fee of the window you choose, early or standard. Read GARP’s fees page for the conditions attached to enrollment if your plan stretches over several years.' },
  ],
  body: (h) => {
    const F = h.P.frm;
    const rows = F.sessions.map((s) => [s.id.replace(/^(\d{4})-(\d{2})$/, (_m, y, mo) => `${h.mn(Number(mo))} ${y}`), s.p1, s.p2, `until ${s.early}`, `until ${s.standard}`]);
    const ret = [0, 1, 2].map((n) => [`${n} retake${n === 1 ? '' : 's'}`, h.m(h.E.frmTotal({ window: 'early', extraSittings: n, prep: 0 }).total), h.m(h.E.frmTotal({ window: 'standard', extraSittings: n, prep: 0 }).total)]);
    return `
<h2>The 2027 windows</h2>
${h.table(['Window', 'Part I', 'Part II', 'Early registration', 'Standard registration'], rows, `${h.src('garp_fees', 'GARP, FRM® exam fees and payments')}, read on ${h.read}. Each deadline is the last one before the window.`, ['l', 'l', 'l', 'l', 'l'])}
<p>The difference between early and standard is ${h.m(F.standard - F.early)} per part. Over two parts, registering early saves ${h.m(2 * (F.standard - F.early))}.</p>

<h2>Exam cost totals with retakes</h2>
${h.table(['Plan', 'Early registration', 'Standard registration'], ret, 'Enrollment plus two parts plus retakes at the same registration price.', ['l', 'r', 'r'])}
<p>Retakes are valued at the same price as the first sitting. GARP’s pass rates were not read for this site, so the calculator does not infer a number of retakes from them.</p>

<h2>FRM® or CFA® Program?</h2>
<p>The two are often weighed against each other by people in risk and investment roles. In fees, the FRM® is lighter: two exams instead of three, and ${h.m(F.enrollment + 2 * F.early)} at the first try with early registration against ${h.m(h.P.cfa.programTotal.low)} for the three CFA® levels. The ${h.a('cfa-exam-cost', 'CFA® exam cost')} calculator adds the CFA® retakes, which the published pass rates make likely.</p>
${h.box('Not in the total', '<p>GARP membership, the cost of the experience requirement and any travel to a test center are not included. Only fees read on GARP’s fees page are.</p>', 'info')}

<h2>Prep</h2>
<p>Type what you will spend on books, a course or practice exams, once. This site sells none and does not list prices. If you budget a retake, decide whether your materials would carry over and adjust the amount you type.</p>
<p>The ${h.a('cia-exam', 'CIA')} is the other professional designation on this site with a clear price list, and the ${h.a('home', 'comparator')} sets all six side by side.</p>
<h2>Early registration, window by window</h2>
<p>The early deadlines come months before each window: ${F.sessions[0].early} for May 2027, ${F.sessions[1].early} for August and ${F.sessions[2].early} for November. Standard registration then runs to ${F.sessions[0].standard}, ${F.sessions[1].standard} and ${F.sessions[2].standard}. A candidate who decides late pays ${h.m(F.standard - F.early)} more per part. Over a plan of two parts and one retake, the difference between always registering early and always registering late is ${h.m(3 * (F.standard - F.early))}, on top of an exam bill that is otherwise fixed.</p>
<h2>One window or two</h2>
<p>In May and November 2027 the two parts fall on different days of the same window; in August they share the same days, morning and afternoon. Sitting both in one window saves time but not money: each part is paid at its own registration fee. Whether both parts are graded when they are taken together is a matter for GARP’s own rules, which this site has not read; check them before paying for both in one window.</p>
<p>Whatever plan you choose, the enrollment fee is paid once, so it weighs less the more parts you sit.</p>
`;
  },
});
