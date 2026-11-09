import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Credential cost comparator', method: 'Method and sources', about: 'About', widget: 'Embed the comparator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
const GROUP_LABEL: Record<Group, string> = { cfa: 'CFA® Program', cpa: 'CPA exam and license', cfp: 'CFP® certification', more: 'Tax, audit and risk credentials' };
export const GROUPS_ORDER: Group[] = ['cpa', 'cfa', 'cfp', 'more'];
export const groupLabel = (g: Group) => GROUP_LABEL[g];
export const label = (id: string, _lang: Locale = 'en') => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
function categoriesCompletes(lang: Locale): NavCategory[] {
  return GROUPS_ORDER.map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
// Top menu: one or two words each, never on two lines (full labels stay in the footer, RECETTE §10.3).
const COURT: Record<string, string> = { 'CFA® Program': 'CFA®', 'CPA exam and license': 'CPA', 'CFP® certification': 'CFP®', 'Tax, audit and risk credentials': 'EA, CIA, FRM' };
export const navCategories = (lang: Locale, court = true): NavCategory[] =>
  categoriesCompletes(lang).map((c) => (court ? { ...c, label: COURT[c.label] ?? c.label } : c));
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [...GROUPS_ORDER.map((g) => ({ label: GROUP_LABEL[g], links: inGroup(g, lang) })).filter((c) => c.links.length), { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
