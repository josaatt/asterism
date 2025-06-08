import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { componentStyles } from "~/design-system/components";
import { legalCases } from "~/data/legal-cases";
import ViewToggle from "~/components/comp-108";
import TableFilters from "~/components/ui/table-filters";
import LegalFilters, { 
  type LegalFilter, 
  LegalFilterType, 
  FilterOperator 
} from "~/components/ui/legal-filters";
import AddLegalFilter from "~/components/ui/add-legal-filter";
export const meta: MetaFunction = () => {
  return [
    { title: "Rättspraxis - Asterism" },
    { name: "description", content: "Svensk rättspraxis och prejudicerande domar från svenska domstolar." },
  ];
};

export default function Rättspraxis() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Table filter states (for table view)
  const [searchTerm, setSearchTerm] = useState("");
  const [courtFilter, setCourtFilter] = useState("Alla domstolar");
  const [legalAreaFilter, setLegalAreaFilter] = useState("Alla rättsområden");
  const [yearFilter, setYearFilter] = useState("Alla år");

  // Advanced filter states (for card view)
  const [legalFilters, setLegalFilters] = useState<LegalFilter[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'cards' ? 10 : 50;

  // Filter legal cases based on current filters
  const filteredCases = useMemo(() => {
    return legalCases.filter((legalCase) => {
      // For table view, use simple filters
      if (viewMode === 'table') {
        // Search term filter - improved search that looks in all text fields
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const searchWords = searchLower.split(' ').filter(word => word.length > 0);
          
          const searchableText = [
            legalCase.title,
            legalCase.summary,
            legalCase.background,
            legalCase.caseNumber,
            legalCase.court,
            legalCase.legalArea,
            legalCase.decision,
            legalCase.ruling,
            ...legalCase.keywords
          ].join(' ').toLowerCase();
          
          // Check if all search words are found in the searchable text
          const matchesSearch = searchWords.every(word => searchableText.includes(word));
          
          if (!matchesSearch) return false;
        }

        // Court filter
        if (courtFilter !== "Alla domstolar" && legalCase.court !== courtFilter) {
          return false;
        }

        // Legal area filter
        if (legalAreaFilter !== "Alla rättsområden" && legalCase.legalArea !== legalAreaFilter) {
          return false;
        }

        // Year filter
        if (yearFilter !== "Alla år") {
          const caseYear = legalCase.date.split('-')[0];
          if (caseYear !== yearFilter) {
            return false;
          }
        }
      } else {
        // For card view, use advanced filters
        for (const filter of legalFilters) {
          if (filter.value.length === 0) continue;

          const filterPassed = (() => {
            switch (filter.type) {
              case LegalFilterType.COURT:
                if (filter.operator === FilterOperator.IS) {
                  // All values must match (only makes sense with one value)
                  return filter.value.includes(legalCase.court);
                } else if (filter.operator === FilterOperator.IS_ANY_OF) {
                  // At least one value must match
                  return filter.value.includes(legalCase.court);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  // None of the values should match
                  return !filter.value.includes(legalCase.court);
                }
                break;
              
              case LegalFilterType.LEGAL_AREA:
                if (filter.operator === FilterOperator.IS) {
                  return filter.value.includes(legalCase.legalArea);
                } else if (filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(legalCase.legalArea);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(legalCase.legalArea);
                }
                break;
              
              case LegalFilterType.YEAR:
                const caseYear = legalCase.date.split('-')[0];
                if (filter.operator === FilterOperator.IS) {
                  return filter.value.includes(caseYear);
                } else if (filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(caseYear);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(caseYear);
                }
                break;
              
              case LegalFilterType.CASE_NUMBER:
                if (filter.operator === FilterOperator.IS) {
                  return filter.value.includes(legalCase.caseNumber);
                } else if (filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(legalCase.caseNumber);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(legalCase.caseNumber);
                }
                break;
              
              case LegalFilterType.KEYWORDS:
                if (filter.operator === FilterOperator.INCLUDE) {
                  // All keywords must be present
                  return filter.value.every(keyword => legalCase.keywords.includes(keyword));
                } else if (filter.operator === FilterOperator.INCLUDE_ANY_OF) {
                  // At least one keyword must be present
                  return filter.value.some(keyword => legalCase.keywords.includes(keyword));
                } else if (filter.operator === FilterOperator.DO_NOT_INCLUDE) {
                  // None of the keywords should be present
                  return !filter.value.some(keyword => legalCase.keywords.includes(keyword));
                } else if (filter.operator === FilterOperator.EXCLUDE_ALL_OF) {
                  // All keywords must be absent
                  return !filter.value.every(keyword => legalCase.keywords.includes(keyword));
                }
                break;
            }
            return true;
          })();

          if (!filterPassed) return false;
        }
      }

      return true;
    });
  }, [searchTerm, courtFilter, legalAreaFilter, yearFilter, legalFilters, viewMode]);

  // Reset page when filters change or view mode changes
  const resetPage = () => setCurrentPage(1);
  
  // Pagination calculation
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <Link 
            to="/" 
            className="inline-block mb-8 text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: '"La Belle Aurore", cursive' }}
          >
            ← ⁂ asterism
          </Link>
          <h1 className="text-4xl md:text-6xl text-foreground mb-6" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
            rättspraxis
          </h1>
          <p className={cn(componentStyles.enhancedParagraph, "max-w-2xl mx-auto text-lg")}>
            <span className={componentStyles.enhancedFirstWord}>Svensk</span>{' '}
            rättspraxis och prejudicerande domar från landets högsta domstolar. 
            Sök och utforska viktiga juridiska prejudikat inom olika rättsområden.
          </p>
        </header>

        {/* View Toggle Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <ViewToggle viewMode={viewMode} onViewChange={(mode) => {
              setViewMode(mode);
              resetPage();
            }} />
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, filteredCases.length)}</span> av{' '}
              <span className="font-medium">{filteredCases.length}</span> rättsfall
            </p>
          </div>
        </div>

        {/* Filters Section - only show in card view */}
        {viewMode === 'cards' && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <AddLegalFilter 
                onAddFilter={(filter) => {
                  setLegalFilters(prev => [...prev, filter]);
                  resetPage();
                }}
                existingFilters={legalFilters}
              />
              <LegalFilters 
                filters={legalFilters}
                setFilters={(filters) => {
                  setLegalFilters(filters);
                  resetPage();
                }}
              />
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto">
          {viewMode === 'cards' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCases.map((legalCase) => (
                <article 
                  key={legalCase.id} 
                  className={cn(componentStyles.card, "page-transition")}
                >
                  <div className="mb-4">
                    <span className="asterisk text-2xl">*</span>
                  </div>
                  
                  <header className="mb-4">
                    <div className="mb-2">
                      <span className={cn(componentStyles.metadataTag, "mr-2")}>
                        {legalCase.caseNumber}
                      </span>
                      <span className={cn(componentStyles.metadataTag, "mr-2")}>
                        {legalCase.court}
                      </span>
                      <span className={componentStyles.metadataTag}>
                        {legalCase.date}
                      </span>
                    </div>
                    <h2 className="text-xl  text-foreground mb-2 leading-tight">
                      {legalCase.title}
                    </h2>
                    <span className={cn(componentStyles.metadataTag, "bg-primary/10 text-primary")}>
                      {legalCase.legalArea}
                    </span>
                  </header>

                  <div className="space-y-3">
                    <p className={componentStyles.enhancedParagraph}>
                      <span className={componentStyles.enhancedFirstWord}>Sammanfattning:</span>{' '}
                      {legalCase.summary}
                    </p>
                    
                    <div>
                      <h3 className="text-sm  font-medium text-foreground mb-2">
                        Bakgrund
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {legalCase.background}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm  font-medium text-foreground mb-2">
                        Nyckelord
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {legalCase.keywords.map((keyword) => (
                          <span 
                            key={keyword} 
                            className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={componentStyles.tableContainer}>
              <TableFilters
                searchTerm={searchTerm}
                onSearchChange={(term) => {
                  setSearchTerm(term);
                  resetPage();
                }}
                courtFilter={courtFilter}
                onCourtFilterChange={(filter) => {
                  setCourtFilter(filter);
                  resetPage();
                }}
                legalAreaFilter={legalAreaFilter}
                onLegalAreaFilterChange={(filter) => {
                  setLegalAreaFilter(filter);
                  resetPage();
                }}
                yearFilter={yearFilter}
                onYearFilterChange={(filter) => {
                  setYearFilter(filter);
                  resetPage();
                }}
              />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={componentStyles.tableHeader}>
                    <tr>
                      <th className={componentStyles.tableHeaderCell}>Rättsfall</th>
                      <th className={componentStyles.tableHeaderCell}>Domstol</th>
                      <th className={componentStyles.tableHeaderCell}>Datum</th>
                      <th className={componentStyles.tableHeaderCell}>Rättsområde</th>
                      <th className={componentStyles.tableHeaderCell}>Sammanfattning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCases.map((legalCase, index) => (
                      <tr 
                        key={legalCase.id} 
                        className={cn(
                          componentStyles.tableRow,
                          index % 2 === 0 ? componentStyles.tableRowEven : componentStyles.tableRowOdd
                        )}
                      >
                        <td className={componentStyles.tableCell}>
                          <div className="space-y-1">
                            <h3 className={componentStyles.tableTitle}>
                              {legalCase.title}
                            </h3>
                            <span className={cn(componentStyles.metadataTag, "text-xs")}>
                              {legalCase.caseNumber}
                            </span>
                          </div>
                        </td>
                        <td className={cn(componentStyles.tableCell, componentStyles.tableCellText)}>
                          {legalCase.court}
                        </td>
                        <td className={cn(componentStyles.tableCell, componentStyles.tableCellText)}>
                          {legalCase.date}
                        </td>
                        <td className={componentStyles.tableCell}>
                          <span className={cn(componentStyles.metadataTag, "bg-primary/10 text-primary text-xs")}>
                            {legalCase.legalArea}
                          </span>
                        </td>
                        <td className={cn(componentStyles.tableCell, "max-w-md")}>
                          <p className={cn(componentStyles.tableDescription, "line-clamp-3")}>
                            {legalCase.summary}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          <section className="mt-16 text-center">
            <div className="pull-quote">
              Rättspraxis är grunden för rättssäkerhet och förutsägbarhet i rättstillämpningen.
            </div>
            <div className="footnote max-w-md mx-auto">
              Dessa prejudicerande domar formar tolkningen av svensk rätt och 
              ger vägledning för framtida rättstillämpning.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }
    
    rangeWithDots.push(...range);
    
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }
    
    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md border transition-colors",
          currentPage === 1 
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-background hover:bg-muted"
        )}
      >
        <ChevronLeft className="size-4" />
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={cn(
            "px-3 py-2 rounded-md border transition-colors min-w-[40px]",
            page === currentPage 
              ? "bg-primary text-primary-foreground" 
              : page === '...'
              ? "bg-background text-muted-foreground cursor-default"
              : "bg-background hover:bg-muted"
          )}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md border transition-colors",
          currentPage === totalPages 
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-background hover:bg-muted"
        )}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}