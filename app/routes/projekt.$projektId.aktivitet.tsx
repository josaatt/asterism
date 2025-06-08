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
import { ResponsiveCalendar } from '@nivo/calendar';
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Aktivitetslogg - Asterism" },
    { name: "description", content: "Aktivitetslogg för projektet" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const projektId = params.projektId!;
  
  const project = getProjectById(projektId);
  if (!project) {
    throw new Response("Projekt hittades inte", { status: 404 });
  }
  
  // Kontrollera behörighet
  const hasAccess = project.members.some(member => member.userId === currentUser.id);
  if (!hasAccess) {
    throw new Response("Ingen behörighet", { status: 403 });
  }

  const auditLog = getAuditLogForProject(projektId);
  
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
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  
  // Get available years from audit log
  const availableYears = [...new Set(
    auditLog.map(entry => new Date(entry.timestamp).getFullYear())
  )].sort((a, b) => b - a);
  
  // Default to the most recent year with activity, or current year if no activity
  const defaultYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const groupedLog = groupLogEntriesByDate(auditLog);
  const calendarData = generateCalendarData(auditLog, selectedYear);

  return (
    <div className="space-y-8">
      <header className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl  text-foreground">Aktivitetslogg</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Tidslinje
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Kalender
            </button>
          </div>
        </div>
        <p className={cn(componentStyles.enhancedParagraph, "text-lg")}>
          <span className={componentStyles.enhancedFirstWord}>Fullständig</span>{" "}
          historik över alla ändringar och aktiviteter i projektet.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {viewMode === 'calendar' ? (
          <ActivityCalendar 
            data={calendarData} 
            auditLog={auditLog} 
            selectedYear={selectedYear}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
          />
        ) : auditLog.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedLog).map(([date, entries]) => (
              <div key={date}>
                <h3 className="text-lg  text-foreground mb-4 sticky top-0 bg-background py-2">
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

function getActivityIcon(action: string) {
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
}

function getActivityDescription(action: string, details: any) {
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
}

function ActivityEntry({ entry }: { entry: any }) {

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

function ActivityCalendar({ 
  data, 
  auditLog, 
  selectedYear, 
  availableYears, 
  onYearChange 
}: { 
  data: any[], 
  auditLog: any[], 
  selectedYear: number,
  availableYears: number[],
  onYearChange: (year: number) => void
}) {
  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  return (
    <div className={cn(componentStyles.card, "p-6")}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg  text-foreground">Aktivitetskalender</h3>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-muted-foreground">
          Visualisering av projektaktivitet under {selectedYear}. Mörkare färger indikerar fler aktiviteter.
        </p>
      </div>
      
      <div className="h-40">
        <ResponsiveCalendar
          data={data}
          from={startDate}
          to={endDate}
          emptyColor="#e2e8f0"
          colors={[
            '#fef3f2',
            '#fee2e2', 
            '#fecaca',
            '#f87171',
            '#ef4444',
            '#dc2626',
            '#6D0E0E'
          ]}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          tooltip={({ day, value, color }) => {
            const dayActivities = auditLog.filter(entry => {
              const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
              const entryYear = new Date(entry.timestamp).getFullYear();
              return entryDate === day && entryYear === selectedYear;
            });
            
            return (
              <div className="bg-white border border-gray-200 rounded p-2 shadow-lg">
                <div className="font-medium text-sm">{new Date(day).toLocaleDateString('sv-SE')}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {Number(value) === 0 ? 'Ingen aktivitet' : `${value} aktivitet${Number(value) !== 1 ? 'er' : ''}`}
                </div>
                {dayActivities.length > 0 && (
                  <div className="mt-2 space-y-1 max-w-xs">
                    {dayActivities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="text-xs text-gray-700">
                        • {getActivityDescription(activity.action, activity.details)}
                      </div>
                    ))}
                    {dayActivities.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayActivities.length - 3} fler
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Mindre</span>
        <div className="flex gap-1">
          {['#e2e8f0', '#fef3f2', '#fee2e2', '#fecaca', '#f87171', '#ef4444', '#dc2626', '#6D0E0E'].map((color, index) => (
            <div key={index} className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
          ))}
        </div>
        <span>Mer</span>
      </div>
    </div>
  );
}

function generateCalendarData(auditLog: any[], selectedYear: number) {
  const activityCounts: Record<string, number> = {};
  
  // Filter audit log for selected year
  const yearFilteredLog = auditLog.filter(entry => {
    const entryYear = new Date(entry.timestamp).getFullYear();
    return entryYear === selectedYear;
  });
  
  yearFilteredLog.forEach(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    activityCounts[date] = (activityCounts[date] || 0) + 1;
  });
  
  return Object.entries(activityCounts).map(([day, value]) => ({
    day,
    value
  }));
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