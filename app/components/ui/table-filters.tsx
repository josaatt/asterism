import { Search, ChevronDown } from "lucide-react";
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
import { useState } from "react";

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  courtFilter: string;
  onCourtFilterChange: (court: string) => void;
  legalAreaFilter: string;
  onLegalAreaFilterChange: (area: string) => void;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
}

const courts = [
  "Alla domstolar",
  "Högsta domstolen",
  "Arbetsdomstolen", 
  "Förvaltningsrätten",
  "Högsta förvaltningsdomstolen",
  "Marknadsdomstolen",
  "Patent- och marknadsöverdomstolen",
  "Svea hovrätt"
];

const legalAreas = [
  "Alla rättsområden",
  "Avtalsrätt",
  "Arbetsrätt", 
  "Dataskydd",
  "Skatterätt",
  "Marknadsrätt",
  "Miljörätt",
  "Immaterialrätt"
];

const years = [
  "Alla år",
  "2023",
  "2022", 
  "2021"
];

function FilterSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  options: string[]; 
  placeholder: string; 
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background"
        >
          {value}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" sideOffset={4}>
        <Command>
          <CommandInput placeholder={`Sök ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Inga resultat.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function TableFilters({
  searchTerm,
  onSearchChange,
  courtFilter,
  onCourtFilterChange,
  legalAreaFilter,
  onLegalAreaFilterChange,
  yearFilter,
  onYearFilterChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 border-b items-center">
      {/* Search Field */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Sök rättsfall..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Court Filter */}
      <div className="min-w-[150px]">
        <FilterSelect
          value={courtFilter}
          onValueChange={onCourtFilterChange}
          options={courts}
          placeholder="Domstol"
        />
      </div>

      {/* Legal Area Filter */}
      <div className="min-w-[150px]">
        <FilterSelect
          value={legalAreaFilter}
          onValueChange={onLegalAreaFilterChange}
          options={legalAreas}
          placeholder="Rättsområde"
        />
      </div>

      {/* Year Filter */}
      <div className="min-w-[120px]">
        <FilterSelect
          value={yearFilter}
          onValueChange={onYearFilterChange}
          options={years}
          placeholder="År"
        />
      </div>

      {/* Clear Filters Button */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          onSearchChange("");
          onCourtFilterChange("Alla domstolar");
          onLegalAreaFilterChange("Alla rättsområden");
          onYearFilterChange("Alla år");
        }}
        className="text-muted-foreground hover:text-foreground"
      >
        Rensa
      </Button>
    </div>
  );
}