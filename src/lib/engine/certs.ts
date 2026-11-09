/**
 * Engine: pure functions over the parameter file. Every fee comes from `params-2026.json`; nothing is typed
 * here. CPA totals use no pass rate (see `cpaTotal`). Expected attempts follow a geometric model: with a pass chance p at each sitting, the average number
 * of sittings until a pass is 1 / p. When first-time and repeat rates are published separately (CFP Board),
 * the average is 1 + (1 − p₁) / pᵣ.
 */
import { P } from './params';

export type Window = 'early' | 'standard';
export type CfaLevel = 'l1' | 'l2' | 'l3';
export const CFA_LEVELS: CfaLevel[] = ['l1', 'l2', 'l3'];
export const LEVEL_NAME: Record<CfaLevel, string> = { l1: 'Level I', l2: 'Level II', l3: 'Level III' };

/** Average number of sittings to pass with a constant pass chance p (0 < p ≤ 1). */
export function expectedSittings(p: number): number {
  if (!(p > 0)) return Infinity;
  return 1 / Math.min(1, p);
}
/** Average sittings when the first try and the retries have different pass chances. */
export function expectedSittings2(pFirst: number, pRepeat: number): number {
  if (!(pFirst > 0) || !(pRepeat > 0)) return Infinity;
  return 1 + (1 - Math.min(1, pFirst)) / Math.min(1, pRepeat);
}
/** Chance of passing within n sittings at a constant pass chance p. */
export const passWithin = (p: number, n: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), Math.max(0, n));

// ---------- CFA ----------
type Sess = (typeof P.cfa.sessions)[number];
export const cfaSessions = P.cfa.sessions as Array<Sess & Partial<Record<CfaLevel, number[]>>>;
export function cfaRate(level: CfaLevel, w?: string): number {
  if (!w || w === 'tenYear') { const [s, p] = P.cfa.tenYear[level]; return p / s; }
  if (w === 'sinceStart') { const [s, p] = P.cfa.sinceStart[level]; return p / s; }
  const s = cfaSessions.find((x) => x.w === w)?.[level];
  if (!s) throw new Error(`No CFA ${level} result for ${w}`);
  return s[1] / s[0];
}
/** Average rate over the sessions of the last n years held in the file, weighted by candidates. */
export function cfaRecentRate(level: CfaLevel): number {
  let sat = 0, pass = 0;
  for (const s of cfaSessions) { const r = s[level]; if (r) { sat += r[0]; pass += r[1]; } }
  return pass / sat;
}
export const cfaLatest = (level: CfaLevel) => [...cfaSessions].reverse().find((s) => s[level])!;
export const cfaFee = (level: CfaLevel, w: Window) => P.cfa.fees[level][w];

export interface CfaInput { window: Window; rateBasis: 'tenYear' | 'recent' | 'first'; prepPerLevel: number; duesPerYear: number; duesYears: number; levels?: CfaLevel[] }
export function cfaTotal(i: CfaInput) {
  const levels = i.levels ?? CFA_LEVELS;
  const rows = levels.map((l) => {
    const p = i.rateBasis === 'first' ? 1 : i.rateBasis === 'recent' ? cfaRecentRate(l) : cfaRate(l, 'tenYear');
    const sittings = expectedSittings(p);
    const fee = cfaFee(l, i.window);
    return { level: l, p, sittings, fee, examCost: fee * sittings, firstTry: fee };
  });
  const exams = rows.reduce((a, r) => a + r.examCost, 0);
  const firstTry = rows.reduce((a, r) => a + r.firstTry, 0);
  const prep = i.prepPerLevel * rows.reduce((a, r) => a + r.sittings, 0);
  const dues = i.duesPerYear * i.duesYears;
  return { rows, exams, firstTry, retakes: exams - firstTry, prep, dues, total: exams + prep + dues };
}

