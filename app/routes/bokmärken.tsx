import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { PageHeader } from "~/components/navigation/page-header";
import { 
  mockBookmarks, 
  mockProjects,
  currentUser 
} from "~/data/mock-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Bokmärken - Asterism" },
    { name: "description", content: "Spara och organisera viktiga juridiska källor" },
  ];
};

export async function loader() {
  return json({ 
    bookmarks: mockBookmarks,
    projects: mockProjects.filter(p => 
      p.members.some(m => m.userId === currentUser.id)
    )
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const url = formData.get("url") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Enkel validering
    const errors: Record<string, string> = {};
    
    if (!url || !isValidUrl(url)) {
      errors.url = "Ange en giltig URL";
    }
    
    if (!title || title.trim().length < 2) {
      errors.title = "Titel måste vara minst 2 tecken";
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }

    // Skapa nytt bokmärke
    const newBookmark = {
      id: `bm-${Date.now()}`,
      url: url.trim(),
      title: title.trim(),
      description: description?.trim() || undefined,
      createdBy: currentUser.id,
      createdAt: new Date()
    };

    mockBookmarks.push(newBookmark);
    
    return json({ success: true });
  }

  if (intent === "move-to-project") {
    const bookmarkId = formData.get("bookmarkId") as string;
    const projectId = formData.get("projectId") as string;

    // I en riktig app skulle detta skapa en ny artefakt i projektet
    // och ta bort bokmärket eller markera det som flyttat
    
    return json({ moved: true, projectId });
  }

  return json({ success: false });
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export default function Bookmarks() {
  const { bookmarks, projects } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showMoveDialog, setShowMoveDialog] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="bokmärken"
          description="Spara viktiga juridiska källor och referenser för senare användning."
        />

        <main className="max-w-6xl mx-auto space-y-8">
          {/* Skapa nytt bokmärke */}
          <section>
            <div className={componentStyles.card}>
              <h2 className="text-xl  text-foreground mb-4">Lägg till nytt bokmärke</h2>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="create" />
                
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://exempel.se/artikel"
                  />
                  {actionData && 'errors' in actionData && actionData.errors?.url && (
                    <p className="mt-1 text-sm text-red-600">{actionData.errors.url}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Beskriv vad länken handlar om"
                  />
                  {actionData && 'errors' in actionData && actionData.errors?.title && (
                    <p className="mt-1 text-sm text-red-600">{actionData.errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Beskrivning (valfritt)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Ytterligare information om källan..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sparar..." : "Spara bokmärke"}
                </button>
              </Form>
            </div>
          </section>

          {/* Lista över bokmärken */}
          <section>
            <h2 className="text-xl  text-foreground mb-6">Sparade bokmärken ({bookmarks.length})</h2>
            
            {bookmarks.length > 0 ? (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <BookmarkCard 
                    key={bookmark.id} 
                    bookmark={bookmark} 
                    projects={projects}
                    onMoveToProject={(projectId) => {
                      // I en riktig app skulle detta göra en action-anrop
                      console.log('Flyttar bokmärke till projekt:', projectId);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className={cn(componentStyles.card, "text-center py-12")}>
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-4">🔖</div>
                  <h3 className="text-lg font-medium mb-2">Inga bokmärken ännu</h3>
                  <p>Lägg till ditt första bokmärke ovan för att komma igång.</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function BookmarkCard({ 
  bookmark, 
  projects, 
  onMoveToProject 
}: { 
  bookmark: any; 
  projects: any[]; 
  onMoveToProject: (projectId: string) => void;
}) {
  const [showProjectList, setShowProjectList] = useState(false);

  return (
    <div className={cn(componentStyles.card, "relative")}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {bookmark.title}
            </a>
          </h3>
          <div className="text-sm text-muted-foreground mb-2">
            {bookmark.url}
          </div>
          {bookmark.description && (
            <p className="text-sm text-foreground">
              {bookmark.description}
            </p>
          )}
        </div>
        
        <div className="flex gap-2 ml-4">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
          >
            Öppna
          </a>
          <button
            onClick={() => setShowProjectList(!showProjectList)}
            className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Flytta till projekt
          </button>
        </div>
      </div>

      {showProjectList && (
        <div className="border-t border-border pt-3 mt-3">
          <h4 className="text-sm font-medium text-foreground mb-2">Välj projekt:</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onMoveToProject(project.id)}
                className="text-left p-2 border border-border rounded hover:bg-muted transition-colors"
              >
                <div className="font-medium text-sm">{project.name}</div>
                {project.description && (
                  <div className="text-xs text-muted-foreground">
                    {project.description}
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowProjectList(false)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Avbryt
          </button>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        Sparat: {new Date(bookmark.createdAt).toLocaleDateString('sv-SE')}
      </div>
    </div>
  );
}