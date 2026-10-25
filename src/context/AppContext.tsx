import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  DealerProfile,
  InventoryItem,
  PartRequest,
  DealerOffer,
  Order,
  Vehicle,
  AuditLog,
  DeliveryMethod,
  OrderStatus,
  Role,
  AppNotification
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_DEALERS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  switchUser: (user: User) => void;
  availableUsers: User[];
  activeTown: string;
  setActiveTown: (town: string) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveVehicle: (vehicle: Vehicle) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  dealers: DealerProfile[];
  inventory: InventoryItem[];
  requests: PartRequest[];
  offers: DealerOffer[];
  orders: Order[];
  auditLogs: AuditLog[];
  savedPartIds: string[];
  notifications: AppNotification[];
  toggleSavedPart: (partId: string) => void;
  createPartRequest: (data: {
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
    attachments: { type: 'image' | 'audio'; name: string; url: string; size?: string; durationSeconds?: number }[];
  }) => PartRequest;
  submitDealerOffer: (data: {
    requestId: string;
    partTitle: string;
    condition: any;
    partPrice: number;
    deliveryFee: number;
    warranty: string;
    stockAvailability: string;
    estimatedFulfilment: string;
    notes: string;
  }) => DealerOffer;
  acceptOffer: (offerId: string, deliveryMethod: DeliveryMethod, address?: string) => Order;
  createDirectOrder: (partId: string, quantity: number, deliveryMethod: DeliveryMethod, address?: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, dispatchRef?: string, note?: string) => void;
  approveDealerApplication: (dealerId: string, notes?: string) => void;
  rejectDealerApplication: (dealerId: string, reason: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'updatedAt' | 'dealerId' | 'dealerName' | 'dealerTown' | 'dealerPhone'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'partna_current_user',
  TOWN: 'partna_town',
  VEHICLES: 'partna_vehicles',
  DEALERS: 'partna_dealers',
  INVENTORY: 'partna_inventory',
  REQUESTS: 'partna_requests',
  OFFERS: 'partna_offers',
  ORDERS: 'partna_orders',
  SAVED: 'partna_saved_parts',
  AUDIT: 'partna_audit_logs',
  NOTIFICATIONS: 'partna_notifications'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [activeTown, setActiveTown] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOWN) || 'Serekunda';
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [dealers, setDealers] = useState<DealerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEALERS);
    return saved ? JSON.parse(saved) : INITIAL_DEALERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [requests, setRequests] = useState<PartRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [offers, setOffers] = useState<DealerOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [savedPartIds, setSavedPartIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
    return saved ? JSON.parse(saved) : ['part_1', 'part_2', 'part_3', 'part_4'];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      userId: 'user_mech_1',
      title: 'Quote received for Alternator',
      message: 'Kairaba Auto Parts quoted GMD 4,800 for RQ-208.',
      timestamp: '10 mins ago',
      read: false,
      linkTab: 'requests'
    },
    {
      id: 'notif_2',
      userId: 'user_mech_1',
      title: 'Order PN-1048 is out for delivery',
      message: 'Courier dispatched with reference KA-2410-048.',
      timestamp: '30 mins ago',
      read: false,
      linkTab: 'orders'
    }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOWN, activeTown);
  }, [activeTown]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(dealers));
  }, [dealers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedPartIds));
  }, [savedPartIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const activeVehicle = vehicles.find((v) => v.isPrimary) || vehicles[0] || null;

  const setActiveVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isPrimary: v.id === vehicle.id
      }))
    );
  };

  const addVehicle = (veh: Omit<Vehicle, 'id'>) => {
    const newV: Vehicle = {
      ...veh,
      id: `veh_${Date.now()}`,
      isPrimary: true
    };
    setVehicles((prev) => [
      newV,
      ...prev.map((v) => ({ ...v, isPrimary: false }))
    ]);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const toggleSavedPart = (partId: string) => {
    setSavedPartIds((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      target,
      details
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Part Request Creation
  const createPartRequest = (data: {
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
    attachments: { type: 'image' | 'audio'; name: string; url: string; size?: string; durationSeconds?: number }[];
  }): PartRequest => {
    const refNum = Math.floor(100 + Math.random() * 900);
    const newRequest: PartRequest = {
      id: `req_${Date.now()}`,
      reference: `RQ-${refNum}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerLocation: currentUser.location || activeTown,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      engine: data.engine,
      partName: data.partName,
      partNumber: data.partNumber || 'Not provided',
      conditionPreference: data.conditionPreference,
      notes: data.notes,
      quantity: data.quantity || 1,
      preferredFulfilment: data.preferredFulfilment,
      status: 'open',
      createdAt: new Date().toISOString(),
      quotesCount: 0,
      targetCategories: ['Engine', 'Electrical', 'Brakes'],
      attachments: data.attachments.map((att, idx) => ({
        ...att,
        id: `att_${Date.now()}_${idx}`
      }))
    };

    setRequests((prev) => [newRequest, ...prev]);
    addAuditLog('CREATE_REQUEST', `Request: ${newRequest.reference}`, `New part request submitted for ${data.partName} (${data.vehicleMake} ${data.vehicleModel}).`);
    return newRequest;
  };

  // Submit Dealer Quote / Offer
  const submitDealerOffer = (data: {
    requestId: string;
    partTitle: string;
    condition: any;
    partPrice: number;
    deliveryFee: number;
    warranty: string;
    stockAvailability: string;
    estimatedFulfilment: string;
    notes: string;
  }): DealerOffer => {
    const activeDealer = dealers.find((d) => d.id === currentUser.dealerId) || dealers[0];
    const targetReq = requests.find((r) => r.id === data.requestId);

    const newOffer: DealerOffer = {
      id: `offer_${Date.now()}`,
      requestId: data.requestId,
      requestReference: targetReq?.reference || 'RQ-000',
      dealerId: activeDealer.id,
      dealerName: activeDealer.name,
      dealerPhone: activeDealer.phone,
      dealerTown: activeDealer.town,
      dealerVerified: activeDealer.verified,
      partTitle: data.partTitle,
      condition: data.condition,
      partPrice: data.partPrice,
      deliveryFee: data.deliveryFee,
      totalPrice: data.partPrice + data.deliveryFee,
      warranty: data.warranty,
      stockAvailability: data.stockAvailability,
      estimatedFulfilment: data.estimatedFulfilment,
      notes: data.notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOffers((prev) => [newOffer, ...prev]);
    setRequests((prev) =>
      prev.map((r) => (r.id === data.requestId ? { ...r, quotesCount: r.quotesCount + 1, status: 'quotes_received' } : r))
    );

    addAuditLog(
      'SUBMIT_OFFER',
      `Offer for ${newOffer.requestReference}`,
      `Dealer ${activeDealer.name} offered GMD ${newOffer.totalPrice} for ${newOffer.partTitle}.`
    );

    return newOffer;
  };

  // Accept Offer and turn into Order
  const acceptOffer = (offerId: string, deliveryMethod: DeliveryMethod, address?: string): Order => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found');
    if (offer.status === 'accepted') throw new Error('Offer already accepted');

    const req = requests.find((r) => r.id === offer.requestId);
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const collectionCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      reference: `PN-${orderNum}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      dealerId: offer.dealerId,
      dealerName: offer.dealerName,
      dealerPhone: offer.dealerPhone,
      dealerTown: offer.dealerTown,
      offerId: offer.id,
      partName: offer.partTitle,
      partImage: '/parts/alternator.jpg',
      condition: offer.condition,
      unitPrice: offer.partPrice,
      quantity: 1,
      deliveryFee: deliveryMethod === 'delivery' ? offer.deliveryFee : 0,
      totalAmount: offer.partPrice + (deliveryMethod === 'delivery' ? offer.deliveryFee : 0),
      paymentMethod: deliveryMethod === 'delivery' ? 'Cash on delivery' : 'Cash on collection',
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? (address || '12 Kairaba Avenue, Serekunda') : undefined,
      collectionCode: deliveryMethod === 'collection' ? collectionCode : undefined,
      pickupLocation: deliveryMethod === 'collection' ? `${offer.dealerTown} Main Road Shop` : undefined,
      pickupOpeningHours: deliveryMethod === 'collection' ? 'Mon–Sat • 08:30–18:00' : undefined,
      dispatchReference: deliveryMethod === 'delivery' ? `KA-${Date.now().toString().slice(-4)}` : undefined,
      estimatedArrival: deliveryMethod === 'delivery' ? offer.estimatedFulfilment : undefined,
      status: deliveryMethod === 'delivery' ? 'pending' : 'ready_collection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Order confirmed',
          timestamp: 'Just now',
          completed: true
        },
        deliveryMethod === 'delivery'
          ? {
              title: 'Packed by dealer',
              timestamp: 'Pending dealer packaging',
              completed: false,
              current: true
            }
          : {
              title: 'Ready for collection',
              subtitle: `Show code ${collectionCode} at shop`,
              timestamp: 'Ready today',
              completed: true,
              current: true
            },
        deliveryMethod === 'delivery'
          ? {
              title: 'Out for delivery',
              timestamp: offer.estimatedFulfilment,
              completed: false
            }
          : {
              title: 'Collected by buyer',
              timestamp: 'Pending collection',
              completed: false
            },
        deliveryMethod === 'delivery'
          ? {
              title: 'Delivered',
              timestamp: 'Pending arrival',
              completed: false
            }
          : {
              title: 'Completed',
              timestamp: 'Pending receipt',
              completed: false
            }
      ]
    };

    // Mark offer accepted, other offers on this request declined
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) return { ...o, status: 'accepted' };
        if (o.requestId === offer.requestId) return { ...o, status: 'declined' };
        return o;
      })
    );

    if (req) {
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r))
      );
    }

    setOrders((prev) => [newOrder, ...prev]);

    addAuditLog(
      'ACCEPT_OFFER',
      `Order: ${newOrder.reference}`,
      `Accepted offer from ${offer.dealerName} for GMD ${newOrder.totalAmount} (${deliveryMethod}).`
    );

    return newOrder;
  };

  // Direct Order for listed part
  const createDirectOrder = (partId: string, quantity: number, deliveryMethod: DeliveryMethod, address?: string): Order => {
    const part = inventory.find((p) => p.id === partId);
    if (!part) throw new Error('Part not found');
    if (part.stock < quantity) throw new Error(`Insufficient stock. Only ${part.stock} available.`);

    const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0;
    const totalAmount = part.price * quantity + deliveryFee;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const collectionCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      reference: `PN-${orderNum}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      dealerId: part.dealerId,
      dealerName: part.dealerName,
      dealerPhone: part.dealerPhone,
      dealerTown: part.dealerTown,
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      partImage: part.imageUrl,
      condition: part.condition,
      unitPrice: part.price,
      quantity,
      deliveryFee,
      totalAmount,
      paymentMethod: deliveryMethod === 'delivery' ? 'Cash on delivery' : 'Cash on collection',
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? (address || '12 Kairaba Avenue, Serekunda') : undefined,
      collectionCode: deliveryMethod === 'collection' ? collectionCode : undefined,
      pickupLocation: deliveryMethod === 'collection' ? `${part.dealerTown} Main Road Shop` : undefined,
      pickupOpeningHours: deliveryMethod === 'collection' ? 'Mon–Sat • 08:30–18:00' : undefined,
      dispatchReference: deliveryMethod === 'delivery' ? `KA-${Date.now().toString().slice(-4)}` : undefined,
      estimatedArrival: deliveryMethod === 'delivery' ? 'Today • by 18:00' : undefined,
      status: deliveryMethod === 'delivery' ? 'pending' : 'ready_collection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Order confirmed',
          timestamp: 'Just now',
          completed: true
        },
        deliveryMethod === 'delivery'
          ? {
              title: 'Packed by dealer',
              timestamp: 'Pending dealer preparation',
              completed: false,
              current: true
            }
          : {
              title: 'Ready for collection',
              subtitle: `Show code ${collectionCode} at counter`,
              timestamp: 'Ready today',
              completed: true,
              current: true
            },
        deliveryMethod === 'delivery'
          ? {
              title: 'Out for delivery',
              timestamp: 'Estimated today',
              completed: false
            }
          : {
              title: 'Collected by buyer',
              timestamp: 'Pending collection',
              completed: false
            },
        deliveryMethod === 'delivery'
          ? {
              title: 'Delivered',
              timestamp: 'Pending delivery',
              completed: false
            }
          : {
              title: 'Order completed',
              timestamp: 'Pending receipt',
              completed: false
            }
      ]
    };

    // Decrement stock persistently
    setInventory((prev) =>
      prev.map((item) =>
        item.id === partId
          ? {
              ...item,
              stock: Math.max(0, item.stock - quantity),
              status: item.stock - quantity <= 0 ? 'out_of_stock' : item.stock - quantity <= 2 ? 'low_stock' : 'in_stock'
            }
          : item
      )
    );

    setOrders((prev) => [newOrder, ...prev]);

    addAuditLog(
      'PLACE_DIRECT_ORDER',
      `Order: ${newOrder.reference}`,
      `Purchased ${quantity}x ${part.name} for GMD ${totalAmount} from ${part.dealerName}.`
    );

    return newOrder;
  };

  // Update Order Status (for Dealer / Courier / Admin)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, dispatchRef?: string, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [...order.timeline];
        const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

        if (newStatus === 'packed') {
          const step = updatedTimeline.find((t) => t.title.includes('Packed'));
          if (step) {
            step.completed = true;
            step.subtitle = note || 'Packed and verified by dealer';
            step.timestamp = now;
          }
        } else if (newStatus === 'out_for_delivery') {
          const packStep = updatedTimeline.find((t) => t.title.includes('Packed'));
          if (packStep) packStep.completed = true;

          const outStep = updatedTimeline.find((t) => t.title.includes('Out for delivery'));
          if (outStep) {
            outStep.completed = true;
            outStep.current = true;
            outStep.subtitle = `Dispatched • Ref: ${dispatchRef || order.dispatchReference || 'KA-DISPATCH'}`;
            outStep.timestamp = now;
          }
        } else if (newStatus === 'delivered' || newStatus === 'collected') {
          updatedTimeline.forEach((t) => (t.completed = true));
          const last = updatedTimeline[updatedTimeline.length - 1];
          if (last) {
            last.completed = true;
            last.current = false;
            last.subtitle = 'Confirmed receipt';
            last.timestamp = now;
          }
        }

        return {
          ...order,
          status: newStatus,
          dispatchReference: dispatchRef || order.dispatchReference,
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline
        };
      })
    );

    addAuditLog('UPDATE_ORDER_STATUS', `Order: ${orderId}`, `Status changed to ${newStatus}.`);
  };

  // Admin Dealer Approvals
  const approveDealerApplication = (dealerId: string, notes?: string) => {
    setDealers((prev) =>
      prev.map((d) =>
        d.id === dealerId
          ? {
              ...d,
              status: 'approved',
              verified: true,
              verifiedAt: new Date().toISOString(),
              reviewNotes: notes || 'Verified with valid business registration and local address check.'
            }
          : d
      )
    );

    addAuditLog('APPROVE_DEALER', `Dealer: ${dealerId}`, `Administrator approved dealer application with verified status.`);
  };

  const rejectDealerApplication = (dealerId: string, reason: string) => {
    setDealers((prev) =>
      prev.map((d) =>
        d.id === dealerId
          ? {
              ...d,
              status: 'rejected',
              verified: false,
              reviewNotes: reason
            }
          : d
      )
    );

    addAuditLog('REJECT_DEALER', `Dealer: ${dealerId}`, `Administrator rejected application: ${reason}`);
  };

  // Dealer Inventory CRUD
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'updatedAt' | 'dealerId' | 'dealerName' | 'dealerTown' | 'dealerPhone'>) => {
    const activeDealer = dealers.find((d) => d.id === currentUser.dealerId) || dealers[0];
    const newItem: InventoryItem = {
      ...item,
      id: `part_${Date.now()}`,
      dealerId: activeDealer.id,
      dealerName: activeDealer.name,
      dealerTown: activeDealer.town,
      dealerPhone: activeDealer.phone,
      updatedAt: new Date().toISOString()
    };

    setInventory((prev) => [newItem, ...prev]);
    addAuditLog('ADD_INVENTORY', `Part: ${newItem.name}`, `Added new part ${newItem.name} priced at GMD ${newItem.price}.`);
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory((prev) =>
      prev.map((p) => (p.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : p))
    );
    addAuditLog('UPDATE_INVENTORY', `Part: ${item.name}`, `Updated part details and stock.`);
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory((prev) => prev.filter((p) => p.id !== itemId));
    addAuditLog('DELETE_INVENTORY', `Part: ${itemId}`, `Removed part from dealer inventory.`);
  };

  const resetAllData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTown('Serekunda');
    setVehicles(INITIAL_VEHICLES);
    setDealers(INITIAL_DEALERS);
    setInventory(INITIAL_INVENTORY);
    setRequests(INITIAL_REQUESTS);
    setOffers(INITIAL_OFFERS);
    setOrders(INITIAL_ORDERS);
    setSavedPartIds(['part_1', 'part_2', 'part_3', 'part_4']);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: INITIAL_USERS,
        activeTown,
        setActiveTown,
        vehicles,
        activeVehicle,
        setActiveVehicle,
        addVehicle,
        dealers,
        inventory,
        requests,
        offers,
        orders,
        auditLogs,
        savedPartIds,
        notifications,
        toggleSavedPart,
        createPartRequest,
        submitDealerOffer,
        acceptOffer,
        createDirectOrder,
        updateOrderStatus,
        approveDealerApplication,
        rejectDealerApplication,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
