import {
  DealerProfile,
  InventoryItem,
  PartRequest,
  DealerOffer,
  Order,
  Vehicle,
  User,
  AuditLog,
  AppNotification
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_mech_1',
    name: 'Awa Touray',
    phone: '+220 700 1234',
    role: 'mechanic',
    location: 'Serekunda',
    email: 'awa.touray@gamautos.gm'
  },
  {
    id: 'user_dealer_1',
    name: 'Lamin Ceesay',
    phone: '+220 700 3333',
    role: 'dealer',
    location: 'Serekunda',
    email: 'lamin@kairabaparts.gm',
    dealerId: 'dealer_1'
  },
  {
    id: 'user_dealer_2',
    name: 'Musa Jallow',
    phone: '+220 700 2222',
    role: 'dealer',
    location: 'Bakau',
    email: 'musa@bms-parts.gm',
    dealerId: 'dealer_2'
  },
  {
    id: 'user_dealer_3',
    name: 'Modou Bah',
    phone: '+220 877 3125',
    role: 'dealer',
    location: 'Jeshwang',
    email: 'modou@burgispares.gm',
    dealerId: 'dealer_3'
  },
  {
    id: 'user_admin_1',
    name: 'Partna Admin',
    phone: '+220 788 9000',
    role: 'admin',
    location: 'Banjul',
    email: 'admin@partna.gm'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2010,
    engine: '1.6 petrol',
    registrationPlate: 'BJL 4920 D',
    isPrimary: true
  },
  {
    id: 'veh_2',
    make: 'Mercedes-Benz',
    model: 'C200',
    year: 2008,
    engine: '1.8 Kompressor',
    registrationPlate: 'WCR 8102 A',
    isPrimary: false
  },
  {
    id: 'veh_3',
    make: 'Nissan',
    model: 'Patrol',
    year: 2012,
    engine: '3.0 Di Turbo Diesel',
    registrationPlate: 'KM 1109 B',
    isPrimary: false
  }
];

