import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { useState } from "react";
import { FileText, Users, Calendar, Clock, ArrowRight, Check, Plus, Briefcase, ChevronUp, ChevronDown } from "lucide-react";
import { mockProjects, currentUser, getUserById, getGroupMembers } from "~/data/mock-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Asterism - Juridiskt Arbetsverktyg" },
    {
      name: "description",
      content: "Centraliserat verktyg för juridisk forskning och dokumentation",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1
            className="text-4xl md:text-6xl text-foreground mb-6"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ⁂ asterism
          </h1>
          <p
            className={cn(
              componentStyles.enhancedParagraph,
              "max-w-2xl mx-auto text-lg"
            )}
          >
            <span className={componentStyles.enhancedFirstWord}>
              Centraliserat
            </span>{" "}
            arbetsverktyg för juridisk forskning, dokumentation och
            projekthantering. Skapat för att förenkla det juridiska arbetet.
          </p>
        </header>

        {/* Mina arbetsuppgifter sektion */}
        <WorkTasksSection />

        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mt-16">
          {features.map((feature) => {
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={cn(
                  componentStyles.card,
                  "page-transition cursor-pointer"
                )}
              >
                <h2
                  className="text-2xl md:text-3xl mb-3 text-foreground lowercase flex items-start gap-3"
                  style={{ fontFamily: '"La Belle Aurore", cursive' }}
                >
                  <span className="text-primary text-lg leading-none translate-y-[-0.2em]">
                    ¶
                  </span>
                  {feature.title}
                </h2>
                <p className={componentStyles.enhancedParagraph}>
                  {feature.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className={componentStyles.metadataTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </main>

        <section className="mt-16 text-center">
          <div className="pull-quote">
            Juridisk forskning förenklas genom väldesignade verktyg.
          </div>
          <div className="footnote max-w-md mx-auto">
            Asterism kombinerar traditionell juridisk arbetsmetodik med moderna verktyg för att skapa en smidig och effektiv arbetsprocess.
          </div>
        </section>
      </div>
    </div>
  );
}

type SortField = 'title' | 'date' | 'priority' | 'assignedTo';
type SortDirection = 'asc' | 'desc';

function WorkTasksSection() {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [myTasksSort, setMyTasksSort] = useState<{ field: SortField; direction: SortDirection }>({ field: 'date', direction: 'desc' });
  const [groupTasksSort, setGroupTasksSort] = useState<{ field: SortField; direction: SortDirection }>({ field: 'date', direction: 'desc' });
  
  // Get projects where current user is a member
  const userProjects = mockProjects.filter(project => 
    project.members.some(member => member.userId === currentUser.id)
  );
  
  // Create today tasks based on user projects
  const todayTasks = [
    {
      id: '1',
      text: `Förbered möte med ${currentUser.group}-gruppen den 5/6`,
      caseNumber: undefined
    },
    {
      id: '2', 
      text: 'Tidredovisa förra månadens arbete i exponera-projektet',
      caseNumber: undefined
    },
    {
      id: '3',
      text: `Granska ${userProjects[0]?.name || 'projekt'}`,
      caseNumber: userProjects[0]?.caseNumber
    }
  ];
  
  // Create my tasks from user's projects
  const myTasks = userProjects.filter(project => project.ownerId === currentUser.id).map(project => ({
    id: project.id,
    caseNumber: project.caseNumber || `PROJ-${project.id}`,
    title: project.name,
    date: project.updatedAt.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }),
    priority: project.priority === 'brådskande' ? 'Brådskande' : project.priority === 'normal' ? 'Normal' : 'Ej prioritet',
    description: project.description
  }));
  
  // Get current user's group members
  const groupMembers = getGroupMembers(currentUser.group);
  
  // Create group tasks from projects assigned to group members (excluding current user's own projects)
  const groupTasks = mockProjects
    .filter(project => {
      const owner = getUserById(project.ownerId);
      return owner && 
        groupMembers.some(member => member.id === owner.id) && 
        project.ownerId !== currentUser.id; // Exclude current user's own projects
    })
    .map(project => {
      const owner = getUserById(project.ownerId);
      return {
        id: project.id,
        title: project.name,
        caseNumber: project.caseNumber || `PROJ-${project.id}`,
        date: project.updatedAt.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }),
        priority: project.priority === 'brådskande' ? 'Brådskande' : project.priority === 'normal' ? 'Normal' : 'Ej prioritet',
        assignedTo: owner?.name || 'Okänd',
        group: owner?.group || 'Okänd'
      };
    });

  const toggleTask = (taskId: string) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(taskId)) {
      newChecked.delete(taskId);
    } else {
      newChecked.add(taskId);
    }
    setCheckedTasks(newChecked);
  };

  const handleSort = (field: SortField, isGroupTasks: boolean = false) => {
    if (isGroupTasks) {
      setGroupTasksSort(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setMyTasksSort(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  const sortTasks = (tasks: any[], sortConfig: { field: SortField; direction: SortDirection }) => {
    return [...tasks].sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.field) {
        case 'title':
          aVal = a.title || a.caseNumber;
          bVal = b.title || b.caseNumber;
          break;
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'priority':
          const priorityOrder = { 'Brådskande': 3, 'Normal': 2, 'Ej prioritet': 1 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'assignedTo':
          aVal = a.assignedTo || '';
          bVal = b.assignedTo || '';
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Sort the tasks
  const sortedMyTasks = sortTasks(myTasks, myTasksSort);
  const sortedGroupTasks = sortTasks(groupTasks, groupTasksSort);

  const SortableHeader = ({ field, label, currentSort, onSort }: {
    field: SortField;
    label: string;
    currentSort: { field: SortField; direction: SortDirection };
    onSort: (field: SortField) => void;
  }) => (
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

  return (
    <section className="max-w-6xl mx-auto mb-8">
      <div className="grid gap-6 lg:grid-cols-2 h-fit">
        {/* Mina arbetsuppgifter */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-fit">
          <div className="flex items-center gap-3 p-4 border-b">
            <FileText className="size-6 text-primary" />
            <h2 className="text-2xl text-foreground lowercase" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
              mina arbetsuppgifter
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={cn(componentStyles.tableHeader)}>
                <tr>
                  <th className={componentStyles.tableHeaderCell}>uppgift</th>
                  <th className={componentStyles.tableHeaderCell}>status</th>
                </tr>
              </thead>
              <tbody>
                {todayTasks.map((task, index) => (
                  <tr 
                    key={task.id} 
                    className={cn(
                      componentStyles.tableRow,
                      index % 2 === 0 ? componentStyles.tableRowEven : componentStyles.tableRowOdd
                    )}
                  >
                    <td className={componentStyles.tableCell}>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{task.text}</div>
                        {task.caseNumber && (
                          <div>
                            <span className={cn(componentStyles.metadataTag, "text-xs")}>
                              {task.caseNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={componentStyles.tableCell}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          checkedTasks.has(task.id)
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {checkedTasks.has(task.id) && <Check className="size-3" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column with Mina ärenden above Gruppens ärenden */}
        <div className="space-y-6">
          {/* Mina ärenden (separate table) */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-fit">
            <div className="flex items-center gap-3 p-4 border-b">
              <Briefcase className="size-6 text-primary" />
              <h2 className="text-2xl text-foreground lowercase" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                mina ärenden
              </h2>
            </div>
            
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className={cn(componentStyles.tableHeader, "sticky top-0")}>
                  <tr>
                    <SortableHeader 
                      field="title" 
                      label="ärende" 
                      currentSort={myTasksSort} 
                      onSort={(field) => handleSort(field, false)} 
                    />
                    <SortableHeader 
                      field="priority" 
                      label="prioritering" 
                      currentSort={myTasksSort} 
                      onSort={(field) => handleSort(field, false)} 
                    />
                    <th className={componentStyles.tableHeaderCell}></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMyTasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      className={cn(
                        componentStyles.tableRow,
                        index % 2 === 0 ? componentStyles.tableRowEven : componentStyles.tableRowOdd
                      )}
                    >
                      <td className={componentStyles.tableCell}>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{task.title}</div>
                          <div>
                            <span className={cn(componentStyles.metadataTag, "text-xs")}>
                              {task.caseNumber}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={componentStyles.tableCell}>
                        <span className={cn(componentStyles.metadataTag, 
                          task.priority === 'Brådskande' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F3F4F6] text-[#374151]'
                        )}>
                          {task.priority.toLowerCase()}
                        </span>
                      </td>
                      <td className={componentStyles.tableCell}>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gruppens ärenden */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-fit">
            <div className="flex items-center gap-3 p-4 border-b">
              <Users className="size-6 text-primary" />
              <h2 className="text-2xl text-foreground lowercase" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                gruppens ärenden
              </h2>
            </div>
            
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className={cn(componentStyles.tableHeader, "sticky top-0")}>
                  <tr>
                    <SortableHeader 
                      field="title" 
                      label="ärende" 
                      currentSort={groupTasksSort} 
                      onSort={(field) => handleSort(field, true)} 
                    />
                    <SortableHeader 
                      field="priority" 
                      label="prioritering" 
                      currentSort={groupTasksSort} 
                      onSort={(field) => handleSort(field, true)} 
                    />
                    <SortableHeader 
                      field="assignedTo" 
                      label="tilldelad" 
                      currentSort={groupTasksSort} 
                      onSort={(field) => handleSort(field, true)} 
                    />
                    <th className={componentStyles.tableHeaderCell}></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGroupTasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      className={cn(
                        componentStyles.tableRow,
                        index % 2 === 0 ? componentStyles.tableRowEven : componentStyles.tableRowOdd
                      )}
                    >
                      <td className={componentStyles.tableCell}>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{task.title}</div>
                          <div>
                            <span className={cn(componentStyles.metadataTag, "text-xs")}>
                              {task.caseNumber}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={componentStyles.tableCell}>
                        <span className={cn(componentStyles.metadataTag, 
                          task.priority === 'Brådskande' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                          task.priority === 'Normal' ? 'bg-[#F3F4F6] text-[#374151]' :
                          'bg-[#FEF3C7] text-[#92400E]'
                        )}>
                          {task.priority.toLowerCase()}
                        </span>
                      </td>
                      <td className={cn(componentStyles.tableCell, componentStyles.tableCellText)}>
                        {task.assignedTo}
                      </td>
                      <td className={componentStyles.tableCell}>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



const features = [
  {
    title: "ärenden",
    path: "/projects",
    description:
      "Hantera juridiska ärenden med strukturerad dokumentation, artefakter och samarbetsverktyg.",
    tags: ["Ärendehantering", "Samarbete", "Dokumentation"],
  },
  {
    title: "rättspraxis",
    path: "/rättspraxis",
    description:
      "Sök och analysera rättsfall från svenska domstolar med avancerade filtreringsmöjligheter.",
    tags: ["Rättsfall", "Analys", "Sökning"],
  },
  {
    title: "utredningar",
    path: "/drafts",
    description:
      "Skriv och redigera juridiska utredningar med Markdown-stöd och smart länkning.",
    tags: ["Utredningar", "Markdown", "Redigering"],
  },
  {
    title: "bokmärken",
    path: "/bookmarks",
    description:
      "Spara och organisera viktiga juridiska källor och referenser för senare användning.",
    tags: ["Referenser", "Källor", "Organisation"],
  },
  {
    title: "tidslinje",
    path: "/timeline",
    description:
      "Visualisera kronologiska händelseförlopp och viktiga datum i juridiska ärenden.",
    tags: ["Visualisering", "Kronologi", "Händelser"],
  },
  {
    title: "relationskarta",
    path: "/entities",
    description:
      "Kartlägg komplexa relationer mellan personer, företag och juridiska entiteter.",
    tags: ["Relationer", "Visualisering", "Entiteter"],
  },
];
