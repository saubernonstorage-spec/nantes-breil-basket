/**
 * Dessins décoratifs aux couleurs du club (SVG plats, sans texte) : ils accompagnent un texte
 * qui dit déjà tout, d'où aria-hidden. Les couleurs viennent des variables de la charte.
 */

/** Sifflet d'arbitre avec son cordon et un ballon (accueil, École d'arbitrage). */
export function Sifflet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true" focusable="false">
      <circle cx="240" cy="180" r="140" fill="var(--blanc)" />
      {/* Cordon : part de l'anneau et passe derrière le ballon. */}
      <path
        d="M118 158 C80 200 84 290 170 304 C230 314 276 296 300 280"
        fill="none"
        stroke="var(--orange-fonce)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="128" cy="146" r="16" fill="none" stroke="var(--nuit)" strokeWidth="8" />
      {/* Embout et chambre du sifflet. */}
      <rect x="200" y="130" width="150" height="46" rx="12" fill="var(--nuit)" />
      <circle cx="200" cy="196" r="66" fill="var(--nuit)" />
      <rect x="214" y="131" width="36" height="14" rx="3" fill="var(--blanc)" />
      <path d="M156 196 A44 44 0 0 1 200 152" fill="none" stroke="var(--bleu)" strokeWidth="8" strokeLinecap="round" />
      {/* Coup de sifflet. */}
      <path
        d="M372 118 L398 98 M378 153 H410 M372 188 L398 208"
        stroke="var(--orange)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="330" cy="262" r="40" fill="var(--orange)" />
      <path
        d="M290 262 H370 M330 222 V302 M302 234 C318 250 318 274 302 290 M358 234 C342 250 342 274 358 290"
        fill="none"
        stroke="var(--nuit)"
        strokeWidth="3.5"
      />
    </svg>
  );
}
