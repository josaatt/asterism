import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  Calendar,
  Check,
  Gavel,
  Scale,
  Building2,
  Hash,
  Tag,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { legalCases } from "~/data/legal-cases";
import { allSwedishCourts, swedishCourts } from "~/data/swedish-courts";

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, dampping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

export enum LegalFilterType {
  COURT = "Domstol",
  LEGAL_AREA = "Rättsområde", 
  YEAR = "År",
  CASE_NUMBER = "Målnummer",
  KEYWORDS = "Nyckelord",
}

export enum FilterOperator {
  IS = "är",
  IS_NOT = "är inte", 
  IS_ANY_OF = "är någon av",
  INCLUDE = "innehåller",
  DO_NOT_INCLUDE = "innehåller inte",
  INCLUDE_ANY_OF = "innehåller någon av",
  EXCLUDE_ALL_OF = "exkluderar alla",
  BEFORE = "före",
  AFTER = "efter",
}

export type LegalFilterOption = {
  name: string;
  icon: React.ReactNode | undefined;
  label?: string;
};

export type LegalFilter = {
  id: string;
  type: LegalFilterType;
  operator: FilterOperator;
  value: string[];
};

const LegalFilterIcon = ({ type }: { type: LegalFilterType | string }) => {
  switch (type) {
    case LegalFilterType.COURT:
      return <Building2 className="size-3.5" />;
    case LegalFilterType.LEGAL_AREA:
      return <Scale className="size-3.5" />;
    case LegalFilterType.YEAR:
      return <Calendar className="size-3.5" />;
    case LegalFilterType.CASE_NUMBER:
      return <Hash className="size-3.5" />;
    case LegalFilterType.KEYWORDS:
      return <Tag className="size-3.5" />;
    default:
      return <Gavel className="size-3.5" />;
  }
};

// Extract unique values from legal cases data
const getUniqueValues = (field: keyof typeof legalCases[0]) => {
  if (field === 'court') {
    // Use comprehensive list of Swedish courts
    return allSwedishCourts;
  }
  if (field === 'keywords') {
    // Flatten keywords arrays and get unique values
    const allKeywords = legalCases.flatMap(case_ => case_.keywords);
    return [...new Set(allKeywords)].sort();
  }
  if (field === 'date') {
    // Extract years from dates
    const years = legalCases.map(case_ => case_.date.split('-')[0]);
    return [...new Set(years)].sort().reverse();
  }
  const values = legalCases.map(case_ => case_[field] as string);
  return [...new Set(values)].sort();
};

export const legalFilterViewOptions: LegalFilterOption[][] = [
  [
    {
      name: LegalFilterType.COURT,
      icon: <LegalFilterIcon type={LegalFilterType.COURT} />,
    },
    {
      name: LegalFilterType.LEGAL_AREA, 
      icon: <LegalFilterIcon type={LegalFilterType.LEGAL_AREA} />,
    },
    {
      name: LegalFilterType.YEAR,
      icon: <LegalFilterIcon type={LegalFilterType.YEAR} />,
    },
  ],
  [
    {
      name: LegalFilterType.CASE_NUMBER,
      icon: <LegalFilterIcon type={LegalFilterType.CASE_NUMBER} />,
    },
    {
      name: LegalFilterType.KEYWORDS,
      icon: <LegalFilterIcon type={LegalFilterType.KEYWORDS} />,
    },
  ],
];

// Generate filter options from comprehensive court list with categories
export const courtFilterOptions: LegalFilterOption[] = getUniqueValues('court').map(
  (court) => {
    // Find which category this court belongs to for better organization
    const category = swedishCourts.find(cat => cat.courts.includes(court));
    return {
      name: court,
      icon: <Building2 className="size-3.5" />,
      label: category?.name
    };
  }
);

export const legalAreaFilterOptions: LegalFilterOption[] = getUniqueValues('legalArea').map(
  (area) => ({
    name: area,
    icon: <Scale className="size-3.5" />,
  })
);

export const yearFilterOptions: LegalFilterOption[] = getUniqueValues('date').map(
  (year) => ({
    name: year,
    icon: <Calendar className="size-3.5" />,
  })
);

export const keywordFilterOptions: LegalFilterOption[] = getUniqueValues('keywords').map(
  (keyword) => ({
    name: keyword,
    icon: <Tag className="size-3.5" />,
  })
);

export const caseNumberFilterOptions: LegalFilterOption[] = getUniqueValues('caseNumber').map(
  (caseNumber) => ({
    name: caseNumber,
    icon: <Hash className="size-3.5" />,
  })
);

