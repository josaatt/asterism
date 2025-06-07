import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";

export const meta: MetaFunction = () => {
  return [
    { title: "Asterism - Juridiskt Arbetsverktyg" },
    {
      name: "description",
      content: "Centraliserat verktyg för juridisk forskning och dokumentation",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1
            className="text-4xl md:text-6xl text-foreground mb-6"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ⁂ asterism
          </h1>
          <p
            className={cn(
              componentStyles.enhancedParagraph,
              "max-w-2xl mx-auto text-lg"
            )}
          >
            <span className={componentStyles.enhancedFirstWord}>
              Centraliserat
            </span>{" "}
            arbetsverktyg för juridisk forskning, dokumentation och
            projekthantering. Skapat för att förenkla det juridiska arbetet.
          </p>
        </header>

        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature) => {
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={cn(
                  componentStyles.card,
                  "page-transition cursor-pointer"
                )}
              >
                <h2
                  className="text-2xl md:text-3xl mb-3 text-foreground lowercase flex items-start gap-3"
                  style={{ fontFamily: '"La Belle Aurore", cursive' }}
                >
                  <span className="text-primary text-lg leading-none translate-y-[-0.2em]">
                    ¶
                  </span>
                  {feature.title}
                </h2>
                <p className={componentStyles.enhancedParagraph}>
                  {feature.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className={componentStyles.metadataTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </main>

        <section className="mt-16 text-center">
          <div className="pull-quote">
            Juridisk forskning förenklas genom väldesignade verktyg.
          </div>
          <div className="footnote max-w-md mx-auto">
            En fotnot med upphovsrättsinformation.
          </div>
        </section>
      </div>
    </div>
  );
}

const features = [
  {
    title: "projekt",
    path: "/projects",
    description:
      "Hantera juridiska projekt med strukturerad dokumentation, artefakter och samarbetsverktyg.",
    tags: ["Projekthantering", "Samarbete", "Dokumentation"],
  },
  {
    title: "rättspraxis",
    path: "/rättspraxis",
    description:
      "Sök och analysera rättsfall från svenska domstolar med avancerade filtreringsmöjligheter.",
    tags: ["Rättsfall", "Analys", "Sökning"],
  },
  {
    title: "utredningar",
    path: "/drafts",
    description:
      "Skriv och redigera juridiska utredningar med Markdown-stöd och smart länkning.",
    tags: ["Utredningar", "Markdown", "Redigering"],
  },
  {
    title: "bokmärken",
    path: "/bookmarks",
    description:
      "Spara och organisera viktiga juridiska källor och referenser för senare användning.",
    tags: ["Referenser", "Källor", "Organisation"],
  },
  {
    title: "tidslinje",
    path: "/timeline",
    description:
      "Visualisera kronologiska händelseförlopp och viktiga datum i juridiska ärenden.",
    tags: ["Visualisering", "Kronologi", "Händelser"],
  },
  {
    title: "relationskarta",
    path: "/entities",
    description:
      "Kartlägg komplexa relationer mellan personer, företag och juridiska entiteter.",
    tags: ["Relationer", "Visualisering", "Entiteter"],
  },
];
