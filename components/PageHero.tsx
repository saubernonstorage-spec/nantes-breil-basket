type Props = {
  title: string;
  intro?: string;
};

/** Bandeau bleu marine en haut des pages intérieures. */
export function PageHero({ title, intro }: Props) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </section>
  );
}
