import type { CSSProperties } from "react";

/**
 * Grille responsive (classe `.grid`) : autant de colonnes que possible,
 * chacune d'au moins `min` pixels.
 */
export function grille(min: number, options: { gap?: string; align?: "start" | "center" | "stretch" } = {}): CSSProperties {
  const style: Record<string, string> = { "--min": `${min}px` };
  if (options.gap) style["--gap"] = options.gap;
  if (options.align) style["--align"] = options.align;
  return style as CSSProperties;
}

/** Variables CSS en ligne, ex. vars({ "--gap": "8px" }). */
export function vars(valeurs: Record<`--${string}`, string>): CSSProperties {
  return valeurs as CSSProperties;
}
