// Återanvändbara komponent-patterns
export const componentStyles = {
  // Card pattern från ReportList
  card: `
    bg-white p-8 lg:p-10 rounded-md border border-border shadow-sm 
    transition-all duration-300 hover:shadow-md
  `,
  
  // Metadata tags pattern
  metadataTag: `
    text-xs border-b-2 border-primary/30 hover:border-primary/100 
    transition-colors duration-300 font-normal pb-1
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
    w-full py-2 text-sm bg-transparent border-0 border-b border-gray-300 
    focus:border-gray-600 focus:outline-none transition-colors placeholder-gray-400
  `,
  
  // Filter section pattern
  filterSection: `
    text-sm uppercase tracking-wider text-muted-foreground font-medium font-serif
  `,
} as const;