export const INITIAL_DEALERS: DealerProfile[] = [
  {
    id: 'dealer_1',
    name: 'Kairaba Auto Parts',
    ownerName: 'Lamin Ceesay',
    phone: '+220 700 3333',
    email: 'info@kairaba-autoparts.gm',
    address: '14 Kairaba Avenue, Traffic Lights',
    town: 'Serekunda',
    distanceKm: 1.2,
    rating: 4.8,
    verified: true,
    categories: ['Brakes', 'Filters', 'Engine', 'Electrical', 'Suspension'],
    openUntil: '18:00',
    status: 'approved',
    logoUrl: '/dealers/burgi.jpg',
    registrationNumber: 'GM-KAP-2021-089',
    createdAt: '2024-01-15T09:00:00Z',
    verifiedAt: '2024-01-16T14:30:00Z',
    documents: [
      {
        type: 'Business Registration',
        name: 'Kairaba_Auto_Parts_Certificate_2024.pdf',
        url: '/public/assets/aistudio/ui_04fd776e.pdf',
        size: '1.8 MB'
      }
    ],
    shopfrontImage: '/parts/hero_banner.jpg'
  },
  {
    id: 'dealer_2',
    name: 'Bakau Motor Spares',
    ownerName: 'Musa Jallow',
    phone: '+220 700 2222',
    email: 'musa.jallow@bms-parts.gm',
    address: 'Sait Matty Road, Near Cape Point',
    town: 'Bakau',
    distanceKm: 3.8,
    rating: 4.5,
    verified: false,
    categories: ['Engine', 'Cooling', 'Filters', 'Transmission'],
    openUntil: '18:30',
    status: 'pending',
    logoUrl: '/dealers/autoroom.jpg',
    registrationNumber: 'GM-BMS-2023-041',
    createdAt: '2026-10-23T09:12:00Z',
    documents: [
      {
        type: 'Business Registration',
        name: 'Bakau Motor Spares • GM-BMS-2023-041 • Registration scan.pdf',
        url: '/public/assets/aistudio/ui_04fd776e.pdf',
        size: '2.1 MB'
      }
    ],
    shopfrontImage: '/parts/hero_banner.jpg'
  },
  {
    id: 'dealer_3',
    name: 'Burgi Spare Parts',
    ownerName: 'Modou Bah',
    phone: '+220 877 3125',
    email: 'sales@burgispares.gm',
    address: 'Old Jeshwang Highway, Opposite Garage',
    town: 'Jeshwang',
    distanceKm: 2.1,
    rating: 4.9,
    verified: true,
    categories: ['Brakes', 'Engine', 'Sensors', 'Ignition'],
    openUntil: '19:00',
    status: 'approved',
    logoUrl: '/dealers/burgi.jpg',
    registrationNumber: 'GM-BSP-2022-114',
    createdAt: '2024-04-10T11:00:00Z',
    verifiedAt: '2024-04-12T10:00:00Z',
    documents: [
      {
        type: 'Business Registration',
        name: 'Burgi_Spares_Incorporation.pdf',
        url: '/public/assets/aistudio/ui_04fd776e.pdf',
        size: '1.4 MB'
      }
    ],
    shopfrontImage: '/parts/hero_banner.jpg'
  },
  {
    id: 'dealer_4',
    name: 'Auto Room',
    ownerName: 'Ebrima Touray',
    phone: '+220 873 6627',
    email: 'contact@autoroom.gm',
    address: 'Kanifing Institutional Area, Jeshwang Junction',
    town: 'Jeshwang',
    distanceKm: 2.4,
    rating: 4.7,
    verified: true,
    categories: ['Electrical', 'Batteries', 'Alternators', 'Starters'],
    openUntil: '18:00',
    status: 'approved',
    logoUrl: '/dealers/autoroom.jpg',
    registrationNumber: 'GM-AR-2020-033',
    createdAt: '2024-03-01T08:00:00Z',
    verifiedAt: '2024-03-02T16:00:00Z'
  },
  {
    id: 'dealer_5',
    name: 'Omega Auto Parts',
    ownerName: 'Ousman Sowe',
    phone: '+220 877 2343',
    email: 'info@omega-auto.gm',
    address: 'Latrikunda Sabiji Market Road',
    town: 'Latrikunda',
    distanceKm: 3.1,
    rating: 4.6,
    verified: true,
    categories: ['Suspension', 'Steering', 'Brakes', 'Cooling'],
    openUntil: '18:30',
    status: 'approved',
    logoUrl: '/dealers/omega.jpg',
    registrationNumber: 'GM-OAP-2019-201',
    createdAt: '2024-02-18T10:00:00Z',
    verifiedAt: '2024-02-19T11:20:00Z'
  },
  {
    id: 'dealer_6',
    name: 'M-Auto Services',
    ownerName: 'Pa Amadou Jallow',
    phone: '+220 833 3028',
    email: 'pa@mautoservices.gm',
    address: 'Bambo Junction, Serrekunda East',
    town: 'Bambo',
    distanceKm: 1.9,
    rating: 4.4,
    verified: true,
    categories: ['Transmission', 'Clutch', 'Drive Axles', 'Used parts'],
    openUntil: '17:30',
    status: 'approved',
    logoUrl: '/dealers/mauto.jpg',
    registrationNumber: 'GM-MAS-2022-771',
    createdAt: '2024-05-12T09:00:00Z',
    verifiedAt: '2024-05-14T15:00:00Z'
  },
  {
    id: 'dealer_7',
    name: 'Brikama Parts Centre',
    ownerName: 'Sulayman Jagne',
    phone: '+220 799 4455',
    email: 'parts@brikamacenter.gm',
    address: 'Main Market Road, Near Mosque',
    town: 'Brikama',
    distanceKm: 16.5,
    rating: 4.8,
    verified: true,
    categories: ['OEM Parts', 'Engine', 'Fuel Systems', 'Brakes'],
    openUntil: '18:00',
    status: 'approved',
    logoUrl: '/dealers/autoroom.jpg',
    registrationNumber: 'GM-BPC-2021-998',
    createdAt: '2024-01-20T12:00:00Z',
    verifiedAt: '2024-01-22T09:30:00Z'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'part_1',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerTown: 'Serekunda',
    dealerPhone: '+220 700 3333',
    name: 'Front brake pads',
    partNumber: 'BP-COR-2010-F',
    category: 'Brakes',
    condition: 'Aftermarket',
    price: 1850,
    stock: 8,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Auris', 'Toyota Yaris'],
    imageUrl: '/parts/brake_pads.jpg',
    description: 'High friction ceramic composite brake pads designed for high dust and heat resilience. Low noise and extended rotor lifespan.',
    warranty: '6 months warranty',
    updatedAt: '2026-10-24T08:30:00Z'
  },
  {
    id: 'part_2',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerTown: 'Serekunda',
    dealerPhone: '+220 700 3333',
    name: 'Alternator 12V',
    partNumber: 'ALT-COR-16',
    category: 'Electrical',
    condition: 'Aftermarket',
    price: 4800,
    stock: 2,
    status: 'low_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Avensis', 'Toyota RAV4'],
    imageUrl: '/parts/alternator.jpg',
    description: '12V 80A heavy-duty alternator with internal regulator and sealed bearings for tropical climates. Tested under full load.',
    warranty: '6 months replacement warranty',
    updatedAt: '2026-10-24T10:15:00Z'
  },
  {
    id: 'part_3',
    dealerId: 'dealer_3',
    dealerName: 'Burgi Spare Parts',
    dealerTown: 'Jeshwang',
    dealerPhone: '+220 877 3125',
    name: 'Toyota oil filter',
    partNumber: 'OF-TOY-16',
    category: 'Filters',
    condition: 'OEM',
    price: 450,
    stock: 24,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Camry', 'Toyota RAV4', 'Toyota Hilux'],
    imageUrl: '/parts/oil_filter.jpg',
    description: 'Genuine OEM spin-on oil filter with premium pleated synthetic blend media and anti-drainback silicon valve.',
    warranty: 'Genuine OEM quality guarantee',
    updatedAt: '2026-10-24T07:45:00Z'
  },
  {
    id: 'part_4',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerTown: 'Serekunda',
    dealerPhone: '+220 700 3333',
    name: 'KYB shock absorber',
    partNumber: 'SA-KYB-334',
    category: 'Suspension',
    condition: 'Aftermarket',
    price: 2900,
    stock: 4,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Nissan Sunny', 'Honda Civic'],
    imageUrl: '/parts/shock_absorber.jpg',
    description: 'Nitrogen gas-charged twin tube strut designed for rough road conditions. Restores original steering response and dampening.',
    warranty: '12 months warranty',
    updatedAt: '2026-10-23T14:20:00Z'
  },
  {
    id: 'part_5',
    dealerId: 'dealer_3',
    dealerName: 'Burgi Spare Parts',
    dealerTown: 'Jeshwang',
    dealerPhone: '+220 877 3125',
    name: 'NGK Spark Plugs (Set of 4)',
    partNumber: 'SP-NGK-BKR6E',
    category: 'Engine',
    condition: 'OEM',
    price: 950,
    stock: 15,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Mercedes-Benz C200', 'Honda CR-V', 'Nissan Patrol'],
    imageUrl: '/parts/brake_pads.jpg',
    description: 'V-power nickel alloy spark plugs for quick ignition and optimal combustion. Pre-gapped to factory specs.',
    warranty: '10,000 km performance guarantee',
    updatedAt: '2026-10-24T09:00:00Z'
  },
  {
    id: 'part_6',
    dealerId: 'dealer_4',
    dealerName: 'Auto Room',
    dealerTown: 'Jeshwang',
    dealerPhone: '+220 873 6627',
    name: 'Heavy Duty 70Ah Battery',
    partNumber: 'BAT-HK-70',
    category: 'Electrical',
    condition: 'New',
    price: 3600,
    stock: 6,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Mercedes-Benz C200', 'Nissan Patrol', 'Mitsubishi Pajero'],
    imageUrl: '/parts/alternator.jpg',
    description: 'Sealed maintenance-free calcium alloy battery. High cranking power (CCA 620A) withstands intense West African heat.',
    warranty: '12 months replacement warranty',
    updatedAt: '2026-10-22T16:00:00Z'
  },
  {
    id: 'part_7',
    dealerId: 'dealer_5',
    dealerName: 'Omega Auto Parts',
    dealerTown: 'Latrikunda',
    dealerPhone: '+220 877 2343',
    name: 'Radiator Cooling Fan Assembly',
    partNumber: 'RF-COR-09',
    category: 'Engine',
    condition: 'Tested Used',
    price: 2400,
    stock: 2,
    status: 'low_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Matrix'],
    imageUrl: '/parts/shock_absorber.jpg',
    description: 'Complete dual motor shroud and fan assembly. Motor windings checked and tested with steady amperage draw.',
    warranty: '30 days warranty',
    updatedAt: '2026-10-24T11:00:00Z'
  },
  {
    id: 'part_8',
    dealerId: 'dealer_6',
    dealerName: 'M-Auto Services',
    dealerTown: 'Bambo',
    dealerPhone: '+220 833 3028',
    name: 'Clutch Disc & Pressure Plate Kit',
    partNumber: 'CK-TOY-302',
    category: 'Transmission',
    condition: 'OEM',
    price: 4200,
    stock: 3,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Hilux 2.4D', 'Toyota HiAce'],
    imageUrl: '/parts/brake_pads.jpg',
    description: 'Includes reinforced friction disc, pressure plate cover, and release bearing. Smooth engagement without slip.',
    warranty: '6 months warranty',
    updatedAt: '2026-10-21T13:40:00Z'
  },
  {
    id: 'part_9',
    dealerId: 'dealer_7',
    dealerName: 'Brikama Parts Centre',
    dealerTown: 'Brikama',
    dealerPhone: '+220 799 4455',
    name: 'Electric Fuel Pump Assembly',
    partNumber: 'FP-DENSO-71',
    category: 'Engine',
    condition: 'OEM',
    price: 2100,
    stock: 5,
    status: 'in_stock',
    compatibleVehicles: ['Toyota Corolla', 'Nissan Sunny', 'Hyundai Elantra'],
    imageUrl: '/parts/oil_filter.jpg',
    description: 'In-tank low-noise fuel pump with built-in strainer mesh. Steady 3.5 bar flow for smooth fuel injection.',
    warranty: '12 months warranty',
    updatedAt: '2026-10-23T15:10:00Z'
  },
  {
    id: 'part_10',
    dealerId: 'dealer_4',
    dealerName: 'Auto Room',
    dealerTown: 'Jeshwang',
    dealerPhone: '+220 873 6627',
    name: 'Timing Belt & Tensioner Kit',
    partNumber: 'TB-GATE-401',
    category: 'Engine',
    condition: 'Aftermarket',
    price: 1750,
    stock: 0,
    status: 'out_of_stock',
    compatibleVehicles: ['Toyota Corolla', 'Toyota Carina', 'Honda Civic'],
    imageUrl: '/parts/shock_absorber.jpg',
    description: 'Reinforced HNBR rubber timing belt with precision molded teeth and automatic hydraulic tensioner pulley.',
    warranty: '50,000 km warranty',
    updatedAt: '2026-10-20T10:00:00Z'
  }
];

