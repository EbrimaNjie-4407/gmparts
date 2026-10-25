import React from 'react';
import { Package, Inbox, Truck, DollarSign, Plus, ArrowRight, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DealerDashboardViewProps {
  onSelectTab: (tab: string) => void;
  onOpenAddPart: () => void;
}

export const DealerDashboardView: React.FC<DealerDashboardViewProps> = ({
  onSelectTab,
  onOpenAddPart
}) => {
  const { currentUser, dealers, inventory, requests, orders } = useApp();

  const activeDealer = dealers.find((d) => d.id === currentUser.dealerId) || dealers[0];

  const dealerInventory = inventory.filter((p) => p.dealerId === activeDealer.id);
  const activeOrders = orders.filter((o) => o.dealerId === activeDealer.id && o.status !== 'delivered' && o.status !== 'collected');
  const totalRevenue = orders
    .filter((o) => o.dealerId === activeDealer.id && (o.status === 'delivered' || o.status === 'collected'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const isPending = activeDealer.status === 'pending';

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Dealer Workspace / Dashboard
            </span>
            {activeDealer.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Dealer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Clock className="w-3.5 h-3.5" /> Application {activeDealer.status}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight mt-1">
            {activeDealer.name}
          </h1>
          <p className="text-sm text-zinc-500">
            {activeDealer.address}, {activeDealer.town} · Reg: {activeDealer.registrationNumber}
          </p>
        </div>

        {activeDealer.status === 'approved' && (
          <button
            onClick={onOpenAddPart}
            className="h-12 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Part</span>
          </button>
        )}
      </div>

      {/* Pending Approval Notice if not approved yet */}
      {isPending && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <h4 className="font-bold text-sm">Dealer Application Under Review (Ref: {activeDealer.registrationNumber})</h4>
            <p>
              Your business registration document is currently being reviewed by Partna administrators. You can explore the workspace, but listings cannot be published to the public search until verification is approved.
            </p>
            <p className="font-semibold text-amber-950 pt-1">
              Tip: Switch to the Partna Admin persona in the top right to review and approve this dealer application.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-zinc-950">{dealerInventory.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Parts in marketplace</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Open Requests</span>
            <Inbox className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-zinc-950">{requests.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Mechanics seeking parts</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Orders</span>
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-zinc-950">{activeOrders.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Requiring preparation/delivery</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fulfilled Volume</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-zinc-950">
            GMD {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Completed purchases</p>
        </div>
      </div>

      {/* Quick Action Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incoming Requests to Quote */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-zinc-950">Incoming Part Requests</h3>
            <button
              onClick={() => onSelectTab('dealer_requests')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1"
            >
              <span>View all ({requests.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {requests.slice(0, 2).map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectTab('dealer_requests')}
                className="p-3.5 bg-zinc-50 hover:bg-zinc-100/80 rounded-2xl border border-zinc-200/80 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-zinc-500">{r.reference}</span>
                    <h4 className="font-bold text-sm text-zinc-900 mt-0.5">{r.partName}</h4>
                    <p className="text-xs text-zinc-500">{r.vehicleMake} {r.vehicleModel} ({r.vehicleYear})</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Quote needed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Orders requiring fulfillment */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-zinc-950">Orders in Fulfilment</h3>
            <button
              onClick={() => onSelectTab('dealer_orders')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1"
            >
              <span>Manage orders ({activeOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No active orders pending fulfilment.</p>
            ) : (
              activeOrders.slice(0, 2).map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onSelectTab('dealer_orders')}
                  className="p-3.5 bg-zinc-50 hover:bg-zinc-100/80 rounded-2xl border border-zinc-200/80 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-zinc-500">{ord.reference}</span>
                      <h4 className="font-bold text-sm text-zinc-900 mt-0.5">{ord.partName}</h4>
                      <p className="text-xs text-zinc-500">Buyer: {ord.buyerName} · {ord.deliveryMethod}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-950">
                      GMD {ord.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
