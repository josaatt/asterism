import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { useState } from "react";
import { FileText, Users, Calendar, Clock, ArrowRight, Check, Plus } from "lucide-react";
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

function WorkTasksSection() {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  
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
    priority: project.status === 'active' ? 'Brådskande' : 'Normal',
    description: project.description
  }));
  
  // Get current user's group members
  const groupMembers = getGroupMembers(currentUser.group);
  
  // Create group tasks from projects assigned to group members
  const groupTasks = mockProjects
    .filter(project => {
      const owner = getUserById(project.ownerId);
      return owner && groupMembers.some(member => member.id === owner.id);
    })
    .map(project => {
      const owner = getUserById(project.ownerId);
      return {
        id: project.id,
        caseNumber: project.caseNumber || `PROJ-${project.id}`,
        date: project.updatedAt.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }),
        priority: project.status === 'active' ? 'Brådskande' : project.status === 'pending' ? 'Normal' : 'Ej prioritet',
        assignedTo: project.ownerId === currentUser.id ? 'Jag' : owner?.name || 'Okänd',
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

  return (
    <section className="max-w-6xl mx-auto mb-8">
      <div className="grid gap-6 lg:grid-cols-2 h-fit">
        {/* Mina arbetsuppgifter */}
        <div className={cn(componentStyles.card, "h-fit")}>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="size-6 text-primary" />
            <h2 className="text-2xl text-foreground lowercase" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
              mina arbetsuppgifter
            </h2>
          </div>
          
          {/* Idag */}
          <div className="mb-4">
            <h3 className="text-sm font-serif font-medium text-foreground mb-3">idag</h3>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  isChecked={checkedTasks.has(task.id)}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </div>
          </div>

          {/* Mina ärenden */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-serif font-medium text-foreground">mina ärenden</h3>
              <span className={cn(componentStyles.metadataTag, "bg-[#FEE2E2] text-[#991B1B]")}>brådskande</span>
            </div>
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div key={task.id} className="p-3 bg-muted/30 rounded border-l-4 border-l-red-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.caseNumber} - {task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{task.date}</div>
                    </div>
                    <span className={cn(componentStyles.metadataTag, 
                      task.priority === 'Brådskande' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F3F4F6] text-[#374151]'
                    )}>
                      {task.priority.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {task.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Gruppens ärenden */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-fit">
          <div className="flex items-center gap-3 p-4 border-b">
            <Users className="size-6 text-primary" />
            <div>
              <h2 className="text-2xl text-foreground lowercase" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                gruppens ärenden
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentUser.group} ({groupMembers.length} medlemmar)
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b sticky top-0">
                <tr>
                  <th className="text-left p-4 font-serif font-medium text-foreground">ärende</th>
                  <th className="text-left p-4 font-serif font-medium text-foreground">datum</th>
                  <th className="text-left p-4 font-serif font-medium text-foreground">prioritering</th>
                  <th className="text-left p-4 font-serif font-medium text-foreground">tilldelad</th>
                  <th className="text-left p-4 font-serif font-medium text-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {groupTasks.map((task, index) => (
                  <tr 
                    key={task.id} 
                    className={cn(
                      "border-b transition-colors hover:bg-muted/30",
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={cn(componentStyles.metadataTag, "text-xs")}>
                          {task.caseNumber}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {task.date}
                    </td>
                    <td className="p-4">
                      <span className={cn(componentStyles.metadataTag, 
                        task.priority === 'Brådskande' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                        task.priority === 'Normal' ? 'bg-[#F3F4F6] text-[#374151]' :
                        'bg-[#FEF3C7] text-[#92400E]'
                      )}>
                        {task.priority.toLowerCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {task.assignedTo}
                    </td>
                    <td className="p-4">
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskItem({ task, isChecked, onToggle }: { 
  task: { id: string; text: string; caseNumber?: string }, 
  isChecked: boolean, 
  onToggle: () => void 
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onToggle}
        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          isChecked 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'border-border hover:border-primary'
        }`}
      >
        {isChecked && <Check className="size-3" />}
      </button>
      <div className={`flex-1 ${
        isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
      }`}>
        <div className="text-sm">{task.text}</div>
        {task.caseNumber && (
          <div className="text-xs text-muted-foreground mt-1">{task.caseNumber}</div>
        )}
      </div>
    </div>
  );
}


const features = [
  {
    title: "projekt",
    path: "/projects",
    description:
      "Hantera juridiska projekt med strukturerad dokumentation, artefakter och samarbetsverktyg.",
    tags: ["Projekthantering", "Samarbete", "Dokumentation"],
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
