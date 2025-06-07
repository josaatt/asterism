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
  FolderOpen,
  Circle,
  CircleDot,
  CircleX,
  Users,
  Hash,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { mockProjects } from "~/data/mock-data";

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

export enum ProjectFilterType {
  STATUS = "Status",
  MEMBER_COUNT = "Medlemmar",
  CREATED_YEAR = "Skapad år",
  CASE_NUMBER = "Målnummer",
}

export enum FilterOperator {
  IS = "är",
  IS_NOT = "är inte", 
  IS_ANY_OF = "är någon av",
  INCLUDE = "innehåller",
  DO_NOT_INCLUDE = "innehåller inte",
  MORE_THAN = "fler än",
  LESS_THAN = "färre än",
  EQUAL_TO = "exakt",
}

export type ProjectFilterOption = {
  name: string;
  icon: React.ReactNode | undefined;
  label?: string;
};

export type ProjectFilter = {
  id: string;
  type: ProjectFilterType;
  operator: FilterOperator;
  value: string[];
};

const ProjectFilterIcon = ({ type }: { type: ProjectFilterType | string }) => {
  switch (type) {
    case ProjectFilterType.STATUS:
      return <Circle className="size-3.5" />;
    case ProjectFilterType.MEMBER_COUNT:
      return <Users className="size-3.5" />;
    case ProjectFilterType.CREATED_YEAR:
      return <Calendar className="size-3.5" />;
    case ProjectFilterType.CASE_NUMBER:
      return <Hash className="size-3.5" />;
    case "active":
      return <CircleDot className="size-3.5 text-green-500" />;
    case "pending":
      return <Circle className="size-3.5 text-yellow-500" />;
    case "completed":
      return <Check className="size-3.5 text-blue-500" />;
    case "cancelled":
      return <CircleX className="size-3.5 text-red-500" />;
    default:
      return <FolderOpen className="size-3.5" />;
  }
};

// Extract unique values from project data
const getUniqueProjectValues = (field: string) => {
  if (field === 'status') {
    return ['active', 'pending', 'completed', 'cancelled'];
  }
  if (field === 'createdYear') {
    const years = mockProjects.map(project => project.createdAt.getFullYear().toString());
    return [...new Set(years)].sort().reverse();
  }
  if (field === 'memberCount') {
    return ['1', '2', '3', '4', '5+'];
  }
  if (field === 'caseNumber') {
    const caseNumbers = mockProjects.map(project => project.caseNumber).filter(Boolean);
    return [...new Set(caseNumbers)].sort();
  }
  return [];
};

export const projectFilterViewOptions: ProjectFilterOption[][] = [
  [
    {
      name: ProjectFilterType.STATUS,
      icon: <ProjectFilterIcon type={ProjectFilterType.STATUS} />,
    },
    {
      name: ProjectFilterType.MEMBER_COUNT,
      icon: <ProjectFilterIcon type={ProjectFilterType.MEMBER_COUNT} />,
    },
  ],
  [
    {
      name: ProjectFilterType.CREATED_YEAR,
      icon: <ProjectFilterIcon type={ProjectFilterType.CREATED_YEAR} />,
    },
    {
      name: ProjectFilterType.CASE_NUMBER,
      icon: <ProjectFilterIcon type={ProjectFilterType.CASE_NUMBER} />,
    },
  ],
];

// Generate filter options from actual data
export const statusFilterOptions: ProjectFilterOption[] = getUniqueProjectValues('status').map(
  (status) => ({
    name: status || '',
    icon: <ProjectFilterIcon type={status || ''} />,
    label: status === 'active' ? 'Aktiv' : status === 'pending' ? 'Väntande' : 
           status === 'completed' ? 'Slutförd' : 'Avbruten'
  })
);

export const memberCountFilterOptions: ProjectFilterOption[] = getUniqueProjectValues('memberCount').map(
  (count) => ({
    name: count || '',
    icon: <Users className="size-3.5" />,
    label: count === '5+' ? '5 eller fler' : `${count} medlem${count === '1' ? '' : 'mar'}`
  })
);

export const createdYearFilterOptions: ProjectFilterOption[] = getUniqueProjectValues('createdYear').map(
  (year) => ({
    name: year || '',
    icon: <Calendar className="size-3.5" />,
  })
);

