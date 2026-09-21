import type { QuestionFaq } from "@/lib/types";

/**
 * Questions fréquentes en accordéon, sans JavaScript (éléments <details>).
 * Le même `groupe` fait qu'une seule réponse est ouverte à la fois.
 */
export function Faq({ items, groupe }: { items: QuestionFaq[]; groupe: string }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} className="faq__item" name={groupe} open={i === 0}>
          <summary className="faq__question">
            <span>{f.q}</span>
            <span className="faq__sign" aria-hidden="true" />
          </summary>
          <p className="faq__answer">{f.r}</p>
        </details>
      ))}
    </div>
  );
}
