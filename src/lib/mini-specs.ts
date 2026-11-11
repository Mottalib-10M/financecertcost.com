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
const prepAlert = (n: number, what = 'these exam fees') => (n > 0 ? undefined : `Fees only. Review courses often cost as much as ${what}, or more: add them with the review course choice above.`);
/** Rule 5 of 2026-11-10: every hard field has a simple rule and a “not sure” way out. */
const PREP_HELP = 'Not sure? Leave it empty: the total then shows the official fees only. Many candidates spend at least as much as the exam fees on courses and books.';
const RETAKE_HELP = 'Not sure? Leave 0, then type 1 to see what one retake adds.';
/** “Sitting” and decimals, said where the figure is (2nd round: “7.5 sittings? Nobody sits half an exam”). */
const ATTEMPT_NOTE = 'A try is one sitting of one exam; a figure such as 2.47 is an average over all candidates, about 2 to 3 tries.';
/** Extra attempts in a label: two decimals so the line adds up ($445 = 0.54 × $825), then the same in words. */
const extraLabel = (_e: number) => 'Retakes, averaged over all candidates';
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
const ST_OR_NONE = [{ value: String(NO_STATE), label: 'Choose… (none: board fees left out)' }, ...ST];
/**
 * CPA retakes are typed by the reader (editor's decision of 2026-11-08): the AICPA's pass rates are not
 * reproduced, since its terms limit their use to personal, non-commercial purposes. Until the reader types a
 * number the head says no retake is counted yet; the « Example » mention itself is shown once, by MentionExemple.
 */
const CPA_RATES_NOTE = 'Not sure how many? The CPA pass rates page links to the rate the AICPA (American Institute of Certified Public Accountants) publishes for each section, and turns a rate into tries.';
const retakesLabel = (k: number) => `${formatNumber(k, 0)} retake${k === 1 ? '' : 's'}`;
const cpaRetakeField = (help: string, showIf?: (v: Record<string, number>) => boolean) => ({ id: 'retakes', label: 'How many sections do you think you will retake?', def: 0, max: 40, help, showIf });
const CFA_BASIS = opt(['10-year average, 2017–2026', 'Sessions since Feb 2024', 'No retake (first try)']);
const BASIS_HELP = 'Not sure? Keep the ten-year average: it is the steadiest guide. “No retake” shows the price list.';
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
export const HOME_RETAKES = 0;

/** Beginner path (4th round, all three testers: “no way in for someone who starts from zero”). What each credential is
 *  and needs, in the words of the home page; every fact is stated with its source on the credential's own page. */
