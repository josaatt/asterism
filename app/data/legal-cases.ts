export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  date: string;
  legalArea: string;
  summary: string;
  background: string;
  decision: string[];
  ruling: string[];
  keywords: string[];
}

export const legalCases: LegalCase[] = [
  {
    id: "1",
    caseNumber: "NJA 2023:15",
    title: "Avtalsrättsligt prejudikat om digitala tjänsteavtal",
    court: "Högsta domstolen",
    date: "2023-03-15",
    legalArea: "Avtalsrätt",
    summary: "Högsta domstolen fastställer nya principer för tolkning av digitala tjänsteavtal och användarvillkor.",
    background: "Fallet rörde en tvist mellan en konsument och en digital plattform gällande bindande verkan av användarvillkor som uppdaterats efter kontraktets ingående. Konsumenten hävdade att avtalsändringarna inte var giltiga.",
    decision: [
      "Digitala tjänsteavtal ska tolkas enligt samma principer som traditionella avtal",
      "Användarvillkor kan endast ändras med tydlig information och aktivt samtycke",
      "Automatisk accept genom fortsatt användning är inte tillräckligt för väsentliga ändringar"
    ],
    ruling: [
      "Tingsrättens dom upphävs",
      "Hovrätten bekräftas i huvudsak",
      "Svaranden ska ersätta kärandens rättegångskostnader med 85 000 kronor"
    ],
    keywords: ["Avtalsrätt", "Digital plattform", "Användarvillkor", "Konsumentskydd"]
  },
  {
    id: "2",
    caseNumber: "AD 2023:42",
    title: "Distansarbete och arbetstidsreglering",
    court: "Arbetsdomstolen",
    date: "2023-06-22",
    legalArea: "Arbetsrätt",
    summary: "Arbetsdomstolen klargör hur arbetstidslagen ska tillämpas vid distansarbete och hemarbete.",
    background: "En anställd krävde övertidsersättning för arbete utfört hemma utanför ordinarie arbetstid. Arbetsgivaren hävdade att arbetstidslagen inte gällde för frivilligt hemarbete.",
    decision: [
      "Arbetstidslagen gäller oavsett var arbetet utförs",
      "Arbetsgivaren har ansvar för att följa upp arbetstider även vid distansarbete",
      "Frivilligt mertidsarbete kan berättiga till övertidsersättning"
    ],
    ruling: [
      "Arbetsgivaren ska betala övertidsersättning om 127 000 kronor",
      "Rättegångskostnaderna fördelas mellan parterna",
      "Domen ska tillämpas från och med 2023-09-01"
    ],
    keywords: ["Arbetsrätt", "Distansarbete", "Arbetstid", "Övertidsersättning"]
  },
  {
    id: "3",
    caseNumber: "RH 2023:28",
    title: "GDPR-överträdelse och skadestånd",
    court: "Förvaltningsrätten i Stockholm",
    date: "2023-04-18",
    legalArea: "Dataskydd",
    summary: "Första prejudicerande domen om individuell rätt till skadestånd vid GDPR-överträdelser.",
    background: "En registrerad person krävde skadestånd efter att personuppgifter lämnats ut till obehörig part. Datainspektionen hade tidigare utfärdat sanktionsavgift mot den personuppgiftsansvarige.",
    decision: [
      "GDPR ger rätt till individuellt skadestånd vid överträdelser",
      "Skadestånd kan utgå även för immateriell skada",
      "Bevisbördan för skadestånd följer allmänna skadeståndsrättsliga principer"
    ],
    ruling: [
      "Svaranden ska betala skadestånd om 45 000 kronor",
      "Ränta ska utgå från stämningsansökan",
      "Svaranden ska ersätta kärandens rättegångskostnader"
    ],
    keywords: ["GDPR", "Dataskydd", "Skadestånd", "Personuppgifter"]
  },
  {
    id: "4",
    caseNumber: "HFD 2023:8",
    title: "Skatteflykt och substansbedömning",
    court: "Högsta förvaltningsdomstolen",
    date: "2023-02-09",
    legalArea: "Skatterätt",
    summary: "HFD utvecklar praxis kring skatteflyktslagen och substansbedömning av bolagsstrukturer.",
    background: "En komplex bolagsstruktur hade skapats för att minimera beskattning av kapitalvinster. Skatteverket tillämpade skatteflyktslagen och omprövade beskattningen.",
    decision: [
      "Skatteflyktslagen kan tillämpas på komplexa bolagsstrukturer utan affärsmässig substans",
      "Bevisvärdet av förhandsdispenser från Skatteverket är begränsat",
      "Ekonomisk substans måste bedömas utifrån hela arrangemanget"
    ],
    ruling: [
      "Förvaltningsrättens dom upphävs",
      "Skatteverkets omprövning fastställs",
      "Ärendet återförvisas för ny prövning av skattetillägg"
    ],
    keywords: ["Skatterätt", "Skatteflykt", "Bolagsstruktur", "Substansbedömning"]
  },
  {
    id: "5",
    caseNumber: "MMD 2023:31",
    title: "Marknadsföring av kryptovalutor",
    court: "Patent- och marknadsdomstolen",
    date: "2023-05-11",
    legalArea: "Marknadsrätt",
    summary: "Patent- och marknadsdomstolen fastställer principer för marknadsföring av kryptovalutor och finansiella risker.",
    background: "En influencer marknadsförde investeringar i kryptovalutor utan att informera om risker eller sin ekonomiska koppling till produkten.",
    decision: [
      "Marknadsföring av kryptovalutor ska följa samma regler som annan finansiell marknadsföring",
      "Upplysning om risker och ekonomiska kopplingar är obligatorisk",
      "Influencer marketing omfattas av marknadsföringslagen"
    ],
    ruling: [
      "Marknadsföringen förbjuds",
      "Marknadsstörningsavgift på 250 000 kronor",
      "Svaranden ska publicera rättelse på samtliga kanaler"
    ],
    keywords: ["Marknadsrätt", "Kryptovalutor", "Influencer", "Finansiell marknadsföring"]
  },
  {
    id: "6",
    caseNumber: "PMÖ 2023:7",
    title: "Miljöskadeansvar för tidigare verksamhet",
    court: "Patent- och marknadsöverdomstolen",
    date: "2023-07-03",
    legalArea: "Miljörätt",
    summary: "Prövning av miljöskadeansvar för historisk industriverksamhet och kedjeansvar.",
    background: "En tidigare industritomt hade förorenats under flera decennier av olika verksamhetsutövare. Frågan rörde vem som skulle bära ansvaret för saneringsåtgärder.",
    decision: [
      "Miljöskadeansvar kan aktualiseras även för historisk verksamhet",
      "Kedjeansvar gäller när verksamheten överförts mellan bolag",
      "Proportionalitetsprincipen ska tillämpas vid fördelning av ansvar"
    ],
    ruling: [
      "Både tidigare och nuvarande verksamhetsutövare är solidariskt ansvariga",
      "Saneringsåtgärder ska genomföras inom 18 månader",
      "Kostnaderna fördelas baserat på verksamhetens omfattning och tid"
    ],
    keywords: ["Miljörätt", "Miljöskadeansvar", "Sanering", "Kedjeansvar"]
  },
  {
    id: "7",
    caseNumber: "HovR 2023:19",
    title: "AI-system och upphovsrättsligt skydd",
    court: "Svea hovrätt",
    date: "2023-08-14",
    legalArea: "Immaterialrätt",
    summary: "Hovrättens prövning av upphovsrättsligt skydd för AI-genererat innehåll och träningsdata.",
    background: "Ett AI-system hade tränats på upphovsrättsskyddade verk utan tillstånd. Rättighetshavarna krävde skadestånd och förbud mot fortsatt användning.",
    decision: [
      "AI-träning på upphovsrättsskyddade verk kräver licensiering",
      "Undantaget för teknisk reproduktion gäller inte kommersiell AI-träning",
      "AI-genererat innehåll kan utgöra intrång om det liknar originalverk"
    ],
    ruling: [
      "Förbud mot fortsatt användning av träningsmodellen",
      "Skadestånd om 1 200 000 kronor till rättighetshavarna",
      "Alla AI-genererade verk ska tas bort från plattformen"
    ],
    keywords: ["Upphovsrätt", "AI", "Träningsdata", "Immaterialrätt"]
  },
  {
    id: "8",
    caseNumber: "TR 2023:112",
    title: "Hyresrätt och bostadsbrist",
    court: "Stockholms tingsrätt",
    date: "2023-09-05",
    legalArea: "Hyresrätt",
    summary: "Tingsrätten prövar frågan om hyreshöjning med hänsyn till bostadsbrist och marknadshyror.",
    background: "En hyresvärd begärde betydande hyreshöjning med hänvisning till allmän kostnadsutveckling och jämförbara lägenheter på marknaden.",
    decision: [
      "Bostadsbrist kan inte ensamt motivera hyreshöjning utöver bruksvärdet",
      "Jämförelse ska göras med likartade lägenheter i närområdet",
      "Hyresgästens ekonomiska situation är inte relevant för bruksvärdesbedömningen"
    ],
    ruling: [
      "Hyreshöjningen begränsas till 8% av tidigare hyra",
      "Hyresvärdens yrande om 25% höjning avslås till större delen",
      "Parterna bär sina egna rättegångskostnader"
    ],
    keywords: ["Hyresrätt", "Bruksvärde", "Bostadsbrist", "Hyreshöjning"]
  },
  {
    id: "9",
    caseNumber: "KamR 2023:45",
    title: "Upphandlingsrättsligt prejudikat",
    court: "Kammarrätten i Göteborg",
    date: "2023-10-12",
    legalArea: "Upphandlingsrätt",
    summary: "Kammarrätten utvecklar praxis om utvärdering av anbud och jävsproblematik i offentlig upphandling.",
    background: "En kommun upphandlade IT-tjänster där en anbudsgivare påstods ha otillbörliga kontakter med utvärderingskommittén.",
    decision: [
      "Upphandlande myndighet måste säkerställa oberoende i utvärderingsprocessen",
      "Misstanke om jäv kräver omedelbar utredning och dokumentation",
      "Transparensprincipen kräver fullständig redovisning av utvärderingsgrunder"
    ],
    ruling: [
      "Upphandlingen ogiltigförklaras",
      "Kommunen ska genomföra ny upphandling",
      "Skadestånd om 340 000 kronor till klagande leverantör"
    ],
    keywords: ["Upphandlingsrätt", "Jäv", "Transparens", "Offentlig upphandling"]
  },
  {
    id: "10",
    caseNumber: "MMÖ 2023:18",
    title: "Vattenrättslig tillståndsgivning",
    court: "Mark- och miljööverdomstolen",
    date: "2023-11-20",
    legalArea: "Miljörätt",
    summary: "Överdomstolen prövar tillstånd för vattenuttag och påverkan på Natura 2000-område.",
    background: "Ett industriföretag ansökte om tillstånd för betydande vattenuttag från en sjö som ligger nära ett Natura 2000-område.",
    decision: [
      "Vattenuttag kräver särskild prövning när Natura 2000-områden kan påverkas",
      "Försiktighetsprincipen ska tillämpas vid osäkerhet om miljöpåverkan",
      "Alternativa vattenkällor måste utredas innan tillstånd kan ges"
    ],
    ruling: [
      "Tillståndsansökan avslås",
      "Sökanden ska genomföra kompletterande miljökonsekvensbeskrivning",
      "Ärendet återförvisas till mark- och miljödomstolen för ny prövning"
    ],
    keywords: ["Miljörätt", "Vattenrätt", "Natura 2000", "Tillståndsprövning"]
  },
  {
    id: "11",
    caseNumber: "NJA 2023:45",
    title: "Personuppgiftsskydd i arbetslivet",
    court: "Högsta domstolen",
    date: "2023-12-15",
    legalArea: "Dataskydd",
    summary: "Högsta domstolen klargör gränserna för arbetsgivarens rätt att övervaka anställda genom digitala system.",
    background: "En arbetsgivare installerade spårningsprogram på tjänstedatorer för att övervaka produktivitet och internetanvändning. Fackföreningen invände mot övervakningen.",
    decision: [
      "Övervakning av anställda kräver proportionalitetsavvägning",
      "Kollektivavtal kan inte åsidosätta GDPR:s grundläggande krav",
      "Kontinuerlig övervakning kräver särskild motivering och begränsning"
    ],
    ruling: [
      "Övervakningen förbjuds i nuvarande omfattning",
      "Företaget ska implementera nya rutiner för dataskydd",
      "Ersättning om 150 000 kronor till berörd personal"
    ],
    keywords: ["Dataskydd", "Arbetsrätt", "Övervakning", "GDPR"]
  },
  {
    id: "12",
    caseNumber: "HFD 2023:62",
    title: "Mervärdesskatt på digitala tjänster",
    court: "Högsta förvaltningsdomstolen",
    date: "2024-01-08",
    legalArea: "Skatterätt",
    summary: "HFD fastställer principer för mervärdesskatt på gränsöverskridande digitala tjänster.",
    background: "Ett svenskt företag tillhandahöll digitala marknadsföringstjänster till kunder i andra EU-länder. Tvisten gällde var mervärdesskatten skulle betalas.",
    decision: [
      "Digitala tjänster beskattas där tjänsten konsumeras",
      "B2B-tjänster följer andra regler än B2C-tjänster",
      "Företag måste registrera sig i kundens hemland för B2C-försäljning"
    ],
    ruling: [
      "Skatteverkets beslut fastställs",
      "Företaget ska betala mervärdesskatt i kundens hemland",
      "Skattetillägg reduceras med hänsyn till regelområdets komplexitet"
    ],
    keywords: ["Skatterätt", "Mervärdesskatt", "Digitala tjänster", "EU-rätt"]
  },
  {
    id: "13",
    caseNumber: "AD 2024:12",
    title: "Kollektivavtal och gig-ekonomi",
    court: "Arbetsdomstolen",
    date: "2024-02-14",
    legalArea: "Arbetsrätt",
    summary: "Arbetsdomstolen prövar tillämpningen av kollektivavtal på plattformsarbetare i gig-ekonomin.",
    background: "Ett fackförbund krävde att kollektivavtal skulle tillämpas på förare som arbetar för en digital plattform. Plattformen hävdade att förarna var egenföretagare.",
    decision: [
      "Plattformsarbetare kan omfattas av kollektivavtal beroende på kontrollgraden",
      "Ekonomiskt beroende är en viktig faktor vid bedömning av anställningsförhållande",
      "Digitaliseringen förändrar inte grundläggande arbetsrättsliga principer"
    ],
    ruling: [
      "Förarna anses som anställda",
      "Kollektivavtalet ska tillämpas retroaktivt",
      "Efterbetalning av löner och sociala avgifter om 2 400 000 kronor"
    ],
    keywords: ["Arbetsrätt", "Kollektivavtal", "Gig-ekonomi", "Plattformsarbete"]
  },
  {
    id: "14",
    caseNumber: "PMD 2024:03",
    title: "Varumärkesrättsligt skydd för AI-genererade logotyper",
    court: "Patent- och marknadsdomstolen",
    date: "2024-03-22",
    legalArea: "Immaterialrätt",
    summary: "Patent- och marknadsdomstolen prövar varumärkesskydd för logotyper skapade av artificiell intelligens.",
    background: "Ett företag ansökte om varumärkesskydd för en logotyp som helt genererats av AI. Patent- och registreringsverket ifrågasatte möjligheten att registrera AI-genererade verk.",
    decision: [
      "AI-genererade verk kan erhålla varumärkeskydd om de uppfyller distinctiveness-kravet",
      "Mänsklig kreativ input är inte ett absolut krav för varumärkesskydd",
      "Registreringsansökan ska bedömas utifrån slutresultatet, inte skapandeprocessen"
    ],
    ruling: [
      "Varumärket godkänns för registrering",
      "Patent- och registreringsverkets beslut upphävs",
      "Rättegångskostnaderna fördelas lika mellan parterna"
    ],
    keywords: ["Varumärkesrätt", "AI", "Immaterialrätt", "Logotyp"]
  },
  {
    id: "15",
    caseNumber: "MÖD 2024:08",
    title: "Miljötillstånd för vindkraftspark",
    court: "Mark- och miljööverdomstolen",
    date: "2024-04-11",
    legalArea: "Miljörätt",
    summary: "Överdomstolen prövar miljötillstånd för vindkraftspark och avvägning mellan energiproduktion och naturskydd.",
    background: "En energibolag ansökte om tillstånd för vindkraftspark i ett område med värdefull fågelfauna. Naturskyddsorganisationer överklagade tillståndbeslutet.",
    decision: [
      "Vindkraft har generellt positiv miljöpåverkan men kräver platsspecifik bedömning",
      "Påverkan på flyttfåglar måste utredas grundligt",
      "Kompensationsåtgärder kan vara nödvändiga för att tillstånd ska kunna ges"
    ],
    ruling: [
      "Tillståndet godkänns med villkor",
      "Vindkraftverken ska stängas av under fåglarnas flyttperioder",
      "Sökanden ska finansiera naturvårdsprojekt om 5 000 000 kronor"
    ],
    keywords: ["Miljörätt", "Vindkraft", "Naturskydd", "Tillståndsprövning"]
  },
  {
    id: "16",
    caseNumber: "HovR 2024:25",
    title: "Diskriminering i rekryteringsprocess",
    court: "Göta hovrätt",
    date: "2024-05-19",
    legalArea: "Diskrimineringsrätt",
    summary: "Hovrätten prövar diskriminering baserat på etnisk tillhörighet i anställningsprocess.",
    background: "En arbetsökande med utländskt namn påstod att hen systematiskt exkluderades från intervjuer trots kvalifikationer. Arbetsgivaren bestred diskriminering.",
    decision: [
      "Statistisk underrepresentation kan indikera diskriminering",
      "Bevisbördan skiftar när prima facie-fall etableras",
      "Arbetsgivaren måste kunna redovisa objektiva urvalskriterier"
    ],
    ruling: [
      "Diskriminering anses styrkt",
      "Arbetsgivaren ska betala diskrimineringsersättning om 75 000 kronor",
      "Företaget ska implementera rutiner för icke-diskriminerande rekrytering"
    ],
    keywords: ["Diskrimineringsrätt", "Rekrytering", "Etnisk diskriminering", "Arbetsrätt"]
  },
  {
    id: "17",
    caseNumber: "TR 2024:201",
    title: "Konsumentköp av elfordon och reklamationsrätt",
    court: "Malmö tingsrätt",
    date: "2024-06-07",
    legalArea: "Konsumenträtt",
    summary: "Tingsrätten prövar konsumentens rättigheter vid fel på elfordon och batterikapacitet.",
    background: "En konsument reklamerade ett elfordon vars batterikapacitet var betydligt lägre än utlovat. Bilhandlaren hävdade att naturlig försämring var orsaken.",
    decision: [
      "Batterikapacitet under 80% inom två år anses som fel",
      "Konsumentköplagen gäller fullt ut för elfordon",
      "Naturlig förslitning ska bedömas utifrån normal användning"
    ],
    ruling: [
      "Bilen ska bytas ut mot ny med fullt fungerande batteri",
      "Konsumenten har rätt till ersättning för merkostnader",
      "Säljaren ska ersätta rättegångskostnaderna"
    ],
    keywords: ["Konsumenträtt", "Elfordon", "Reklamation", "Köprätt"]
  },
  {
    id: "18",
    caseNumber: "FövR 2024:34",
    title: "Offentlighet och sekretess i digital förvaltning",
    court: "Förvaltningsrätten i Växjö",
    date: "2024-07-15",
    legalArea: "Förvaltningsrätt",
    summary: "Förvaltningsrätten prövar tillämpningen av offentlighetsprincipen på digital dokumenthantering.",
    background: "En journalist begärde ut kommunala dokument som fanns i digitalt format. Kommunen hävdade att utlämnande var tekniskt komplicerat och kostnadskrävande.",
    decision: [
      "Offentlighetsprincipen gäller oavsett dokumentens digitala format",
      "Tekniska hinder kan inte motivera vägran att lämna ut allmänna handlingar",
      "Kommuner måste anpassa sina IT-system för offentlighetsprincipens krav"
    ],
    ruling: [
      "Kommunen ska lämna ut begärda dokument",
      "Kostnaderna för utlämnande får inte överstiga faktiska kostnader",
      "Kommunen ska utveckla rutiner för digital handläggning"
    ],
    keywords: ["Förvaltningsrätt", "Offentlighetsprincipen", "Digitalisering", "Allmänna handlingar"]
  },
  {
    id: "19",
    caseNumber: "KamR 2024:17",
    title: "Bygglov och grannesynpunkter",
    court: "Kammarrätten i Stockholm",
    date: "2024-08-03",
    legalArea: "Byggrätt",
    summary: "Kammarrätten utvecklar praxis om grannesynpunkter vid bygglovsgivning för flerfamiljshus.",
    background: "En kommun beviljade bygglov för flerfamiljshus trots kraftiga granneprotester om skuggning och trafikpåverkan. Grannarna överklagade beslutet.",
    decision: [
      "Grannesynpunkter ska vägas mot allmänintresset av bostadsbyggande",
      "Betydande skuggning kan motivera avslag på bygglov",
      "Kommunens planmonopol begränsar inte grannarnas rättigheter enligt PBL"
    ],
    ruling: [
      "Bygglovet upphävs för den del som skapar betydande skuggning",
      "Ärendet återförvisas för ny prövning med modifierat projekt",
      "Kommunen ska ersätta överklagandenas rättegångskostnader"
    ],
    keywords: ["Byggrätt", "Bygglov", "Grannesynpunkter", "Plan- och bygglagen"]
  },
  {
    id: "20",
    caseNumber: "HFD 2024:19",
    title: "Beskattning av kryptovalutor och mining",
    court: "Högsta förvaltningsdomstolen",
    date: "2024-09-12",
    legalArea: "Skatterätt",
    summary: "HFD fastställer beskattningsregler för kryptovalutor och cryptocurrency mining.",
    background: "En privatperson bedrev cryptocurrency mining och sålde genererade tokens. Skatteverket beskattade verksamheten som näringsverksamhet medan personen hävdade hobbyverksamhet.",
    decision: [
      "Cryptocurrency mining kan utgöra näringsverksamhet beroende på omfattning",
      "Kontinuerlig verksamhet med vinstsyfte indikerar näringsverksamhet",
      "Eltgifter och hårdvarukostnader är avdragsgilla i näringsverksamhet"
    ],
    ruling: [
      "Verksamheten klassas som näringsverksamhet",
      "Inkomsten ska beskattas som näringsinkomst",
      "Skattetillägg utgår på grund av rättslägets oklarheter"
    ],
    keywords: ["Skatterätt", "Kryptovalutor", "Mining", "Näringsverksamhet"]
  }
];