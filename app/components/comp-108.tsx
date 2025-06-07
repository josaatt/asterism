import { LayoutGrid, Table } from "lucide-react"
import { Button } from "~/components/ui/button"

interface ViewToggleProps {
  viewMode: 'cards' | 'table';
  onViewChange: (mode: 'cards' | 'table') => void;
}

export default function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
      <Button
        className={`rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10 ${
          viewMode === 'cards' 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'hover:bg-muted/50 hover:text-foreground'
        }`}
        variant="outline"
        size="sm"
        onClick={() => onViewChange('cards')}
        aria-label="Kortvy"
      >
        <LayoutGrid className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Kort
      </Button>
      <Button
        className={`rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10 ${
          viewMode === 'table' 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'hover:bg-muted/50 hover:text-foreground'
        }`}
        variant="outline"
        size="sm"
        onClick={() => onViewChange('table')}
        aria-label="Tabellvy"
      >
        <Table className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Tabell
      </Button>
    </div>
  )
}
