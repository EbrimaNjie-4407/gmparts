import React from 'react';
import { X, Check, Truck, Store, MapPin, Phone, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus, currentUser } = useApp();

  if (!order) return null;

  const isCollection = order.deliveryMethod === 'collection';

  const handleMarkReceived = () => {
    updateOrderStatus(order.id, isCollection ? 'collected' : 'delivered');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {isCollection ? 'Collection Ready' : 'Delivery Tracking'}
            </span>
            <h2 className="text-xl font-black text-zinc-950 mt-0.5">
              {isCollection ? 'Your part is waiting for you.' : 'Your part is on its way.'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {order.reference} · {order.partName} · {order.condition}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === 'delivered' || order.status === 'collected'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : order.status === 'out_for_delivery'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
              }`}
            >
              {order.status === 'out_for_delivery' && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left 3 cols: Status Timeline or Collection Point */}
            <div className="md:col-span-3 space-y-4">
              <div className="border border-zinc-200 rounded-2xl p-5 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
                  {isCollection ? 'Collection Progress' : 'Delivery Status Timeline'}
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                  {order.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                            step.completed
                              ? 'bg-zinc-950 border-zinc-950 text-white'
                              : 'bg-white border-zinc-300'
                          }`}
                        >
                          {step.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        <div>
                          <p className={`text-xs font-bold ${step.completed ? 'text-zinc-950' : 'text-zinc-400'}`}>
                            {step.title}
                          </p>
                          {step.subtitle && (
                            <p className="text-[11px] text-zinc-500 mt-0.5">{step.subtitle}</p>
                          )}
                          <p className="text-[10px] text-zinc-400 mt-0.5">{step.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isCollection && (
                <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 text-xs space-y-1.5">
                  <p className="font-bold text-zinc-900">Pickup Location Details:</p>
                  <p className="text-zinc-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {order.pickupLocation || `${order.dealerTown} Main Road Shop`}
                  </p>
                  <p className="text-zinc-500">Opening hours: {order.pickupOpeningHours || 'Mon–Sat • 08:30–18:00'}</p>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    Bring your phone and inspect the part condition before taking it away.
                  </p>
                </div>
              )}
            </div>

            {/* Right 2 cols: Delivery Details & Actions */}
            <div className="md:col-span-2 space-y-4">
              {/* Collection Code Box */}
              {isCollection && order.collectionCode && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Your Collection Code
                  </span>
                  <div className="text-3xl font-black text-zinc-950 tracking-wider my-2 font-mono">
                    {order.collectionCode}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Show this 6-digit code to the dealer at counter.
                  </p>
                </div>
              )}

              {/* Order Info Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  {isCollection ? 'Order Details' : 'Delivery Details'}
                </h4>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-zinc-400 text-[10px] block uppercase">Recipient</span>
                    <span className="font-semibold text-zinc-900">{order.buyerName}</span>
                  </div>

                  {!isCollection && (
                    <div>
                      <span className="text-zinc-400 text-[10px] block uppercase">Address</span>
                      <span className="font-semibold text-zinc-900">{order.deliveryAddress}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-zinc-400 text-[10px] block uppercase">Phone</span>
                    <span className="font-semibold text-zinc-900">{order.buyerPhone}</span>
                  </div>

                  {order.dispatchReference && (
                    <div>
                      <span className="text-zinc-400 text-[10px] block uppercase">Dispatch Reference</span>
                      <span className="font-semibold text-zinc-900 font-mono">{order.dispatchReference}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-200">
                    <span className="text-zinc-400 text-[10px] block uppercase">Amount Due</span>
                    <span className="text-xl font-black text-zinc-950">
                      GMD {order.totalAmount.toLocaleString()} cash
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href={`tel:${order.dealerPhone}`}
                    className="w-full h-11 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {order.dealerName}
                  </a>

                  {order.status !== 'delivered' && order.status !== 'collected' && (
                    <button
                      type="button"
                      onClick={handleMarkReceived}
                      className="w-full h-11 rounded-full bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirm {isCollection ? 'Picked Up' : 'Received'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
