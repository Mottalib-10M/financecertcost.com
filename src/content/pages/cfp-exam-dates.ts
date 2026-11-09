import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';

const $ = (n: number) => formatMoney(Math.round(n), 0);

export default definePage({
  id: 'cfp-exam-dates',
  group: 'cfp',
  order: 20,
  tool: { kind: 'mini:cfp-window' },
  related: ['cfp-certification-cost', 'cfp-pass-rate', 'cfp-requirements'],
  sources: ['cfp_registration', 'cfp_stats'],
  slug: 'cfp-exam-dates',
  nav: 'CFP® exam dates',
  card: 'The three testing windows CFP Board has announced, when registration opens and the education deadline of each.',
  title: 'CFP® Exam Dates 2026-2027: Windows and Fee Deadlines',
  description: 'CFP® exam dates for October 2026, March 2027 and July 2027: when registration opens, the education verification deadline and the early, standard and late fees.',
  h1: 'CFP® exam dates and registration deadlines',
  intro: `CFP Board has posted exam windows for ${P.cfp.windows.slice(1).map((w) => w.test).join(' and ')}. The exam costs ${$(P.cfp.exam.early)} with early registration (“early bird”), ${$(P.cfp.exam.standard)} standard and ${$(P.cfp.exam.late)} late. Pick a window to see its deadlines.`,
  resume: (h) => {
    const W = h.P.cfp.windows;
    return `The CFP® exam is offered three times a year, in testing windows of about a week. CFP Board’s registration page lists the windows of ${W.map((w) => w.test).join(', ')}. Registration for the March 2027 window opened on ${h.date(W[1].opens)}, and for July 2027 it opens on ${h.date(W[2].opens)}. Each window has an education verification deadline: candidates must have their CFP Board coursework verified by ${h.date(W[1].eduDeadline)} for March and ${h.date(W[2].eduDeadline)} for July. Inside a window, the fee rises in three steps: ${h.m(h.P.cfp.exam.early)} for early bird registration, ${h.m(h.P.cfp.exam.standard)} standard and ${h.m(h.P.cfp.exam.late)} late, as listed for the October 2026 window. CFP Board had not yet posted the early, standard and late closing dates for 2027 when we read the page on ${h.read}, so the tool shows them only for the window where they were published.`;
  },
  faqs: (h) => [
    { q: 'How many times a year is the CFP® exam offered?', a: 'Three. In 2026 and 2027 the windows fall in March, July and October or November, each lasting about a week, during which candidates sit on the day they book. CFP Board posts each window with its registration dates on the exam registration page.' },
    { q: 'What is the education verification deadline for the CFP® exam?', a: `The date by which CFP Board must have verified that you completed the coursework requirement before you can sit in that window: ${h.date(h.P.cfp.windows[1].eduDeadline)} for March 2027 and ${h.date(h.P.cfp.windows[2].eduDeadline)} for July 2027. Ask your program early how long it takes to report completion.` },
    { q: 'When do CFP® exam results come out?', a: 'CFP Board releases results after the window has closed and scores have been reviewed. This site has not read a fixed release date for the 2027 windows, so it does not give one. CFP Board’s exam statistics, published after each window, are the basis of the pass rates on this site.' },
  ],
  body: (h) => {
    const W = h.P.cfp.windows as Array<(typeof h.P.cfp.windows)[number] & { earlyClose?: string; standardClose?: string; lateClose?: string }>;
    const rows = W.map((w) => [w.test, h.date(w.opens), h.date(w.eduDeadline), w.earlyClose ? h.date(w.earlyClose) : 'not posted', w.lateClose ? h.date(w.lateClose) : 'not posted']);
    const past = h.E.cfpSessions.slice(-6).map((s) => [h.ml(s.w), h.num(s.all[0]), h.pc(h.E.cfpRate(s, 'all'))]);
    return `
<h2>The three windows</h2>
${h.table(['Testing window', 'Registration opens', 'Education verified by', 'Early registration (early bird) closes', 'Registration closes'], rows, `${h.src('cfp_registration', 'CFP Board, upcoming exam dates and registration')}, read on ${h.read}.`, ['l', 'l', 'l', 'l', 'l'])}
<p>For October 2026, the standard deadline was ${h.date(W[0].standardClose!)}, the same day as the education deadline, and late registration ran a week longer. If the 2027 windows follow the same pattern, the last cheap day to register falls well before the education deadline; but that is a pattern, not a published date, and the tool does not fill it in.</p>

<h2>Picking a window</h2>
<p>Three questions decide it. Will your coursework be verified in time? Can you register early, which is ${h.m(h.P.cfp.exam.late - h.P.cfp.exam.early)} cheaper than late? And how many weeks of review do you need between the end of the course and the exam? Candidates who miss a window lose nothing but time if they had not registered; once registered, moving to another window follows CFP Board’s own rules and fees.</p>

<h2>Recent windows, by size</h2>
${h.table(['Window', 'Candidates who sat', 'Overall pass rate'], past, `${h.src('cfp_stats', 'CFP Board, historical exam statistics')}.`, ['l', 'r', 'r'])}
<p>Recent windows have been larger than those of 2023, and pass rates have stayed in a narrow band. The full list of sessions, with first-time and repeat rates, is on the ${h.a('cfp-pass-rate', 'CFP® pass rate')} page.</p>
${h.box('Before you register', '<p>Check three things on CFP Board’s site: the education deadline for your window, the identity documents the test provider requires, and the cancellation and transfer policy in force for that window.</p>', 'tip')}
<p>The ${h.a('cfp-certification-cost', 'cost calculator')} turns the deadline you choose into a full budget, and the ${h.a('cfp-requirements', 'requirements page')} covers what you still need after the exam.</p>
<h2>Working back from a window</h2>
<p>A simple way to use the table is to start from the window you want and count backward. The education verification deadline is the hard stop: if your program cannot confirm completion by then, the window is out of reach whatever you pay. Before that comes the early bird deadline, the date that decides whether the exam costs ${h.m(h.P.cfp.exam.early)} or more. And before both comes your review: the weeks between finishing the coursework and sitting the exam. For March 2027, registration has been open since ${h.date(W[1].opens)} and the education deadline is ${h.date(W[1].eduDeadline)}; for July 2027, registration opens on ${h.date(W[2].opens)} and the education deadline is ${h.date(W[2].eduDeadline)}. If you need more time, the next window is four months later, and nothing is lost by waiting if you have not yet registered.</p>
<p>The fee steps are the part most guides leave out. A candidate who misses the early registration deadline twice, on a first attempt and a retake, pays ${h.m(2 * (h.P.cfp.exam.standard - h.P.cfp.exam.early))} more than one who meets it both times, for the same exam.</p>
`;
  },
});