export const INITIAL_REQUESTS: PartRequest[] = [
  {
    id: 'req_1',
    reference: 'RQ-208',
    buyerId: 'user_mech_1',
    buyerName: 'Awa Touray',
    buyerPhone: '+220 700 1234',
    buyerLocation: 'Serekunda',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: 2010,
    engine: '1.6 petrol',
    partName: 'Alternator 12V',
    partNumber: 'Not provided',
    conditionPreference: 'OEM, aftermarket or tested used',
    notes: 'Battery warning light is on. Please quote a tested unit with warranty and confirm the fit.',
    quantity: 1,
    preferredFulfilment: 'either',
    status: 'quotes_received',
    createdAt: '2026-10-24T09:15:00Z',
    quotesCount: 3,
    targetCategories: ['Electrical', 'Engine'],
    attachments: [
      {
        id: 'att_1',
        type: 'image',
        name: 'buyer_alternator_reference.jpg',
        url: '/parts/alternator.jpg',
        size: '1.2 MB'
      },
      {
        id: 'att_2',
        type: 'audio',
        name: 'mechanic_voice_note_serekunda.mp3',
        url: 'https://cdn.freesound.org/previews/381/381382_6494619-lq.mp3',
        size: '480 KB',
        durationSeconds: 18
      }
    ]
  },
  {
    id: 'req_2',
    reference: 'RQ-209',
    buyerId: 'user_mech_1',
    buyerName: 'Awa Touray',
    buyerPhone: '+220 700 1234',
    buyerLocation: 'Serekunda',
    vehicleMake: 'Mercedes-Benz',
    vehicleModel: 'C200',
    vehicleYear: 2008,
    engine: '1.8 Kompressor',
    partName: 'Brake Master Cylinder',
    partNumber: 'A0054303401',
    conditionPreference: 'OEM or Tested Used',
    notes: 'Soft brake pedal feel after bleeding. Need master cylinder with intact reservoir seals.',
    quantity: 1,
    preferredFulfilment: 'delivery',
    status: 'open',
    createdAt: '2026-10-24T14:30:00Z',
    quotesCount: 1,
    targetCategories: ['Brakes'],
    attachments: [
      {
        id: 'att_3',
        type: 'image',
        name: 'master_cylinder.jpg',
        url: '/parts/brake_pads.jpg',
        size: '950 KB'
      }
    ]
  }
];