const WORK = [{ value: '6', label: 'Choose… (or not sure yet)' }, ...opt(['Accounting or audit', 'Tax returns', 'Investments', 'Advice on family money', 'Internal audit', 'Financial risk'])];
/** “Choose…” first, so the form does not answer for the reader (rule 5 of 2026-11-10); value 3 = not answered. */
const DEGREE = [{ value: '3', label: 'Choose…' }, ...opt(['No college degree', 'Bachelor’s degree', 'Bachelor’s + a fifth year'])];
const START = [
  { id: 'cpa-exam-cost', path: '/en/cpa-exam-cost/', name: 'CPA, Certified Public Accountant', short: 'CPA', what: 'The state license for accounting and audit work.', need: ['Not yet: most states ask for about five years of college (150 credit hours); some accept a bachelor’s degree with more work experience.', 'Enough where your state accepts a bachelor’s degree with more work experience; elsewhere, a fifth year of college.', 'Enough college; work experience comes before the license.'] },
  { id: 'enrolled-agent-exam', path: '/en/enrolled-agent-exam-cost/', name: 'Enrolled agent (EA), tax practitioner', short: 'enrolled agent', what: 'Authorized by the IRS to represent taxpayers before it.', need: ['Enough: no college degree is required.', 'Enough: no college degree is required.', 'Enough: no college degree is required.'] },
  { id: 'cfa-exam-cost', path: '/en/cfa-exam-cost/', name: 'CFA® Program, Chartered Financial Analyst®', short: 'CFA®', what: 'Three exams set by CFA Institute, for investment professionals.', need: ['Entry rules are set by CFA Institute: check them on its site before you register.', 'Entry rules are set by CFA Institute: check them on its site before you register.', 'Entry rules are set by CFA Institute: check them on its site before you register.'] },
  { id: 'cfp-certification-cost', path: '/en/cfp-certification-cost/', name: 'CFP® certification, financial planner', short: 'CFP®', what: 'For advice on personal financial planning.', need: ['Not yet: a bachelor’s degree is required to be certified, plus courses approved by CFP Board.', 'Enough college; courses approved by CFP Board and work experience come on top.', 'Enough college; courses approved by CFP Board and work experience come on top.'] },
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
      { ...cpaRetakeField(`Each section you retake costs ${m2(P.cpa.sectionFee)} again. ${RETAKE_HELP}`, (v) => Math.round(v.cert) === 0), def: HOME_RETAKES },
      // One meaning for every credential here: a total, added once (final round: “total” here, “per sitting” on the CFA® page).
      money('prep', 'Review course and books, your total for all the exams', 0, PREP_HELP),
      { id: 'years', label: 'Years of yearly fees to count, after you qualify', def: 0, unit: 'yrs', max: 40, help: `CFP®: ${m(P.cfp.annual)} a year once certified. EA: the tax preparer ID (PTIN), ${m2(P.ea.ptin)} a year; the first year is always counted.`, showIf: (v) => [2, 3].includes(Math.round(v.cert)) },
    ],
    run: (v, touched = {}) => {
      const c = Math.round(v.cert), w = win(v.timing), years = Math.max(0, Math.round(v.years));
      if (c === 1) {
        const r = E.cfaTotal({ window: w, rateBasis: 'tenYear', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 });
        const n = r.rows.reduce((a, x) => a + x.sittings, 0);
        return { head: [`With the usual retakes (ten-year pass rates): cost of the three CFA® exams`, m(r.exams + v.prep)], alert: prepAlert(v.prep), rows: [['Three exams, all passed the first time', m(r.firstTry)], ['Expected retakes (average pass rates of the last ten years)', rest(r.exams, r.firstTry)], prepRow(v.prep, 'Your review course and books, total'), ['Yearly CFA Institute membership, once you qualify', 'not counted']], hyp: `Assumes ${w === 'early' ? 'early' : 'standard'} registration and CFA Institute’s ten-year pass rates: ${tw(n).replace(/ tries$/, '')} exams in all, paid over the years it takes to pass.`, exemple: ['Example: CFA®, early registration, average retakes', 'change any figure to fit yours'] };
      }
      if (c === 2) {
        const t = (['early', 'standard'] as const)[v.timing === 1 ? 1 : 0];
        const r = E.cfpTotal({ window: t, education: 0, prep: v.prep, years, basis: 'latest' });
        const head = years > 0 ? `With the usual retakes: CFP® cost and ${formatNumber(years, 0)} certified year${years > 1 ? 's' : ''}${noPrep(v.prep)}` : `With the usual retakes (latest pass rates): cost to get CFP® certified${noPrep(v.prep)}`;
        return { exemple: ['Example: CFP®, early registration, average retakes', 'change any figure to fit yours'], head: [head, m(r.total)], alert: prepAlert(v.prep), rows: [['Exam, passed the first time', m(r.fee)], [extraLabel(r.sittings - 1), rest(r.exams, r.fee)], ['Application to CFP Board', m(P.cfp.application)], years > 0 ? [`Yearly certification fee × ${formatNumber(years, 0)}`, m(P.cfp.annual * years)] : ['Yearly certification fee, once certified', `${m(P.cfp.annual)} a year, not counted`], prepRow(v.prep)], hyp: `Assumes ${t === 'early' ? 'early' : 'standard'} registration and the latest pass rates (${pct(r.p1)} pass at the first try, ${pct(r.pr)} on a retake).`, note: 'A bachelor’s degree and courses approved by CFP Board are required; the school’s price is not included: add it on the CFP® page.' };
      }
      if (c === 3) {
        const r = E.eaTotal({ sittings: 3, prep: v.prep, years });
        const y = Math.max(1, years);
        return { exemple: ['Example: enrolled agent, every part passed the first time', 'change any figure to fit yours'], head: [`Enrolled agent fees, first-try price only${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['IRS exam, three parts', m(r.exams)], ['Enrollment with the IRS', m(r.enrollment)], [`Tax preparer ID, ${m2(P.ea.ptin)} a year × ${formatNumber(y, 0)}`, m(r.ptin)], prepRow(v.prep)], hyp: 'Assumes all three parts passed the first time, 2026 IRS fees.', note: `Each retake adds ${m(P.ea.perPart)}; the enrolled agent page counts them.` };
      }
      if (c === 4) {
        const r = E.ciaTotal({ member: false, year: '2026', extraSittings: 0, prep: v.prep });
        const mem = E.ciaTotal({ member: true, year: '2026', extraSittings: 0, prep: 0 });
        return { exemple: ['Example: CIA, non-member, every part passed the first time', 'change any figure to fit yours'], head: [`CIA fees, first-try price only, non-member${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['Application', m(r.application)], ['Three parts, passed the first time', m(r.exams)], prepRow(v.prep)], hyp: 'Assumes a non-member, all three parts passed the first time, 2026 prices.', note: `Members of The IIA (Institute of Internal Auditors) pay ${m(mem.total)} instead. Each retake adds about ${m(r.exams / 3)}.` };
      }
      if (c === 5) {
        const r = E.frmTotal({ window: w, extraSittings: 0, prep: v.prep });
        return { exemple: ['Example: FRM®, early registration, both parts passed the first time', 'change any figure to fit yours'], head: [`FRM® fees, first-try price only${noPrep(v.prep)}`, m(r.total)], alert: prepAlert(v.prep), rows: [['One-time enrollment', m(r.enrollment)], ['Part I and Part II, passed the first time', m(r.exams)], prepRow(v.prep)], hyp: 'Assumes early registration, both parts passed the first time.', note: `Each retake adds ${m(r.fee)}; the FRM® page counts them.` };
      }
      const a = E.cpaTotal({ state: null, retakes: v.retakes, prep: v.prep });
      const head = a.retakes ? `CPA exam fees with ${retakesLabel(a.retakes)}${noPrep(v.prep)}` : `CPA exam fees, all four sections passed the first time${noPrep(v.prep)}`;
      return { head: [head, fm(sumShown(a.firstTryExams, a.retakeExams, v.prep), 0)], hyp: 'Assumes 2026 section fees; state board fees left out.', alert: prepAlert(v.prep), rows: [[`Four sections, ${m2(P.cpa.sectionFee)} each`, m(a.firstTryExams)], [`Retakes you expect: ${formatNumber(a.retakes, 0)} × ${m2(P.cpa.sectionFee)}`, a.retakes ? m(a.retakeExams) : 'none typed'], prepRow(v.prep, 'Your review course and books, total'), ['Fees of your state’s accountancy board', 'not counted: they vary by state']], exemple: [`Example: CPA, ${retakesLabel(a.retakes)}, no review course`, 'change any figure to fit yours'] };
    },
  },

  /** Beginner path: two questions, one credential, its fees and what to check first. */
  start: {
    title: 'Not sure where to start? Two questions',
    cta: 'Compare all six credentials',
    ctaPage: 'home',
    inputs: [
      { id: 'work', label: 'What kind of work do you want to do?', def: 6, options: WORK, help: 'Accounting or audit: CPA. Tax returns: enrolled agent. Investments: CFA®. Advice on family money: CFP®. Internal audit: CIA. Financial risk: FRM®.' },
      { id: 'degree', label: 'How much college have you done?', def: 3, options: DEGREE, help: 'A bachelor’s degree is a four-year college degree. Not sure? Leave “Choose…”: the answer then lists what each one asks.' },
    ],
    run: (v) => {
      const k = WORK_TO[Math.max(0, Math.min(WORK_TO.length - 1, Math.round(v.work)))];
      const d = Math.max(0, Math.min(3, Math.round(v.degree)));
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
          head: ['If you pass every exam the first time: exam fees of the six', `${m(six[0].x)} to ${m(six[5].x)}`],
          hyp: 'Official fees, 2026 prices, early registration where there is a choice; review courses not included.',
          alert: `With the usual retakes, the dearest, the CFA®, comes to about ${m(cfa.exams)}.`,
          rows: six.map((c) => [c.name, m(c.x)] as [string, string]),
          note: d === 1 || d === 2 ? 'Pick the work you want above to see what that credential needs first and what a retake adds.' : `No college degree? The enrolled agent is the one credential here that asks for none: ${m(fl.ea[0])} at the first try. The CPA and the CFP® ask for a degree first.`,
          go: ['Compare all six with retakes ↓', '#compare-title'],
          exemple: ['Not sure yet: all six shown, cheapest first', 'pick the work you want above'],
        };
      }
      const blocked = (k === 0 || k === 3) && d === 0;
      const rows: Array<[string, string]> = [['What it is', c.what], ['With your studies', d === 3 ? 'Choose how much college you have done, above.' : c.need[d]], [k === 2 || k === 3 ? 'With retakes' : 'If you retake', retake]];
      const note = blocked ? `No degree yet? The enrolled agent asks for no college degree: ${m(fl.ea[0])} at the first try.` : 'Fees only: review courses, and for the CFP® the school program, come on top.';
      return { head: [`${c.name}: exam fees if you pass every exam the first time`, m(first)], hyp: 'Official fees, 2026 prices; review courses not included.', rows, note, go: [`See the full ${c.short} cost, step by step`, c.path] };
    },
  },

  'cfa-total': {
    title: 'CFA® Program: cost of the three levels',
    cta: 'How each level’s pass rate is used',
    ctaPage: 'cfa-pass-rates',
    inputs: [
      { id: 'timing', label: 'When you register', def: 0, options: TIMING, help: `Early registration costs ${m(P.cfa.fees.l1.standard - P.cfa.fees.l1.early)} less per exam than standard.` },
      { id: 'basis', label: 'Pass rates used for retakes', def: 0, options: CFA_BASIS, help: BASIS_HELP },
      money('prep', 'Review course and books, your total for the three levels', 0, PREP_HELP),
      money('dues', 'Yearly membership fees, once you hold the CFA® title', 0, 'Not sure? Leave it empty: these fees start only after you pass all three levels. Type an amount from your own invoice and a field for the number of years appears.'),
      { id: 'years', label: 'Years of membership fees to count', def: 0, unit: 'yrs', max: 40, showIf: (v) => v.dues > 0 },
    ],
    run: (v) => {
      const r = E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: 0, duesPerYear: v.dues, duesYears: v.dues > 0 ? v.years : 0 });
      const b = Math.max(0, Math.min(2, Math.round(v.basis)));
      const total = sumShown(...r.rows.map((x) => x.examCost), v.prep, r.dues);
      return { head: [`${b === 2 ? 'If every level is passed the first time' : `With the usual retakes (${CFA_BASIS_SHORT[b]})`}: cost of the three CFA® exams${noPrep(v.prep)}`, fm(total, 0)], hyp: `Assumes ${v.timing === 1 ? 'standard' : 'early'} registration and ${CFA_BASIS_SHORT[b]}; paid over the years it takes to pass the three levels.`, alert: prepAlert(v.prep), rows: [...r.rows.map((x) => [`${E.LEVEL_NAME[x.level]}: ${tw(x.sittings)} × ${m(x.fee)}`, m(x.examCost)] as [string, string]), prepRow(v.prep, 'Your review course and books, total'), ['Yearly membership, once you qualify', r.dues > 0 ? m(r.dues) : 'not counted']], note: `A try is one sitting of one exam; “2 to 3 tries” is the average over all candidates. If every level is passed the first time: ${m(r.firstTry)}.`, exemple: ['Example: early registration, ten-year pass rates, no course', 'change any figure to fit yours'] };
    },
  },
  'cfa-level1': {
    title: 'CFA® Level I: fee and expected sittings',
    cta: 'Price all three levels',
    ctaPage: 'cfa-exam-cost',
    inputs: [
      { id: 'timing', label: 'When you register', def: 0, options: TIMING },
      { id: 'basis', label: 'Pass rate used', def: 0, options: CFA_BASIS, help: BASIS_HELP },
      money('prep', 'Review course and books, your total for Level I', 0, PREP_HELP),
    ],
    run: (v) => {
      const r = E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: 0, duesPerYear: 0, duesYears: 0, levels: ['l1'] });
      const x = r.rows[0];
      return { exemple: ['Example: early registration, ten-year pass rate', 'change any figure to fit yours'], head: [`With the usual retakes (${pct(x.p)} pass rate): Level I cost`, m(r.total + v.prep)], hyp: `Assumes ${v.timing === 1 ? 'standard' : 'early'} registration and a ${pct(x.p)} pass rate.`, rows: [['Registration fee, each try', m(x.fee)], ['Tries to pass, on average', tw(x.sittings)], ['Chance of passing within two tries', pct(E.passWithin(x.p, 2))], prepRow(v.prep, 'Your review course and books, total')], note: `${P.cfa.examHours} hours, multiple choice. Results come ${P.cfa.resultsWeeks.min} to ${P.cfa.resultsWeeks.max} weeks after the window closes.` };
    },
  },
  'cfa-retake': {
    title: 'What a CFA® pass rate means for your budget',
    cta: 'Total for the three levels',
    ctaPage: 'cfa-exam-cost',
    inputs: [
      { id: 'level', label: 'Level', def: 0, options: LEVELS },
      { id: 'basis', label: 'Pass rate', def: 0, options: opt(['10-year average, 2017–2026', 'Latest session', 'Sessions since Feb 2024']), help: 'Not sure? Keep the ten-year average: it is the steadiest guide.' },
      { id: 'timing', label: 'When you register', def: 0, options: TIMING },
    ],
    run: (v) => {
      const l = lvl(v.level); const last = E.cfaLatest(l);
      const p = v.basis === 1 ? E.cfaRate(l, last.w) : v.basis === 2 ? E.cfaRecentRate(l) : E.cfaRate(l, 'tenYear');
      const n = E.expectedSittings(p); const fee = E.cfaFee(l, win(v.timing));
      return { exemple: [`Example: ${E.LEVEL_NAME[l]}, ten-year average`, 'pick another level or rate above'], head: [`Tries needed to pass ${E.LEVEL_NAME[l]}, on average`, tw(n).replace(/^about /, '')], hyp: `At a ${pct(p)} pass rate (${v.basis === 1 ? `session of ${wLabel(last.w)}` : v.basis === 2 ? 'sessions since February 2024' : 'ten-year average'}), all candidates counted together.`, rows: [['Passed within two tries', pct(E.passWithin(p, 2))], ['Passed within three tries', pct(E.passWithin(p, 3))], [`Expected exam fees, ${E.LEVEL_NAME[l]} only`, m(fee * n)]], note: 'A try is one sitting of one exam. The ten-year average is the one the CFA® cost page uses.' };
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
      money('education', 'Education program you pay a school', 0, 'The courses CFP Board approves; each school sets its price. Not sure? Leave it empty and ask the school: the total then shows CFP Board fees only.'),
      money('prep', 'Exam review and books', 0, PREP_HELP),
      { id: 'years', label: 'Certified years to count (yearly fee)', def: 0, unit: 'yrs', max: 40, help: `${m(P.cfp.annual)} a year once certified. Not sure? Leave 0 to see the cost of getting certified.` },
    ],
    run: (v) => {
      const t = (['early', 'standard', 'late'] as const)[Math.max(0, Math.min(2, Math.round(v.timing)))];
      const years = Math.max(0, Math.round(v.years));
      const r = E.cfpTotal({ window: t, education: v.education, prep: v.prep, years, basis: v.basis === 1 ? 'pooled' : 'latest' });
      const head = years > 0 ? `With the usual retakes: CFP® cost and ${formatNumber(years, 0)} certified year${years > 1 ? 's' : ''}` : 'With the usual retakes (latest pass rates): cost to get CFP® certified';
      const total = sumShown(r.fee, r.exams - r.fee, P.cfp.application, P.cfp.annual * years, v.education, v.prep);
      return { exemple: ['Example: early registration, latest pass rates, no school program yet', 'change any figure to fit yours'], head: [`${head}${noPrep(v.prep)}`, fm(total, 0)], alert: v.education > 0 ? prepAlert(v.prep) : 'Fees only. The education program a school charges is usually the biggest line: type it above, with any review course.', hyp: `Assumes ${t === 'early' ? 'early' : t} registration and the ${v.basis === 1 ? 'pass rates since March 2023' : 'latest pass rates'}: ${pct(r.p1)} pass at the first try, ${pct(r.pr)} on a retake.${years > 0 ? '' : ' Paid once, before the yearly fee starts.'}`, rows: [['Exam fee', m(r.fee)], [extraLabel(r.sittings - 1), rest(r.exams, r.fee)], ['Application', m(P.cfp.application)], years > 0 ? [`Yearly certification fee × ${formatNumber(years, 0)}`, m(P.cfp.annual * years)] : ['Yearly certification fee, once certified', `${m(P.cfp.annual)} a year, not counted`], ['Education program', v.education > 0 ? m(v.education) : 'not included yet'], prepRow(v.prep, 'Exam review and books')], note: years > 0 ? 'CFP Board prorates the first year’s fee; counting it whole keeps the total on the safe side.' : undefined };
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
      return { exemple: [`Example: the ${wLabel(s.w)} session, standard fee`, 'pick another session above'], head: ['Tries needed to pass, on average', tw(n).replace(/^about /, '')], rows: [['Overall pass rate', pct(E.cfpRate(s, 'all'))], ['First-time candidates', pct(p1)], ['Repeat candidates', pct(pr)], ['Expected exam fees', m(fee * n)]], note: `${formatNumber(s.all[0], 0)} candidates sat in ${wLabel(s.w)} (CFP Board statistics).` };
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
      { id: 'state', label: 'Your state (adds its board fees)', def: NO_STATE, options: ST_OR_NONE, help: 'Five states are covered. In another state, keep “Choose…” and check your board’s fee page.' },
      cpaRetakeField(`Each section you retake costs ${m2(P.cpa.sectionFee)} again, plus a board fee in California and Texas. ${RETAKE_HELP}`),
      money('prep', 'Review course and books', 0, PREP_HELP),
    ],
    run: (v, touched = {}) => {
      const none = Math.round(v.state) >= NO_STATE;
      const state = none ? null : st(v.state);
      const r = E.cpaTotal({ state, retakes: v.retakes, prep: v.prep });
      const example = !touched.retakes;
      // Section fee and board fee on separate lines, each with its own unit price (4th round: “0 × $268.59” next to “one retake costs $283.59”).
      const rows: Array<[string, string]> = [[`Four sections, ${m2(P.cpa.sectionFee)} each`, m(r.firstTryExams)], [`Retakes you expect: ${formatNumber(r.retakes, 0)} × ${m2(P.cpa.sectionFee)} section fee`, r.retakes ? m(r.retakeExams) : 'none typed']];
      const exams = sumShown(r.firstTryExams, r.retakeExams);
      for (const l of r.board) rows.push([l.label, l.amount === null ? 'not counted: check the board’s fee page' : m(l.amount)]);
      const boardShown = sumShown(...r.board.map((l) => l.amount ?? 0));
      rows.push(prepRow(v.prep));
      const total = exams + boardShown + Math.round(v.prep);
      const what = state ? `CPA exam and ${E.stateName(state)} board fees` : 'CPA exam fees';
      // The « Example » mention is MentionExemple's; the head says what is left out.
      const head = example ? `No retake counted yet: ${what} if all four sections pass the first time` : `${what} with ${retakesLabel(r.retakes)}`;
      const first = state ? `Exam fees ${m(exams)}, plus ${m(boardShown)} of ${E.stateName(state)} board fees we could confirm.` : 'Exam fees only: pick your state to add its board fees.';
      const extra = E.cpaRetakePrice(state) - P.cpa.sectionFee;
      const retakeSaid = extra > 0 ? `One retake costs ${m2(E.cpaRetakePrice(state))} here: the ${m2(P.cpa.sectionFee)} section fee, the same in every state, plus the board’s ${m(extra)} for a new try.` : `One retake costs the ${m2(P.cpa.sectionFee)} section fee, the same in every state; some boards add their own fee for a new try.`;
      return { head: [`${head}${noPrep(v.prep)}`, fm(total, 0)], hyp: state ? `Assumes 2026 fees and only the ${E.stateName(state)} board fees we could confirm.` : 'Assumes 2026 section fees; state board fees left out.', alert: prepAlert(v.prep), rows, note: `${first} ${retakeSaid}`, exemple: ['Starting point: every section passed the first time', 'type the retakes you expect'] };
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
      { id: 'rate', label: 'Pass rate you read for the section', def: 45, unit: '%', max: 100, decimals: 1, help: 'Type the rate the AICPA publishes for your section (link just above). Not sure? Keep 45%: it is an illustration, close to half.' },
      { id: 'n', label: 'Tries you budget for', def: 2, max: 10, help: 'Not sure? Keep 2.' },
    ],
    run: (v, touched = {}) => {
      const p = Math.max(0, Math.min(100, v.rate)) / 100; const n = Math.max(1, Math.round(v.n));
      const example = !touched.rate;
      const avg = E.expectedSittings(p);
      const ok = Number.isFinite(avg);
      const head = `At a ${pct(p)} pass rate: average fees for one section`;
      return { head: [head, ok ? m(avg * P.cpa.sectionFee) : '—'], hyp: `Each try costs ${m2(P.cpa.sectionFee)}; the rate counts all candidates, first-timers and repeaters together.`, rows: [['Tries to pass, on average', ok ? tw(avg) : 'no answer at 0%'], [`Chance of passing within ${formatNumber(n, 0)} tr${n > 1 ? 'ies' : 'y'}`, pct(E.passWithin(p, n))]], exemple: ['Illustration only: 45% is not an AICPA figure', 'type the rate you read on the AICPA page'], note: 'Your own odds may be better or worse than the average.' };
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
      return { exemple: [`Example: ${formatNumber(v.hours, 0)} semester hours, ${formatNumber(v.years, Number.isInteger(v.years) ? 0 : 1)} years of work`, 'type your own above'], head, rows, note: s === 'FL' ? 'Florida law still requires 150 hours for the license; 120 hours are enough to sit for the exam.' : s === 'CA' ? 'From January 1, 2027 the California Board of Accountancy mentions extra flexibility for candidates with an advanced degree or changing careers; it is not modeled here, so check with the board.' : s === 'NY' ? 'From August 1, 2027 the 150-hour route follows the course content of the 150E pathway; content rules apply on top of the hours.' : 'Course content rules (accounting and business credits) apply on top of the hours: the board’s page, in the sources below, lists them.' };
    },
  },

  'ea-total': {
    title: 'Enrolled agent: cost of the IRS exam and enrollment',
    cta: 'Compare with the CPA',
    ctaPage: 'cpa-exam-cost',
    // Same question as the CPA calculator (4th round: “retakes from 0 there, parts from 3 here”).
    inputs: [{ id: 'retakes', label: 'How many parts do you think you will retake?', def: 0, max: 27, help: `The IRS exam has three parts at ${m(P.ea.perPart)} each; each part you retake costs ${m(P.ea.perPart)} again. ${RETAKE_HELP}` }, money('prep', 'Review course and books', 0, PREP_HELP), { id: 'years', label: 'Years of tax preparer ID to count', def: 1, unit: 'yrs', max: 40, help: `The tax preparer ID (PTIN) costs ${m2(P.ea.ptin)} and is renewed every year.` }],
    run: (v) => {
      const retakes = Math.max(0, Math.round(v.retakes)), n = P.ea.parts + retakes, y = Math.max(1, Math.round(v.years));
      const r = E.eaTotal({ sittings: n, prep: v.prep, years: y });
      const total = sumShown(r.exams, r.enrollment, r.ptin, v.prep);
      return { exemple: ['Starting point: all three parts passed the first time', 'type the retakes you expect'], head: [`Enrolled agent fees${retakes ? '' : ', all three parts passed the first time'}${noPrep(v.prep)}`, fm(total, 0)], alert: prepAlert(v.prep), rows: [[`IRS exam: ${m(P.ea.perPart)} × ${formatNumber(n, 0)}${retakes ? ` (${formatNumber(retakes, 0)} retake${retakes > 1 ? 's' : ''})` : ''}`, m(r.exams)], ['Enrollment with the IRS', m(r.enrollment)], [`Tax preparer ID, ${m2(P.ea.ptin)} a year × ${formatNumber(y, 0)}`, m(r.ptin)], prepRow(v.prep)], hyp: `Assumes 2026 IRS fees and ${formatNumber(y, 0)} year${y > 1 ? 's' : ''} of tax preparer ID.`, note: `The IRS publishes no pass rate, so retakes are the ones you type. Passed parts stay valid for ${P.ea.carryoverYears} years.` };
    },
  },
  'cia-total': {
    title: 'CIA: application and three exam parts',
    cta: 'Compare every credential',
    ctaPage: 'home',
    inputs: [{ id: 'member', label: 'Member of the Institute of Internal Auditors?', def: 0, options: opt(['No', 'Yes']) }, { id: 'year', label: 'Price list', def: 0, options: opt(['2026 prices', `Prices from ${dd(P.cia.y2027.from)}`]) }, { id: 'extra', label: 'Retakes you budget', def: 0, max: 10, help: RETAKE_HELP }, money('prep', 'Review course and books', 0, PREP_HELP)],
    run: (v) => {
      const r = E.ciaTotal({ member: v.member === 1, year: v.year === 1 ? '2027' : '2026', extraSittings: Math.max(0, Math.round(v.extra)), prep: v.prep });
      return { exemple: ['Example: non-member, 2026 prices, no retake', 'change any figure to fit yours'], head: [`CIA fees${noPrep(v.prep)}`, fm(sumShown(r.application, ...r.parts, r.retakes, v.prep), 0)], alert: prepAlert(v.prep), rows: [['Application', m(r.application)], ['Part 1', m(r.parts[0])], ['Part 2', m(r.parts[1])], ['Part 3', m(r.parts[2])], ['Retakes (average part fee)', m(r.retakes)], prepRow(v.prep)], hyp: `Assumes ${v.member === 1 ? 'a member' : 'a non-member'}, ${v.year === 1 ? 'the prices from ' + dd(P.cia.y2027.from) : '2026 prices'}.`, note: `You have ${P.cia.eligibilityYears} years from acceptance into the program to complete the eligibility requirements.` };
    },
  },
  'frm-total': {
    title: 'FRM: enrollment and two exam parts',
    cta: 'Compare every credential',
    ctaPage: 'home',
    inputs: [{ id: 'timing', label: 'When you register', def: 0, options: TIMING }, { id: 'extra', label: 'Retakes you budget', def: 0, max: 10, help: RETAKE_HELP }, money('prep', 'Review course and books', 0, PREP_HELP)],
    run: (v) => {
      const r = E.frmTotal({ window: win(v.timing), extraSittings: Math.max(0, Math.round(v.extra)), prep: v.prep });
      return { exemple: ['Example: early registration, no retake', 'change any figure to fit yours'], head: [`FRM® fees${noPrep(v.prep)}`, fm(sumShown(r.enrollment, r.exams, v.prep), 0)], alert: prepAlert(v.prep), rows: [['One-time enrollment', m(r.enrollment)], [`Exam fee × ${formatNumber(P.frm.parts + Math.round(v.extra), 0)}`, m(r.exams)], prepRow(v.prep)], hyp: `Assumes ${v.timing === 1 ? 'standard' : 'early'} registration, 2027 sessions.`, note: `Part I and Part II cost the same: ${m(P.frm.early)} early, ${m(P.frm.standard)} standard.` };
    },
  },
};

