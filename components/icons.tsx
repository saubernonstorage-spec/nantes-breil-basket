/** Icônes des réseaux sociaux (décoratives : le texte du lien suffit). */

export function IconeFacebook() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V14h2.7v8h3.1z" />
    </svg>
  );
}

export function IconeInstagram() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeWhatsapp() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.2-1.4-.6-.5-1.1-1.2-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5.3-.4c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

/** Mention lue par les lecteurs d'écran pour les liens qui s'ouvrent dans un nouvel onglet. */
export function NouvelOnglet() {
  return <span className="sr-only"> (nouvel onglet)</span>;
}

/** Icônes du choix d'affichage des matchs (décoratives : le bouton porte son texte). */
export function IconeTableau() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 3.5h12M2 8h12M2 12.5h12" />
    </svg>
  );
}

export function IconeCartes() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="1.8" width="12" height="5.2" rx="1.6" />
      <rect x="2" y="9" width="12" height="5.2" rx="1.6" />
    </svg>
  );
}

/* Icônes d'interface (décoratives : aria-hidden ; le texte ou l'aria-label du bouton porte le sens). */

/** Coche (listes « ce qui est inclus », confirmation d'envoi). */
export function IconeCoche({ taille = 16 }: { taille?: number }) {
  return (
    <svg aria-hidden="true" className="icone" width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Croix des boutons « Fermer ». */
export function IconeFermer({ taille = 18 }: { taille?: number }) {
  return (
    <svg aria-hidden="true" className="icone" width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Étoiles du label École Française de Mini-Basket (n étoiles), lues « n étoiles » par les lecteurs d'écran. */
export function Etoiles({ n = 3, taille = 14 }: { n?: number; taille?: number }) {
  return (
    <span className="etoiles">
      <span className="sr-only">{n} étoiles</span>
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} aria-hidden="true" width={taille} height={taille} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}
