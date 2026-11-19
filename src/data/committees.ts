export const BRAND_ASSETS = {
  logo: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_4.12.23_PM_4a86296b.jpeg',
  spaceBg: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_3.41.30_PM_33705e9b.jpeg',
  eclipseSpaceBg: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_3.32.30_PM__1__e9cb2aac.jpeg',
  bannerSpaceBg: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_3.32.31_PM_047c32c3.jpeg',
} as const;

export interface Committee {
  id: 'UNEP' | 'UNCSW' | 'IPL' | 'CBI' | 'IPC' | 'AIPPM';
  acronym: string;
  name: string;
  tier: string;
  delegatesCount: number;
  agenda: string;
  posterUrl: string;
  summary: string;
  mandate: string;
  focusPoints: string[];
}

export const COMMITTEES: Committee[] = [
  {
    id: 'UNEP',
    acronym: 'UNEP',
    name: 'United Nations Environmental Programme',
    tier: 'Environmental Council',
    delegatesCount: 55,
    agenda:
      'Addressing the Escalating Global Environmental Crisis with Special Emphasis on Transboundary Air Pollution, Marine Plastic Pollution and the Accountability of Polluting Industries.',
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_4.23.11_PM_ac9865a1.jpeg',
    summary:
      'Negotiate enforceable cross-border emissions treaties, marine plastic cleanup compacts, and corporate ecological liability standards.',
    mandate:
      'Delegates confront transnational industrial externalities and establish verifiable regulatory frameworks that balance ecological restoration with developing-nation growth.',
    focusPoints: [
      'Transboundary air quality monitoring and cross-border emission caps',
      'Binding marine plastic lifecycle reduction and oceanic remediation',
      'Extended producer responsibility and corporate environmental accountability',
    ],
  },
  {
    id: 'UNCSW',
    acronym: 'UNCSW',
    name: 'United Nations Commission on the Status of Women',
    tier: 'Human Rights & Digital Policy',
    delegatesCount: 48,
    agenda:
      "Addressing the Emerging Challenges to Women's Rights in the Digital Age with Special Emphasis on AI Generated Gender Based Violence, Online Safety and Equal Digital Opportunities.",
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_9.05.04_PM_8c20fa71.jpeg',
    summary:
      'Craft global safeguards against synthetic media abuse, algorithmic harassment, and the gender divide in emerging digital economies.',
    mandate:
      'Formulate international legal standards governing AI-generated harms, cross-platform survivor protections, and equitable STEM access worldwide.',
    focusPoints: [
      'Detection, takedown mandates, and prosecution of AI-generated abuse',
      'Platform accountability and survivor-first digital safety protocols',
      'Closing structural barriers to digital literacy, capital, and leadership',
    ],
  },
  {
    id: 'IPL',
    acronym: 'IPL',
    name: 'Indian Premier League',
    tier: 'Franchise Auction Simulation',
    delegatesCount: 40,
    agenda: 'IPL Mega Auction 2027',
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_9.05.04_PM__1__9b41b03e.jpeg',
    summary:
      'High-intensity franchise war room managing purse strategy, player valuations, RTM cards, and squad balance under live gavel pressure.',
    mandate:
      'Step into the shoes of franchise owners and directors of cricket to build a championship-caliber 2027 roster within strict salary-cap dynamics.',
    focusPoints: [
      'Live multi-round bidding strategy and purse conservation math',
      'Right-To-Match (RTM) counter-tactics and overseas slot balancing',
      'Mid-auction trade windows and emerging uncapped talent scouting',
    ],
  },
  {
    id: 'CBI',
    acronym: 'CBI',
    name: 'Central Bureau of Investigation',
    tier: 'Classified Crisis Chamber',
    delegatesCount: 30,
    agenda: 'Classified: Murder Mystery',
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_9.05.04_PM__2__1793c9e3.jpeg',
    summary:
      'Forensic crisis simulation where investigators interrogate live evidence drops, alibis, and covert intelligence leads in real time.',
    mandate:
      'Operating behind closed doors, officers dissect classified case files, cross-examine witnesses, and assemble an airtight prosecutorial charge sheet.',
    focusPoints: [
      'Real-time forensic dossier analysis and timeline reconstruction',
      'Interrogation strategy and contradiction-mapping across suspects',
      'Jurisdictional coordination and sealed evidence preservation',
    ],
  },
  {
    id: 'IPC',
    acronym: 'IPC',
    name: 'International Press Corps',
    tier: 'Journalism, Photography & Caricature',
    delegatesCount: 36,
    agenda: 'Inviting all enthusiasts Caricaturists, Photographers and Journalists to the conference.',
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_9.05.05_PM_ff2265e2.jpeg',
    summary:
      'Chronicle the summit through investigative reporting, sharp editorial satire, and documentary visual storytelling across every chamber.',
    mandate:
      'Assigned across councils as reporters, photojournalists, and caricaturists, the IPC holds delegates accountable through daily press dispatches and press conferences.',
    focusPoints: [
      'Investigative beat reporting and live press conference questioning',
      'Editorial caricature and satirical visual commentary',
      'Documentary summit photography and daily Aurora Chronicle editions',
    ],
  },
  {
    id: 'AIPPM',
    acronym: 'AIPPM',
    name: 'All India Political Parties Meet',
    tier: 'National Parliamentary Forum',
    delegatesCount: 52,
    agenda:
      'Deliberation on Electoral and Economic Reforms in India with Special Emphasis on Electoral Transparency, Political Funding, Food Grain Diversion, Public Distribution System Irregularities and the Criminalisation of Politics.',
    posterUrl: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_9.05.05_PM__1__39fa8500.jpeg',
    summary:
      'Debate institutional integrity, campaign finance reform, PDS accountability, and electoral transparency across party lines.',
    mandate:
      'Representing key national and regional leaders, delegates negotiate bipartisan legislative reforms addressing governance, welfare delivery, and clean politics.',
    focusPoints: [
      'Campaign finance disclosure and electoral transparency mechanisms',
      'Digital auditing of food grain procurement and PDS leakage prevention',
      'Judicial and legislative deterrence against criminalisation of politics',
    ],
  },
];

