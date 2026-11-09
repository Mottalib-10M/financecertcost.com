/**
 * Calculators, one per subject (RECETTE §9.3). Each one calls the tested engine of `lib/engine/certs.ts`;
 * none computes on its own. Prep spending and dues are typed by the reader: no review-course price and no
 * dues figure we could not read on an official page is ever loaded as a value.
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as E from './engine/certs';
import { formatMoney as fm, formatNumber, displayDate, triesInWords as tw, retakesInWords } from './format';
import { pct } from './pct';

const m = (n: number) => fm(Math.round(n), 0);
const m2 = (n: number) => fm(n, 2);
const n1 = (n: number) => formatNumber(n, 1);
const n2 = (n: number) => formatNumber(n, 2);
/** Three decimals where a reader multiplies (4th round: “$1,140 × 2.47 is $2,815.80, not $2,817”). */
const n3 = (n: number) => formatNumber(n, 3);
/** Rounded parts that add up to the rounded total shown (a reader adds them up: 2026-11-08). */
const rest = (total: number, part: number) => m(Math.round(total) - Math.round(part));
const dd = (iso: string) => displayDate(iso, 'en-US');
/** Sum of the rounded amounts shown, so the big figure is the sum a reader makes ($2,051 vs $2,052: 2nd round). */
const sumShown = (...xs: number[]) => xs.reduce((a, x) => a + Math.round(x), 0);
/** Prep is never a silent $0 inside a total (2nd round: “the big figure looks too good”). */
const prepRow = (n: number, label = 'Your review course and books'): [string, string] => [label, n > 0 ? m(n) : 'not included yet'];
/** The head stays short: what prep adds is said once, in bold, under the big figure (4th round: “the biggest line is hidden in grey”). */
const noPrep = (_n: number) => '';
const prepAlert = (n: number, what = 'these exam fees') => (n > 0 ? undefined : `Fees only. Review courses often cost as much as ${what}, or more: type yours above to add them.`);
/** “Sitting” and decimals, said where the figure is (2nd round: “7.5 sittings? Nobody sits half an exam”). */
const ATTEMPT_NOTE = 'A try is one sitting of one exam; a figure such as 2.47 is an average over all candidates, about 2 to 3 tries.';
/** Extra attempts in a label: two decimals so the line adds up ($445 = 0.54 × $825), then the same in words. */
const extraLabel = (e: number) => `Expected retakes: ${retakesInWords(e)} (${n2(e)} extra try on average)`;
const money = (id: string, label: string, def: number, help?: string) => ({ id, label, def, unit: '$', max: 1_000_000, help });
const opt = (labels: string[]) => labels.map((label, i) => ({ value: String(i), label }));
const TIMING = opt(['Early registration', 'Standard registration']);
const win = (v: number): E.Window => (v === 1 ? 'standard' : 'early');
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const wLabel = (w: string) => `${MONTH[Number(w.slice(5)) - 1]} ${w.slice(0, 4)}`;
const ST = E.STATES.map((s, i) => ({ value: String(i), label: E.stateName(s) }));
export const stateIndex = (s: E.StateCode) => E.STATES.indexOf(s);
const st = (v: number): E.StateCode => E.STATES[Math.max(0, Math.min(E.STATES.length - 1, Math.round(v)))];
/** CPA state field: “no state” first, so no state is assumed for the reader. */
const NO_STATE = E.STATES.length;
const ST_OR_NONE = [{ value: String(NO_STATE), label: 'No state (no board fees)' }, ...ST];
/**
 * CPA retakes are typed by the reader (editor's decision of 2026-11-08): the AICPA's pass rates are not
 * reproduced, since its terms limit their use to personal, non-commercial purposes. Until the reader types a
 * number the head says no retake is counted yet; the « Example » mention itself is shown once, by MentionExemple.
 */
const CPA_RATES_NOTE = 'Not sure how many? The CPA pass rates page links to the rate the AICPA (American Institute of Certified Public Accountants) publishes for each section, and turns a rate into tries.';
const retakesLabel = (k: number) => `${formatNumber(k, 0)} retake${k === 1 ? '' : 's'}`;
const cpaRetakeField = (help: string, showIf?: (v: Record<string, number>) => boolean) => ({ id: 'retakes', label: 'How many sections do you think you will retake?', def: 0, max: 40, help, showIf });
const CFA_BASIS = opt(['10-year average, 2017–2026', 'Sessions since Feb 2024', 'No retake (first try)']);
const CFA_BASIS_SHORT = ['ten-year pass rates', 'pass rates since February 2024', 'every level passed the first time'];
const cfaBasis = (v: number) => (v === 1 ? 'recent' : v === 2 ? 'first' : 'tenYear') as 'tenYear' | 'recent' | 'first';
const LEVELS = opt(['Level I', 'Level II', 'Level III']);
const lvl = (v: number): E.CfaLevel => E.CFA_LEVELS[Math.max(0, Math.min(2, Math.round(v)))];
/** Application dates offered by the eligibility checker (the rule in force depends on it). */
export const APPLY_DATES = ['2026-11-07', '2026-12-01', '2027-03-01', '2027-09-01'];
const APPLY = opt(['Before Nov 21, 2026', 'Nov 21 to Dec 31, 2026', 'Jan 1 to Jul 31, 2027', 'Aug 1, 2027 or later']);
/** The application date changes the routes only in New York and California (Texas Pathway B is open since August 1, 2026). */
const DATED = new Set<E.StateCode>(['NY', 'CA']);
/** Each choice says what the credential is, not only its letters (3rd round), within 26 characters. */
/** Plain-words name of each credential, in the order of CERTS (final round, 61-year-old tester: “I do not know these letters”). */
const PLAIN = ['CPA: licensed accountant', 'CFA®: investment analyst', 'CFP®: financial planner for families', 'Enrolled agent: tax preparer approved by the IRS', 'CIA: internal auditor', 'FRM®: risk manager'];
const CERTS = opt(['CPA, accountant (4 exams)', 'CFA®, investment (3 exams)', 'CFP®, financial planner', 'Enrolled agent, tax (IRS)', 'CIA, internal auditor', 'FRM®, risk manager']);
/** Home comparator default: the CPA with one section retaken, so the first figure counts a retake (4th round: “you promise
 *  retakes, then show $1,074 without any”) without opening on the dearest credential (final round: “first figure I see:
 *  $7,800, I think it is the price of any finance credential”). The quiz above it is the first tool of the page. */
