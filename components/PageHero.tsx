import type { ReactNode } from "react";

/** Bandeau d'en-tête des pages intérieures. */
export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <p className="kicker">{kicker}</p>
        <h1 className="title-page">{title}</h1>
        {children}
      </div>
    </section>
  );
}
