import type { MetaFunction } from "@remix-run/node";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { PageHeader } from "~/components/navigation/page-header";

export const meta: MetaFunction = () => {
  return [
    { title: "Relationskarta - Asterism" },
    { name: "description", content: "Kartlägg komplexa relationer mellan juridiska entiteter" },
  ];
};

export default function Entities() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="relationskarta"
          description="Kartlägg komplexa relationer mellan personer, företag och juridiska entiteter."
        />

        <main className="max-w-6xl mx-auto">
          <EntityMapMockup />
        </main>
      </div>
    </div>
  );
}

function EntityMapMockup() {
  return (
    <div className={componentStyles.card}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif">Relationskarta</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
            + Lägg till nod
          </button>
          <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors">
            + Skapa koppling
          </button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-4">
        Använd knapparna ovan för att lägga till noder och skapa kopplingar mellan entiteter.
      </div>
      
      <div className="bg-gray-50 h-96 rounded-md border-2 border-dashed border-gray-300 relative overflow-hidden">
        {/* Mockup nodes */}
        <div className="absolute top-12 left-12 w-24 h-16 bg-blue-100 border-2 border-blue-300 rounded-md flex items-center justify-center text-xs font-medium">
          Bolag A
        </div>
        
        <div className="absolute top-12 right-12 w-24 h-16 bg-green-100 border-2 border-green-300 rounded-md flex items-center justify-center text-xs font-medium">
          Person 1
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-yellow-100 border-2 border-yellow-300 rounded-md flex items-center justify-center text-xs font-medium">
          Avtal X
        </div>
        
        {/* Mockup connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="96" y1="28" 
            x2="calc(100% - 96px)" y2="28" 
            stroke="#6B7280" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
          <line 
            x1="60" y1="44" 
            x2="50%" y2="calc(100% - 60px)" 
            stroke="#6B7280" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
          <line 
            x1="calc(100% - 60px)" y1="44" 
            x2="50%" y2="calc(100% - 60px)" 
            stroke="#6B7280" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          <div className="text-center">
            <div className="text-lg mb-2">🗺️</div>
            <div>Interaktiv relationskarta</div>
            <div className="text-sm mt-1">Drag & drop noder, skapa kopplingar</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-md">
        <h4 className="font-medium text-sm mb-2">Funktioner i fullständig version:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Dra och släpp noder för att organisera</li>
          <li>• Skapa kopplingar mellan entiteter</li>
          <li>• Olika nodtyper (personer, företag, avtal, etc.)</li>
          <li>• Zoom och panorering av stora kartor</li>
          <li>• Export till PDF eller bild</li>
        </ul>
      </div>
    </div>
  );
}