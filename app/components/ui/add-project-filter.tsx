import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { 
  ProjectFilterType, 
  FilterOperator, 
  projectFilterViewOptions,
  type ProjectFilter 
} from "~/components/ui/project-filters";

interface AddProjectFilterProps {
  onAddFilter: (filter: ProjectFilter) => void;
  existingFilters: ProjectFilter[];
}

export default function AddProjectFilter({ onAddFilter, existingFilters }: AddProjectFilterProps) {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");

  const handleAddFilter = (filterType: ProjectFilterType) => {
    // Allow multiple filters of the same type
    const newFilter: ProjectFilter = {
      id: `filter-${Date.now()}`,
      type: filterType,
      operator: FilterOperator.IS,
      value: [],
    };

    onAddFilter(newFilter);
    setOpen(false);
    setCommandInput("");
  };

  // Show all filter types (allow multiple of same type)
  const availableFilterOptions = projectFilterViewOptions.flat();

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
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-xs gap-1.5"
        >
          <Plus className="size-3" />
          Lägg till filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Sök filter..."
            className="h-9"
            value={commandInput}
            onInputCapture={(e) => {
              setCommandInput(e.currentTarget.value);
            }}
          />
          <CommandList>
            <CommandEmpty>Inga filter hittades.</CommandEmpty>
            <CommandGroup>
              {availableFilterOptions.map((option) => (
                <CommandItem
                  key={option.name}
                  className="flex gap-2 items-center cursor-pointer"
                  onSelect={() => handleAddFilter(option.name as ProjectFilterType)}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}