export const HOME_CERT = 0;
export const HOME_RETAKES = 1;

/** Beginner path (4th round, all three testers: “no way in for someone who starts from zero”). What each credential is
 *  and needs, in the words of the home page; every fact is stated with its source on the credential's own page. */
const WORK = opt(['Accounting or audit', 'Tax returns', 'Investments', 'Advice on family money', 'Internal audit', 'Financial risk', 'Not sure yet']);
const DEGREE = opt(['No college degree', 'Bachelor’s degree', 'Bachelor’s + a fifth year']);
const START = [
  { id: 'cpa-exam-cost', path: '/en/cpa-exam-cost/', name: 'CPA, Certified Public Accountant', short: 'CPA', what: 'The state license for accounting and audit work.', need: ['Not yet: most states ask for 150 college semester hours; some accept 120 hours, a bachelor’s degree, with more work experience.', 'Enough where your state has a 120-hour route, with more work experience; elsewhere, a fifth year of college.', 'Enough on the education-hour rule; work experience comes before the license.'] },
  { id: 'enrolled-agent-exam', path: '/en/enrolled-agent-exam-cost/', name: 'Enrolled agent (EA), tax practitioner', short: 'enrolled agent', what: 'Authorized by the IRS to represent taxpayers before it.', need: ['Enough: there is no education-hour rule.', 'Enough: there is no education-hour rule.', 'Enough: there is no education-hour rule.'] },
  { id: 'cfa-exam-cost', path: '/en/cfa-exam-cost/', name: 'CFA® Program, Chartered Financial Analyst®', short: 'CFA®', what: 'Three exams set by CFA Institute, for investment professionals.', need: ['Entry rules are set by CFA Institute: check them on its site before you register.', 'Entry rules are set by CFA Institute: check them on its site before you register.', 'Entry rules are set by CFA Institute: check them on its site before you register.'] },
  { id: 'cfp-certification-cost', path: '/en/cfp-certification-cost/', name: 'CFP® certification, financial planner', short: 'CFP®', what: 'For advice on personal financial planning.', need: ['Not yet: a bachelor’s degree is required to be certified, plus CFP Board coursework.', 'Enough on the degree rule; CFP Board coursework and work experience come on top.', 'Enough on the degree rule; CFP Board coursework and work experience come on top.'] },
  { id: 'cia-exam', path: '/en/cia-exam-cost/', name: 'CIA, Certified Internal Auditor', short: 'CIA', what: 'The designation for internal auditors, from The Institute of Internal Auditors (The IIA).', need: ['Program requirements are set by The IIA: check them on its site.', 'Program requirements are set by The IIA: check them on its site.', 'Program requirements are set by The IIA: check them on its site.'] },
  { id: 'frm-exam', path: '/en/frm-exam-cost/', name: 'FRM®, Financial Risk Manager', short: 'FRM®', what: 'A risk management designation from GARP, the Global Association of Risk Professionals.', need: ['A work-experience requirement is set by GARP: check it on its site.', 'A work-experience requirement is set by GARP: check it on its site.', 'A work-experience requirement is set by GARP: check it on its site.'] },
];
/** Work → credential: accounting CPA, tax EA, investments CFA®, planning CFP®, internal audit CIA, risk FRM®; “not sure” lists all six (index unused). */
const WORK_TO = [0, 1, 2, 3, 4, 5, 1];

