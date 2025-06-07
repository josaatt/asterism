// Återanvändbara komponent-patterns
export const componentStyles = {
  // Card pattern från ReportList
  card: `
    bg-white p-8 lg:p-10 rounded-md border border-border shadow-sm 
    transition-all duration-300 hover:shadow-md
  `,
  
  // Metadata tags pattern
  metadataTag: `
    text-xs px-2 py-1 bg-primary/10 text-primary rounded-sm
    transition-colors duration-300 font-normal
  `,
  
  // Button pattern
  button: `
    px-3 py-1.5 text-xs font-medium border transition-all duration-200 
    bg-transparent text-gray-500 border-gray-300 
    hover:text-gray-700 hover:border-gray-400
  `,
  
  // Selected button pattern
  buttonSelected: `
    px-3 py-1.5 text-xs font-medium border transition-all duration-200 
    bg-transparent text-gray-900 border-gray-400
  `,
  
  // Enhanced paragraph pattern
  enhancedParagraph: `
    text-foreground leading-relaxed
  `,
  
  // Enhanced first word pattern
  enhancedFirstWord: `
    font-serif text-lg font-medium
  `,
  
  // Search input pattern
  searchInput: `
    w-full py-2 text-sm bg-background border border-input rounded-md 
    focus:border-ring focus:outline-none transition-colors placeholder-gray-400 px-3
  `,
  
  // Filter section pattern
  filterSection: `
    text-sm uppercase tracking-wider text-muted-foreground font-medium font-serif
  `,

  // Table styles for consistency
  tableContainer: `
    bg-card rounded-lg border shadow-sm overflow-hidden
  `,
  
  tableHeader: `
    bg-muted/50 border-b
  `,
  
  tableHeaderCell: `
    text-left p-4 font-medium text-foreground
  `,
  
  tableRow: `
    border-b transition-colors hover:bg-muted/50
  `,
  
  tableRowEven: `
    bg-background
  `,
  
  tableRowOdd: `
    bg-muted/10
  `,
  
  tableCell: `
    p-4
  `,
  
  tableCellText: `
    text-sm text-muted-foreground
  `,
  
  tableTitle: `
    font-serif font-medium text-foreground leading-tight
  `,
  
  tableDescription: `
    text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-md
  `,
} as const;