export const legalFilterViewToFilterOptions: Record<LegalFilterType, LegalFilterOption[]> = {
  [LegalFilterType.COURT]: courtFilterOptions,
  [LegalFilterType.LEGAL_AREA]: legalAreaFilterOptions,
  [LegalFilterType.YEAR]: yearFilterOptions,
  [LegalFilterType.CASE_NUMBER]: caseNumberFilterOptions,
  [LegalFilterType.KEYWORDS]: keywordFilterOptions,
};

const legalFilterOperators = ({
  filterType,
  filterValues,
}: {
  filterType: LegalFilterType;
  filterValues: string[];
}) => {
  switch (filterType) {
    case LegalFilterType.COURT:
    case LegalFilterType.LEGAL_AREA:
    case LegalFilterType.YEAR:
    case LegalFilterType.CASE_NUMBER:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [FilterOperator.IS_ANY_OF, FilterOperator.IS_NOT];
      } else {
        return [FilterOperator.IS, FilterOperator.IS_NOT];
      }
    case LegalFilterType.KEYWORDS:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [
          FilterOperator.INCLUDE_ANY_OF,
          FilterOperator.EXCLUDE_ALL_OF,
        ];
      } else {
        return [FilterOperator.INCLUDE, FilterOperator.DO_NOT_INCLUDE];
      }
    default:
      return [];
  }
};

