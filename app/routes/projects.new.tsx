import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { PageHeader } from "~/components/navigation/page-header";
import { currentUser, mockProjects, mockAuditLog } from "~/data/mock-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Nytt projekt - Asterism" },
    { name: "description", content: "Skapa ett nytt juridiskt projekt" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const caseNumber = formData.get("caseNumber") as string;

  // Enkel validering
  const errors: Record<string, string> = {};
  
  if (!name || name.trim().length < 2) {
    errors.name = "Projektnamn måste vara minst 2 tecken";
  }
  
  if (name && name.trim().length > 100) {
    errors.name = "Projektnamn får inte vara längre än 100 tecken";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Skapa nytt projekt (i en riktig app skulle detta sparas till databas)
  const newProject = {
    id: `proj-${Date.now()}`,
    name: name.trim(),
    description: description?.trim() || undefined,
    caseNumber: caseNumber?.trim() || undefined,
    status: 'active' as const,
    ownerId: currentUser.id,
    members: [{ userId: currentUser.id, permission: 'owner' as const }],
    artefacts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Lägg till i mock-data (i en riktig app skulle detta sparas till databas)
  mockProjects.push(newProject);
  
  // Logga aktivitet
  mockAuditLog.push({
    id: `log-${Date.now()}`,
    timestamp: new Date(),
    userId: currentUser.id,
    projectId: newProject.id,
    action: "project.create",
    details: { 
      projectName: newProject.name,
      caseNumber: newProject.caseNumber 
    }
  });

  return redirect(`/projects/${newProject.id}`);
}

export default function NewProject() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="nytt projekt"
          description="Skapa ett nytt juridiskt projekt för att organisera ditt arbete."
        />

        <main className="max-w-2xl mx-auto">
          <Form 
            method="post" 
            className={cn(componentStyles.card, "space-y-6")}
          >
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Projektnamn *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                maxLength={100}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="t.ex. GDPR Implementation 2024"
              />
              {actionData?.errors?.name && (
                <p className="mt-1 text-sm text-red-600">{actionData.errors.name}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="caseNumber" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Ärendenummer
              </label>
              <input
                type="text"
                id="caseNumber"
                name="caseNumber"
                maxLength={50}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="t.ex. JUR-2024-015"
              />
            </div>

            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Beskrivning
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Beskriv projektets syfte och mål..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Valfritt. Max 500 tecken.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Skapar projekt..." : "Skapa projekt"}
              </button>
              
              <a
                href="/projects"
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