import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { getProjectsForUser, currentUser, getUserById } from "~/data/mock-data";
import { PageHeader } from "~/components/navigation/page-header";
import ViewToggle from "~/components/comp-108";
import ProjectFiltersComponent, { type ProjectFilter, ProjectFilterType, FilterOperator } from "~/components/ui/project-filters";
import AddProjectFilter from "~/components/ui/add-project-filter";

export const meta: MetaFunction = () => {
  return [
    { title: "Ärenden - Asterism" },
    { name: "description", content: "Översikt över dina juridiska ärenden" },
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

type SortField = 'name' | 'status' | 'priority' | 'caseNumber' | 'members' | 'artefacts' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function ProjectsIndex() {
  const { user: _user, projects } = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Alla status");
  const [projectFilters, setProjectFilters] = useState<ProjectFilter[]>([]);
  const [tableSort, setTableSort] = useState<{ field: SortField; direction: SortDirection }>({ field: 'updatedAt', direction: 'desc' });

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

  const handleSort = (field: SortField) => {
    setTableSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortProjects = (projectsToSort: any[]) => {
    return [...projectsToSort].sort((a, b) => {
      let aVal, bVal;
      
      switch (tableSort.field) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'status':
          const statusOrder = { 'active': 3, 'pending': 2, 'archived': 1 };
          aVal = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bVal = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        case 'priority':
          const priorityOrder = { 'brådskande': 3, 'normal': 2, 'ej_prioritet': 1 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'caseNumber':
          aVal = a.caseNumber || '';
          bVal = b.caseNumber || '';
          break;
        case 'members':
          aVal = a.members.length;
          bVal = b.members.length;
          break;
        case 'artefacts':
          aVal = a.artefacts?.length || 0;
          bVal = b.artefacts?.length || 0;
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt);
          bVal = new Date(b.updatedAt);
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return tableSort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return tableSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const pendingProjects = filteredProjects.filter(p => p.status === 'pending');
  const archivedProjects = filteredProjects.filter(p => p.status === 'archived');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <PageHeader 
          title="ärenden"
          description="Översikt över alla dina juridiska ärenden och pågående arbeten."
        />
        
        {/* View Toggle Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-medium">{filteredProjects.length}</span> av{' '}
                <span className="font-medium">{projects.length}</span> ärenden
              </p>
              <Link
                to="/projects/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Nytt ärende
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
            <ProjectTableView 
              projects={sortProjects(filteredProjects)} 
              tableSort={tableSort} 
              onSort={handleSort} 
            />
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
          placeholder="Sök ärenden..."
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
      {/* Aktiva ärenden */}
      <section>
        <h2 className="text-xl  text-foreground mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Aktiva ärenden ({activeProjects.length})
        </h2>
        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic">Inga aktiva ärenden för tillfället.</div>
        )}
      </section>

      {/* Väntande ärenden */}
      {pendingProjects.length > 0 && (
        <section>
          <h2 className="text-xl  text-foreground mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Väntande ärenden ({pendingProjects.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Arkiverade ärenden */}
      {archivedProjects.length > 0 && (
        <section>
          <h2 className="text-xl  text-foreground mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            Arkiverade ärenden ({archivedProjects.length})
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

// Sortable Header Component
function SortableHeader({ field, label, currentSort, onSort }: {
  field: SortField;
  label: string;
  currentSort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}) {
  return (
    <th 
      className={cn(componentStyles.tableHeaderCell, "cursor-pointer hover:bg-muted/30 transition-colors")}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        {currentSort.field === field && (
          currentSort.direction === 'asc' ? 
            <ChevronUp className="size-4" /> : 
            <ChevronDown className="size-4" />
        )}
      </div>
    </th>
  );
}

// Table View Component
function ProjectTableView({ projects, tableSort, onSort }: { 
  projects: any[]; 
  tableSort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}) {
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

  const getPriorityBadge = (priority: string) => {
    const badges = {
      brådskande: { label: 'Brådskande', class: 'bg-[#FEE2E2] text-[#991B1B]' },
      normal: { label: 'Normal', class: 'bg-[#F3F4F6] text-[#374151]' },
      ej_prioritet: { label: 'Ej prioritet', class: 'bg-[#FEF3C7] text-[#92400E]' }
    };
    const badge = badges[priority as keyof typeof badges] || badges.normal;
    return (
      <span className={cn(componentStyles.metadataTag, badge.class)}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className={componentStyles.tableContainer}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={componentStyles.tableHeader}>
            <tr>
              <SortableHeader field="name" label="Ärende" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="status" label="Status" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="priority" label="Prioritet" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="caseNumber" label="Ärendenummer" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="members" label="Medlemmar" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="artefacts" label="Artefakter" currentSort={tableSort} onSort={onSort} />
              <SortableHeader field="updatedAt" label="Uppdaterad" currentSort={tableSort} onSort={onSort} />
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr 
                key={project.id} 
                className={cn(
                  componentStyles.tableRow,
                  index % 2 === 0 ? componentStyles.tableRowEven : componentStyles.tableRowOdd
                )}
              >
                <td className={componentStyles.tableCell}>
                  <Link to={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                    <div className="space-y-1">
                      <h3 className={componentStyles.tableTitle}>
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className={componentStyles.tableDescription}>
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className={componentStyles.tableCell}>
                  {getStatusBadge(project.status)}
                </td>
                <td className={componentStyles.tableCell}>
                  {getPriorityBadge(project.priority)}
                </td>
                <td className={componentStyles.tableCell}>
                  <span className={cn(componentStyles.metadataTag, "text-xs")}>
                    {project.caseNumber || '-'}
                  </span>
                </td>
                <td className={componentStyles.tableCell}>
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
                <td className={cn(componentStyles.tableCell, componentStyles.tableCellText)}>
                  {project.artefacts?.length || 0}
                </td>
                <td className={cn(componentStyles.tableCell, componentStyles.tableCellText)}>
                  {new Date(project.updatedAt).toLocaleDateString('sv-SE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2">Inga ärenden hittades</h3>
            <p>Försök ändra dina sökkriterier eller skapa ett nytt ärende.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: any }) {
  const statusColors: Record<string, string> = {
    active: 'border-l-green-500',
    pending: 'border-l-yellow-500', 
    archived: 'border-l-gray-400'
  };

  const priorityColors: Record<string, string> = {
    brådskande: 'bg-[#FEE2E2] text-[#991B1B]',
    normal: 'bg-[#F3F4F6] text-[#374151]',
    ej_prioritet: 'bg-[#FEF3C7] text-[#92400E]'
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
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {project.caseNumber && (
            <span className={cn(componentStyles.metadataTag, "text-xs")}>
              {project.caseNumber}
            </span>
          )}
          <span className={cn(componentStyles.metadataTag, "text-xs", priorityColors[project.priority])}>
            {project.priority === 'brådskande' ? 'brådskande' : 
             project.priority === 'normal' ? 'normal' : 'ej prioritet'}
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-foreground">
          {project.name}
        </h3>
        
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="text-xs text-muted-foreground pt-2">
          Uppdaterad: {new Date(project.updatedAt).toLocaleDateString('sv-SE')}
        </div>
      </div>
    </Link>
  );
}