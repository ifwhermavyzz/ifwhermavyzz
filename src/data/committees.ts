export interface Committee {
  id: 'UNSC' | 'UNGA' | 'AIPPM' | 'UNHRC';
  acronym: 'UNSC' | 'UNGA' | 'AIPPM' | 'UNHRC';
  name: string;
  tier: string;
  delegatesCount: number;
  agenda: string;
  summary: string;
  mandate: string;
  focusPoints: string[];
  featured?: boolean;
  accentGradient: string;
  iconName: 'shield' | 'globe' | 'landmark' | 'scale';
}

export const COMMITTEES: Committee[] = [
  {
    id: 'UNSC',
    acronym: 'UNSC',
    name: 'United Nations Security Council',
    tier: 'Crisis & Flagship Council',
    delegatesCount: 15,
    agenda: 'Governing Autonomous Orbit-to-Surface Security & Lunar Maritime Chokepoints',
    summary:
      'High-stakes, continuous crisis diplomacy confronting dual-use orbital infrastructure, satellite deterrence treaties, and rapid-response peacekeeping mandates.',
    mandate:
      'Operating under Chapter VII authority, delegates navigate real-time intelligence directives, veto politics, and emergency communiqués in a fast-moving security theater.',
    focusPoints: [
      'Orbital debris weaponization & anti-satellite escalation protocols',
      'Binding verification frameworks for cislunar dual-use relays',
      'Multilateral rapid-response coalitions under Article 42',
    ],
    featured: true,
    accentGradient:
      'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.22), rgba(15, 23, 42, 0.4) 55%, rgba(5, 5, 5, 0.9) 100%)',
    iconName: 'shield',
  },
  {
    id: 'UNGA',
    acronym: 'UNGA',
    name: 'United Nations General Assembly',
    tier: 'Plenary Diplomatic Forum',
    delegatesCount: 72,
    agenda: 'Restructuring Sovereign Debt Architecture for Climate-Vulnerable Nations',
    summary:
      'Broad multilateral consensus-building addressing sovereign liquidity crises, green technology transfers, and equitable global trade corridors.',
    mandate:
      'Representing the full breadth of the international community, delegates draft comprehensive draft resolutions balancing fiscal stability with climate justice.',
    focusPoints: [
      'Special Drawing Rights reallocation and debt-for-nature swaps',
      'Cross-border carbon border adjustment dispute mechanisms',
      'Technology transfer compacts for emerging grid resilience',
    ],
    accentGradient:
      'radial-gradient(circle at 20% 20%, rgba(148, 163, 184, 0.18), rgba(15, 23, 42, 0.45) 55%, rgba(5, 5, 5, 0.9) 100%)',
    iconName: 'globe',
  },
  {
    id: 'AIPPM',
    acronym: 'AIPPM',
    name: 'All India Political Parties Meet',
    tier: 'National Policy Conclave',
    delegatesCount: 44,
    agenda: 'Federal Fiscal Autonomy, AI Labor Transitions & Electoral Reform',
    summary:
      'Sharply contested parliamentary debate reconciling coalition politics, constitutional federalism, and rapid industrial automation across states.',
    mandate:
      'Portraying senior national and regional political leaders, representatives negotiate floor consensus, private member bills, and constitutional amendments.',
    focusPoints: [
      'Finance Commission devolution formulas and GST compensation frameworks',
      'National reskilling compact for automation-disrupted districts',
      'Concurrent list jurisdiction over digital public infrastructure',
    ],
    accentGradient:
      'radial-gradient(circle at 85% 80%, rgba(212, 175, 55, 0.16), rgba(30, 41, 59, 0.45) 55%, rgba(5, 5, 5, 0.9) 100%)',
    iconName: 'landmark',
  },
  {
    id: 'UNHRC',
    acronym: 'UNHRC',
    name: 'United Nations Human Rights Council',
    tier: 'Normative Rights Assembly',
    delegatesCount: 47,
    agenda: 'Biometric Surveillance, Algorithmic Asylum Screening & Statelessness',
    summary:
      'Examining the intersection of frontier digital identity systems, cross-border refugee protections, and enforceable human rights safeguards.',
    mandate:
      'Delegates author Special Rapporteur mandates and Universal Periodic Review benchmarks safeguarding civil liberties in an era of automated border governance.',
    focusPoints: [
      'Moratoriums on opaque predictive risk scoring at asylum ports',
      'Due-process guarantees for biometric digital civil registries',
      'Binding legal pathways for climate-displaced stateless communities',
    ],
    accentGradient:
      'radial-gradient(circle at 25% 80%, rgba(243, 229, 171, 0.14), rgba(15, 23, 42, 0.5) 55%, rgba(5, 5, 5, 0.9) 100%)',
    iconName: 'scale',
  },
];

export const SECRETARIAT_PORTFOLIOS = [
  'Under-Secretary-General for Delegate Affairs',
  'Director of Crisis & Logistics',
  'Head of Press & Editorial',
  'Deputy Secretary-General for Finance',
];
