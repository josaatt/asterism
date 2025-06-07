// Typ-definitioner för det juridiska arbetsverktyget

// De olika typerna av objekt som kan finnas i ett projekt
export type ArtefactType = 
  | 'legal_brief'       // Rättsutredning (Markdown-dokument)
  | 'statute_proposal'  // Författningsförslag (Markdown-dokument)
  | 'case_reference'    // Sparat rättsfall
  | 'generic_file'      // Uppladdad fil (PDF, Word etc.)
  | 'timeline'          // Tidslinje-visualisering (Mockup)
  | 'entity_map'        // Relationskarta (Mockup)
  | 'law_chain_explorer'; // Lagkedje-utforskare (Mockup)

// Status för ett projekt
export type ProjectStatus = 'active' | 'archived' | 'pending';

// Prioritet för ett projekt
export type ProjectPriority = 'brådskande' | 'normal' | 'ej_prioritet';

// Behörighetsnivåer inom ett projekt
export type ProjectPermission = 'owner' | 'editor' | 'commenter' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  group: string;
}

export interface Artefact {
  id: string;
  projectId: string;
  type: ArtefactType;
  title: string;
  content: string; // För dokument: Markdown. För filer: Sökväg/URL. För mockups: Kan vara tom eller innehålla frontend-data.
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  caseNumber?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  ownerId: string; // userId
  members: { userId: string; permission: ProjectPermission; }[];
  artefacts: string[]; // Lista med artefakt-IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  projectId: string;
  action: string; // Ex: "artefact.create", "project.permission.update"
  details: Record<string, any>; // Ex: { artefactId: 'xyz', newTitle: '...' }
}

// Hjälptyper för formulär och UI
export interface CreateProjectData {
  name: string;
  description?: string;
  caseNumber?: string;
}

export interface CreateArtefactData {
  projectId: string;
  type: ArtefactType;
  title: string;
  content?: string;
}

// Bokmarksystemet (för "Läs Senare")
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  projectId?: string; // Om bokmärket har flyttats till ett projekt
}

// Sökresultat för global sökning
export interface SearchResult {
  id: string;
  type: 'project' | 'artefact' | 'case' | 'bookmark';
  title: string;
  description?: string;
  url: string;
  projectId?: string;
}