export const caseNumberFilterOptions: ProjectFilterOption[] = getUniqueProjectValues('caseNumber').map(
  (caseNumber) => ({
    name: caseNumber || '',
    icon: <Hash className="size-3.5" />,
  })
);

export const projectFilterViewToFilterOptions: Record<ProjectFilterType, ProjectFilterOption[]> = {
  [ProjectFilterType.STATUS]: statusFilterOptions,
  [ProjectFilterType.MEMBER_COUNT]: memberCountFilterOptions,
  [ProjectFilterType.CREATED_YEAR]: createdYearFilterOptions,
  [ProjectFilterType.CASE_NUMBER]: caseNumberFilterOptions,
};

const projectFilterOperators = ({
  filterType,
  filterValues,
}: {
  filterType: ProjectFilterType;
  filterValues: string[];
}) => {
  switch (filterType) {
    case ProjectFilterType.STATUS:
    case ProjectFilterType.CREATED_YEAR:
    case ProjectFilterType.CASE_NUMBER:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [FilterOperator.IS_ANY_OF, FilterOperator.IS_NOT];
      } else {
        return [FilterOperator.IS, FilterOperator.IS_NOT];
      }
    case ProjectFilterType.MEMBER_COUNT:
      return [FilterOperator.EQUAL_TO, FilterOperator.MORE_THAN, FilterOperator.LESS_THAN];
    default:
      return [];
  }
};

const ProjectFilterOperatorDropdown = ({
  filterType,
  operator,
  filterValues,
  setOperator,
}: {
  filterType: ProjectFilterType;
  operator: FilterOperator;
  filterValues: string[];
  setOperator: (operator: FilterOperator) => void;
}) => {
  const operators = projectFilterOperators({ filterType, filterValues });
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

const ProjectFilterValueCombobox = ({
  filterType,
  filterValues,
  setFilterValues,
}: {
  filterType: ProjectFilterType;
  filterValues: string[];
  setFilterValues: (filterValues: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const nonSelectedFilterValues = projectFilterViewToFilterOptions[filterType]?.filter(
    (filter) => !filterValues.includes(filter.name)
  );
  
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
                  <ProjectFilterIcon type={value} />
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
      <PopoverContent className="w-[250px] p-0">
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
                      setTimeout(() => {
                        setCommandInput("");
                      }, 200);
                      setOpen(false);
                    }}
                  >
                    <Checkbox checked={true} />
                    <ProjectFilterIcon type={value} />
                    <span className="text-foreground group-data-[selected=true]:text-primary-foreground">{value}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {nonSelectedFilterValues?.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {nonSelectedFilterValues.map((filter: ProjectFilterOption) => (
                      <CommandItem
                        className="group flex gap-2 items-center data-[selected=true]:text-primary-foreground"
                        key={filter.name}
                        value={filter.name}
                        onSelect={(currentValue: string) => {
                          setFilterValues([...filterValues, currentValue]);
                          setTimeout(() => {
                            setCommandInput("");
                          }, 200);
                          setOpen(false);
                        }}
                      >
                        <Checkbox
                          checked={false}
                          className="opacity-0 group-data-[selected=true]:opacity-100"
                        />
                        {filter.icon}
                        <span className="text-foreground group-data-[selected=true]:text-primary-foreground">
                          {filter.label || filter.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

export default function ProjectFilters({
  filters,
  setFilters,
}: {
  filters: ProjectFilter[];
  setFilters: Dispatch<SetStateAction<ProjectFilter[]>>;
}) {
  const hasActiveFilters = filters.some(filter => filter.value.length > 0);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {filters.map((filter) => (
          <div key={filter.id} className="flex gap-[1px] items-center text-xs">
            <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
              <ProjectFilterIcon type={filter.type} />
              {filter.type}
            </div>
            <ProjectFilterOperatorDropdown
              filterType={filter.type}
              operator={filter.operator}
              filterValues={filter.value}
              setOperator={(operator) => {
                setFilters((prev) =>
                  prev.map((f) => (f.id === filter.id ? { ...f, operator } : f))
                );
              }}
            />
            <ProjectFilterValueCombobox
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