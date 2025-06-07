import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { 
  getProjectById, 
  currentUser, 
  mockArtefacts, 
  mockAuditLog 
} from "~/data/mock-data";
import type { ArtefactType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Ny artefakt - Asterism" },
    { name: "description", content: "Skapa en ny artefakt i projektet" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projectId!;
  const project = getProjectById(projectId);
  
  if (!project) {
    throw new Response("Projekt hittades inte", { status: 404 });
  }

  // Kontrollera behörighet
  const hasAccess = project.members.some(member => member.userId === currentUser.id);
  if (!hasAccess) {
    throw new Response("Ingen behörighet", { status: 403 });
  }

  return json({ project });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const projectId = params.projectId!;
  const formData = await request.formData();
  
  const title = formData.get("title") as string;
  const type = formData.get("type") as ArtefactType;
  const content = formData.get("content") as string;

  // Validering
  const errors: Record<string, string> = {};
  
  if (!title || title.trim().length < 2) {
    errors.title = "Titel måste vara minst 2 tecken";
  }
  
  if (!type) {
    errors.type = "Typ måste väljas";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Skapa ny artefakt
  const newArtefact = {
    id: `art-${Date.now()}`,
    projectId,
    type,
    title: title.trim(),
    content: content?.trim() || '',
    createdBy: currentUser.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Lägg till i mock-data
  mockArtefacts.push(newArtefact);
  
  // Logga aktivitet
  mockAuditLog.push({
    id: `log-${Date.now()}`,
    timestamp: new Date(),
    userId: currentUser.id,
    projectId,
    action: "artefact.create",
    details: { 
      artefactId: newArtefact.id,
      title: newArtefact.title,
      type: newArtefact.type
    }
  });

  return redirect(`/projects/${projectId}/artefacts/${newArtefact.id}`);
}

const artefactTypes: { value: ArtefactType; label: string; description: string }[] = [
  {
    value: 'legal_brief',
    label: 'Rättsutredning',
    description: 'Juridisk analys och argumentation'
  },
  {
    value: 'statute_proposal',
    label: 'Författningsförslag',
    description: 'Förslag till ny eller ändrad lagstiftning'
  },
  {
    value: 'case_reference',
    label: 'Rättsfall',
    description: 'Referens till domstolsavgörande'
  },
  {
    value: 'generic_file',
    label: 'Allmän fil',
    description: 'PDF, Word-dokument eller annan fil'
  },
  {
    value: 'timeline',
    label: 'Tidslinje',
    description: 'Kronologisk visualisering (Mockup)'
  },
  {
    value: 'entity_map',
    label: 'Relationskarta',
    description: 'Visualisering av relationer (Mockup)'
  },
  {
    value: 'law_chain_explorer',
    label: 'Lagkedje-utforskare',
    description: 'Analys av lagstiftningskedjor (Mockup)'
  }
];

export default function NewArtefact() {
  const { project } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [selectedType, setSelectedType] = useState<ArtefactType>('legal_brief');
  const [content, setContent] = useState('');

  const isTextArtefact = ['legal_brief', 'statute_proposal', 'case_reference'].includes(selectedType);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 
            className="text-3xl md:text-4xl text-foreground mb-4 lowercase"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            <span className="text-primary text-lg leading-none translate-y-[-0.2em] mr-3">¶</span>
            ny artefakt
          </h1>
          <p className={cn(componentStyles.enhancedParagraph, "text-lg")}>
            <span className={componentStyles.enhancedFirstWord}>Skapa</span>{" "}
            en ny artefakt i projektet "{project.name}".
          </p>
        </header>

        <main>
          <Form method="post" className="space-y-8">
            <div className={cn(componentStyles.card, "space-y-6")}>
              <div>
                <label 
                  htmlFor="title" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Titel *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Beskriv artefakten..."
                />
                {actionData?.errors?.title && (
                  <p className="mt-1 text-sm text-red-600">{actionData.errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Typ av artefakt *
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  {artefactTypes.map((type) => (
                    <label
                      key={type.value}
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-md cursor-pointer transition-colors",
                        selectedType === type.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={(e) => setSelectedType(e.target.value as ArtefactType)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {actionData?.errors?.type && (
                  <p className="mt-1 text-sm text-red-600">{actionData.errors.type}</p>
                )}
              </div>
            </div>

            {isTextArtefact && (
              <div className={componentStyles.card}>
                <label 
                  htmlFor="content" 
                  className="block text-sm font-medium text-foreground mb-4"
                >
                  Innehåll
                </label>
                <MarkdownEditor 
                  value={content}
                  onChange={setContent}
                />
                <input type="hidden" name="content" value={content} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Använd Markdown för formatering. Skriv @ för att länka till andra artefakter.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Skapar..." : "Skapa artefakt"}
              </button>
              
              <a
                href={`/projects/${project.id}`}
                className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors"
              >
                Avbryt
              </a>
            </div>
          </Form>
        </main>
      </div>
    </div>
  );
}

// Enkel Markdown-editor komponent
function MarkdownEditor({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) {
  return (
    <div className="border border-border rounded-md">
      <div className="border-b border-border px-3 py-2 bg-muted/30">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Markdown stöds</span>
          <span>•</span>
          <span>**fet**, *kursiv*, # rubrik</span>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        className="w-full px-3 py-3 bg-transparent focus:outline-none resize-none font-mono text-sm"
        placeholder={`# Rubrik

## Underrubrik

Detta är ett exempel på **fetstil** och *kursiv* text.

### Juridisk analys

1. Första punkten
2. Andra punkten
3. Tredje punkten

> Detta är ett citat eller viktigt påstående

För att länka till andra artefakter, skriv @ följt av artefaktens namn.`}
      />
    </div>
  );
}