/** CFA retake spacing: a retake cannot be in the next window nor in one six months or less later. */
export function cfaNextRetake(month: number, level: CfaLevel): { month: number; yearsAhead: number } {
  const offered = P.cfa.offered[level];
  for (let k = 7; k <= 24; k++) {
    const m = ((month - 1 + k) % 12) + 1;
    if (offered.includes(m)) return { month: m, yearsAhead: Math.floor((month - 1 + k) / 12) };
  }
  return { month, yearsAhead: 1 };
}
/** First window offering `level` at least `gap` months after `month` (next level after a pass). */
export function cfaNextLevelWindow(month: number, level: CfaLevel, gap = 3): { month: number; yearsAhead: number } {
  const offered = P.cfa.offered[level];
  for (let k = gap; k <= 24; k++) {
    const m = ((month - 1 + k) % 12) + 1;
    if (offered.includes(m)) return { month: m, yearsAhead: Math.floor((month - 1 + k) / 12) };
  }
  return { month, yearsAhead: 1 };
}
/** Fastest path through the three levels from a Level I window (month, year), passing each first time. */
export function cfaFastestPath(startMonth: number, startYear: number, gap = 3) {
  const out: Array<{ level: CfaLevel; month: number; year: number }> = [{ level: 'l1', month: startMonth, year: startYear }];
  let m = startMonth, y = startYear;
  for (const l of ['l2', 'l3'] as CfaLevel[]) {
    const n = cfaNextLevelWindow(m, l, gap); y += n.yearsAhead; m = n.month; out.push({ level: l, month: m, year: y });
  }
  return out;
}

// ---------- CFP ----------
type CfpSess = (typeof P.cfp.sessions)[number];
export const cfpSessions = P.cfp.sessions as CfpSess[];
export const cfpRate = (s: CfpSess, k: 'all' | 'first' | 'repeat') => s[k][1] / s[k][0];
export function cfpPooled(k: 'all' | 'first' | 'repeat') {
  let sat = 0, pass = 0; for (const s of cfpSessions) { sat += s[k][0]; pass += s[k][1]; } return pass / sat;
}
export const cfpLatest = () => cfpSessions[cfpSessions.length - 1];
export type CfpWindow = 'early' | 'standard' | 'late';
export interface CfpInput { window: CfpWindow; education: number; prep: number; years: number; basis: 'latest' | 'pooled' }
export function cfpTotal(i: CfpInput) {
  const s = cfpLatest();
  const p1 = i.basis === 'latest' ? cfpRate(s, 'first') : cfpPooled('first');
  const pr = i.basis === 'latest' ? cfpRate(s, 'repeat') : cfpPooled('repeat');
  const sittings = expectedSittings2(p1, pr);
  const fee = P.cfp.exam[i.window];
  const exams = fee * sittings;
  const certification = P.cfp.application + P.cfp.annual * i.years;
  return { p1, pr, sittings, fee, exams, retakes: exams - fee, certification, education: i.education, prep: i.prep, total: exams + certification + i.education + i.prep };
}
/** Months to log the experience hours at a steady number of hours a week (52 weeks a year). */
export const monthsForHours = (hours: number, perWeek: number) => (perWeek > 0 ? (hours / perWeek) * (12 / 52) : Infinity);

// ---------- CPA ----------
export type Discipline = 'BAR' | 'ISC' | 'TCP';
export type Section = 'AUD' | 'FAR' | 'REG' | Discipline;
export const CORE: Section[] = ['AUD', 'FAR', 'REG'];
export const DISCIPLINES: Discipline[] = ['BAR', 'ISC', 'TCP'];
export const SECTION_NAME: Record<Section, string> = { AUD: 'Auditing and Attestation', FAR: 'Financial Accounting and Reporting', REG: 'Taxation and Regulation', BAR: 'Business Analysis and Reporting', ISC: 'Information Systems and Controls', TCP: 'Tax Compliance and Planning' };
export type StateCode = keyof typeof P.cpa.states;
export const STATES = Object.keys(P.cpa.states) as StateCode[];
export const stateName = (s: StateCode) => P.cpa.states[s].name;