const SPECS: Record<string, MiniSpec> = {
  /** Home: every credential on one form. */
  total: {
    title: 'Total cost of a finance credential',
    cta: 'See how the totals are built',
    ctaPage: 'method',
    inputs: [
      { id: 'cert', label: 'Which certification?', def: HOME_CERT, options: CERTS, help: 'Tap to change: CPA (accountant), CFA® (investment analyst), CFP® (financial planner), enrolled agent (tax preparer for the IRS), CIA (internal auditor) or FRM® (risk manager).' },
      { id: 'timing', label: 'When you register', def: 0, options: TIMING, help: 'Registering early costs less for this certification.', showIf: (v) => [1, 2, 5].includes(Math.round(v.cert)) },
      { ...cpaRetakeField(`Each section you retake costs ${m2(P.cpa.sectionFee)} again. 0 means all four passed the first time.`, (v) => Math.round(v.cert) === 0), def: HOME_RETAKES },
      // One meaning for every credential here: a total, added once (final round: “total” here, “per sitting” on the CFA® page).
      money('prep', 'Review course and books, your total for all the exams', 0, 'Your full price for the whole credential, retakes included; it is added once. No course price is loaded.'),
      { id: 'years', label: 'Years of yearly fees to count, after you qualify', def: 0, unit: 'yrs', max: 40, help: `CFP®: ${m(P.cfp.annual)} a year once certified. EA: the tax preparer ID (PTIN), ${m2(P.ea.ptin)} a year; the first year is always counted.`, showIf: (v) => [2, 3].includes(Math.round(v.cert)) },
    ],
    run: (v, touched = {}) => {
      const c = Math.round(v.cert), w = win(v.timing), years = Math.max(0, Math.round(v.years));
      if (c === 1) {
        const r = E.cfaTotal({ window: w, rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
        const n = r.rows.reduce((a, x) => a + x.sittings, 0);
        return { head: [`Expected cost of the three CFA® exams, retakes included`, m(r.exams + v.prep)], alert: prepAlert(v.prep), rows: [['Three exams, all passed the first time', m(r.firstTry)], ['Expected retakes (average pass rates of the last ten years)', rest(r.exams, r.firstTry)], prepRow(v.prep, 'Your review course and books, total'), ['Yearly CFA Institute membership, once you qualify', 'not counted']], note: `Assumes ${w === 'early' ? 'early' : 'standard'} registration. An average candidate sits ${tw(n).replace(/ tries$/, '')} exams in total for the three levels, against 3 for someone who never fails.`, exemple: ['Example: CFA®, early registration, average retakes', 'change any figure to fit yours'] };
      }
      if (c === 2) {
        const t = (['early', 'standard'] as const)[v.timing === 1 ? 1 : 0];
        const r = E.cfpTotal({ window: t, education: 0, prep: v.prep, years, basis: 'latest' });
        const head = years > 0 ? `Expected CFP® cost, with ${formatNumber(years, 0)} certified year${years > 1 ? 's' : ''}${noPrep(v.prep)}` : `Expected cost to get CFP® certified${noPrep(v.prep)}`;
        return { exemple: ['Example: CFP®, early registration, average retakes', 'change any figure to fit yours'], head: [head, m(r.total)], alert: prepAlert(v.prep), rows: [['Exam, passed the first time', m(r.fee)], [extraLabel(r.sittings - 1), rest(r.exams, r.fee)], ['Application to CFP Board', m(P.cfp.application)], years > 0 ? [`Yearly certification fee × ${formatNumber(years, 0)}`, m(P.cfp.annual * years)] : ['Yearly certification fee, once certified', `${m(P.cfp.annual)} a year, not counted`], prepRow(v.prep)], note: `Assumes ${t === 'early' ? 'early' : 'standard'} registration and the latest pass rates. A bachelor’s degree and CFP Board coursework are required; the school’s price is not included: add it on the CFP® page.` };
      }
      if (c === 3) {
        const r = E.eaTotal({ sittings: 3, prep: v.prep, years });
        const y = Math.max(1, years);
        return { exemple: ['Example: enrolled agent, every part passed the first time', 'change any figure to fit yours'], head: [`Enrolled agent fees, first-try price only${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['IRS exam, three parts', m(r.exams)], ['Enrollment with the IRS', m(r.enrollment)], [`Tax preparer ID, ${m2(P.ea.ptin)} a year × ${formatNumber(y, 0)}`, m(r.ptin)], prepRow(v.prep)], note: `First-try price only: the IRS publishes no pass rate, so no retake is counted, unlike the CFA® and CFP® figures. Each retake adds ${m(P.ea.perPart)} for the part; the enrolled agent page counts them.` };
      }
      if (c === 4) {
        const r = E.ciaTotal({ member: false, year: '2026', extraSittings: 0, prep: v.prep });
        const mem = E.ciaTotal({ member: true, year: '2026', extraSittings: 0, prep: 0 });
        return { exemple: ['Example: CIA, non-member, every part passed the first time', 'change any figure to fit yours'], head: [`CIA fees, first-try price only, non-member${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['Application', m(r.application)], ['Three parts, passed the first time', m(r.exams)], prepRow(v.prep)], note: `Members of The IIA (Institute of Internal Auditors) pay ${m(mem.total)} instead. First-try price only: no pass rate was found, so no retake is counted, unlike the CFA® and CFP® figures. Each retake adds about ${m(r.exams / 3)}. 2026 prices; new prices start on ${dd(P.cia.y2027.from)}: see the CIA page.` };
      }
      if (c === 5) {
        const r = E.frmTotal({ window: w, extraSittings: 0, prep: v.prep });
        return { exemple: ['Example: FRM®, early registration, both parts passed the first time', 'change any figure to fit yours'], head: [`FRM® fees, first-try price only${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['One-time enrollment', m(r.enrollment)], ['Part I and Part II, passed the first time', m(r.exams)], prepRow(v.prep)], note: `First-try price only: no pass rate was read, so no retake is counted, unlike the CFA® and CFP® figures. Each retake adds ${m(r.fee)}; the FRM® page counts them.` };
      }
      const a = E.cpaTotal({ state: null, retakes: v.retakes, prep: v.prep });
      const example = !touched.retakes;
      // The head names the retakes counted; the mention says the one retake is an example (final round).
      const head = a.retakes ? `CPA exam fees with ${retakesLabel(a.retakes)}${noPrep(v.prep)}` : `CPA exam fees, all four sections passed the first time${noPrep(v.prep)}`;
      return { head: [head, fm(sumShown(a.firstTryExams, a.retakeExams, v.prep), 0)], alert: prepAlert(v.prep), rows: [[`Four sections, ${m2(P.cpa.sectionFee)} each`, m(a.firstTryExams)], [`Retakes you expect: ${formatNumber(a.retakes, 0)} × ${m2(P.cpa.sectionFee)}`, a.retakes ? m(a.retakeExams) : 'none typed'], prepRow(v.prep, 'Your review course and books, total'), ['Fees of your state’s accountancy board', 'not counted: they vary by state']], note: `${example ? `One retake is only an example: type the number you expect. With none the fees are ${m(a.firstTryExams)}; with two, ${m(a.firstTryExams + 2 * P.cpa.sectionFee)}. ` : ''}${CPA_RATES_NOTE}`, exemple: [`Example: CPA, ${retakesLabel(a.retakes)}, no review course`, 'change any figure to fit yours'] };
    },
  },

  /** Beginner path: two questions, one credential, its fees and what to check first. */
  start: {
    title: 'Not sure where to start? Two questions',
    cta: 'Compare all six credentials',
    ctaPage: 'home',
    inputs: [
      { id: 'work', label: 'What kind of work do you want to do?', def: 6, options: WORK, help: 'Accounting or audit: CPA. Tax returns: enrolled agent. Investments: CFA®. Advice on family money: CFP®. Internal audit: CIA. Financial risk: FRM®.' },
      { id: 'degree', label: 'How much college have you done?', def: 0, options: DEGREE, help: 'A bachelor’s degree is usually about 120 semester hours; a fifth year brings it to about 150.' },
    ],
    run: (v) => {
      const k = WORK_TO[Math.max(0, Math.min(WORK_TO.length - 1, Math.round(v.work)))];
      const d = Math.max(0, Math.min(2, Math.round(v.degree)));
      const c = START[k];
      const fl = E.floors();
      const cfa = E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
      const cfp = E.cfpTotal({ window: 'early', education: 0, prep: 0, years: 0, basis: 'latest' });
      const first = [fl.cpa[0], fl.ea[0], fl.cfa[0], fl.cfp[0], fl.cia[1], fl.frm[0]][k];
      const retake = [
        `${m2(P.cpa.sectionFee)} for each section retaken`,
        `${m(P.ea.perPart)} for each part retaken`,
        `about ${m(cfa.exams)} in all (average pass rates)`,
        `about ${m(cfp.exams + P.cfp.application)} in all (average pass rates)`,
        `about ${m((fl.cia[1] - E.ciaTotal({ member: false, year: '2026', extraSittings: 0, prep: 0 }).application) / 3)} for each part retaken`,
        `${m(P.frm.early)} for each part retaken`,
      ][k];
      const unsure = Math.round(v.work) === 6;
      if (unsure) {
        // Not sure yet: the six side by side, cheapest first, each named in plain words; no credential picked for the
        // reader (final round: “I answered nothing and it recommends the enrolled agent”).
        const firsts = [fl.cpa[0], fl.cfa[0], fl.cfp[0], fl.ea[0], fl.cia[1], fl.frm[0]];
        const six = PLAIN.map((name, i) => ({ name, x: firsts[i] })).sort((a, b) => a.x - b.x);
        return {
          head: ['Six credentials: exam fees at the first try', `${m(six[0].x)} to ${m(six[5].x)}`],
          alert: `Failed exams are paid again: with the usual retakes the CFA® comes to about ${m(cfa.exams)}. The table below adds the retakes for all six.`,
          rows: six.map((c) => [c.name, m(c.x)] as [string, string]),
          note: d === 0 ? 'Without a college degree, the enrolled agent is the one credential here with no education-hour rule; the CPA and the CFP® ask for a degree first. Pick the work you want above to see what each one needs.' : 'Pick the work you want above to see what that credential needs first and what a retake adds.',
          go: ['Compare all six with retakes ↓', '#compare-title'],
          exemple: ['Not sure yet: all six shown, cheapest first', 'pick the work you want above'],
        };
      }
      const blocked = (k === 0 || k === 3) && d === 0;
      const rows: Array<[string, string]> = [['What it is', c.what], ['With your studies', c.need[d]], [k === 2 || k === 3 ? 'With retakes' : 'If you retake', retake]];
      const note = blocked ? `No degree yet? The enrolled agent exam has no education-hour rule: ${m(fl.ea[0])} at the first try.` : 'Fees only: review courses, and for the CFP® the school program, come on top.';
      return { head: [`${c.name}: exam fees at the first try`, m(first)], rows, note, go: [`See the full ${c.short} cost, step by step`, c.path] };
    },
  },

  'cfa-total': {
    title: 'CFA® Program: cost of the three levels',
    cta: 'How each level’s pass rate is used',
    ctaPage: 'cfa-pass-rates',
    inputs: [
      { id: 'timing', label: 'When you register', def: 0, options: TIMING, help: `Early registration costs ${m(P.cfa.fees.l1.standard - P.cfa.fees.l1.early)} less per exam than standard.` },
      { id: 'basis', label: 'Pass rates used for retakes', def: 0, options: CFA_BASIS, help: 'The ten-year average is the steadiest guide. “No retake” shows the price list.' },
      money('prep', 'Course and books, for each try', 0, 'Course, books and mock exams, for each exam you sit; multiplied by the expected tries.'),
      money('dues', 'Yearly membership fees, once you hold the CFA® title', 0, 'CFA Institute and local society dues, from your own invoice: we could not read a dues schedule on CFA Institute’s site. Type an amount and a field for the number of years appears.'),
      { id: 'years', label: 'Years of membership fees to count', def: 0, unit: 'yrs', max: 40, showIf: (v) => v.dues > 0 },
    ],
    run: (v) => {
      const r = E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: v.prep, duesPerYear: v.dues, duesYears: v.dues > 0 ? v.years : 0 });
      const b = Math.max(0, Math.min(2, Math.round(v.basis)));
      const total = sumShown(...r.rows.map((x) => x.examCost), r.prep, r.dues);
      return { head: [`Expected cost of the three CFA® exams${noPrep(v.prep)}`, fm(total, 0)], alert: prepAlert(v.prep, 'the exam fees, for each level'), rows: [...r.rows.map((x) => [`${E.LEVEL_NAME[x.level]}: ${tw(x.sittings)} × ${m(x.fee)} (${n3(x.sittings)} on average)`, m(x.examCost)] as [string, string]), v.prep > 0 ? ['Course and books, for each try', m(r.prep)] : prepRow(0), ['Yearly membership, once you qualify', r.dues > 0 ? m(r.dues) : 'not counted']], note: `Assumes ${v.timing === 1 ? 'standard' : 'early'} registration and ${CFA_BASIS_SHORT[b]}. A try is one sitting of one exam; the figure in brackets is the average over all candidates. If every level is passed the first time: ${m(r.firstTry)}. No enrollment fee since ${dd(P.cfa.enrollmentRemoved)}.`, exemple: ['Example: early registration, ten-year pass rates, no course', 'change any figure to fit yours'] };
    },
  },
  'cfa-level1': {
    title: 'CFA® Level I: fee and expected sittings',
    cta: 'Price all three levels',
    ctaPage: 'cfa-exam-cost',
    inputs: [
      { id: 'timing', label: 'When you register', def: 0, options: TIMING },
      { id: 'basis', label: 'Pass rate used', def: 0, options: CFA_BASIS },
      money('prep', 'Prep spending per sitting', 0),
    ],
    run: (v) => {
      const r = E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: v.prep, duesPerYear: 0, duesYears: 0, levels: ['l1'] });
      const x = r.rows[0];
      return { exemple: ['Example: early registration, ten-year pass rate', 'change any figure to fit yours'], head: ['Expected Level I cost', m(r.total)], rows: [['Registration fee', m(x.fee)], ['Pass rate used', pct(x.p)], ['Average tries to pass', `${n2(x.sittings)} (${tw(x.sittings)})`], ['Chance of passing within two tries', pct(E.passWithin(x.p, 2))]], note: `${P.cfa.examHours} hours, multiple choice. Results come ${P.cfa.resultsWeeks.min} to ${P.cfa.resultsWeeks.max} weeks after the window closes.` };
    },
  },
  'cfa-retake': {
    title: 'What a CFA® pass rate means for your budget',
    cta: 'Total for the three levels',
    ctaPage: 'cfa-exam-cost',
    inputs: [
      { id: 'level', label: 'Level', def: 0, options: LEVELS },
      { id: 'basis', label: 'Pass rate', def: 0, options: opt(['10-year average, 2017–2026', 'Latest session', 'Sessions since Feb 2024']) },
      { id: 'timing', label: 'When you register', def: 0, options: TIMING },
    ],
    run: (v) => {
      const l = lvl(v.level); const last = E.cfaLatest(l);
      const p = v.basis === 1 ? E.cfaRate(l, last.w) : v.basis === 2 ? E.cfaRecentRate(l) : E.cfaRate(l, 'tenYear');
      const n = E.expectedSittings(p); const fee = E.cfaFee(l, win(v.timing));
      return { exemple: [`Example: ${E.LEVEL_NAME[l]}, ten-year average`, 'pick another level or rate above'], head: [`Tries needed to pass ${E.LEVEL_NAME[l]}, on average`, tw(n).replace(/^about /, '')], rows: [['Average tries, exact', n2(n)], ['Pass rate used', pct(p)], ['Passed within two tries', pct(E.passWithin(p, 2))], ['Passed within three tries', pct(E.passWithin(p, 3))], ['Expected exam fees for this level', m(fee * n)]], note: `${v.basis === 1 ? `Session of ${wLabel(last.w)}, CFA Institute results file.` : 'CFA Institute results file, all candidates of the period counted together. The ten-year average is the one the CFA® cost page uses.'} ${ATTEMPT_NOTE}` };
    },
  },
  'cfa-plan': {
    title: 'Fastest CFA® calendar from your first window',
    cta: 'Pass rates by session',
    ctaPage: 'cfa-pass-rates',
    inputs: [
      { id: 'start', label: 'Level I window', def: 1, options: P.cfa.offered.l1.map((mo) => ({ value: String(mo), label: MONTH[mo - 1] })) },
      { id: 'year', label: 'Year of that window', def: 2027, max: 2035 },
      { id: 'gap', label: 'Months you need between levels', def: 3, unit: 'mo', max: 24, help: 'At least the 5 to 9 weeks results take, plus registration.' },
    ],
    run: (v) => {
      const start = [2, 5, 8, 11].includes(Math.round(v.start)) ? Math.round(v.start) : 2;
      const path = E.cfaFastestPath(start, Math.round(v.year), Math.max(1, Math.round(v.gap)));
      const retake = E.cfaNextRetake(start, 'l1');
      const end = path[2];
      return { exemple: [`Example: Level I in ${MONTH[start - 1]} ${Math.round(v.year)}, ${formatNumber(v.gap, 0)} months between levels`, 'change any figure to fit yours'], head: ['Earliest Level III window', `${MONTH[end.month - 1]} ${end.year}`], rows: [...path.map((x) => [E.LEVEL_NAME[x.level], `${MONTH[x.month - 1]} ${x.year}`] as [string, string]), ['If Level I is failed, earliest retake', `${MONTH[retake.month - 1]} ${Math.round(v.year) + retake.yearsAhead}`]], note: `Level I is offered in ${P.cfa.offered.l1.map((x) => MONTH[x - 1]).join(', ')}; Level II in ${P.cfa.offered.l2.map((x) => MONTH[x - 1]).join(', ')}; Level III in ${P.cfa.offered.l3.map((x) => MONTH[x - 1]).join(' and ')} (sessions held 2024 to 2026).` };
    },
  },

  'cfp-total': {
    title: 'CFP® certification: expected total',
    cta: 'Exam windows and deadlines',
    ctaPage: 'cfp-exam-dates',
    inputs: [
      { id: 'timing', label: 'When you register for the exam', def: 0, options: opt(['Early registration (early bird)', 'Standard', 'Late']), help: 'CFP Board calls early registration “early bird”.' },
      money('education', 'Education program you pay a school', 0, 'The CFP Board-registered coursework; schools set their own price.'),
      money('prep', 'Exam review and books', 0),
      { id: 'years', label: 'Certified years to count (yearly fee)', def: 0, unit: 'yrs', max: 40, help: `${m(P.cfp.annual)} a year once certified. Leave 0 to see the cost of getting certified.` },
      { id: 'basis', label: 'Pass rates used', def: 0, options: opt(['Latest session', 'Sessions since March 2023']) },
    ],
    run: (v) => {
      const t = (['early', 'standard', 'late'] as const)[Math.max(0, Math.min(2, Math.round(v.timing)))];
      const years = Math.max(0, Math.round(v.years));
      const r = E.cfpTotal({ window: t, education: v.education, prep: v.prep, years, basis: v.basis === 1 ? 'pooled' : 'latest' });
      const head = years > 0 ? `Expected CFP® cost, with ${formatNumber(years, 0)} certified year${years > 1 ? 's' : ''}` : 'Expected cost to get CFP® certified';
      const total = sumShown(r.fee, r.exams - r.fee, P.cfp.application, P.cfp.annual * years, v.education, v.prep);
      return { exemple: ['Example: early registration, latest pass rates, no school program yet', 'change any figure to fit yours'], head: [`${head}${noPrep(v.prep)}`, fm(total, 0)], alert: v.education > 0 ? prepAlert(v.prep) : 'Fees only. The education program a school charges is usually the biggest line: type it above, with any review course.', rows: [['Exam fee', m(r.fee)], [extraLabel(r.sittings - 1), rest(r.exams, r.fee)], ['Application', m(P.cfp.application)], years > 0 ? [`Yearly certification fee × ${formatNumber(years, 0)}`, m(P.cfp.annual * years)] : ['Yearly certification fee, once certified', `${m(P.cfp.annual)} a year, not counted`], ['Education program', v.education > 0 ? m(v.education) : 'not included yet'], prepRow(v.prep, 'Exam review and books')], note: `Pass rates used: ${pct(r.p1)} at the first try, ${pct(r.pr)} for a retake.${years > 0 ? ' The first year’s certification fee is prorated by CFP Board; counting it whole keeps the total on the safe side.' : ''}` };
    },
  },
  'cfp-window': {
    title: 'CFP® exam window: dates and fee',
    cta: 'Total cost of certification',
    ctaPage: 'cfp-certification-cost',
    inputs: [{ id: 'w', label: 'Testing window', def: 1, options: P.cfp.windows.map((w, i) => ({ value: String(i), label: w.test })) }],
    run: (v) => {
      const w = P.cfp.windows[Math.max(0, Math.min(P.cfp.windows.length - 1, Math.round(v.w)))] as (typeof P.cfp.windows)[number] & { earlyClose?: string; standardClose?: string; lateClose?: string };
      const rows: Array<[string, string]> = [['Registration opens', dd(w.opens)], ['Education verification deadline', dd(w.eduDeadline)]];
      if (w.earlyClose) rows.push(['Early registration (early bird) closes', dd(w.earlyClose)], ['Standard closes', dd(w.standardClose!)], ['Late registration closes', dd(w.lateClose!)]);
      else rows.push(['Early, standard and late deadlines', 'not yet posted by CFP Board']);
      return { exemple: [`Example: the ${w.test} window`, 'pick another window above'], head: ['Exam fee, early / standard / late', `${m(P.cfp.exam.early)} / ${m(P.cfp.exam.standard)} / ${m(P.cfp.exam.late)}`], rows, note: `Testing: ${w.test}.` };
    },
  },
  'cfp-attempts': {
    title: 'CFP® pass rates: first try and retake',
    cta: 'What retakes add to the bill',
    ctaPage: 'cfp-certification-cost',
    inputs: [{ id: 's', label: 'Exam session', def: P.cfp.sessions.length - 1, options: P.cfp.sessions.map((s, i) => ({ value: String(i), label: wLabel(s.w) })) }, { id: 'timing', label: 'Fee paid each time', def: 1, options: opt(['Early (early bird)', 'Standard', 'Late']) }],
    run: (v) => {
      const s = E.cfpSessions[Math.max(0, Math.min(E.cfpSessions.length - 1, Math.round(v.s)))];
      const p1 = E.cfpRate(s, 'first'), pr = E.cfpRate(s, 'repeat'), n = E.expectedSittings2(p1, pr);
      const fee = P.cfp.exam[(['early', 'standard', 'late'] as const)[Math.max(0, Math.min(2, Math.round(v.timing)))]];
      return { exemple: [`Example: the ${wLabel(s.w)} session, standard fee`, 'pick another session above'], head: ['Tries needed to pass, on average', tw(n).replace(/^about /, '')], rows: [['Average tries, exact', n2(n)], ['Overall pass rate', pct(E.cfpRate(s, 'all'))], ['First-time candidates', pct(p1)], ['Repeat candidates', pct(pr)], ['Expected exam fees', m(fee * n)]], note: `${formatNumber(s.all[0], 0)} candidates sat in ${wLabel(s.w)} (CFP Board statistics).` };
    },
  },
  'cfp-experience': {
    title: 'CFP® experience: how long it takes',
    cta: 'Cost of the certification',
    ctaPage: 'cfp-certification-cost',
    inputs: [{ id: 'path', label: 'Pathway', def: 0, options: opt([`Standard: ${formatNumber(P.cfp.experience.standard, 0)} hours`, `Apprenticeship: ${formatNumber(P.cfp.experience.apprenticeship, 0)} hours`]) }, { id: 'hours', label: 'Qualifying hours a week', def: 40, unit: 'h', max: 80 }],
    run: (v) => {
      const need = v.path === 1 ? P.cfp.experience.apprenticeship : P.cfp.experience.standard;
      const mo = E.monthsForHours(need, v.hours);
      return { exemple: [`Example: ${v.path === 1 ? 'apprenticeship' : 'standard'} pathway, ${formatNumber(v.hours, 0)} hours a week`, 'change any figure to fit yours'], head: ['Time to log the hours', Number.isFinite(mo) ? `${n1(mo / 12)} years` : 'never'], rows: [['Hours required', formatNumber(need, 0)], ['Months at this pace', Number.isFinite(mo) ? formatNumber(Math.ceil(mo), 0) : '—'], ['Hours a year at this pace', formatNumber(v.hours * 52, 0)]], note: 'Counted at 52 working weeks a year; vacation weeks push the date back.' };
    },
  },

  'cpa-total': {
    title: 'CPA exam and license: your total',
    cta: 'Licensure routes of the five states',
    ctaPage: 'cpa-requirements',
    inputs: [
      { id: 'state', label: 'Your state (adds its board fees)', def: NO_STATE, options: ST_OR_NONE, help: 'Five states are covered. In another state, keep the first choice and check your board’s fees.' },
      cpaRetakeField(`Each section you retake costs the section fee again, ${m2(P.cpa.sectionFee)}, the same in every state; California and Texas also charge a board fee for each new try (${m(P.cpa.states.CA.examRepeat!)} and ${m(P.cpa.states.TX.perSection)}). 0 means all four passed the first time. Not sure? Type 1, then 2, to see the range.`),
      money('prep', 'Review course and books', 0),
    ],
    run: (v, touched = {}) => {
      const none = Math.round(v.state) >= NO_STATE;
      const state = none ? null : st(v.state);
      const r = E.cpaTotal({ state, retakes: v.retakes, prep: v.prep });
      const example = !touched.retakes;
      // Section fee and board fee on separate lines, each with its own unit price (4th round: “0 × $268.59” next to “one retake costs $283.59”).
      const rows: Array<[string, string]> = [[`Four sections, ${m2(P.cpa.sectionFee)} each`, m(r.firstTryExams)], [`Retakes you expect: ${formatNumber(r.retakes, 0)} × ${m2(P.cpa.sectionFee)} section fee`, r.retakes ? m(r.retakeExams) : 'none typed']];
      const exams = sumShown(r.firstTryExams, r.retakeExams);
      for (const l of r.board) rows.push([l.label, l.amount === null ? 'not counted: ask the board' : m(l.amount)]);
      const boardShown = sumShown(...r.board.map((l) => l.amount ?? 0));
      rows.push(prepRow(v.prep));
      const total = exams + boardShown + Math.round(v.prep);
      const what = state ? `CPA exam and ${E.stateName(state)} board fees` : 'CPA exam fees';
      // The « Example » mention is MentionExemple's; the head says what is left out.
      const head = example ? `No retake counted yet: ${what} if all four sections pass the first time` : `${what} with ${retakesLabel(r.retakes)}`;
      const first = state ? `Exam fees ${m(exams)}, plus ${m(boardShown)} of ${E.stateName(state)} board fees we could confirm.` : 'Exam fees only: pick your state to add its board fees.';
      const extra = E.cpaRetakePrice(state) - P.cpa.sectionFee;
      const retakeSaid = extra > 0 ? `One retake costs ${m2(E.cpaRetakePrice(state))} here: the ${m2(P.cpa.sectionFee)} section fee, the same in every state, plus the board’s ${m(extra)} for a new try.` : `One retake costs the ${m2(P.cpa.sectionFee)} section fee, the same in every state; some boards add their own fee for a new try.`;
      return { head: [`${head}${noPrep(v.prep)}`, fm(total, 0)], alert: prepAlert(v.prep), rows, note: `${first} ${retakeSaid} ${CPA_RATES_NOTE}`, exemple: ['Starting point: every section passed the first time', 'type the retakes you expect'] };
    },
  },
  'cpa-discipline': {
    title: 'CPA sections: what is left to pay',
    cta: 'Full CPA cost with state fees',
    ctaPage: 'cpa-exam-cost',
    inputs: [
      { id: 'passed', label: 'Sections you have passed', def: 0, options: opt(['None yet', 'One', 'Two', 'Three', 'All four']) },
      cpaRetakeField(`Each one costs the section fee again, ${m2(P.cpa.sectionFee)}, whichever fourth section you pick.`),
    ],
    run: (v, touched = {}) => {
      const r = E.cpaLeft(v.passed, v.retakes);
      const example = !touched.passed && !touched.retakes;
      return { exemple: ['Starting point: no section passed yet, no retake', 'choose your own above'], head: ['Section fees left to pay', m(r.fees)], rows: [['Sections still to pass', formatNumber(r.left, 0)], [`Sections not yet passed: ${formatNumber(r.left, 0)} × ${m2(P.cpa.sectionFee)}`, m(r.left * P.cpa.sectionFee)], [`Retakes you expect: ${formatNumber(r.retakes, 0)} × ${m2(P.cpa.sectionFee)}`, r.retakes ? m(r.retakes * P.cpa.sectionFee) : 'none typed'], ['Tries left to book', formatNumber(r.sittings, 0)]], note: `${example ? 'Choose how many sections you have passed and type the retakes you expect. ' : ''}The fourth section, the one you pick among three topics, costs the same as the others. State board fees are not in this figure. ${CPA_RATES_NOTE}` };
    },
  },
  'cpa-passrate': {
    title: 'A CPA pass rate turned into tries and fees',
    cta: 'What the retakes cost in total',
    ctaPage: 'cpa-exam-cost',
    inputs: [
      { id: 'rate', label: 'Pass rate you read for the section', def: 45, unit: '%', max: 100, decimals: 1, help: 'Type the rate the AICPA publishes for your section: open its page with the link just above. 45% is only a placeholder.' },
      { id: 'n', label: 'Tries you budget for', def: 2, max: 10 },
    ],
    run: (v, touched = {}) => {
      const p = Math.max(0, Math.min(100, v.rate)) / 100; const n = Math.max(1, Math.round(v.n));
      const example = !touched.rate;
      const avg = E.expectedSittings(p);
      const ok = Number.isFinite(avg);
      const head = `Chance of passing within ${formatNumber(n, 0)} tr${n > 1 ? 'ies' : 'y'}, at the rate above`;
      return { head: [head, pct(E.passWithin(p, n))], rows: [['Pass rate used', pct(p)], ['Average tries to pass', ok ? `${n2(avg)} (${tw(avg)})` : 'no finite answer at 0%'], [`Fees for ${formatNumber(n, 0)} tr${n > 1 ? 'ies' : 'y'}`, m(n * P.cpa.sectionFee)], ['Average fees for this section', ok ? m(avg * P.cpa.sectionFee) : '—']], exemple: ['Illustration only: 45% is not an AICPA figure', 'type the rate you read on the AICPA page'], note: `${example ? 'Type the pass rate published by the AICPA for your section. ' : ''}A pass rate is an average over all candidates, first-timers and repeaters together; your own odds may be better or worse. Each try costs ${m2(P.cpa.sectionFee)}.` };
    },
  },
  'cpa-eligibility': {
    title: 'CPA licensure route: which one you fit',
    cta: 'CPA exam cost page, five states',
    ctaPage: 'cpa-exam-cost',
    inputs: [
      { id: 'state', label: 'State board', def: stateIndex('NY'), options: ST },
      { id: 'hours', label: 'College semester hours completed or planned', def: 120, unit: 'h', max: 400, help: 'Credit hours on your transcript, not hours of work. 120 is usually a bachelor’s degree; 150 means about a fifth year.' },
      { id: 'years', label: 'Years of supervised experience', def: 2, unit: 'yrs', max: 40, decimals: 1 },
      { id: 'when', label: 'When you apply for the license', def: 2, options: APPLY, help: 'The rules change on these dates in this state.', showIf: (v) => DATED.has(st(v.state)) },
    ],
    run: (v, touched = {}) => {
      // Pre-filled example until the reader types hours or years (3rd round: “it says I fit, I typed nothing”).
      const example = !touched.hours && !touched.years;
      const s = st(v.state); const date = DATED.has(s) ? APPLY_DATES[Math.max(0, Math.min(3, Math.round(v.when)))] : APPLY_DATES[0];
      const r = E.cpaEligibility(s, v.hours, v.years, date);
      const rows: Array<[string, string]> = r.routes.map((x) => [x.name, !x.open ? (x.from && date < x.from ? `opens ${dd(x.from)}` : `closed from ${dd(x.until!)}`) : x.hoursShort || x.yearsShort ? `${[x.hoursShort ? `${formatNumber(x.hoursShort, 0)} hours` : '', x.yearsShort ? `${n1(x.yearsShort)} years of experience` : ''].filter(Boolean).join(' and ')} missing` : example ? 'this example fits' : 'you fit']);
      const routeName = (hours: number) => (s === 'TX' ? (hours === 150 ? 'Pathway A (150 hours)' : 'Pathway B (120 hours)') : `${hours}-hour route`);
      // « Example, not your result yet » is shown by MentionExemple (trame) until a field is changed;
      // the head keeps saying “this example” until hours or years are typed.
      const exLabel = `With ${formatNumber(v.hours, 0)} semester hours and ${formatNumber(v.years, Number.isInteger(v.years) ? 0 : 1)} years of work, the route would be (type your own above)`;
      const head = r.fits.length ? [example ? exLabel : 'Route open with the hours and years above', routeName(r.fits[0].hours)] : [example ? 'No route fits this example: type your own hours and years above' : 'No route fits yet', r.nearest ? `closest: ${routeName(r.nearest.hours)}` : 'see the board'];
      return { exemple: [`Example: ${formatNumber(v.hours, 0)} semester hours, ${formatNumber(v.years, Number.isInteger(v.years) ? 0 : 1)} years of work`, 'type your own above'], head, rows, note: s === 'FL' ? 'Florida law still requires 150 hours for the license; 120 hours are enough to sit for the exam.' : s === 'CA' ? 'From January 1, 2027 the California Board of Accountancy mentions extra flexibility for candidates with an advanced degree or changing careers; it is not modeled here, so check with the board.' : s === 'NY' ? 'From August 1, 2027 the 150-hour route follows the course content of the 150E pathway; content rules apply on top of the hours.' : 'Education content rules (accounting and business hours) apply on top: see the state page.' };
    },
  },

  'ea-total': {
    title: 'Enrolled agent: cost of the SEE and enrollment',
    cta: 'Compare with the CPA',
    ctaPage: 'cpa-exam-cost',
    // Same question as the CPA calculator (4th round: “retakes from 0 there, parts from 3 here”).
    inputs: [{ id: 'retakes', label: 'How many parts do you think you will retake?', def: 0, max: 27, help: `The IRS exam, the SEE (Special Enrollment Examination), has three parts at ${m(P.ea.perPart)} each; each part you retake costs ${m(P.ea.perPart)} again. 0 means all three passed the first time. The IRS publishes no pass rate.` }, money('prep', 'Review course and books', 0), { id: 'years', label: 'Years of tax preparer ID to count', def: 1, unit: 'yrs', max: 40, help: `The tax preparer ID (PTIN) costs ${m2(P.ea.ptin)} and is renewed every year.` }],
    run: (v) => {
      const retakes = Math.max(0, Math.round(v.retakes)), n = P.ea.parts + retakes, y = Math.max(1, Math.round(v.years));
      const r = E.eaTotal({ sittings: n, prep: v.prep, years: y });
      const total = sumShown(r.exams, r.enrollment, r.ptin, v.prep);
      return { exemple: ['Starting point: all three parts passed the first time', 'type the retakes you expect'], head: [`Enrolled agent fees${retakes ? '' : ', all three parts passed the first time'}${noPrep(v.prep)}`, fm(total, 0)], alert: prepAlert(v.prep), rows: [[`IRS exam: ${m(P.ea.perPart)} × ${formatNumber(n, 0)}${retakes ? ` (${formatNumber(retakes, 0)} retake${retakes > 1 ? 's' : ''})` : ''}`, m(r.exams)], ['Enrollment with the IRS', m(r.enrollment)], [`Tax preparer ID, ${m2(P.ea.ptin)} a year × ${formatNumber(y, 0)}`, m(r.ptin)], prepRow(v.prep)], note: `Of each ${m(P.ea.perPart)} part, ${m(P.ea.irsUserFee)} goes to the IRS and the rest to the test provider; nothing more to add. The IRS publishes no pass rate, so retakes are the ones you type. Passed parts stay valid for ${P.ea.carryoverYears} years; apply for enrollment within ${P.ea.applyWithinYears} year of the last pass.` };
    },
  },
  'cia-total': {
    title: 'CIA: application and three exam parts',
    cta: 'Compare every credential',
    ctaPage: 'home',
    inputs: [{ id: 'member', label: 'Member of the Institute of Internal Auditors?', def: 0, options: opt(['No', 'Yes']) }, { id: 'year', label: 'Price list', def: 0, options: opt(['2026 prices', `Prices from ${dd(P.cia.y2027.from)}`]) }, { id: 'extra', label: 'Retakes you budget', def: 0, max: 10 }, money('prep', 'Review course and books', 0)],
    run: (v) => {
      const r = E.ciaTotal({ member: v.member === 1, year: v.year === 1 ? '2027' : '2026', extraSittings: Math.max(0, Math.round(v.extra)), prep: v.prep });
      return { exemple: ['Example: non-member, 2026 prices, no retake', 'change any figure to fit yours'], head: [`CIA fees${noPrep(v.prep)}`, fm(sumShown(r.application, ...r.parts, r.retakes, v.prep), 0)], alert: prepAlert(v.prep), rows: [['Application', m(r.application)], ['Part 1', m(r.parts[0])], ['Part 2', m(r.parts[1])], ['Part 3', m(r.parts[2])], ['Retakes (average part fee)', m(r.retakes)], prepRow(v.prep)], note: `You have ${P.cia.eligibilityYears} years from acceptance into the program to complete the eligibility requirements.` };
    },
  },
  'frm-total': {
    title: 'FRM: enrollment and two exam parts',
    cta: 'Compare every credential',
    ctaPage: 'home',
    inputs: [{ id: 'timing', label: 'When you register', def: 0, options: TIMING }, { id: 'extra', label: 'Retakes you budget', def: 0, max: 10 }, money('prep', 'Review course and books', 0)],
    run: (v) => {
      const r = E.frmTotal({ window: win(v.timing), extraSittings: Math.max(0, Math.round(v.extra)), prep: v.prep });
      return { exemple: ['Example: early registration, no retake', 'change any figure to fit yours'], head: [`FRM® fees${noPrep(v.prep)}`, fm(sumShown(r.enrollment, r.exams, v.prep), 0)], alert: prepAlert(v.prep), rows: [['One-time enrollment', m(r.enrollment)], [`Exam fee × ${formatNumber(P.frm.parts + Math.round(v.extra), 0)}`, m(r.exams)], prepRow(v.prep)], note: `Part I and Part II cost the same: ${m(P.frm.early)} early, ${m(P.frm.standard)} standard (GARP, 2027 sessions).` };
    },
  },
};

export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini spec: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
