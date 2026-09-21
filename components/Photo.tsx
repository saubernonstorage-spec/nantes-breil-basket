import Image from "next/image";
import { estLienExterne, estPhoto } from "@/lib/utils";

type Props = {
  /** Chemin d'une vraie photo ("/photos/…") ou texte de l'emplacement gris rayé. */
  photo: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** Texte court à afficher dans l'emplacement à la place de `photo` (petites vignettes). */
  label?: string;
};

/**
 * Affiche la photo si elle a été fournie, sinon l'emplacement rayé
 * qui indique le format attendu (comme sur la maquette).
 */
export function Photo({ photo, alt, className = "", sizes = "(max-width: 768px) 100vw, 50vw", preload, label }: Props) {
  if (estPhoto(photo)) {
    return (
      <span className={`photo ${className}`}>
        <Image
          src={photo.trim()}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          unoptimized={estLienExterne(photo)}
        />
      </span>
    );
  }
  return (
    <span className={`photo photo--placeholder ${className}`} aria-hidden="true">
      <span className="photo__label">{label ?? photo}</span>
    </span>
  );
}