/** State board fees that apply to one candidate and were read on the board's site; null = not read. */
export function stateFees(s: StateCode, sittings: number) {
  const st = P.cpa.states[s] as Record<string, unknown>;
  const lines: Array<{ label: string; amount: number | null }> = [];
  if (s === 'CA') lines.push({ label: 'California board, first exam application', amount: st.examFirst as number }, { label: 'California board, repeat applications (one per retake, an estimate)', amount: (st.examRepeat as number) * Math.max(0, Math.ceil(sittings - 4)) }, { label: 'California board, license fees', amount: null });
  if (s === 'TX') lines.push({ label: 'Texas board fee to apply for each section, $15 a try', amount: (st.perSection as number) * sittings }, { label: 'Texas board, CPA certificate', amount: st.certificate as number }, { label: 'Texas board, application of intent and license fee', amount: null });
  if (s === 'NY') lines.push({ label: 'New York board, license and first registration', amount: st.license as number }, { label: 'New York, exam application fee', amount: null });
  if (s === 'PA') lines.push({ label: 'Pennsylvania board, first CPA license', amount: st.license as number }, { label: 'Pennsylvania, exam application fee', amount: null });
  if (s === 'FL') lines.push({ label: 'Florida board, exam application and license fees', amount: null });
  return lines;
}

/**
 * Price of one retake of one section: the section fee paid again, plus the board fee charged for each new try
 * where one was read (California repeat application, Texas per-section eligibility fee). No state: section fee only.
 */
export function cpaRetakePrice(s: StateCode | null = null): number {
  const extra = s === 'CA' ? (P.cpa.states.CA.examRepeat as number) : s === 'TX' ? P.cpa.states.TX.perSection : 0;
  return P.cpa.sectionFee + extra;
}

/**
 * CPA exam fees without any pass rate (editor's decision of 2026-11-08: the AICPA's terms limit the use of its
 * pass-rate page to personal, non-commercial use, so none is reproduced). Four sections at the first try, plus
 * the number of section retakes the reader expects, each paid at the section fee again. `state: null` = no
 * state chosen, no board fee. The four-section first-try price is the one CPA headline figure of the site.
 */
export interface CpaInput { state: StateCode | null; retakes: number; prep: number }
export function cpaTotal(i: CpaInput) {
  const retakes = Math.max(0, Math.round(i.retakes || 0));
  const sittings = 4 + retakes;
  const firstTryExams = 4 * P.cpa.sectionFee;
  const retakeExams = retakes * P.cpa.sectionFee;
  const exams = firstTryExams + retakeExams;
  const board = i.state ? stateFees(i.state, sittings) : [];
  const boardKnown = board.reduce((a, l) => a + (l.amount ?? 0), 0);
  const unread = board.filter((l) => l.amount === null).map((l) => l.label);
  return { retakes, sittings, firstTryExams, retakeExams, exams, board, boardKnown, unread, prep: i.prep, total: exams + boardKnown + i.prep };
}
/** Section fees still to pay: sections not yet passed, plus the retakes the reader expects. */
export function cpaLeft(passed: number, retakes: number) {
  const left = Math.max(0, Math.min(4, 4 - Math.round(passed)));
  const r = Math.max(0, Math.round(retakes || 0));
  return { left, retakes: r, sittings: left + r, fees: (left + r) * P.cpa.sectionFee };
}

