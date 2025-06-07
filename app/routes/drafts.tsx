import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { PageHeader } from "~/components/navigation/page-header";

export const meta: MetaFunction = () => {
  return [
    { title: "Utredningar - Asterism" },
    { name: "description", content: "Skriv och redigera juridiska utredningar" },
  ];
};

export default function Drafts() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="utredningar"
          description="Skriv och redigera juridiska utredningar med Markdown-stöd och smart länkning."
        />

        <main className="max-w-6xl mx-auto">
          <LawChainMockup searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </main>
      </div>
    </div>
  );
}

function LawChainMockup({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className={componentStyles.card}>
      <h3 className="text-lg font-serif mb-4">Lagkedje-utforskare</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Sök i lagtext..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Sök
          </button>
        </div>
        
        {searchQuery && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-md">
              <h4 className="font-medium mb-2">Refererar till denna</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Miljöbalken 3 kap 2 §</div>
                <div>• Strålskyddslagen 4 § 1 st</div>
                <div>• Plan- och bygglagen 9 kap 31 §</div>
                <div>• Regeringsformen 8 kap 2 §</div>
              </div>
            </div>
            
            <div className="p-4 border-2 border-primary rounded-md bg-primary/5">
              <h4 className="font-medium mb-2">Aktuell paragraf</h4>
              <div className="text-sm">
                <strong>Miljöbalken 2 kap 3 §</strong><br/>
                <em>Bestämmelse om hållbar utveckling</em><br/><br/>
                "Alla som bedriver en verksamhet eller vidtar en åtgärd ska utföra de skyddsåtgärder, iaktta de begränsningar och vidta de försiktighetsmått som behövs för att förebygga, hindra eller motverka..."
              </div>
            </div>
            
            <div className="p-4 border border-border rounded-md">
              <h4 className="font-medium mb-2">Denna refererar till</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Miljöbalken 1 kap 1 §</div>
                <div>• Regeringsformen 1 kap 2 §</div>
                <div>• EU-direktiv 2008/1/EG</div>
                <div>• FN:s klimatramkonvention</div>
              </div>
            </div>
          </div>
        )}
        
        {!searchQuery && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-lg font-medium mb-2">Börja söka i lagtext</h3>
            <p>Ange en paragraf eller nyckelord i sökfältet ovan för att utforska lagstiftningskedjor.</p>
          </div>
        )}
        
        <div className="mt-6 p-3 bg-muted rounded-md">
          <h4 className="font-medium text-sm mb-2">Funktioner i fullständig version:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Intelligens sökning i svensk lagstiftning</li>
            <li>• Automatisk koppling mellan relaterade paragrafer</li>
            <li>• Historisk utveckling av lagstiftning</li>
            <li>• Integration med prejudikat och förarbeten</li>
            <li>• Export av lagstiftningskedjor som diagram</li>
          </ul>
        </div>
      </div>
    </div>
  );
}