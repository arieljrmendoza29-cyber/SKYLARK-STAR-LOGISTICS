import { withBase } from './basePath.ts';

export type RoutePath =
  | '/'
  | '/services'
  | '/about'
  | '/service-area'
  | '/contact'
  | '/privacy-policy'
  | '/terms-and-conditions';

export interface NavItem {
  label: string;
  path: RoutePath;
}

export interface ServiceItem {
  id: 'transportation' | 'logistics' | 'freight-handling' | 'delivery';
  number: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  iconName: 'Truck' | 'Compass' | 'PackageCheck' | 'Navigation';
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  iconName: 'FileText' | 'MapPin' | 'Truck' | 'CheckCircle2';
}

export interface CoverageZone {
  id: 'la-porte' | 'greater-houston' | 'texas-regional';
  name: string;
  statusLabel: string;
  summary: string;
  details: string[];
  coordinates: { x: number; y: number };
}

export const COMPANY_FACTS = {
  legalName: 'Skylark Star Logistics, LLC',
  shortName: 'Skylark Star Logistics',
  websiteUrl: 'https://skylarkstarlogistics.com/',
  logoPath: withBase('/brand/skylark-logo.webp'),
  establishedYear: 2022,
  managerName: 'James Johnson',
  managerTitle: 'Manager / Owner',
  city: 'La Porte',
  state: 'Texas',
  stateAbbr: 'TX',
  zipCode: '77571',
  locationDisplay: 'La Porte, Texas 77571',
  /** What Google Maps searches for on the Contact page. Swap in the full street address once published. */
  mapQuery: 'La Porte, TX 77571',
  industryDisplay: 'Transportation & Logistics',
  registrationStatusNote:
    'Established in 2022 as a Colorado LLC and currently registering to operate in Texas.',
  missionStatement:
    'To provide dependable transportation and logistics solutions through professional service, efficient coordination, and a commitment to customer satisfaction.',
  contact: {
    /** Still a placeholder: replace with the real number once published. */
    phone: 'To be confirmed upon phone line publication',
    email: 'info@skylarkstarlogistics.com',
    hours: '9:00 AM – 5:00 PM Pacific Time',
  },
  copyright: '© 2026 Skylark Star Logistics, LLC. All Rights Reserved.',
} as const;

export const SITE_IMAGES = {
  heroLogisticsHandshake: withBase('/images/hero-logistics-handshake.jpg'),
  heroCargoTruck: withBase('/images/hero-cargo-truck.jpg'),
  editorialContainers: withBase('/images/editorial-cargo-containers.jpg'),
  texasFreightHub: withBase('/images/texas-freight-hub.jpg'),
  heroHighway: withBase('/images/hero-highway-freight.jpg'),
  transportation: withBase('/images/service-transportation.jpg'),
  logistics: withBase('/images/service-logistics.jpg'),
  freightHandling: withBase('/images/service-freight-handling.jpg'),
  delivery: withBase('/images/service-delivery.jpg'),
  laporteCorridor: withBase('/images/about-laporte-corridor.jpg'),
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Service Area', path: '/service-area' },
  { label: 'Contact', path: '/contact' },
];

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'transportation',
    number: '01',
    title: 'Transportation Services',
    shortDescription:
      'Dependable over-the-road freight transportation built around schedule discipline and clear communication.',
    detailedDescription:
      'Skylark Star Logistics provides transportation solutions for businesses requiring steady, dependable freight movement. Every shipment is planned around realistic transit windows, careful pickup coordination, and consistent status communication from dispatch through arrival.',
    highlights: [
      'Direct pickup and destination scheduling tailored to business freight requirements',
      'Disciplined route execution and proactive communication during transit',
      'Consistent operational standards led by owner-level oversight',
    ],
    image: SITE_IMAGES.transportation,
    imageAlt: 'Commercial semi-truck transporting freight along an American highway in clear daylight',
    iconName: 'Truck',
  },
  {
    id: 'logistics',
    number: '02',
    title: 'Logistics Solutions',
    shortDescription:
      'Structured logistics coordination and transportation support that keeps shipping operations organized.',
    detailedDescription:
      'Effective logistics coordination removes friction from day-to-day shipping operations. We work directly with commercial clients to organize pickup timing, shipment sequencing, and transportation support so freight moves predictably across every leg of the schedule.',
    highlights: [
      'End-to-end dispatch planning and shipment schedule alignment',
      'Single point of coordination for straightforward client communication',
      'Practical planning focused on minimizing avoidable transit delays',
    ],
    image: SITE_IMAGES.logistics,
    imageAlt: 'Modern logistics coordination office with dispatch desks and route planning monitors',
    iconName: 'Compass',
  },
  {
    id: 'freight-handling',
    number: '03',
    title: 'Freight Handling',
    shortDescription:
      'Attentive, safety-minded cargo handling designed to protect freight integrity from loading through handoff.',
    detailedDescription:
      'Proper freight handling requires attention to detail at every transfer point. Our approach emphasizes orderly loading practices, verified cargo counts, and respectful treatment of commercial goods so shipments arrive in the condition they were tendered.',
    highlights: [
      'Organized loading and unloading coordination at origin and destination',
      'Careful attention to packaging stability and cargo documentation',
      'Accountable handoff procedures supporting receiver verification',
    ],
    image: SITE_IMAGES.freightHandling,
    imageAlt: 'Clean freight handling warehouse with neatly wrapped pallets and organized loading dock bays',
    iconName: 'PackageCheck',
  },
  {
    id: 'delivery',
    number: '04',
    title: 'Delivery Services',
    shortDescription:
      'Timely, dependable delivery coordination focused on punctual arrival and responsive customer service.',
    detailedDescription:
      'Reliable delivery is where logistics promises are proven. Skylark Star Logistics focuses on timely arrival windows, courteous dock coordination, and clear confirmation upon completion so your customers and receiving teams can plan with confidence.',
    highlights: [
      'Coordinated arrival windows matched to receiver dock hours',
      'Clear delivery verification and responsive dispatch follow-up',
      'Professional representation of your business at the receiving dock',
    ],
    image: SITE_IMAGES.delivery,
    imageAlt: 'Commercial delivery truck positioned cleanly at a modern business distribution bay',
    iconName: 'Navigation',
  },
];