export interface ExperienceHighlight {
  id: string;
  title: string;
  kicker: string;
  description: string;
  icon: 'briefcase' | 'camera' | 'coffee' | 'users' | 'disc' | 'trophy' | 'sparkles';
  spanClass: string;
  isSurprise?: boolean;
}

export const CONFERENCE_HIGHLIGHTS: ExperienceHighlight[] = [
  {
    id: 'delegate-kit',
    title: 'Delegate Kit',
    kicker: 'Curated Welcome',
    description:
      'Bespoke summit folder, embossed gold Aurora Summit crest pin, custom notepad, placard, and credential lanyard.',
    icon: 'briefcase',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'photo-booth',
    title: 'Photo Booth',
    kicker: 'Editorial Studio',
    description:
      'Cosmic constellation portrait backdrop with studio lighting and instant digital keepsake prints for delegations.',
    icon: 'camera',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'refreshments',
    title: 'Refreshments',
    kicker: 'All-Day Hospitality',
    description:
      'Artisanal high-tea breaks, curated meals, and chilled beverages served between intense moderated caucuses.',
    icon: 'coffee',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'socials',
    title: 'Socials',
    kicker: 'Diplomatic Mixers',
    description:
      'Cross-committee networking evenings designed to forge lasting alliances, friendships, and campus memories.',
    icon: 'users',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'dj-night',
    title: 'DJ Night',
    kicker: 'After-Hours Gala',
    description:
      'High-energy live DJ set under gold-lit celestial visuals to celebrate the close of committee debate.',
    icon: 'disc',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'best-delegation',
    title: 'Best Delegation Award',
    kicker: 'Championship Honors',
    description:
      'Coveted rotating crest trophy, formal citations, and distinguished recognition for the top-performing institution.',
    icon: 'trophy',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'special-twist',
    title: 'Special Twist',
    kicker: 'Live Conference Surprise',
    description:
      'An unannounced cross-council twist triggered mid-summit—hover or tap to decode the classified hint.',
    icon: 'sparkles',
    spanClass: 'md:col-span-2 lg:col-span-1',
    isSurprise: true,
  },
];