export const INITIAL_OFFERS: DealerOffer[] = [
  {
    id: 'offer_1',
    requestId: 'req_1',
    requestReference: 'RQ-208',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerPhone: '+220 700 3333',
    dealerTown: 'Serekunda',
    dealerVerified: true,
    partTitle: 'Alternator 12V 80A',
    condition: 'Aftermarket',
    partPrice: 4800,
    deliveryFee: 150,
    totalPrice: 4950,
    warranty: '6 months',
    stockAvailability: '2 in stock',
    estimatedFulfilment: 'Delivery tomorrow',
    notes: 'Tested on test bench with steady 14.2V output. Complete with pulley. Confirmed fit for Corolla 2010 1.6 petrol.',
    badge: 'Recommended',
    status: 'pending',
    createdAt: '2026-10-24T10:05:00Z'
  },
  {
    id: 'offer_2',
    requestId: 'req_1',
    requestReference: 'RQ-208',
    dealerId: 'dealer_2',
    dealerName: 'Bakau Motor Spares',
    dealerPhone: '+220 700 2222',
    dealerTown: 'Bakau',
    dealerVerified: false,
    partTitle: 'Used OEM Alternator',
    condition: 'Tested Used',
    partPrice: 3200,
    deliveryFee: 100,
    totalPrice: 3300,
    warranty: '30 days',
    stockAvailability: '1 in stock',
    estimatedFulfilment: 'Delivery in 2 days',
    notes: 'Imported from Europe vehicle dismantle. Bench tested brushes and rectifier.',
    badge: 'Lowest price',
    status: 'pending',
    createdAt: '2026-10-24T10:30:00Z'
  },
  {
    id: 'offer_3',
    requestId: 'req_1',
    requestReference: 'RQ-208',
    dealerId: 'dealer_7',
    dealerName: 'Brikama Parts Centre',
    dealerPhone: '+220 799 4455',
    dealerTown: 'Brikama',
    dealerVerified: true,
    partTitle: 'Original Denso Alternator 12V',
    condition: 'OEM',
    partPrice: 6750,
    deliveryFee: 0,
    totalPrice: 6750,
    warranty: '12 months',
    stockAvailability: '1 in stock',
    estimatedFulfilment: 'Collection tomorrow',
    notes: 'Brand new boxed Denso OEM alternator. Zero hours.',
    badge: 'Original part',
    status: 'pending',
    createdAt: '2026-10-24T11:10:00Z'
  },
  {
    id: 'offer_4',
    requestId: 'req_2',
    requestReference: 'RQ-209',
    dealerId: 'dealer_3',
    dealerName: 'Burgi Spare Parts',
    dealerPhone: '+220 877 3125',
    dealerTown: 'Jeshwang',
    dealerVerified: true,
    partTitle: 'Brembo Master Cylinder',
    condition: 'OEM',
    partPrice: 3400,
    deliveryFee: 150,
    totalPrice: 3550,
    warranty: '6 months',
    stockAvailability: '1 in stock',
    estimatedFulfilment: 'Delivery today',
    notes: 'Original Brembo casting. Fits C200 Kompressor chassis W204.',
    badge: 'Recommended',
    status: 'pending',
    createdAt: '2026-10-24T15:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    reference: 'PN-1048',
    buyerId: 'user_mech_1',
    buyerName: 'Awa Touray',
    buyerPhone: '+220 700 1234',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerPhone: '+220 700 3333',
    dealerTown: 'Serekunda',
    partId: 'part_1',
    partName: 'Front brake pads',
    partNumber: 'BP-COR-2010-F',
    partImage: '/parts/brake_pads.jpg',
    condition: 'Aftermarket',
    unitPrice: 1850,
    quantity: 1,
    deliveryFee: 150,
    totalAmount: 2000,
    paymentMethod: 'Cash on delivery',
    deliveryMethod: 'delivery',
    deliveryAddress: '12 Kairaba Avenue, Serekunda',
    dispatchReference: 'KA-2410-048',
    estimatedArrival: 'Today, 25 Oct • by 18:00',
    status: 'out_for_delivery',
    createdAt: '2026-10-24T10:32:00Z',
    updatedAt: '2026-10-25T10:10:00Z',
    timeline: [
      {
        title: 'Order confirmed',
        timestamp: '24 Oct • 10:32',
        completed: true
      },
      {
        title: 'Packed by dealer',
        timestamp: '24 Oct • 11:15',
        completed: true
      },
      {
        title: 'Out for delivery',
        subtitle: 'Dealer update • 25 Oct, 10:10',
        timestamp: '25 Oct • 10:10',
        completed: true,
        current: true
      },
      {
        title: 'Delivered',
        subtitle: 'Expected by 18:00 today',
        timestamp: 'Estimated 18:00',
        completed: false
      }
    ]
  },
  {
    id: 'ord_2',
    reference: 'PN-1049',
    buyerId: 'user_mech_1',
    buyerName: 'Awa Touray',
    buyerPhone: '+220 700 1234',
    dealerId: 'dealer_7',
    dealerName: 'Brikama Parts Centre',
    dealerPhone: '+220 799 4455',
    dealerTown: 'Brikama',
    partName: 'Alternator 12V',
    partNumber: 'ALT-DENSO-OEM',
    partImage: '/parts/alternator.jpg',
    condition: 'OEM',
    unitPrice: 6750,
    quantity: 1,
    deliveryFee: 0,
    totalAmount: 6750,
    paymentMethod: 'Cash on collection',
    deliveryMethod: 'collection',
    collectionCode: '482 691',
    pickupLocation: 'Main Market Road, Brikama',
    pickupOpeningHours: 'Mon–Sat • 08:30–18:00',
    status: 'ready_collection',
    createdAt: '2026-10-24T11:45:00Z',
    updatedAt: '2026-10-24T13:00:00Z',
    timeline: [
      {
        title: 'Order confirmed',
        timestamp: '24 Oct • 11:45',
        completed: true
      },
      {
        title: 'Prepared for collection',
        timestamp: '24 Oct • 13:00',
        completed: true,
        current: true
      },
      {
        title: 'Collected by buyer',
        subtitle: 'Provide code 482 691 at shop',
        timestamp: 'Pending pickup',
        completed: false
      }
    ]
  },
  {
    id: 'ord_3',
    reference: 'PN-1021',
    buyerId: 'user_mech_1',
    buyerName: 'Awa Touray',
    buyerPhone: '+220 700 1234',
    dealerId: 'dealer_1',
    dealerName: 'Kairaba Auto Parts',
    dealerPhone: '+220 700 3333',
    dealerTown: 'Serekunda',
    partName: 'Front brake pads',
    partNumber: 'BP-COR-2010-F',
    partImage: '/parts/brake_pads.jpg',
    condition: 'Aftermarket',
    unitPrice: 1850,
    quantity: 1,
    deliveryFee: 150,
    totalAmount: 2000,
    paymentMethod: 'Cash on delivery',
    deliveryMethod: 'delivery',
    deliveryAddress: '12 Kairaba Avenue, Serekunda',
    dispatchReference: 'KA-2410-021',
    status: 'delivered',
    createdAt: '2026-10-16T09:10:00Z',
    updatedAt: '2026-10-16T15:20:00Z',
    timeline: [
      {
        title: 'Order confirmed',
        timestamp: '16 Oct • 09:10',
        completed: true
      },
      {
        title: 'Packed by dealer',
        timestamp: '16 Oct • 11:00',
        completed: true
      },
      {
        title: 'Out for delivery',
        timestamp: '16 Oct • 12:30',
        completed: true
      },
      {
        title: 'Delivered',
        subtitle: 'Signed and confirmed by Awa Touray',
        timestamp: '16 Oct • 15:20',
        completed: true
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-10-24T09:12:00Z',
    actorName: 'Musa Jallow',
    actorRole: 'dealer',
    action: 'SUBMIT_APPLICATION',
    target: 'Dealer: Bakau Motor Spares',
    details: 'New dealer application submitted with registration document GM-BMS-2023-041.'
  },
  {
    id: 'log_2',
    timestamp: '2026-10-24T10:32:00Z',
    actorName: 'Awa Touray',
    actorRole: 'mechanic',
    action: 'PLACE_ORDER',
    target: 'Order: PN-1048',
    details: 'Direct order placed for Front brake pads (GMD 2,000 cash on delivery) with Kairaba Auto Parts.'
  },
  {
    id: 'log_3',
    timestamp: '2026-10-25T10:10:00Z',
    actorName: 'Lamin Ceesay',
    actorRole: 'dealer',
    action: 'DISPATCH_ORDER',
    target: 'Order: PN-1048',
    details: 'Order dispatched for delivery with courier reference KA-2410-048.'
  }
];

export const GAMBIAN_TOWNS = [
  'Serekunda',
  'Bakau',
  'Jeshwang',
  'Latrikunda',
  'Bambo',
  'Banjul',
  'Brikama',
  'Westfield',
  'Sukuta',
  'Brusubi'
];

export const PART_CATEGORIES = [
  { id: 'brakes', name: 'Brakes', icon: 'Disc', count: 18 },
  { id: 'engine', name: 'Engine', icon: 'Cog', count: 34 },
  { id: 'filters', name: 'Filters', icon: 'Filter', count: 26 },
  { id: 'suspension', name: 'Suspension', icon: 'Activity', count: 14 },
  { id: 'electrical', name: 'Electrical', icon: 'Zap', count: 22 },
  { id: 'transmission', name: 'Transmission', icon: 'Settings', count: 12 },
  { id: 'cooling', name: 'Cooling & AC', icon: 'Wind', count: 16 },
  { id: 'body', name: 'Body & Lights', icon: 'Eye', count: 19 }
];
