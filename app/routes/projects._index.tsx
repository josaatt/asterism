import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { getProjectsForUser, currentUser, getUserById } from "~/data/mock-data";
import { PageHeader } from "~/components/navigation/page-header";
import ViewToggle from "~/components/comp-108";
import ProjectFiltersComponent, { type ProjectFilter, ProjectFilterType, FilterOperator } from "~/components/ui/project-filters";
import AddProjectFilter from "~/components/ui/add-project-filter";

export const meta: MetaFunction = () => {
  return [
    { title: "Projekt - Asterism" },
    { name: "description", content: "Översikt över dina juridiska projekt" },
  ];
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
  // I en riktig app skulle vi hämta användaren från session/cookies
  const _user = currentUser;
  const projects = getProjectsForUser(_user.id);
  
  // Lägg till användarinformation för projektmedlemmar
  const projectsWithMembers = projects.map(project => ({
    ...project,
    memberDetails: project.members.map(member => ({
      ...member,
      user: getUserById(member.userId)
    }))
  }));

  return json({ user: _user, projects: projectsWithMembers });
}

export default function ProjectsIndex() {
  const { user: _user, projects } = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Alla status");
  const [projectFilters, setProjectFilters] = useState<ProjectFilter[]>([]);

  // Filter projects based on search, status, and advanced filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !project.name.toLowerCase().includes(searchLower) &&
          !project.description?.toLowerCase().includes(searchLower) &&
          !project.caseNumber?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "Alla status") {
        const statusMap: Record<string, string> = {
          "Aktiva": "active",
          "Väntande": "pending", 
          "Arkiverade": "archived"
        };
        if (project.status !== statusMap[statusFilter]) {
          return false;
        }
      }

      // Advanced filter logic
      for (const filter of projectFilters) {
        if (filter.value.length === 0) continue;

        let matches = false;
        
        switch (filter.type) {
          case ProjectFilterType.STATUS:
            const statusValue = filter.value[0];
            if (filter.operator === FilterOperator.IS) {
              matches = project.status === statusValue;
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = project.status !== statusValue;
            }
            break;
            
          case ProjectFilterType.MEMBER_COUNT:
            const memberCount = project.members.length;
            const filterCount = parseInt(filter.value[0]);
            if (filter.operator === FilterOperator.EQUAL_TO) {
              matches = memberCount === filterCount;
            } else if (filter.operator === FilterOperator.MORE_THAN) {
              matches = memberCount > filterCount;
            } else if (filter.operator === FilterOperator.LESS_THAN) {
              matches = memberCount < filterCount;
            }
            break;
            
          case ProjectFilterType.CREATED_YEAR:
            const projectYear = new Date(project.createdAt).getFullYear().toString();
            if (filter.operator === FilterOperator.IS) {
              matches = filter.value.includes(projectYear);
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = !filter.value.includes(projectYear);
            }
            break;
            
          case ProjectFilterType.CASE_NUMBER:
            if (filter.operator === FilterOperator.IS) {
              matches = filter.value.includes(project.caseNumber || "");
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = !filter.value.includes(project.caseNumber || "");
            }
            break;
        }
        
        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchTerm, statusFilter, projectFilters]);

  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const pendingProjects = filteredProjects.filter(p => p.status === 'pending');
  const archivedProjects = filteredProjects.filter(p => p.status === 'archived');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="mina projekt"
          description="Översikt över alla dina juridiska projekt och pågående arbeten."
        />
        
        {/* View Toggle Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-medium">{filteredProjects.length}</span> av{' '}
                <span className="font-medium">{projects.length}</span> projekt
              </p>
              <Link
                to="/projects/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Nytt projekt
              </Link>
            </div>
          </div>
          
          {/* Table filters - only show in table view */}
          {viewMode === 'table' && (
            <ProjectFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}
        </div>

        <main className="max-w-6xl mx-auto">
          {viewMode === 'cards' ? (
            <>
              {/* Card view filters */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <AddProjectFilter 
                    onAddFilter={(filter) => setProjectFilters(prev => [...prev, filter])}
                    existingFilters={projectFilters}
                  />
                  <ProjectFiltersComponent 
                    filters={projectFilters}
                    setFilters={setProjectFilters}
                  />
                </div>
              </div>
              <ProjectCardsView 
                activeProjects={activeProjects}
                pendingProjects={pendingProjects}
                archivedProjects={archivedProjects}
              />
            </>
          ) : (
            <ProjectTableView projects={filteredProjects} />
          )}
        </main>
      </div>
    </div>
  );
}

