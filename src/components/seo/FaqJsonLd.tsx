import { JsonLd } from "./JsonLd";
import { faqs } from "./faqData";

/** FAQPage con las mismas preguntas que muestra <FAQ />. Montar solo en la home. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.pregunta,
          acceptedAnswer: { "@type": "Answer", text: f.respuesta },
        })),
      }}
    />
  );
}
