import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { 
  mockProjects, 
  mockArtefacts, 
  mockBookmarks,
  getUserById 
} from "~/data/mock-data";
import { legalCases } from "~/data/legal-cases";
import type { SearchResult } from "~/types";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchResults = getSearchResults(query);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.url);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Sök i projekt, artefakter, rättsfall..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Inga resultat hittades.</CommandEmpty>
        
        {searchResults.projects.length > 0 && (
          <CommandGroup heading="Projekt">
            {searchResults.projects.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <div>
                  <div className="font-medium">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchResults.artefacts.length > 0 && (
          <CommandGroup heading="Artefakter">
            {searchResults.artefacts.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <div>
                  <div className="font-medium">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchResults.cases.length > 0 && (
          <CommandGroup heading="Rättsfall">
            {searchResults.cases.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <div>
                  <div className="font-medium">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchResults.bookmarks.length > 0 && (
          <CommandGroup heading="Bokmärken">
            {searchResults.bookmarks.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <div>
                  <div className="font-medium">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      
      <div className="border-t p-2 text-xs text-muted-foreground">
        Tips: Använd ↑↓ för att navigera, Enter för att välja, Esc för att stänga
      </div>
    </CommandDialog>
  );
}

function getSearchResults(query: string) {
  if (!query || query.length < 2) {
    return {
      projects: [],
      artefacts: [],
      cases: [],
      bookmarks: []
    };
  }

  const searchTerm = query.toLowerCase();

  // Sök i projekt
  const projects: SearchResult[] = mockProjects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.caseNumber?.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5)
    .map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.name,
      description: project.description,
      url: `/projekt/${project.id}`,
    }));

  // Sök i artefakter
  const artefacts: SearchResult[] = mockArtefacts
    .filter(artefact =>
      artefact.title.toLowerCase().includes(searchTerm) ||
      artefact.content.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5)
    .map(artefact => ({
      id: artefact.id,
      type: 'artefact' as const,
      title: artefact.title,
      description: `${getArtefactTypeLabel(artefact.type)} • ${getUserById(artefact.createdBy)?.name}`,
      url: `/projekt/${artefact.projectId}/artefakter/${artefact.id}`,
      projectId: artefact.projectId
    }));

  // Sök i rättsfall
  const cases: SearchResult[] = legalCases
    .filter((case_: any) =>
      case_.title.toLowerCase().includes(searchTerm) ||
      case_.summary.toLowerCase().includes(searchTerm) ||
      case_.caseNumber.toLowerCase().includes(searchTerm) ||
      case_.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm))
    )
    .slice(0, 5)
    .map((case_: any) => ({
      id: case_.id,
      type: 'case' as const,
      title: `${case_.caseNumber}: ${case_.title}`,
      description: case_.summary,
      url: `/rättspraxis?case=${case_.id}`,
    }));

  // Sök i bokmärken
  const bookmarks: SearchResult[] = mockBookmarks
    .filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.description?.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5)
    .map(bookmark => ({
      id: bookmark.id,
      type: 'bookmark' as const,
      title: bookmark.title,
      description: bookmark.description || bookmark.url,
      url: `/bokmärken?bookmark=${bookmark.id}`,
    }));

  return {
    projects,
    artefacts,
    cases,
    bookmarks
  };
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