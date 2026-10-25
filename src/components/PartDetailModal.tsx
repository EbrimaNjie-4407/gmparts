import React, { useState } from 'react';
import { X, Check, MapPin, ShieldCheck, Truck, Store, Phone, AlertTriangle, ArrowRight } from 'lucide-react';
import { InventoryItem, DeliveryMethod } from '../types';
import { useApp } from '../context/AppContext';

interface PartDetailModalProps {
  part: InventoryItem | null;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onOrderSuccess
}) => {
  const { createDirectOrder, currentUser, activeVehicle } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [fulfilmentMethod, setFulfilmentMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState('12 Kairaba Avenue, Serekunda');
  const [phone, setPhone] = useState(currentUser.phone || '+220 700 1234');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!part) return null;

  const deliveryFee = fulfilmentMethod === 'delivery' ? 150 : 0;
  const totalPrice = part.price * quantity + deliveryFee;

  const fitsCurrentVehicle = activeVehicle
    ? part.compatibleVehicles.some(
        (v) =>
          v.toLowerCase().includes(activeVehicle.make.toLowerCase()) ||
          v.toLowerCase().includes(activeVehicle.model.toLowerCase())
      )
    : false;

  const handleOrder = () => {
    setErrorMsg(null);
    if (part.stock < quantity) {
      setErrorMsg(`Sorry, only ${part.stock} items are currently available in stock.`);
      return;
    }
    if (fulfilmentMethod === 'delivery' && !address.trim()) {
      setErrorMsg('Please specify your delivery address in The Gambia.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = createDirectOrder(part.id, quantity, fulfilmentMethod, address);
      setIsSubmitting(false);
      onOrderSuccess(newOrder.id);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to place order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Part Listing Details
            </span>
            <h2 className="text-xl font-black text-zinc-950 mt-0.5">{part.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image & Key Badges */}
            <div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <img
                  src={part.imageUrl}
                  alt={part.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {fitsCurrentVehicle && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Confirmed fit for your {activeVehicle?.year} {activeVehicle?.make} {activeVehicle?.model}</span>
                </div>
              )}

              {/* Dealer Box */}
              <div className="mt-4 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-zinc-950">{part.dealerName}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-400" /> {part.dealerTown}, The Gambia
                    </p>
                  </div>
                  <a
                    href={`tel:${part.dealerPhone}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                </div>
              </div>
            </div>

            {/* Part Specs & Purchase Section */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-zinc-950">
                    GMD {part.price.toLocaleString()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    part.stock > 2 ? 'bg-emerald-50 text-emerald-700' : part.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {part.stock > 0 ? `${part.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Condition:</span>
                    <span className="font-semibold text-zinc-900">{part.condition}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Part Number:</span>
                    <span className="font-semibold text-zinc-900">{part.partNumber || 'Universal OE spec'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Category:</span>
                    <span className="font-semibold text-zinc-900">{part.category}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Warranty:</span>
                    <span className="font-semibold text-emerald-700">{part.warranty}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
                  {part.description}
                </p>

                {/* Fulfilment Method Choice */}
                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">
                    Fulfilment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfilmentMethod('delivery')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        fulfilmentMethod === 'delivery'
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <div className="text-left">
                        <p>Dealer Delivery</p>
                        <p className="text-[10px] opacity-80">+GMD 150</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfilmentMethod('collection')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        fulfilmentMethod === 'collection'
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <div className="text-left">
                        <p>Self Collection</p>
                        <p className="text-[10px] opacity-80">Free (GMD 0)</p>
                      </div>
                    </button>
                  </div>
                </div>

                {fulfilmentMethod === 'delivery' ? (
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                      Delivery Address in The Gambia
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 12 Kairaba Avenue, Serekunda"
                      className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="mt-3 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
                    <p className="font-semibold text-zinc-900">Pickup Location:</p>
                    <p>{part.dealerTown} Main Road Shop • Mon-Sat 08:30-18:00</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">A 6-digit pickup code will be generated upon order.</p>
                  </div>
                )}
              </div>

              {/* Total & Action */}
              <div className="mt-6 pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-zinc-500 font-medium">Total (Pay on {fulfilmentMethod === 'delivery' ? 'delivery' : 'collection'}):</span>
                  <span className="text-xl font-black text-zinc-950">GMD {totalPrice.toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  disabled={part.stock === 0 || isSubmitting}
                  onClick={handleOrder}
                  className="w-full h-13 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Processing order...</span>
                  ) : part.stock === 0 ? (
                    <span>Out of stock</span>
                  ) : (
                    <>
                      <span>Confirm Order ({fulfilmentMethod === 'delivery' ? 'Delivery' : 'Collection'})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
