/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
import { P } from '../lib/engine/params';
import * as E from '../lib/engine/certs';
import { formatMoney } from '../lib/format';
export const GET: APIRoute = () => {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const lines = [
    '# Finance Cert Cost',
    '',
    `> Total cost of six US finance and accounting credentials from official fee pages and published pass rates: CFA® Program (${m(P.cfa.fees.l1.early)} to ${m(P.cfa.fees.l3.standard)} per exam, no enrollment fee since ${P.cfa.enrollmentRemoved}), CPA exam (${formatMoney(P.cpa.sectionFee, 2)} per section as of ${P.cpa.sectionFeeFrom}, ${m(4 * P.cpa.sectionFee)} for four sections at the first try plus the retakes the reader types, no AICPA pass rate reproduced, licensure routes in CA, FL, NY, TX and PA), CFP® certification (exam ${m(P.cfp.exam.early)} to ${m(P.cfp.exam.late)}, ${m(P.cfp.annual)} a year), enrolled agent (${m(P.ea.perPart)} per SEE part), CIA and FRM®. Expected retakes for the CFA® and CFP® exams = 1 / pass rate (CFP®: first-time and repeat rates). Review course prices are not shown; the reader types them. Figures read on ${LAST_UPDATED}. Published by Radif Partners, independent, not affiliated with CFA Institute, CFP Board, AICPA, NASBA or FINRA. CFA® is a trademark of CFA Institute; CFP® is a certification mark of CFP Board.`,
    '',
    '## Calculators',
    `- [Finance certification cost comparator](${SITE_URL}${route('home', 'en')}): floor and expected exam fees of the six credentials, CPA default ${m(E.floors().cpa[0])} at the first try.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the totals are built](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
