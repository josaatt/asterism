import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { 
  getProjectById, 
  getAuditLogForProject, 
  getUserById,
  currentUser 
} from "~/data/mock-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Aktivitetslogg - Asterism" },
    { name: "description", content: "Aktivitetslogg för projektet" },
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

  const auditLog = getAuditLogForProject(projectId);
  
  // Lägg till användarinformation
  const auditLogWithUsers = auditLog.map(entry => ({
    ...entry,
    user: getUserById(entry.userId)
  }));

  return json({ 
    project, 
    auditLog: auditLogWithUsers 
  });
}

export default function ProjectActivity() {
  const { project, auditLog } = useLoaderData<typeof loader>();

  const groupedLog = groupLogEntriesByDate(auditLog);

  return (
    <div className="space-y-8">
      <header className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif text-foreground mb-4">Aktivitetslogg</h2>
        <p className={cn(componentStyles.enhancedParagraph, "text-lg")}>
          <span className={componentStyles.enhancedFirstWord}>Fullständig</span>{" "}
          historik över alla ändringar och aktiviteter i projektet.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {auditLog.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedLog).map(([date, entries]) => (
              <div key={date}>
                <h3 className="text-lg font-serif text-foreground mb-4 sticky top-0 bg-background py-2">
                  {formatDate(date)}
                </h3>
                <div className={cn(componentStyles.card, "space-y-4")}>
                  {entries.map((entry) => (
                    <ActivityEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(componentStyles.card, "text-center py-12")}>
            <div className="text-muted-foreground">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">Ingen aktivitet ännu</h3>
              <p>Aktiviteter kommer att visas här när projektet används.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ActivityEntry({ entry }: { entry: any }) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'project.create':
        return '🎯';
      case 'artefact.create':
        return '📄';
      case 'artefact.update':
        return '✏️';
      case 'artefact.delete':
        return '🗑️';
      case 'project.permission.update':
        return '👥';
      case 'project.update':
        return '📝';
      default:
        return '•';
    }
  };

  const getActivityDescription = (action: string, details: any) => {
    switch (action) {
      case 'project.create':
        return `Skapade projektet "${details.projectName}"`;
      case 'artefact.create':
        return `Skapade artefakt "${details.title}" (${getArtefactTypeLabel(details.type)})`;
      case 'artefact.update':
        return `Uppdaterade artefakt "${details.title}"`;
      case 'artefact.delete':
        return `Tog bort artefakt "${details.title}"`;
      case 'project.permission.update':
        return `Ändrade behörigheter för ${details.userName}`;
      case 'project.update':
        return `Uppdaterade projektinformation`;
      default:
        return `Utförde ${action}`;
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
        {getActivityIcon(entry.action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{entry.user?.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(entry.timestamp)}
          </span>
        </div>
        <p className="text-sm text-foreground">
          {getActivityDescription(entry.action, entry.details)}
        </p>
        {entry.details && Object.keys(entry.details).length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Visa detaljer
            </summary>
            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(entry.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function groupLogEntriesByDate(entries: any[]) {
  const grouped: Record<string, any[]> = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(entry);
  });

  // Sortera datum i fallande ordning (nyast först)
  const sortedEntries: Record<string, any[]> = {};
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach(date => {
      // Sortera entries inom varje datum i fallande ordning (nyast först)
      sortedEntries[date] = grouped[date].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

  return sortedEntries;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return 'Idag';
  } else if (dateString === yesterday.toISOString().split('T')[0]) {
    return 'Igår';
  } else {
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

function formatTime(timestamp: Date | string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getArtefactTypeLabel(type: string): string {
  const labels = {
    legal_brief: 'Rättsutredning',
    statute_proposal: 'Författningsförslag',
    case_reference: 'Rättsfall',
    generic_file: 'Fil',
    timeline: 'Tidslinje',
    entity_map: 'Relationskarta',
    law_chain_explorer: 'Lagkedje-utforskare'
  };
  return labels[type as keyof typeof labels] || type;
}