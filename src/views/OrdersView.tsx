import React, { useState } from 'react';
import { Package, Truck, Store, Clock, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface OrdersViewProps {
  onSelectOrder: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onSelectOrder }) => {
  const { orders, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'collected');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'collected');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Orders</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
          From shelf to workshop.
        </h1>
        <p className="text-sm text-zinc-500">
          Track parts in transit across The Gambia or manage shop collections.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Active · {activeOrders.length}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'past'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Past Orders · {pastOrders.length}
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-3xl p-8">
          <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">No {activeTab} orders</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            When you purchase listed parts or accept dealer offers, your orders and real-time delivery timelines will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isCollection = order.deliveryMethod === 'collection';
            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={order.partImage || '/parts/brake_pads.jpg'}
                      alt={order.partName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-500">{order.reference}</span>
                      <span className="text-[10px] text-zinc-400">·</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-zinc-950 group-hover:text-zinc-700 transition-colors">
                      {order.partName}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-0.5">
                      {order.dealerName} · {order.dealerTown} · {isCollection ? 'Shop Collection' : 'Dealer Delivery'}
                    </p>
                  </div>
                </div>

                {/* Right: Price & Status */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-zinc-950">
                      GMD {order.totalAmount.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        order.status === 'delivered' || order.status === 'collected'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>

                    <span className="text-xs font-bold text-zinc-900 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      <span>View order</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful note at bottom matching Figma */}
      <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-400">
        Need help with an order? Open its details to contact the dealer directly or arrange delivery adjustments.
      </div>
    </div>
  );
};
