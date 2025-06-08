import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation, Link } from "@remix-run/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { 
  getProjectById, 
  getArtefactById, 
  getUserById,
  currentUser, 
  mockArtefacts,
  mockAuditLog 
} from "~/data/mock-data";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.artefact.title || 'Artefakt'} - Asterism` },
    { name: "description", content: `Artefakt: ${data?.artefact.title}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { projektId, artefaktId } = params;
  
  const project = getProjectById(projektId!);
  const artefact = getArtefactById(artefaktId!);
  
  if (!project || !artefact || artefact.projectId !== projektId) {
    throw new Response("Artefakt hittades inte", { status: 404 });
  }

  // Kontrollera behörighet
  const hasAccess = project.members.some(member => member.userId === currentUser.id);
  if (!hasAccess) {
    throw new Response("Ingen behörighet", { status: 403 });
  }

  const creator = getUserById(artefact.createdBy);
  const userRole = project.members.find(m => m.userId === currentUser.id)?.role;
  const canEdit = userRole === 'ansvarig' || userRole === 'medarbetare';

  return json({ 
    project, 
    artefact: { ...artefact, creator }, 
    canEdit 
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { projektId, artefaktId } = params;
  const formData = await request.formData();
  
  const intent = formData.get("intent") as string;
  
  if (intent === "update") {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // Hitta och uppdatera artefakt
    const artefactIndex = mockArtefacts.findIndex(a => a.id === artefaktId);
    if (artefactIndex !== -1) {
      mockArtefacts[artefactIndex] = {
        ...mockArtefacts[artefactIndex],
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date()
      };

      // Logga aktivitet
      mockAuditLog.push({
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        userId: currentUser.id,
        projectId: projektId!,
        action: "artefact.update",
        details: { 
          artefactId,
          title: title.trim()
        }
      });
    }
  }

  return json({ success: true });
}

export default function ArtefactView() {
  const { project, artefact, canEdit } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(artefact.title);
  const [editContent, setEditContent] = useState(artefact.content);

  const isTextArtefact = ['legal_brief', 'statute_proposal', 'case_reference'].includes(artefact.type);
  const isMockup = ['timeline', 'entity_map', 'law_chain_explorer'].includes(artefact.type);

  const typeLabels = {
    legal_brief: 'Rättsutredning',
    statute_proposal: 'Författningsförslag',
    case_reference: 'Rättsfall',
    generic_file: 'Fil',
    timeline: 'Tidslinje (Mockup)',
    entity_map: 'Relationskarta (Mockup)',
    law_chain_explorer: 'Lagkedje-utforskare (Mockup)'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Lägg till navigering tillbaka till hem längst upp */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ← ⁂ asterism
          </Link>
        </div>
        
        <header className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="intent" value="update" />
                  <input
                    type="text"
                    name="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-3xl  bg-transparent border-b border-border focus:outline-none focus:border-primary w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sparar..." : "Spara"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(artefact.title);
                        setEditContent(artefact.content);
                      }}
                      className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
                    >
                      Avbryt
                    </button>
                  </div>
                </Form>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl text-foreground mb-4 ">
                    {artefact.title}
                  </h1>
                  {canEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
                    >
                      Redigera titel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={cn(
                componentStyles.metadataTag,
                isMockup ? "bg-[#F3F4F6] text-[#374151]" : "bg-[#FEE2E2] text-[#991B1B]"
              )}>
                {typeLabels[artefact.type]}
              </span>
            </div>
            <div>Skapad av: {artefact.creator?.name}</div>
            <div>Skapad: {new Date(artefact.createdAt).toLocaleDateString('sv-SE')}</div>
            <div>Uppdaterad: {new Date(artefact.updatedAt).toLocaleDateString('sv-SE')}</div>
          </div>
        </header>

        <main>

          {isTextArtefact && (
            <div className={componentStyles.card}>
              {isEditing ? (
                <Form method="post">
                  <input type="hidden" name="intent" value="update" />
                  <input type="hidden" name="title" value={editTitle} />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Innehåll
                    </label>
                    <div className="border border-border rounded-md">
                      <div className="border-b border-border px-3 py-2 bg-muted/30">
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Markdown stöds</span>
                          <span>•</span>
                          <span>**fet**, *kursiv*, # rubrik</span>
                        </div>
                      </div>
                      <textarea
                        name="content"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={25}
                        className="w-full px-3 py-3 bg-transparent focus:outline-none resize-none font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sparar..." : "Spara innehåll"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(artefact.content);
                      }}
                      className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                    >
                      Avbryt
                    </button>
                  </div>
                </Form>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl ">Innehåll</h2>
                    {canEdit && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
                      >
                        Redigera
                      </button>
                    )}
                  </div>
                  
                  {artefact.content ? (
                    <div className="prose prose-gray max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-2xl  font-medium text-foreground mb-4">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl  font-medium text-foreground mb-3 mt-6">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg  font-medium text-foreground mb-2 mt-5">{children}</h3>,
                          p: ({children}) => <p className="text-foreground leading-relaxed mb-4">{children}</p>,
                          blockquote: ({children}) => <blockquote className="border-l-3 border-primary pl-4 italic text-foreground/80 my-4">{children}</blockquote>,
                          ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-foreground">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                          em: ({children}) => <em className="italic text-foreground">{children}</em>,
                          code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                          pre: ({children}) => <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4">{children}</pre>
                        }}
                      >
                        {artefact.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll ännu.</p>
                      {canEdit && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                          Lägg till innehåll
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mockup-innehåll för olika typer */}
          {artefact.type === 'timeline' && <TimelineMockup />}
          {artefact.type === 'entity_map' && <EntityMapMockup />}
          {artefact.type === 'law_chain_explorer' && <LawChainMockup />}
        </main>
      </div>
    </div>
  );
}

// Mockup-komponenter
function TimelineMockup() {
  return (
    <div className={componentStyles.card}>
      <h3 className="text-lg  mb-4">Tidslinje-visualisering</h3>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Detta är en mockup av tidslinje-funktionaliteten.
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          {[
            { date: "2024-01-15", event: "Utredning påbörjad" },
            { date: "2024-02-01", event: "Första analys klar" },
            { date: "2024-02-15", event: "Extern konsultation" },
            { date: "2024-03-01", event: "Slutrapport" }
          ].map((item, index) => (
            <div key={index} className="flex items-center mb-6 relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                {index + 1}
              </div>
              <div className="ml-4">
                <div className="font-medium">{item.event}</div>
                <div className="text-sm text-muted-foreground">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EntityMapMockup() {
  return (
    <div className={componentStyles.card}>
      <h3 className="text-lg  mb-4">Relationskarta</h3>
      <div className="text-sm text-muted-foreground mb-4">
        Detta är en mockup av relationskarta-funktionaliteten.
      </div>
      <div className="bg-gray-50 h-64 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg mb-2">🗺️</div>
          <div>Interaktiv relationskarta kommer här</div>
          <div className="text-sm mt-1">Drag & drop noder, skapa kopplingar</div>
        </div>
      </div>
    </div>
  );
}

function LawChainMockup() {
  return (
    <div className={componentStyles.card}>
      <h3 className="text-lg  mb-4">Lagkedje-utforskare</h3>
      <div className="text-sm text-muted-foreground mb-4">
        Detta är en mockup av lagkedje-utforskaren.
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Sök i lagtext..."
            className="flex-1 px-3 py-2 border border-border rounded-md"
            disabled
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50" disabled>
            Sök
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-md">
            <h4 className="font-medium mb-2">Refererar till denna</h4>
            <div className="text-sm text-muted-foreground">
              • Miljöbalken 3 kap<br/>
              • Strålskyddslagen 4 §<br/>
              • Plan- och bygglagen 9 kap
            </div>
          </div>
          <div className="p-4 border-2 border-primary rounded-md bg-primary/5">
            <h4 className="font-medium mb-2">Aktuell paragraf</h4>
            <div className="text-sm">
              <strong>Miljöbalken 2 kap 3 §</strong><br/>
              Bestämmelse om hållbar utveckling...
            </div>
          </div>
          <div className="p-4 border border-border rounded-md">
            <h4 className="font-medium mb-2">Denna refererar till</h4>
            <div className="text-sm text-muted-foreground">
              • Miljöbalken 1 kap 1 §<br/>
              • Regeringsformen 1 kap<br/>
              • EU-direktiv 2008/1/EG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}