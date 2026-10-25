export type Role = 'mechanic' | 'dealer' | 'admin';

export type ApplicationStatus = 'pending' | 'more_info' | 'approved' | 'rejected' | 'suspended';

export type PartCondition = 'New' | 'OEM' | 'Aftermarket' | 'Tested Used';

export type RequestStatus = 'open' | 'quotes_received' | 'accepted' | 'fulfilled' | 'cancelled';

export type OrderStatus = 'pending' | 'packed' | 'out_for_delivery' | 'ready_collection' | 'delivered' | 'collected' | 'cancelled';

export type DeliveryMethod = 'delivery' | 'collection';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  location: string;
  avatarUrl?: string;
  email?: string;
  dealerId?: string; // linked if role === 'dealer'
}

export interface DealerProfile {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  town: string; // Serekunda, Jeshwang, Latrikunda, Bakau, Brikama, etc.
  distanceKm: number;
  rating: number;
  verified: boolean;
  categories: string[];
  openUntil: string;
  status: ApplicationStatus;
  logoUrl: string;
  registrationNumber: string;
  createdAt: string;
  verifiedAt?: string;
  reviewNotes?: string;
  documents?: {
    type: string;
    name: string;
    url: string;
    size?: string;
  }[];
  shopfrontImage?: string;
}

export interface InventoryItem {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerTown: string;
  dealerPhone: string;
  name: string;
  partNumber?: string;
  category: string;
  condition: PartCondition;
  price: number; // in GMD
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'inactive';
  compatibleVehicles: string[];
  imageUrl: string;
  description: string;
  warranty: string;
  updatedAt: string;
}

export interface RequestAttachment {
  id: string;
  type: 'image' | 'audio';
  url: string;
  name: string;
  size?: string;
  durationSeconds?: number;
}

export interface PartRequest {
  id: string;
  reference: string; // e.g. RQ-208
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  engine: string;
  partName: string;
  partNumber?: string;
  conditionPreference: string;
  notes: string;
  quantity: number;
  preferredFulfilment: 'delivery' | 'collection' | 'either';
  status: RequestStatus;
  attachments: RequestAttachment[];
  createdAt: string;
  quotesCount: number;
  targetCategories: string[];
}

export interface DealerOffer {
  id: string;
  requestId: string;
  requestReference: string;
  dealerId: string;
  dealerName: string;
  dealerPhone: string;
  dealerTown: string;
  dealerVerified: boolean;
  partTitle: string;
  condition: PartCondition;
  partPrice: number; // in GMD
  deliveryFee: number; // in GMD
  totalPrice: number; // in GMD
  warranty: string;
  stockAvailability: string;
  estimatedFulfilment: string;
  notes: string;
  badge?: 'Recommended' | 'Lowest price' | 'Original part';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface DeliveryTimelineStep {
  title: string;
  subtitle?: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  reference: string; // e.g. PN-1048
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  dealerId: string;
  dealerName: string;
  dealerPhone: string;
  dealerTown: string;
  partId?: string;
  offerId?: string;
  partName: string;
  partNumber?: string;
  partImage: string;
  condition: PartCondition;
  unitPrice: number;
  quantity: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on delivery' | 'Cash on collection';
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  collectionCode?: string; // 6-digit code e.g. '482 691'
  pickupLocation?: string;
  pickupOpeningHours?: string;
  dispatchReference?: string; // e.g. KA-2410-048
  estimatedArrival?: string;
  status: OrderStatus;
  timeline: DeliveryTimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  registrationPlate?: string;
  isPrimary?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  details: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
