import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useMemo } from "react";
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

  // Filter legal cases based on current filters
  const filteredCases = useMemo(() => {
    return legalCases.filter((legalCase) => {
      // For table view, use simple filters
      if (viewMode === 'table') {
        // Search term filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            legalCase.title.toLowerCase().includes(searchLower) ||
            legalCase.summary.toLowerCase().includes(searchLower) ||
            legalCase.background.toLowerCase().includes(searchLower) ||
            legalCase.caseNumber.toLowerCase().includes(searchLower) ||
            legalCase.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
          
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
                if (filter.operator === FilterOperator.IS || filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(legalCase.court);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(legalCase.court);
                }
                break;
              
              case LegalFilterType.LEGAL_AREA:
                if (filter.operator === FilterOperator.IS || filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(legalCase.legalArea);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(legalCase.legalArea);
                }
                break;
              
              case LegalFilterType.YEAR:
                const caseYear = legalCase.date.split('-')[0];
                if (filter.operator === FilterOperator.IS || filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(caseYear);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(caseYear);
                }
                break;
              
              case LegalFilterType.CASE_NUMBER:
                if (filter.operator === FilterOperator.IS || filter.operator === FilterOperator.IS_ANY_OF) {
                  return filter.value.includes(legalCase.caseNumber);
                } else if (filter.operator === FilterOperator.IS_NOT) {
                  return !filter.value.includes(legalCase.caseNumber);
                }
                break;
              
              case LegalFilterType.KEYWORDS:
                if (filter.operator === FilterOperator.INCLUDE || filter.operator === FilterOperator.INCLUDE_ANY_OF) {
                  return filter.value.some(keyword => legalCase.keywords.includes(keyword));
                } else if (filter.operator === FilterOperator.DO_NOT_INCLUDE || filter.operator === FilterOperator.EXCLUDE_ALL_OF) {
                  return !filter.value.some(keyword => legalCase.keywords.includes(keyword));
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
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-medium">{filteredCases.length}</span> av{' '}
              <span className="font-medium">{legalCases.length}</span> rättsfall
            </p>
          </div>
        </div>

        {/* Filters Section - only show in card view */}
        {viewMode === 'cards' && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <AddLegalFilter 
                onAddFilter={(filter) => setLegalFilters(prev => [...prev, filter])}
                existingFilters={legalFilters}
              />
              <LegalFilters 
                filters={legalFilters}
                setFilters={setLegalFilters}
              />
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto">
          {viewMode === 'cards' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCases.map((legalCase) => (
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
                    <h2 className="text-xl font-serif text-foreground mb-2 leading-tight">
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
                      <h3 className="text-sm font-serif font-medium text-foreground mb-2">
                        Bakgrund
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {legalCase.background}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-serif font-medium text-foreground mb-2">
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
                onSearchChange={setSearchTerm}
                courtFilter={courtFilter}
                onCourtFilterChange={setCourtFilter}
                legalAreaFilter={legalAreaFilter}
                onLegalAreaFilterChange={setLegalAreaFilter}
                yearFilter={yearFilter}
                onYearFilterChange={setYearFilter}
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
                    {filteredCases.map((legalCase, index) => (
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