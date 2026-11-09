/**
 * Shorter pages on a phone (4th naive round: pages of 12 to 18 screens, “I read the title, the calculator and the big
 * figure, then I skip”). Each H2 section of a page body keeps its title and its first paragraph in view; the rest of
 * the section is folded under a title that names it. Nothing is removed: the folded text stays in the HTML, for search
 * engines and for the reader who opens it. A section that holds a calculator is never folded (its fields must stay
 * visible), nor one that does not open on a paragraph, nor one whose remainder is short.
 */
const MIN_REST = 280;
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export function replierSections(html: string): string {
  const parts = html.split(/(?=<h2[\s>])/);
  return parts.map((sec) => {
    const m = sec.match(/^(<h2[^>]*>([\s\S]*?)<\/h2>)(\s*)(<p[\s>][\s\S]*?<\/p>)([\s\S]*)$/);
    if (!m) return sec;
    const [, h2, title, gap, first, rest] = m;
    if (/<!--tool:/.test(rest) || text(rest).length < MIN_REST) return sec;
    const name = text(title).replace(/[.:]$/, '');
    return `${h2}${gap}${first}\n<details class="suite-section"><summary>More on ${(/^[A-Z][a-z]/.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name)}</summary>${rest.trimEnd()}\n</details>\n`;
  }).join('');
}