/** Which licensure route a candidate fits in a state, from credit hours and years of experience. */
export interface Route { name: string; hours: number; years: number; from?: string; until?: string }
export function cpaRoutes(s: StateCode): Route[] {
  const st = P.cpa.states[s] as any;
  const r: Route[] = [];
  if (s === 'CA') { r.push({ name: '150 semester units and one year of experience (rules in force until December 31, 2026)', hours: 150, years: st.now.expYears, until: st.next.from }); r.push({ name: 'Bachelor’s degree with an accounting concentration and two years of experience (from January 1, 2027)', hours: 120, years: st.next.expYears, from: st.next.from }); }
  if (s === 'NY') { r.push({ name: '150-semester-hour pathway with one year of experience (course content rules of the 150E pathway from August 1, 2027)', hours: 150, years: 1 }); r.push({ name: '120-semester-hour pathway with two years of experience', hours: 120, years: 2, from: st.next.from }); }
  if (s === 'TX') { r.push({ name: 'Pathway A: 150 semester hours and 12 months of experience', hours: 150, years: 1 }); r.push({ name: 'Pathway B: 120 semester hours and 24 months of experience', hours: 120, years: 2, from: st.next.from }); }
  if (s === 'PA') { r.push({ name: '150 semester credits and 1,600 hours over at least 12 months', hours: 150, years: 1 }); r.push({ name: 'Bachelor’s degree with fewer than 150 credits and 3,200 hours over 24 months', hours: 120, years: 2 }); }
  if (s === 'FL') { r.push({ name: '150 semester hours and one year of experience (Florida law)', hours: 150, years: 1 }); }
  return r;
}
/** ISO date compare: is `d` on or after `from` and before `until`? */
export const inForce = (r: Route, d: string) => (!r.from || d >= r.from) && (!r.until || d < r.until);
export function cpaEligibility(s: StateCode, hours: number, years: number, date: string) {
  const routes = cpaRoutes(s).map((r) => ({ ...r, open: inForce(r, date), hoursShort: Math.max(0, r.hours - hours), yearsShort: Math.max(0, r.years - years) }));
  const fits = routes.filter((r) => r.open && r.hoursShort === 0 && r.yearsShort === 0);
  const open = routes.filter((r) => r.open);
  const nearest = [...open].sort((a, b) => (a.hoursShort / 30 + a.yearsShort) - (b.hoursShort / 30 + b.yearsShort))[0];
  return { routes, fits, nearest };
}

// ---------- EA, CIA, FRM ----------
export function eaTotal(i: { sittings: number; prep: number; years: number }) {
  const exams = P.ea.perPart * i.sittings;
  const ptin = P.ea.ptin * Math.max(1, i.years);
  return { exams, irsShare: P.ea.irsUserFee * i.sittings, vendorShare: (P.ea.perPart - P.ea.irsUserFee) * i.sittings, enrollment: P.ea.enrollment, ptin, prep: i.prep, total: exams + P.ea.enrollment + ptin + i.prep };
}
export function ciaTotal(i: { member: boolean; year: '2026' | '2027'; extraSittings: number; prep: number }) {
  const t = i.year === '2027' ? P.cia.y2027 : P.cia.y2026; const k = i.member ? 0 : 1;
  const parts = [t.p1[k], t.p2[k], t.p3[k]];
  const avgPart = (parts[0] + parts[1] + parts[2]) / 3;
  const exams = parts[0] + parts[1] + parts[2] + avgPart * i.extraSittings;
  return { application: t.application[k], parts, exams, retakes: avgPart * i.extraSittings, prep: i.prep, total: t.application[k] + exams + i.prep };
}
export function frmTotal(i: { window: Window; extraSittings: number; prep: number }) {
  const fee = P.frm[i.window];
  const exams = fee * (P.frm.parts + i.extraSittings);
  return { fee, exams, enrollment: P.frm.enrollment, prep: i.prep, total: P.frm.enrollment + exams + i.prep };
}

/** Official fees for one person passing everything the first time (no prep, no dues): the floor of each credential. */
export function floors() {
  const cfaE = cfaTotal({ window: 'early', rateBasis: 'first', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).total;
  const cfaS = cfaTotal({ window: 'standard', rateBasis: 'first', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).total;
  return {
    cfa: [cfaE, cfaS],
    cpa: [4 * P.cpa.sectionFee, 4 * P.cpa.sectionFee],
    cfp: [P.cfp.exam.early + P.cfp.application, P.cfp.exam.late + P.cfp.application],
    ea: [P.ea.perPart * P.ea.parts + P.ea.enrollment + P.ea.ptin, P.ea.perPart * P.ea.parts + P.ea.enrollment + P.ea.ptin],
    cia: [ciaTotal({ member: true, year: '2026', extraSittings: 0, prep: 0 }).total, ciaTotal({ member: false, year: '2026', extraSittings: 0, prep: 0 }).total],
    frm: [frmTotal({ window: 'early', extraSittings: 0, prep: 0 }).total, frmTotal({ window: 'standard', extraSittings: 0, prep: 0 }).total],
  };
}