// Project Filters Component
function ProjectFilters({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex-1 min-w-64">
        <input
          type="text"
          placeholder="Sök projekt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="Alla status">Alla status</option>
          <option value="Aktiva">Aktiva</option>
          <option value="Väntande">Väntande</option>
          <option value="Arkiverade">Arkiverade</option>
        </select>
      </div>
    </div>
  );
}

// Cards View Component
function ProjectCardsView({ 
  activeProjects, 
  pendingProjects, 
  archivedProjects 
}: {
  activeProjects: any[];
  pendingProjects: any[];
  archivedProjects: any[];
}) {
  return (
    <div className="space-y-12">
      {/* Aktiva projekt */}
      <section>
        <h2 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Aktiva projekt ({activeProjects.length})
        </h2>
        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic">Inga aktiva projekt för tillfället.</div>
        )}
      </section>

      {/* Väntande projekt */}
      {pendingProjects.length > 0 && (
        <section>
          <h2 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Väntande projekt ({pendingProjects.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Arkiverade projekt */}
      {archivedProjects.length > 0 && (
        <section>
          <h2 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            Arkiverade projekt ({archivedProjects.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {archivedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Table View Component
function ProjectTableView({ projects }: { projects: any[] }) {
  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'Aktiv', class: 'bg-[#FEE2E2] text-[#991B1B]' },
      pending: { label: 'Väntande', class: 'bg-[#F3F4F6] text-[#374151]' },
      archived: { label: 'Arkiverad', class: 'bg-[#FEF3C7] text-[#92400E]' }
    };
    const badge = badges[status as keyof typeof badges] || badges.active;
    return (
      <span className={cn(componentStyles.metadataTag, badge.class)}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className={componentStyles.card}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Projekt</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Ärendenummer</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Medlemmar</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Artefakter</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Uppdaterad</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <Link to={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                    <div className="font-medium">{project.name}</div>
                    {project.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(project.status)}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {project.caseNumber || '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex -space-x-1">
                    {project.memberDetails.slice(0, 3).map((member: any) => (
                      <div
                        key={member.userId}
                        className="w-6 h-6 bg-primary/10 border border-background rounded-full flex items-center justify-center text-xs font-medium"
                        title={member.user?.name}
                      >
                        {member.user?.name?.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="w-6 h-6 bg-muted border border-background rounded-full flex items-center justify-center text-xs">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {project.artefacts?.length || 0}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(project.updatedAt).toLocaleDateString('sv-SE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2">Inga projekt hittades</h3>
            <p>Försök ändra dina sökkriterier eller skapa ett nytt projekt.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component (unchanged)
function ProjectCard({ project }: { project: any }) {
  const statusColors: Record<string, string> = {
    active: 'border-l-green-500',
    pending: 'border-l-yellow-500', 
    archived: 'border-l-gray-400'
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className={cn(
        componentStyles.card,
        "page-transition cursor-pointer border-l-4",
        statusColors[project.status]
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-serif font-medium text-foreground mb-2">
          {project.name}
        </h3>
        {project.caseNumber && (
          <div className="text-sm text-muted-foreground mb-2">
            Ärendenummer: {project.caseNumber}
          </div>
        )}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Artefakter: {project.artefacts?.length || 0}</span>
          <span>Medlemmar: {project.members.length}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {project.memberDetails.slice(0, 3).map((member: any) => (
            <div
              key={member.userId}
              className="text-xs px-2 py-1 bg-muted rounded-full"
              title={`${member.user?.name} (${member.permission})`}
            >
              {member.user?.name?.split(' ').map((n: string) => n[0]).join('')}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="text-xs px-2 py-1 bg-muted rounded-full">
              +{project.members.length - 3}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Uppdaterad: {new Date(project.updatedAt).toLocaleDateString('sv-SE')}
        </div>
      </div>
    </Link>
  );
}