export const WORKING_PROCESS_STEPS: ProcessStepItem[] = [
  {
    number: '01',
    title: 'Freight Inquiry',
    description:
      'Submit your pickup origin, destination, cargo details, and preferred pickup date through our quote form.',
    iconName: 'FileText',
  },
  {
    number: '02',
    title: 'Coverage & Route Review',
    description:
      'Management reviews lane feasibility, Texas operating scope, and dock requirements before confirming.',
    iconName: 'MapPin',
  },
  {
    number: '03',
    title: 'Coordinated Dispatch',
    description:
      'Shipment pickup, freight handling, and transit schedule are aligned with clear communication.',
    iconName: 'Truck',
  },
  {
    number: '04',
    title: 'Delivery & Verification',
    description:
      'Cargo arrives at the receiving dock with attentive handoff and straightforward completion confirmation.',
    iconName: 'CheckCircle2',
  },
];

export const COVERAGE_ZONES: CoverageZone[] = [
  {
    id: 'la-porte',
    name: 'La Porte, Texas (77571)',
    statusLabel: 'Primary Operations Base',
    summary:
      'Headquartered in La Porte, Texas, positioned along the vital Southeast Houston industrial and freight corridor.',
    details: [
      'Base location: La Porte, Texas 77571',
      'Immediate proximity to Highway 146, Highway 225, and regional freight arteries',
      'Direct coordination point for local business pickup and delivery inquiries',
    ],
    coordinates: { x: 642, y: 404 },
  },
  {
    id: 'greater-houston',
    name: 'Houston Metropolitan Area',
    statusLabel: 'Primary Regional Focus (Subject to Confirmed Coverage)',
    summary:
      'Serving businesses across the Greater Houston metropolitan region, subject to confirmed operating registration and lane scheduling.',
    details: [
      'Commercial corridors spanning Houston, Pasadena, Baytown, Deer Park, and surrounding industrial hubs',
      'Flexible coordination for regional transportation, freight handling, and scheduled deliveries',
      'Coverage availability confirmed directly per shipment inquiry',
    ],
    coordinates: { x: 604, y: 388 },
  },
  {
    id: 'texas-regional',
    name: 'Broader Texas Service Area',
    statusLabel: 'Subject to Confirmed Operating Coverage',
    summary:
      'Additional Texas lanes and commercial destinations evaluated on a per-request basis as Texas operating registration progresses.',
    details: [
      'Established in 2022 as a Colorado LLC; currently registering to operate in Texas',
      'Texas inter-city freight inquiries reviewed individually for scheduling and regulatory readiness',
      'Transparent confirmation of route feasibility prior to dispatch commitment',
    ],
    coordinates: { x: 468, y: 300 },
  },
];

export const SERVICE_TYPE_OPTIONS = [
  'Transportation Services',
  'Logistics Solutions',
  'Freight Handling',
  'Delivery Services',
  'General Freight Inquiry',
] as const;

export interface HeroStat {
  value: number;
  /** Where the count-up animation starts. */
  from?: number;
  suffix?: string;
  label: string;
}

/**
 * Animated numbers under the homepage hero.
 * Only verifiable facts for now. When the client shares real figures
 * (e.g. shipments delivered, miles driven, repeat clients), add or swap them here.
 */
export const HERO_STATS: HeroStat[] = [
  { value: COMPANY_FACTS.establishedYear, from: 2010, label: 'Year Established' },
  { value: CORE_SERVICES.length, label: 'Core Services' },
  { value: COVERAGE_ZONES.length, label: 'Service Regions' },
];
