/** Engine tests (RECETTE §17.3, §17.4): each case is computed by hand from the source it cites. */
import { describe, it, expect } from 'vitest';
import * as E from '../src/lib/engine/certs';
import { P } from '../src/lib/engine/params';
import { getSpec } from '../src/lib/mini-specs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MiniSim from '../src/components/calc/MiniSim';

describe('expected sittings', () => {
  it('geometric mean 1 / p, and odds within n tries', () => {
    expect(E.expectedSittings(0.5)).toBe(2);
    expect(E.expectedSittings(1)).toBe(1);
    expect(E.passWithin(0.5, 2)).toBeCloseTo(0.75, 10);
    expect(E.passWithin(0.4, 3)).toBeCloseTo(1 - 0.6 ** 3, 10);
  });
  it('two rates (CFP Board): 1 + (1 − p1) / pr', () => {
    expect(E.expectedSittings2(0.7, 0.5)).toBeCloseTo(1.6, 10);
    expect(E.expectedSittings2(1, 0.5)).toBe(1);
  });
});

describe('CFA® Program (CFA Institute, pricing changes of December 18, 2024; results file 1963-2026)', () => {
  it('first-try total equals the $3,520 to $4,570 range CFA Institute states', () => {
    expect(E.cfaTotal({ window: 'early', rateBasis: 'first', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).total).toBe(P.cfa.programTotal.low);
    expect(E.cfaTotal({ window: 'standard', rateBasis: 'first', prepPerLevel: 0, duesPerYear: 0, duesYears: 0 }).total).toBe(P.cfa.programTotal.high);
    expect(P.cfa.programTotal.low).toBe(1140 + 1140 + 1240);
  });
  it('Level I ten-year rate 422,652 / 1,044,523; August 2026 Level I 12,168 / 28,145', () => {
    expect(E.cfaRate('l1', 'tenYear')).toBeCloseTo(422652 / 1044523, 12);
    expect(E.cfaRate('l1', '2026-08')).toBeCloseTo(12168 / 28145, 12);
  });
  it('expected fees: fee / rate for each level, prep per sitting', () => {
    const r = E.cfaTotal({ window: 'early', rateBasis: 'tenYear', prepPerLevel: 100, duesPerYear: 300, duesYears: 2 });
    const want = 1140 / E.cfaRate('l1') + 1140 / E.cfaRate('l2') + 1240 / E.cfaRate('l3');
    expect(r.exams).toBeCloseTo(want, 8);
    expect(r.prep).toBeCloseTo(100 * (1 / E.cfaRate('l1') + 1 / E.cfaRate('l2') + 1 / E.cfaRate('l3')), 8);
    expect(r.dues).toBe(600);
  });
  it('retake not in a window six months or less after a fail', () => {
    expect(E.cfaNextRetake(2, 'l1')).toEqual({ month: 11, yearsAhead: 0 });
    expect(E.cfaNextRetake(11, 'l1')).toEqual({ month: 8, yearsAhead: 1 });
    expect(E.cfaNextRetake(8, 'l3')).toEqual({ month: 8, yearsAhead: 1 });
  });
});

describe('CFP® certification (CFP Board registration, final steps and statistics)', () => {
  it('July 2026: 1,910 / 2,768 first-time, 490 / 853 repeat', () => {
    const s = E.cfpLatest();
    expect(s.w).toBe('2026-07');
    expect(E.cfpRate(s, 'first')).toBeCloseTo(1910 / 2768, 12);
    expect(E.cfpRate(s, 'repeat')).toBeCloseTo(490 / 853, 12);
  });
  it('total = fee × sittings + $250 + $575 × years + education + prep', () => {
    const r = E.cfpTotal({ window: 'early', education: 5000, prep: 400, years: 3, basis: 'latest' });
    const n = 1 + (1 - 1910 / 2768) / (490 / 853);
    expect(r.total).toBeCloseTo(825 * n + 250 + 575 * 3 + 5000 + 400, 8);
  });
  it('6,000 hours at 40 a week take 150 weeks', () => {
    expect(E.monthsForHours(6000, 40)).toBeCloseTo(150 * 12 / 52, 10);
  });
});

describe('CPA (Virginia Board of Accountancy; state boards; no AICPA pass rate)', () => {
  it('four sections at $268.59 at the first sitting: $1,074.36, the CPA headline', () => {
    const r = E.cpaTotal({ state: null, retakes: 0, prep: 0 });
    expect(r.exams).toBeCloseTo(4 * 268.59, 8);
    expect(r.exams).toBeCloseTo(1074.36, 8);
    expect(r.sittings).toBe(4);
    expect(r.board.length).toBe(0);
    expect(E.floors().cpa[0]).toBeCloseTo(r.exams, 8);
  });
  it('no pass rate left in the parameter file (editor, 2026-11-08: AICPA terms, personal non-commercial use)', () => {
    expect('rates' in P.cpa).toBe(false);
    expect('ratesPage' in P.cpa).toBe(false);
  });
  it('retakes typed by the reader: each adds the section fee', () => {
    const r = E.cpaTotal({ state: null, retakes: 2, prep: 500 });
    expect(r.exams).toBeCloseTo(6 * 268.59, 8);
    expect(r.retakeExams).toBeCloseTo(2 * 268.59, 8);
    expect(r.total).toBeCloseTo(6 * 268.59 + 500, 8);
    expect(E.cpaTotal({ state: null, retakes: -3, prep: 0 }).retakes).toBe(0);
  });
  it('New York: $427 license, no fee for a new try', () => {
    const r = E.cpaTotal({ state: 'NY', retakes: 1, prep: 0 });
    expect(r.boardKnown).toBe(427);
    expect(E.cpaRetakePrice('NY')).toBeCloseTo(268.59, 8);
  });
  it('Texas: $15 per section sat plus the $50 certificate; a retake costs $283.59', () => {
    expect(E.cpaTotal({ state: 'TX', retakes: 0, prep: 0 }).boardKnown).toBe(15 * 4 + 50);
    expect(E.cpaTotal({ state: 'TX', retakes: 1, prep: 0 }).boardKnown).toBe(15 * 5 + 50);
    expect(E.cpaRetakePrice('TX')).toBeCloseTo(283.59, 8);
  });
  it('California: $100 first application, $50 repeat application per retake (estimate)', () => {
    expect(E.cpaTotal({ state: 'CA', retakes: 0, prep: 0 }).boardKnown).toBe(100);
    expect(E.cpaTotal({ state: 'CA', retakes: 2, prep: 0 }).boardKnown).toBe(100 + 2 * 50);
    expect(E.cpaRetakePrice('CA')).toBeCloseTo(318.59, 8);
    expect(E.cpaRetakePrice()).toBeCloseTo(268.59, 8);
  });
  it('sections left: two passed and one retake leave three tries', () => {
    expect(E.cpaLeft(2, 1).sittings).toBe(3);
    expect(E.cpaLeft(2, 1).fees).toBeCloseTo(3 * 268.59, 8);
    expect(E.cpaLeft(4, 0).fees).toBe(0);
  });
  it('unread fees are listed, never counted', () => {
    const r = E.cpaTotal({ state: 'FL', retakes: 0, prep: 0 });
    expect(r.boardKnown).toBe(0);
    expect(r.unread.length).toBeGreaterThan(0);
  });
  it('New York 120-hour pathway opens on November 21, 2026', () => {
    expect(E.cpaEligibility('NY', 120, 2, '2026-11-20').fits.length).toBe(0);
    expect(E.cpaEligibility('NY', 120, 2, '2026-11-21').fits[0].hours).toBe(120);
    expect(E.cpaEligibility('NY', 150, 1, '2027-09-01').fits[0].hours).toBe(150);
  });
  it('California: 150 units and 1 year until 2026, degree and 2 years from 2027', () => {
    expect(E.cpaEligibility('CA', 150, 1, '2026-12-31').fits[0].hours).toBe(150);
    expect(E.cpaEligibility('CA', 150, 1, '2027-01-01').fits.length).toBe(0);
    expect(E.cpaEligibility('CA', 120, 2, '2027-01-01').fits[0].hours).toBe(120);
  });
  it('Florida keeps 150 hours for the license', () => {
    expect(E.cpaEligibility('FL', 120, 5, '2027-09-01').fits.length).toBe(0);
  });
});

describe('EA, CIA, FRM®', () => {
  it('SEE: $317 a part, $66 of it the IRS user fee; Form 23 $140; PTIN $18.75', () => {
    const r = E.eaTotal({ sittings: 3, prep: 0, years: 1 });
    expect(r.total).toBeCloseTo(3 * 317 + 140 + 18.75, 8);
    expect(r.irsShare).toBe(3 * 66);
  });
  it('CIA 2026 member: 120 + 310 + 280 + 280; 2027 non-member: 195 + 475 + 435 + 435', () => {
    expect(E.ciaTotal({ member: true, year: '2026', extraSittings: 0, prep: 0 }).total).toBe(990);
    expect(E.ciaTotal({ member: false, year: '2027', extraSittings: 0, prep: 0 }).total).toBe(1540);
  });
  it('FRM®: $400 + 2 × $600 early', () => {
    expect(E.frmTotal({ window: 'early', extraSittings: 0, prep: 0 }).total).toBe(1600);
    expect(E.frmTotal({ window: 'standard', extraSittings: 1, prep: 0 }).total).toBe(400 + 3 * 800);
  });
});

describe('CPA calculators: retakes typed, result marked “Example” until then', () => {
  const def = (kind: string) => Object.fromEntries(getSpec(kind).inputs.map((i) => [i.id, i.def]));
  it('cpa-total and the home comparator open on $1,074, no retake counted yet', () => {
    for (const kind of ['cpa-total', 'total']) {
      const out = getSpec(kind).run(def(kind), {});
      expect(out.head[0].startsWith('No retake counted yet: ')).toBe(true);
      expect(out.head[1]).toBe('$1,074');
      expect(out.note).toContain('Type how many sections you think you will retake');
    }
  });
  it('the first CPA screen says “Example” once, from MentionExemple (report of 2026-11-08)', () => {
    for (const kind of ['cpa-total', 'total']) {
      const html = renderToStaticMarkup(createElement(MiniSim, { kind, primary: true }));
      expect(html.match(/Example/g)).toHaveLength(1);
      expect(html).toContain('data-exemple');
      expect(html).toContain('Example, not your result yet');
    }
  });
  it('one retake typed: $1,074 + $269, no longer an example', () => {
    const out = getSpec('cpa-total').run({ ...def('cpa-total'), retakes: 1 }, { retakes: true });
    expect(out.head[0].startsWith('No retake')).toBe(false);
    expect(out.head[0]).toContain('1 retake');
    expect(out.head[1]).toBe('$1,343');
  });
  it('the pass-rate tool uses only the rate the reader types', () => {
    const ex = getSpec('cpa-passrate').run(def('cpa-passrate'), {});
    expect(ex.head[0].startsWith('Example')).toBe(true);
    const r = getSpec('cpa-passrate').run({ rate: 40, n: 2 }, { rate: true });
    expect(r.head[1]).toBe('64.0%');
  });
});