/**
 * Review course: a choice first, “Not counted yet” by default (rule 5 of 2026-11-10: a way out for a reader who has no
 * price, and no default that answers for her). “Rough guess” counts as much as the exam fees of the same calculator,
 * the order of size the site states everywhere; “my own amount” shows the money field. Nothing is loaded from a seller.
 */
const PREP_WAY = opt(['Not counted yet', 'Rough guess: as much as the exam fees', 'I will type my own amount']);
function withPrepGuess(spec: MiniSpec, feesOf: (v: Record<string, number>) => number): MiniSpec {
  const inputs = spec.inputs.flatMap((i) => (i.id !== 'prep' ? [i] : [
    { id: 'prepWay', label: 'Review course and books', def: 0, options: PREP_WAY, help: 'Not sure? Pick the rough guess: courses and books often cost as much as the exam fees, or more. This site sells none.' },
    { ...i, label: 'Your review course and books, total', help: undefined, showIf: (v: Record<string, number>) => Math.round(v.prepWay) === 2 },
  ]));
  return { ...spec, inputs, run: (v, touched) => {
    const way = Math.round(v.prepWay || 0);
    const prep = way === 1 ? Math.round(feesOf(v)) : way === 2 ? v.prep : 0;
    const out = spec.run({ ...v, prep }, touched);
    if (way !== 1) return out;
    return { ...out, rows: out.rows.map(([l, x]) => (/review|course and books/i.test(l) ? [`${l.replace(/, total$/, '')}: rough guess, as much as the exam fees`, x] : [l, x]) as [string, string]) };
  } };
}
const GUESS: Record<string, (v: Record<string, number>) => number> = {
  'cpa-total': (v) => E.cpaTotal({ state: null, retakes: v.retakes, prep: 0 }).exams,
  'cfa-total': (v) => E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).exams,
  'cfa-level1': (v) => E.cfaTotal({ window: win(v.timing), rateBasis: cfaBasis(v.basis), prepPerLevel: 0, duesPerYear: 0, duesYears: 0, levels: ['l1'] }).exams,
  'cfp-total': (v) => E.cfpTotal({ window: (['early', 'standard', 'late'] as const)[Math.max(0, Math.min(2, Math.round(v.timing)))], education: 0, prep: 0, years: 0, basis: v.basis === 1 ? 'pooled' : 'latest' }).exams,
  'ea-total': (v) => E.eaTotal({ sittings: P.ea.parts + Math.max(0, Math.round(v.retakes)), prep: 0, years: 1 }).exams,
  'cia-total': (v) => E.ciaTotal({ member: v.member === 1, year: v.year === 1 ? '2027' : '2026', extraSittings: Math.max(0, Math.round(v.extra)), prep: 0 }).exams,
  'frm-total': (v) => E.frmTotal({ window: win(v.timing), extraSittings: Math.max(0, Math.round(v.extra)), prep: 0 }).exams,
};
for (const [k, f] of Object.entries(GUESS)) SPECS[k] = withPrepGuess(SPECS[k], f);

export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini spec: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
