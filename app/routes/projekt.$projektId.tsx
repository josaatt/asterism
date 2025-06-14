import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { 
  getProjectById, 
  getArtefactsForProject, 
  getAuditLogForProject,
  getUserById,
  currentUser 
} from "~/data/mock-data";
import type { ArtefactType } from "~/types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.project.name || 'Projekt'} - Asterism` },
    { name: "description", content: `Projektvy för ${data?.project.name}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projektId!;
  
  const project = getProjectById(projectId);
  if (!project) {
    throw new Response("Projekt hittades inte", { status: 404 });
  }
  
  // Kontrollera behörighet (förenklad för prototyp)
  const hasAccess = project.members.some(member => member.userId === currentUser.id);
  if (!hasAccess) {
    throw new Response("Ingen behörighet", { status: 403 });
  }

  const artefacts = getArtefactsForProject(projectId);
  const auditLog = getAuditLogForProject(projectId);
  
  // Lägg till användarinformation
  const projectWithMembers = {
    ...project,
    memberDetails: project.members.map(member => ({
      ...member,
      user: getUserById(member.userId)
    }))
  };

  const auditLogWithUsers = auditLog.map(entry => ({
    ...entry,
    user: getUserById(entry.userId)
  }));

  return json({ 
    project: projectWithMembers, 
    artefacts, 
    auditLog: auditLogWithUsers,
    currentUser 
  });
}

const tabs = [
  { id: 'overview', label: 'Översikt', path: '' },
  { id: 'artefacts', label: 'Artefakter', path: '/artefakter' },
  { id: 'kanban', label: 'Kanban', path: '/kanban' },
  { id: 'activity', label: 'Aktivitetslogg', path: '/aktivitet' },
  { id: 'settings', label: 'Inställningar', path: '/settings' }
];

export default function ProjectView() {
  const { project, artefacts, auditLog, currentUser } = useLoaderData<typeof loader>();
  const location = useLocation();
  
  // Bestäm aktiv flik baserat på URL
  const activeTab = tabs.find(tab => {
    if (tab.path === '') {
      return location.pathname === `/projekt/${project.id}`;
    }
    return location.pathname.endsWith(tab.path);
  })?.id || 'overview';

  const userRole = project.members.find(m => m.userId === currentUser.id)?.role;
  const canEdit = userRole === 'ansvarig' || userRole === 'medarbetare';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Navigering tillbaka till hem */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ← ⁂ asterism
          </Link>
        </div>
        
        {/* Projekt-header */}
        <header className="mb-8 max-w-6xl mx-auto">
          <div className="mb-4">
            <h1 
              className="text-3xl md:text-4xl text-foreground mb-2 lowercase"
              style={{ fontFamily: '"La Belle Aurore", cursive' }}
            >
              {project.name}
            </h1>
            <div className="flex gap-2 mb-2">
              {project.caseNumber && (
                <span className={cn(componentStyles.metadataTag, "text-xs")}>
                  {project.caseNumber}
                </span>
              )}
              <span className={cn(
                componentStyles.metadataTag,
                "text-xs",
                project.status === 'active' ? "bg-[#FEE2E2] text-[#991B1B]" :
                project.status === 'pending' ? "bg-[#F3F4F6] text-[#374151]" :
                "bg-[#FEF3C7] text-[#92400E]"
              )}>
                {project.status === 'active' ? 'Aktiv' : 
                 project.status === 'pending' ? 'Väntande' : 'Arkiverad'}
              </span>
            </div>
              {project.description && (
                <p className={cn(componentStyles.enhancedParagraph, "text-lg")}>
                  {project.description}
                </p>
              )}
          </div>

        </header>

        {/* Navigeringsflikar */}
        <nav className="border-b border-border mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/projekt/${project.id}${tab.path}`}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Huvudinnehåll - visa översikt som standard */}
        {activeTab === 'overview' ? (
          <ProjectOverview 
            project={project} 
            artefacts={artefacts} 
            auditLog={auditLog.slice(0, 5)} 
            canEdit={canEdit}
          />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

function ProjectOverview({ 
  project, 
  artefacts, 
  auditLog, 
  canEdit 
}: { 
  project: any; 
  artefacts: any[]; 
  auditLog: any[]; 
  canEdit: boolean;
}) {
  const artefactsByType = artefacts.reduce((acc: Record<string, any[]>, artefact) => {
    if (!acc[artefact.type]) acc[artefact.type] = [];
    acc[artefact.type].push(artefact);
    return acc;
  }, {} as Record<string, any[]>);

  const artefactTypeNames: Record<ArtefactType, string> = {
    legal_brief: 'Rättsutredningar',
    statute_proposal: 'Författningsförslag', 
    case_reference: 'Rättsfall',
    generic_file: 'Filer',
    timeline: 'Tidslinjer',
    entity_map: 'Relationskartor',
    law_chain_explorer: 'Lagkedje-utforskning'
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        {/* Artefakter översikt */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl  text-foreground">Artefakter</h2>
            {canEdit && (
              <Link
                to={`/projekt/${project.id}/artefakter/ny`}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Skapa ny
              </Link>
            )}
          </div>
          
          {artefacts.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(artefactsByType).map(([type, items]) => (
                <div key={type} className={componentStyles.card}>
                  <h3 className="font-medium text-foreground mb-3">
                    {artefactTypeNames[type as ArtefactType]} ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.slice(0, 3).map((artefact: any) => (
                      <Link
                        key={artefact.id}
                        to={`/projekt/${project.id}/artefakter/${artefact.id}`}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        • {artefact.title}
                      </Link>
                    ))}
                    {items.length > 3 && (
                      <Link
                        to={`/projekt/${project.id}/artefakter`}
                        className="text-sm text-primary hover:underline"
                      >
                        Visa alla {items.length} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(componentStyles.card, "text-center py-8")}>
              <p className="text-muted-foreground mb-4">Inga artefakter ännu</p>
              {canEdit && (
                <Link
                  to={`/projekt/${project.id}/artefakter/ny`}
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Skapa första artefakt
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="space-y-8">
        {/* Projektmedlemmar */}
        <section>
          <h2 className="text-xl  text-foreground mb-4">Medlemmar</h2>
          <div className={cn(componentStyles.card, "space-y-3")}>
            {project.memberDetails.map((member: any) => (
              <div key={member.userId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{member.user?.name}</div>
                  <div className="text-xs text-muted-foreground">{member.user?.email}</div>
                </div>
                <span className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-medium",
                  member.role === 'ansvarig' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground border border-border"
                )}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Senaste aktivitet */}
        <section>
          <h2 className="text-xl  text-foreground mb-4">Senaste aktivitet</h2>
          <div className={componentStyles.card}>
            {auditLog.length > 0 ? (
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="text-sm">
                    <div className="font-medium">{entry.user?.name}</div>
                    <div className="text-muted-foreground">
                      {entry.action === 'artefact.create' && `Skapade "${entry.details.title}"`}
                      {entry.action === 'artefact.update' && `Uppdaterade artefakt`}
                      {entry.action === 'project.create' && `Skapade projektet`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString('sv-SE')}
                    </div>
                  </div>
                ))}
                <Link
                  to={`/projekt/${project.id}/aktivitet`}
                  className="text-sm text-primary hover:underline"
                >
                  Visa all aktivitet →
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Ingen aktivitet ännu</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}