import type { MetaFunction } from "@remix-run/node";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { PageHeader } from "~/components/navigation/page-header";

export const meta: MetaFunction = () => {
  return [
    { title: "Tidslinje - Asterism" },
    { name: "description", content: "Visualisera kronologiska händelseförlopp" },
  ];
};

export default function Timeline() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="tidslinje"
          description="Visualisera kronologiska händelseförlopp och viktiga datum i juridiska ärenden."
        />

        <main className="max-w-6xl mx-auto">
          <TimelineMockup />
        </main>
      </div>
    </div>
  );
}

function TimelineMockup() {
  return (
    <div className={componentStyles.card}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif">Tidslinje-visualisering</h3>
        <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
          + Lägg till händelse
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Klicka på knappen ovan för att lägga till en ny händelse på tidslinjen.
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          {[
            { date: "2024-01-15", event: "Utredning påbörjad", description: "Första möte och planering av arbetet" },
            { date: "2024-02-01", event: "Första analys klar", description: "Genomgång av relevant lagstiftning och praxis" },
            { date: "2024-02-15", event: "Extern konsultation", description: "Möte med expertråd och branschorganisationer" },
            { date: "2024-03-01", event: "Slutrapport", description: "Färdigställande av den juridiska utredningen" },
            { date: "2024-03-15", event: "Presentation", description: "Redovisning av resultat för uppdragsgivaren" }
          ].map((item, index) => (
            <div key={index} className="flex items-start mb-8 relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold z-10 flex-shrink-0">
                {index + 1}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{item.event}</div>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                </div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}