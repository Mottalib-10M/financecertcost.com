/** Mini-calculator types (RECETTE §9.3). Each spec lives in `lib/mini-specs.ts` and calls the tested engine. */
export interface MiniInput { id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; options?: Array<{ value: string; label: string }>; /** Shown only when it changes the result (naive test of 2026-11-08: a field without effect reads as a bug). */ showIf?: (v: Record<string, number>) => boolean;
  /** Champ facultatif rangé dans le repli « Plus de détails » ; sa valeur actuelle reste lisible dans le titre du repli. */
  avance?: boolean }
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string;
  /** One line in bold right under the big figure: what the figure leaves out (4th naive round: “prep, the biggest line, is hidden”). */
  alert?: string;
  /** Link that depends on the answer (beginner path): [label, path such as /en/cpa-exam-cost/] (no router import in the client bundle). Replaces the spec's fixed link. */
  go?: [string, string] }
export interface MiniSpec { title: string; cta: string; ctaPage?: string; inputs: MiniInput[]; /** `touched`: the fields the reader has changed (3rd naive round: a pre-filled verdict read as “you fit”). */ run: (v: Record<string, number>, touched?: Record<string, boolean>) => MiniOut }
