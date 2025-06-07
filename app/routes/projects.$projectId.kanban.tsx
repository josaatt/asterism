import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,

  useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { 
  getProjectById, 
  currentUser 
} from "~/data/mock-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Kanban - Asterism" },
    { name: "description", content: "Projekthantering med Kanban-tavla" },
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

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: Date;
}

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Granska GDPR-compliance dokumentation',
    description: 'Läs igenom befintlig dokumentation och identifiera brister',
    assignee: 'Erik Jurist',
    priority: 'high',
    status: 'todo',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'task-2',
    title: 'Sammanställ lista över berörd personal',
    description: 'Kontakta HR för att få en komplett lista',
    assignee: 'Anna Administratör',
    priority: 'medium',
    status: 'todo',
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'task-3',
    title: 'Analysera nuvarande dataflöden',
    description: 'Kartlägg hur personuppgifter hanteras idag',
    assignee: 'Erik Jurist',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-01-17')
  },
  {
    id: 'task-4',
    title: 'Första utkast av rättsutredning',
    description: 'Skriv ett första utkast baserat på insamlad information',
    assignee: 'Erik Jurist',
    priority: 'medium',
    status: 'done',
    createdAt: new Date('2024-01-18')
  }
];

const columns = [
  { id: 'todo', title: 'Att göra', color: 'border-gray-300' },
  { id: 'in_progress', title: 'Pågående', color: 'border-blue-300' },
  { id: 'done', title: 'Klar', color: 'border-green-300' }
] as const;

export default function ProjectKanban() {
  const { project } = useLoaderData<typeof loader>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Kolla om vi drar över en kolumn
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      setTasks(tasks => tasks.map(task => 
        task.id === activeId 
          ? { ...task, status: overColumn.id as Task['status'] }
          : task
      ));
      return;
    }

    // Kolla om vi drar över en annan task
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks(tasks => tasks.map(task => 
        task.id === activeId 
          ? { ...task, status: overTask.status }
          : task
      ));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);

    if (!activeTask) return;

    // Om vi släpper på en kolumn
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      setTasks(tasks => tasks.map(task => 
        task.id === activeId 
          ? { ...task, status: overColumn.id as Task['status'] }
          : task
      ));
      return;
    }

    // Om vi släpper på en annan task, sortera om inom samma kolumn
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(t => t.status === activeTask.status);
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);
      
      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      
      setTasks(tasks => {
        const otherTasks = tasks.filter(t => t.status !== activeTask.status);
        return [...otherTasks, ...reorderedColumnTasks];
      });
    }
  }

  function addNewTask(columnId: string, title: string, description: string) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      assignee: currentUser.name,
      priority: 'medium',
      status: columnId as Task['status'],
      createdAt: new Date()
    };
    
    setTasks(tasks => [...tasks, newTask]);
    setShowNewTaskForm(null);
  }

  return (
    <div className="space-y-8">
      <header className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif text-foreground mb-4">Kanban-tavla</h2>
        <p className={cn(componentStyles.enhancedParagraph, "text-lg")}>
          <span className={componentStyles.enhancedFirstWord}>Organisera</span>{" "}
          och följ upp projektuppgifter med en visuell Kanban-tavla.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks.filter(task => task.status === column.id)}
                onAddTask={(title, description) => addNewTask(column.id, title, description)}
                showNewTaskForm={showNewTaskForm === column.id}
                setShowNewTaskForm={setShowNewTaskForm}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

function KanbanColumn({ 
  column, 
  tasks, 
  onAddTask, 
  showNewTaskForm,
  setShowNewTaskForm 
}: {
  column: { id: string; title: string; color: string };
  tasks: Task[];
  onAddTask: (title: string, description: string) => void;
  showNewTaskForm: boolean;
  setShowNewTaskForm: (columnId: string | null) => void;
}) {
  return (
    <div className={cn(
      "bg-muted/30 rounded-lg p-4 border-t-4",
      column.color
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">
          {column.title} ({tasks.length})
        </h3>
        <button
          onClick={() => setShowNewTaskForm(column.id)}
          className="text-sm px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          + Lägg till
        </button>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div 
          className="space-y-3 min-h-[400px]"
          // Gör hela kolumnen till en drop zone
          data-column-id={column.id}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {showNewTaskForm && (
            <NewTaskForm 
              onSubmit={onAddTask}
              onCancel={() => setShowNewTaskForm(null)}
            />
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function TaskCard({ task, isDragging = false }: { task: Task; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: `${componentStyles.metadataTag} bg-[#FEF3C7] text-[#92400E]`,
    medium: `${componentStyles.metadataTag} bg-[#F3F4F6] text-[#374151]`,
    high: `${componentStyles.metadataTag} bg-[#FEE2E2] text-[#991B1B]`
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white p-3 rounded-md border border-border shadow-sm cursor-grab active:cursor-grabbing",
        isDragging && "rotate-3 shadow-lg"
      )}
    >
      <div className="mb-2">
        <h4 className="font-medium text-sm text-foreground mb-1">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-muted-foreground">
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            priorityColors[task.priority]
          )}>
            {task.priority === 'high' ? 'Hög' : task.priority === 'medium' ? 'Medium' : 'Låg'}
          </span>
        </div>
        
        {task.assignee && (
          <div className="text-xs text-muted-foreground">
            {task.assignee.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
    </div>
  );
}

function NewTaskForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded-md border border-border">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Uppgiftstitel..."
        className="w-full mb-2 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beskrivning (valfritt)..."
        rows={2}
        className="w-full mb-2 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Lägg till
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-xs border border-border rounded hover:bg-muted"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}