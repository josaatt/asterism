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
    court: "Förvaltningsrätten",
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
    court: "Marknadsdomstolen",
    date: "2023-05-11",
    legalArea: "Marknadsrätt",
    summary: "Marknadsdomstolen fastställer principer för marknadsföring av kryptovalutor och finansiella risker.",
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
  }
];