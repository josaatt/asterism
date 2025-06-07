// Svenska domstolar organiserade enligt domstolssystemets struktur

export interface CourtCategory {
  name: string;
  courts: string[];
}

export const swedishCourts: CourtCategory[] = [
  {
    name: "Allmänna domstolar",
    courts: [
      // Högsta instans
      "Högsta domstolen",
      
      // Hovrätter
      "Svea hovrätt",
      "Göta hovrätt", 
      "Hovrätten över Skåne och Blekinge",
      "Hovrätten för Västra Sverige",
      "Hovrätten för Nedre Norrland",
      "Hovrätten för Övre Norrland",
      
      // Tingsrätter (alla 48 tingsrätter)
      "Stockholms tingsrätt",
      "Göteborgs tingsrätt",
      "Malmö tingsrätt",
      "Uppsala tingsrätt",
      "Linköpings tingsrätt",
      "Västerås tingsrätt",
      "Örebro tingsrätt",
      "Jönköpings tingsrätt",
      "Växjö tingsrätt",
      "Kalmar tingsrätt",
      "Karlskrona tingsrätt",
      "Kristianstads tingsrätt",
      "Helsingborgs tingsrätt",
      "Lunds tingsrätt",
      "Halmstads tingsrätt",
      "Varbergs tingsrätt",
      "Borås tingsrätt",
      "Skövde tingsrätt",
      "Uddevalla tingsrätt",
      "Vänersborgs tingsrätt",
      "Karlstads tingsrätt",
      "Eskilstuna tingsrätt",
      "Nyköpings tingsrätt",
      "Norrköpings tingsrätt",
      "Visby tingsrätt",
      "Faluns tingsrätt",
      "Gävle tingsrätt",
      "Sandvikens tingsrätt",
      "Hudiksvalls tingsrätt",
      "Sundsvalls tingsrätt",
      "Härnösands tingsrätt",
      "Östersunds tingsrätt",
      "Umeå tingsrätt",
      "Skellefteå tingsrätt",
      "Luleå tingsrätt",
      "Haparanda tingsrätt"
    ]
  },
  {
    name: "Förvaltningsdomstolar", 
    courts: [
      // Högsta instans
      "Högsta förvaltningsdomstolen",
      
      // Kammarrätter
      "Kammarrätten i Stockholm",
      "Kammarrätten i Göteborg", 
      "Kammarrätten i Sundsvall",
      "Kammarrätten i Jönköping",
      
      // Förvaltningsrätter
      "Förvaltningsrätten i Stockholm",
      "Förvaltningsrätten i Uppsala", 
      "Förvaltningsrätten i Linköping",
      "Förvaltningsrätten i Jönköping",
      "Förvaltningsrätten i Växjö",
      "Förvaltningsrätten i Malmö",
      "Förvaltningsrätten i Göteborg",
      "Förvaltningsrätten i Karlstad",
      "Förvaltningsrätten i Falun",
      "Förvaltningsrätten i Härnösand",
      "Förvaltningsrätten i Umeå",
      "Förvaltningsrätten i Luleå"
    ]
  },
  {
    name: "Specialdomstolar",
    courts: [
      // Fristående specialdomstolar
      "Arbetsdomstolen",
      "Försvarsunderrättelsedomstolen",
      
      // Patent- och marknadsdomstolar
      "Patent- och marknadsdomstolen",
      "Patent- och marknadsöverdomstolen",
      
      // Mark- och miljödomstolar
      "Mark- och miljödomstolen vid Nacka tingsrätt",
      "Mark- och miljödomstolen vid Växjö tingsrätt",
      "Mark- och miljödomstolen vid Vänersborgs tingsrätt",
      "Mark- och miljödomstolen vid Östersunds tingsrätt",
      "Mark- och miljödomstolen vid Umeå tingsrätt",
      "Mark- och miljööverdomstolen",
      
      // Migrationsdomstolar
      "Migrationsöverdomstolen",
      "Migrationsdomstolen i Stockholm",
      "Migrationsdomstolen i Göteborg", 
      "Migrationsdomstolen i Malmö",
      "Migrationsdomstolen i Luleå",
      
      // Sjörättsdomstolar
      "Sjörättsdomstolen vid Luleå tingsrätt",
      "Sjörättsdomstolen vid Sundsvalls tingsrätt",
      "Sjörättsdomstolen vid Stockholms tingsrätt",
      "Sjörättsdomstolen vid Kalmar tingsrätt",
      "Sjörättsdomstolen vid Malmö tingsrätt",
      "Sjörättsdomstolen vid Göteborgs tingsrätt",
      "Sjörättsdomstolen vid Karlstads tingsrätt",
      
      // Hyres- och arrendenämnder
      "Hyres- och arrendenämnden i Stockholm",
      "Hyres- och arrendenämnden i Göteborg",
      "Hyres- och arrendenämnden i Malmö", 
      "Hyres- och arrendenämnden i Västerås",
      "Hyres- och arrendenämnden i Linköping",
      "Hyres- och arrendenämnden i Jönköping",
      "Hyres- och arrendenämnden i Sundsvall",
      "Hyres- och arrendenämnden i Umeå",
      
      // Övriga myndigheter med dömande funktion
      "Patentbesvärsrätten",
      "Statens ansvarsnämnd",
      "Rättshjälpsmyndigheten",
      "Rättshjälpsnämnden"
    ]
  }
];

// Flatten all courts for use in filters
export const allSwedishCourts = swedishCourts.flatMap(category => category.courts).sort();