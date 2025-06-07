import { User, Project, Artefact, AuditLogEntry, Bookmark } from "~/types";

// Mock-användare för prototypen
export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Anna Administratör",
    email: "anna.admin@juridikverktyg.se"
  },
  {
    id: "jurist-1", 
    name: "Erik Jurist",
    email: "erik.jurist@juridikverktyg.se"
  }
];

// Hårdkodad "inloggad" användare för prototypen
export const currentUser = mockUsers[1]; // Erik Jurist

// Mock-projekt
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Dataskyddsförordningen Implementation",
    description: "Utredning av GDPR-compliance för myndigheterna",
    caseNumber: "JUR-2024-001",
    status: "active",
    ownerId: "jurist-1",
    members: [
      { userId: "jurist-1", permission: "owner" },
      { userId: "admin-1", permission: "editor" }
    ],
    artefacts: ["art-1", "art-2"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "proj-2", 
    name: "Miljölagstiftning Revidering",
    description: "Översyn av miljöbalkens tillämpning",
    caseNumber: "JUR-2024-002",
    status: "active",
    ownerId: "admin-1",
    members: [
      { userId: "admin-1", permission: "owner" },
      { userId: "jurist-1", permission: "editor" }
    ],
    artefacts: ["art-3"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: "proj-3",
    name: "Avtalsrätt Digitala Tjänster", 
    description: "Analys av avtalsrättsliga frågor för digitala plattformar",
    status: "pending",
    ownerId: "jurist-1",
    members: [
      { userId: "jurist-1", permission: "owner" }
    ],
    artefacts: [],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  }
];

// Mock-artefakter
export const mockArtefacts: Artefact[] = [
  {
    id: "art-1",
    projectId: "proj-1",
    type: "legal_brief",
    title: "GDPR Compliance Utredning",
    content: `# GDPR Compliance Utredning

## Sammanfattning
Denna utredning analyserar implementeringen av dataskyddsförordningen inom svenska myndigheter.

## Bakgrund
Dataskyddsförordningen (GDPR) träder i kraft 2018 och kräver omfattande ändringar i hur personuppgifter hanteras.

## Juridisk analys
### Artikel 6 - Laglig grund för behandling
Behandling av personuppgifter ska vara laglig endast om och i den mån som åtminstone ett av följande villkor är uppfyllt:

1. Den registrerade har lämnat sitt samtycke
2. Behandlingen är nödvändig för fullgörande av ett avtal
3. Behandlingen är nödvändig för att fullgöra en rättslig förpliktelse

## Rekommendationer
- Implementera privacy by design
- Utbilda personal i GDPR-principer
- Genomför dataskyddskonsekvensbedömningar`,
    createdBy: "jurist-1",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "art-2",
    projectId: "proj-1", 
    type: "case_reference",
    title: "C-311/18 Data Protection Commissioner v Facebook",
    content: `Referens till EU-domstolens avgörande om gränsöverskridande dataöverföring.
    
Viktiga punkter:
- Standard Contractual Clauses mån kompletteras med ytterligare skyddsåtgärder
- Bedömning måste göras för varje enskild överföring
- Nationella tillsynsmyndigheter har rätt att stoppa överföringar`,
    createdBy: "jurist-1", 
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17")
  },
  {
    id: "art-3",
    projectId: "proj-2",
    type: "statute_proposal",
    title: "Förslag till ändring i Miljöbalken 2 kap",
    content: `# Förslag till ändring i Miljöbalken 2 kap

## Nuvarande lydelse
2 kap. 2 § Vad som avses med hållbar utveckling framgår av 1 kap. 1 §.

## Föreslagen lydelse  
2 kap. 2 § Vad som avses med hållbar utveckling framgår av 1 kap. 1 §. Särskild hänsyn ska tas till klimatförändringarnas påverkan på miljön.

## Motivering
Klimataspekten behöver förtydligas i miljöbalkens grundläggande bestämmelser för att stärka koplingen mellan miljö- och klimatpolitik.`,
    createdBy: "admin-1",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-08")
  }
];

// Mock-aktivitetslogg
export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: new Date("2024-01-16T09:30:00"),
    userId: "jurist-1", 
    projectId: "proj-1",
    action: "artefact.create",
    details: { artefactId: "art-1", title: "GDPR Compliance Utredning", type: "legal_brief" }
  },
  {
    id: "log-2",
    timestamp: new Date("2024-01-17T14:15:00"),
    userId: "jurist-1",
    projectId: "proj-1", 
    action: "artefact.create",
    details: { artefactId: "art-2", title: "C-311/18 Data Protection Commissioner v Facebook", type: "case_reference" }
  },
  {
    id: "log-3",
    timestamp: new Date("2024-01-18T11:20:00"),
    userId: "jurist-1",
    projectId: "proj-1",
    action: "artefact.update", 
    details: { artefactId: "art-1", field: "content", newLength: 1247 }
  },
  {
    id: "log-4",
    timestamp: new Date("2024-02-05T16:45:00"),
    userId: "admin-1",
    projectId: "proj-2",
    action: "artefact.create",
    details: { artefactId: "art-3", title: "Förslag till ändring i Miljöbalken 2 kap", type: "statute_proposal" }
  }
];

// Mock-bokmärken
export const mockBookmarks: Bookmark[] = [
  {
    id: "bm-1",
    url: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32016R0679",
    title: "GDPR Fulltext på EUR-Lex",
    description: "Fullständig text av dataskyddsförordningen",
    createdBy: "jurist-1",
    createdAt: new Date("2024-01-10")
  },
  {
    id: "bm-2", 
    url: "https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/",
    title: "IMY:s vägledning om GDPR",
    description: "Integritetsskyddsmyndighetens officiella vägledning",
    createdBy: "jurist-1",
    createdAt: new Date("2024-01-12")
  }
];

// Hjälpfunktioner för att arbeta med mock-data
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(project => project.id === id);
}

export function getArtefactById(id: string): Artefact | undefined {
  return mockArtefacts.find(artefact => artefact.id === id);
}

export function getProjectsForUser(userId: string): Project[] {
  return mockProjects.filter(project => 
    project.members.some(member => member.userId === userId)
  );
}

export function getArtefactsForProject(projectId: string): Artefact[] {
  return mockArtefacts.filter(artefact => artefact.projectId === projectId);
}

export function getAuditLogForProject(projectId: string): AuditLogEntry[] {
  return mockAuditLog.filter(entry => entry.projectId === projectId);
}

export function getAllBookmarks(): Bookmark[] {
  return mockBookmarks;
}