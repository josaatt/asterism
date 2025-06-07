import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { getProjectsForUser, currentUser, getUserById } from "~/data/mock-data";
import type { Project } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Projekt - Asterism" },
    { name: "description", content: "Översikt över dina juridiska projekt" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // I en riktig app skulle vi hämta användaren från session/cookies
  const user = currentUser;
  const projects = getProjectsForUser(user.id);
  
  // Lägg till användarinformation för projektmedlemmar
  const projectsWithMembers = projects.map(project => ({
    ...project,
    memberDetails: project.members.map(member => ({
      ...member,
      user: getUserById(member.userId)
    }))
  }));

  return json({ user, projects: projectsWithMembers });
}

export default function ProjectsIndex() {
  const { user, projects } = useLoaderData<typeof loader>();

  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingProjects = projects.filter(p => p.status === 'pending');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 
            className="text-3xl md:text-4xl text-foreground mb-4 lowercase"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            <span className="text-primary text-lg leading-none translate-y-[-0.2em] mr-3">¶</span>
            mina projekt
          </h1>
          <p className={cn(componentStyles.enhancedParagraph, "text-lg mb-6")}>
            <span className={componentStyles.enhancedFirstWord}>Översikt</span>{" "}
            över alla dina juridiska projekt och pågående arbeten.
          </p>
          
          <div className="flex gap-4">
            <Link
              to="/projects/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Nytt projekt
            </Link>
          </div>
        </header>

        <main className="space-y-12">
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
        </main>
      </div>
    </div>
  );
}

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