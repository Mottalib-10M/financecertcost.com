import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const months = (l: number[]) => { const n = l.map((x) => MONTHS[x - 1]); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0]; };

export default definePage({
  id: 'cfa-exam-dates',
  group: 'cfa',
  order: 40,
  tool: { kind: 'mini:cfa-plan' },
  related: ['cfa-exam-cost', 'cfa-level-1', 'cfa-pass-rates'],
  sources: ['cfa_results', 'cfa_policies', 'cfa_exam', 'cfa_pricing'],
  slug: 'cfa-exam-dates',
  nav: 'CFA® exam dates',
  card: 'Which months each level is offered, the fastest path to Level III and the earliest retake after a fail.',
  title: 'CFA® Exam Dates: Windows by Level and the Fastest Path',
  description: 'CFA® exam dates by level: the months Levels I, II and III are offered, the fastest calendar from your first window to Level III, and the earliest retake.',
  h1: 'CFA® exam dates: which month for which level',
  intro: `The CFA® (Chartered Financial Analyst®) Program has three exams. Level I is offered in ${months(P.cfa.offered.l1)}, Level II in ${months(P.cfa.offered.l2)}, Level III in ${months(P.cfa.offered.l3)}. Pick your Level I window and the gap you need between exams to see the earliest date for each level.`,
  resume: (h) => {
    const o = h.P.cfa.offered; const list = (a: number[]) => a.map(h.mn).join(', ');
    return `CFA® Program exams are held in testing windows rather than on a single day. In the sessions recorded by CFA Institute from 2024 to 2026, Level I was offered in ${list(o.l1)}; Level II in ${list(o.l2)}; and Level III only in ${list(o.l3)}. Because Level III has just two windows, it sets the pace of the whole program: a candidate who passes Level I in February and Level II in May can reach Level III in August of the same year, while a May or August start pushes Level III into the year after. Retakes slow things down. A failed level cannot be retaken in the next window: CFA Institute requires more than six months between attempts at the same level, and allows at most ${h.P.cfa.maxPerYear} attempts at it in a calendar year. The exact days inside each window are set by CFA Institute for each year and are not listed here.`;
  },
  faqs: (h) => [
    { q: 'How fast can I finish all three CFA® levels?', a: 'On the windows of 2024 to 2026, a candidate who sits Level I in February, Level II in May and Level III in August can complete the exams within one calendar year, if each is passed the first time and registration deadlines allow it. Results take five to nine weeks, so check that the next registration is still open when your result arrives.' },
    { q: 'When can I retake a CFA® level I failed?', a: `In the first window offering that level more than six months after the failed one. For Level I, a February fail points to November and a November fail to August. For Level III, offered only in ${h.P.cfa.offered.l3.map(h.mn).join(' and ')}, a retake comes a full year later. The tool gives the retake month for your own Level I window.` },
    { q: 'Are the exact CFA® exam days listed on this page?', a: 'No. CFA Institute schedules the days of each window for each exam year and candidates book a seat at a test center inside it. This page works with the months, which are stable, and leaves the days to CFA Institute’s own calendar, which is the only one that binds the exam.' },
  ],
  body: (h) => {
    const o = h.P.cfa.offered;
    const grid = [2, 5, 8, 11].map((mo) => [h.mn(mo), o.l1.includes(mo) ? 'Level I' : 'not held', o.l2.includes(mo) ? 'Level II' : 'not held', o.l3.includes(mo) ? 'Level III' : 'not held']);
    const paths = o.l1.map((mo) => { const p = h.E.cfaFastestPath(mo, 2027, 3); const r = h.E.cfaNextRetake(mo, 'l1'); return [`${h.mn(mo)} 2027`, `${h.mn(p[1].month)} ${p[1].year}`, `${h.mn(p[2].month)} ${p[2].year}`, `${h.mn(r.month)} ${2027 + r.yearsAhead}`]; });
    return `
<h2>The calendar of exam dates, window by window</h2>
${h.table(['Month', 'Level I', 'Level II', 'Level III'], grid, `Windows held in 2024 to 2026, from the ${h.src('cfa_results', 'CFA Institute results file')}.`, ['l', 'l', 'l', 'l'])}
<p>This grid is drawn from the sessions that actually took place, not from an announcement of future dates. CFA Institute can change the windows for a future year; the registration page for your exam is the reference once you book.</p>

<h2>The fastest path from each Level I window</h2>
<p>Assuming each level is passed the first time and three months are enough between two exams to get the result and register again, the earliest calendars look like this.</p>
${h.table(['Level I', 'Level II', 'Level III', 'Level I retake if failed'], paths, 'Computed from the windows above and the retake rule of CFA Institute’s policies.', ['l', 'l', 'l', 'l'])}
<p>Starting in February or November leads to the same August Level III, because Level III has only two windows. Starting in May or August pushes Level III into the following year. If you want breathing room between exams, raise the gap in the tool: a gap of six months, for example, turns a February start into a three-year path.</p>

<h2>Timing and money</h2>
<p>Exam dates also fix what you pay. Every window has an early and a standard registration deadline; registering early saves ${h.m(h.P.cfa.fees.l1.standard - h.P.cfa.fees.l1.early)} per exam on the prices of the ${h.src('cfa_pricing', 'December 2024 announcement')}. A candidate who aims at the fastest path has less time to register early for the next level, since results arrive ${h.P.cfa.resultsWeeks.min} to ${h.P.cfa.resultsWeeks.max} weeks after the window. Moving a booked exam to another window, where it is allowed, costs ${h.m(h.P.cfa.reschedule)}.</p>
${h.box('Retakes in the same year', `<p>The ${h.src('cfa_policies', 'policies')} say a level can be retaken at most ${h.P.cfa.maxPerYear} times in a calendar year, never in consecutive windows and never in windows six months or less apart, and at most ${h.P.cfa.maxAttemptsPerLevel} times in all. For Level I, offered four times a year, the six-month rule is the one that bites: it rules out the next window and usually the one after.</p>`, 'warning')}
<p>For the fee of each window, see the ${h.a('cfa-exam-cost', 'CFA® exam cost')} page; for the rates that decide how many windows you are likely to need, the ${h.a('cfa-pass-rates', 'pass rates by session')}.</p>
<p>Put the windows and the fees together and the program becomes a payment schedule. On the fastest path from a February start, three registrations fall within about six months, ${h.m(h.P.cfa.fees.l1.early + h.P.cfa.fees.l2.early + h.P.cfa.fees.l3.early)} at early prices. On a slower path, with one Level I retake and a year between levels, the same fees spread over three years or more, with one more Level I fee. Neither path changes the price of a sitting; both change when you need the cash. If you pay from your salary, the slower path spreads the cash; if an employer reimburses fees only on passing, the date of each payment matters as much as its size.</p>
`;
  },
});