const LegalFilterOperatorDropdown = ({
  filterType,
  operator,
  filterValues,
  setOperator,
}: {
  filterType: LegalFilterType;
  operator: FilterOperator;
  filterValues: string[];
  setOperator: (operator: FilterOperator) => void;
}) => {
  const operators = legalFilterOperators({ filterType, filterValues });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 px-1.5 py-1 text-muted-foreground hover:text-primary transition shrink-0">
        {operator}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {operators.map((operator) => (
          <DropdownMenuItem
            key={operator}
            onClick={() => setOperator(operator)}
          >
            {operator}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LegalFilterValueCombobox = ({
  filterType,
  filterValues,
  setFilterValues,
}: {
  filterType: LegalFilterType;
  filterValues: string[];
  setFilterValues: (filterValues: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const nonSelectedFilterValues = legalFilterViewToFilterOptions[filterType]?.filter(
    (filter) => !filterValues.includes(filter.name)
  );
  
  // Special handling for court filter to show in three columns
  const isCourtFilter = filterType === LegalFilterType.COURT;
  
  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            setCommandInput("");
          }, 200);
        }
      }}
    >
      <PopoverTrigger
        className="rounded-none px-1.5 py-1 bg-muted hover:bg-muted/50 transition
  text-muted-foreground hover:text-primary shrink-0"
      >
        <div className="flex gap-1.5 items-center">
          <div className="flex items-center flex-row -space-x-1.5">
            <AnimatePresence mode="popLayout">
              {filterValues?.slice(0, 3).map((value) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <LegalFilterIcon type={value} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filterValues?.length === 0
            ? `Välj ${filterType.toLowerCase()}...`
            : filterValues?.length === 1
            ? filterValues?.[0]
            : `${filterValues?.length} valda`}
        </div>
      </PopoverTrigger>
      <PopoverContent className={isCourtFilter ? "w-[800px] p-0" : "w-[250px] p-0"}>
        <AnimateChangeInHeight>
          <Command>
            <CommandInput
              placeholder={`Sök ${filterType.toLowerCase()}...`}
              className="h-9"
              value={commandInput}
              onInputCapture={(e) => {
                setCommandInput(e.currentTarget.value);
              }}
            />
            <CommandList>
              <CommandEmpty>Inga resultat hittades.</CommandEmpty>
              <CommandGroup>
                {filterValues.map((value) => (
                  <CommandItem
                    key={value}
                    className="group flex gap-2 items-center data-[selected=true]:text-primary-foreground"
                    onSelect={() => {
                      setFilterValues(filterValues.filter((v) => v !== value));
                    }}
                  >
                    <Checkbox checked={true} />
                    <LegalFilterIcon type={value} />
                    <span className="text-foreground group-data-[selected=true]:text-primary-foreground">{value}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {nonSelectedFilterValues?.length > 0 && (
                <>
                  <CommandSeparator />
                  {isCourtFilter ? (
                    // Three-column layout for courts - show all courts, not just non-selected
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-6">
                        {swedishCourts.map((category) => {
                          // Show ALL courts in this category, both selected and non-selected
                          const allCategoryOptions = legalFilterViewToFilterOptions[filterType]?.filter(
                            (filter) => category.courts.includes(filter.name)
                          ) || [];
                          
                          if (allCategoryOptions.length === 0) return null;
                          
                          // Sort by court hierarchy: highest courts, then appeal courts, then lower courts, then special courts
                          const sortedFilters = allCategoryOptions.sort((a, b) => {
                            const getCourtLevel = (courtName: string) => {
                              // Highest courts
                              if (['Högsta domstolen', 'Högsta förvaltningsdomstolen', 'Arbetsdomstolen'].includes(courtName)) {
                                return 1;
                              }
                              // Appeal courts (hovrätter and kammarrätter) and överdomstolar
                              if (courtName.toLowerCase().includes('hovrätt') || courtName.includes('Kammarrätten') || 
                                  courtName.includes('överdomstolen')) {
                                return 2;
                              }
                              // Lower courts (tingsrätter and förvaltningsrätter)
                              if (courtName.includes('tingsrätt') || courtName.includes('Förvaltningsrätten')) {
                                return 3;
                              }
                              // Patent och marknads, mark och miljö, migrations, sjörätts special courts
                              if (courtName.includes('Patent-') || courtName.includes('Mark-') || 
                                  courtName.includes('Migrations') || courtName.includes('Sjörätts') ||
                                  courtName.includes('Försvarsunderrättelse')) {
                                return 4;
                              }
                              // Nämnder and myndigheter
                              if (courtName.includes('nämnd') || courtName.includes('myndighet')) {
                                return 5;
                              }
                              // All other special courts
                              return 6;
                            };
                            
                            const aLevel = getCourtLevel(a.name);
                            const bLevel = getCourtLevel(b.name);
                            
                            if (aLevel !== bLevel) {
                              return aLevel - bLevel;
                            }
                            
                            return a.name.localeCompare(b.name, 'sv');
                          });
                          
                          return (
                            <div key={category.name} className="space-y-3">
                              <h4 className="text-xs font-semibold text-foreground border-b border-border pb-1">
                                {category.name}
                              </h4>
                              <div className="space-y-1">
                                {sortedFilters.map((filter: LegalFilterOption) => {
                                  const isSelected = filterValues.includes(filter.name);
                                  
                                  return (
                                    <div
                                      key={filter.name}
                                      className={`group flex gap-2 items-center p-1 rounded cursor-pointer transition-colors ${
                                        isSelected 
                                          ? 'bg-primary/10 hover:bg-primary/20'
                                          : 'hover:bg-muted/50'
                                      }`}
                                      onClick={() => {
                                        if (isSelected) {
                                          setFilterValues(filterValues.filter((v) => v !== filter.name));
                                        } else {
                                          setFilterValues([...filterValues, filter.name]);
                                        }
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className={isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}
                                      />
                                      {filter.icon}
                                      <span className={`text-xs leading-tight ${
                                        isSelected ? 'text-primary font-medium' : 'text-foreground'
                                      }`}>
                                        {filter.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // Standard single column for other filters
                    <CommandGroup>
                      {nonSelectedFilterValues.map((filter: LegalFilterOption) => (
                        <CommandItem
                          className="group flex gap-2 items-center data-[selected=true]:text-primary-foreground"
                          key={filter.name}
                          value={filter.name}
                          onSelect={(currentValue: string) => {
                            setFilterValues([...filterValues, currentValue]);
                          }}
                        >
                          <Checkbox
                            checked={false}
                            className="opacity-0 group-data-[selected=true]:opacity-100"
                          />
                          {filter.icon}
                          <span className="text-foreground group-data-[selected=true]:text-primary-foreground">
                            {filter.name}
                          </span>
                          {filter.label && (
                            <span className="text-muted-foreground text-xs ml-auto">
                              {filter.label}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

export default function LegalFilters({
  filters,
  setFilters,
}: {
  filters: LegalFilter[];
  setFilters: Dispatch<SetStateAction<LegalFilter[]>>;
}) {
  const hasActiveFilters = filters.some(filter => filter.value.length > 0);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {filters.map((filter) => (
          <div key={filter.id} className="flex gap-[1px] items-center text-xs">
            <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
              <LegalFilterIcon type={filter.type} />
              {filter.type}
            </div>
            <LegalFilterOperatorDropdown
              filterType={filter.type}
              operator={filter.operator}
              filterValues={filter.value}
              setOperator={(operator) => {
                setFilters((prev) =>
                  prev.map((f) => (f.id === filter.id ? { ...f, operator } : f))
                );
              }}
            />
            <LegalFilterValueCombobox
              filterType={filter.type}
              filterValues={filter.value}
              setFilterValues={(filterValues) => {
                setFilters((prev) =>
                  prev.map((f) =>
                    f.id === filter.id ? { ...f, value: filterValues } : f
                  )
                );
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFilters((prev) => prev.filter((f) => f.id !== filter.id));
              }}
              className="bg-muted rounded-l-none rounded-r-sm h-6 w-6 text-muted-foreground hover:text-primary hover:bg-muted/50 transition shrink-0"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters([]);
          }}
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          Rensa filter
        </Button>
      )}
    </div>
  );
}