type IconProps = { size?: number };

export function IconFacebook({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.4h2.9l.44-3.37H13.5V8.09c0-.98.27-1.64 1.67-1.64h1.78V3.43c-.31-.04-1.37-.13-2.6-.13-2.57 0-4.33 1.57-4.33 4.45v2.48H7.1v3.37h2.92V22h3.48Z" />
    </svg>
  );
}

export function IconInstagram({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWhatsapp({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.5A9.42 9.42 0 0 0 4.1 16.93L2.5 21.5l4.7-1.55A9.42 9.42 0 1 0 12.04 2.5Zm0 1.7a7.72 7.72 0 0 1 0 15.44 7.7 7.7 0 0 1-4.06-1.16l-.36-.22-2.46.81.8-2.37-.23-.37a7.72 7.72 0 0 1 6.31-12.13Zm-3.2 3.9c-.2 0-.52.07-.79.36-.27.3-.74.85-.74 1.77 0 .92.63 1.8.72 1.93.09.12 1.28 2.1 3.2 2.85 1.6.62 2.03.53 2.4.5.45-.05 1.31-.54 1.5-1.07.18-.53.18-.98.13-1.07-.06-.09-.21-.15-.45-.27-.24-.12-1.31-.65-1.51-.72-.2-.08-.35-.12-.5.12-.15.24-.57.75-.7.9-.13.15-.26.17-.5.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.4-1.33-1.64-.13-.24-.01-.37.1-.49.12-.12.27-.31.4-.47.13-.15.17-.26.26-.44.09-.18.04-.33-.02-.45-.06-.12-.5-1.2-.69-1.64-.15-.35-.3-.32-.45-.33h-.6Z" />
    </svg>
  );
}

export function IconMenu({ open }: { open: boolean }) {
  // Trois barres qui pivotent en croix à l'ouverture (l'animation est dans globals.css).
  return (
    <svg
      className={open ? "icon-menu icon-menu--open" : "icon-menu"}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}
