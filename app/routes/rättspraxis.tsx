import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { legalCases } from "~/data/legal-cases";

export const meta: MetaFunction = () => {
  return [
    { title: "Rättspraxis - Asterism" },
    { name: "description", content: "Svensk rättspraxis och prejudicerande domar från svenska domstolar." },
  ];
};

export default function Rättspraxis() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <Link 
            to="/" 
            className="inline-block mb-8 text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ← ⁂ asterism
          </Link>
          <h1 className="text-4xl md:text-6xl text-foreground mb-6" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
            rättspraxis
          </h1>
          <p className={cn(componentStyles.enhancedParagraph, "max-w-2xl mx-auto text-lg")}>
            <span className={componentStyles.enhancedFirstWord}>Svensk</span>{' '}
            rättspraxis och prejudicerande domar från landets högsta domstolar. 
            Sök och utforska viktiga juridiska prejudikat inom olika rättsområden.
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {legalCases.map((legalCase) => (
              <article 
                key={legalCase.id} 
                className={cn(componentStyles.card, "page-transition")}
              >
                <div className="mb-4">
                  <span className="asterisk text-2xl">*</span>
                </div>
                
                <header className="mb-4">
                  <div className="mb-2">
                    <span className={cn(componentStyles.metadataTag, "mr-2")}>
                      {legalCase.caseNumber}
                    </span>
                    <span className={cn(componentStyles.metadataTag, "mr-2")}>
                      {legalCase.court}
                    </span>
                    <span className={componentStyles.metadataTag}>
                      {legalCase.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-foreground mb-2 leading-tight">
                    {legalCase.title}
                  </h2>
                  <span className={cn(componentStyles.metadataTag, "bg-primary/10 text-primary")}>
                    {legalCase.legalArea}
                  </span>
                </header>

                <div className="space-y-3">
                  <p className={componentStyles.enhancedParagraph}>
                    <span className={componentStyles.enhancedFirstWord}>Sammanfattning:</span>{' '}
                    {legalCase.summary}
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-serif font-medium text-foreground mb-2">
                      Bakgrund
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {legalCase.background}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-serif font-medium text-foreground mb-2">
                      Nyckelord
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {legalCase.keywords.map((keyword) => (
                        <span 
                          key={keyword} 
                          className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 text-center">
            <div className="pull-quote">
              Rättspraxis är grunden för rättssäkerhet och förutsägbarhet i rättstillämpningen.
            </div>
            <div className="footnote max-w-md mx-auto">
              Dessa prejudicerande domar formar tolkningen av svensk rätt och 
              ger vägledning för framtida rättstillämpning.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}