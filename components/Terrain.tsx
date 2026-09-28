/* eslint-disable @next/next/no-img-element -- motif décoratif en SVG : rien à optimiser */

const MOTIFS = {
  angle: "/terrain/angle-clair.svg",
  bout: "/terrain/bout-clair.svg",
  raquette: "/terrain/raquette-clair.svg",
  cote: "/terrain/raquette-cote-clair.svg",
} as const;

/**
 * Lignes de terrain de basket en filigrane (charte de la maquette).
 * La position se règle avec `style` (top, right, width…) ; le fondu dépend du motif.
 */
export function Terrain({
  motif,
  className = "",
  style,
}: {
  motif: keyof typeof MOTIFS;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={MOTIFS[motif]}
      alt=""
      aria-hidden="true"
      className={`terrain terrain--${motif} ${className}`}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
