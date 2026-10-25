import React, { useState } from 'react';
import { X, Check, ShieldCheck, MapPin, Truck, Store, ArrowRight, Clock, Award } from 'lucide-react';
import { PartRequest, DealerOffer, DeliveryMethod } from '../types';
import { useApp } from '../context/AppContext';

interface QuotesComparisonModalProps {
  request: PartRequest | null;
  onClose: () => void;
  onOfferAccepted: (orderId: string) => void;
}

export const QuotesComparisonModal: React.FC<QuotesComparisonModalProps> = ({
  request,
  onClose,
  onOfferAccepted
}) => {
  const { offers, acceptOffer, currentUser } = useApp();
  const [selectedOffer, setSelectedOffer] = useState<DealerOffer | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState('12 Kairaba Avenue, Serekunda');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const relevantOffers = offers.filter((o) => o.requestId === request.id);

  const handleConfirmAccept = () => {
    if (!selectedOffer) return;
    try {
      setIsSubmitting(true);
      const newOrder = acceptOffer(selectedOffer.id, deliveryMethod, address);
      setIsSubmitting(false);
      onOfferAccepted(newOrder.id);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || 'Failed to accept offer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Dealer Quotations
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                {request.reference}
              </span>
            </div>
            <h2 className="text-xl font-black text-zinc-950 mt-0.5">
              Quotes for {request.partName} ({request.vehicleMake} {request.vehicleModel})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {relevantOffers.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">Waiting for Dealer Responses</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                Your request {request.reference} has been routed to verified dealers in Serekunda, Jeshwang, and Bakau. Quotations usually arrive within 10-30 minutes.
              </p>
            </div>
          ) : !selectedOffer ? (
            <div>
              <p className="text-xs text-zinc-500 mb-4">
                Compare price, warranty, and fulfilment estimates from responding Gambian dealers. Selecting an offer locks the price.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relevantOffers.map((offer) => {
                  const isAccepted = offer.status === 'accepted';
                  return (
                    <div
                      key={offer.id}
                      className="border border-zinc-200 hover:border-zinc-400 bg-white rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md relative"
                    >
                      {/* Badge if available */}
                      {offer.badge && (
                        <div className="mb-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                              offer.badge === 'Recommended'
                                ? 'bg-zinc-950 text-white'
                                : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                            }`}
                          >
                            {offer.badge}
                          </span>
                        </div>
                      )}

                      <div>
                        {/* Dealer Header */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900">{offer.dealerName}</span>
                          {offer.dealerVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-400" /> {offer.dealerTown}
                        </p>

                        {/* Price */}
                        <div className="mt-4">
                          <span className="text-2xl font-black text-zinc-950">
                            GMD {offer.partPrice.toLocaleString()}
                          </span>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {offer.condition} · {offer.stockAvailability}
                          </p>
                        </div>

                        {/* Fit Confirmation */}
                        <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{request.vehicleModel} {request.vehicleYear} • Confirmed fit</span>
                        </div>

                        {/* Details list */}
                        <div className="mt-3 space-y-1.5 text-xs">
                          <div className="flex justify-between py-1 border-b border-zinc-100">
                            <span className="text-zinc-500">Warranty:</span>
                            <span className="font-semibold text-zinc-900">{offer.warranty}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-zinc-100">
                            <span className="text-zinc-500">Fulfilment:</span>
                            <span className="font-semibold text-zinc-900">{offer.estimatedFulfilment}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-zinc-100">
                            <span className="text-zinc-500">Delivery Fee:</span>
                            <span className="font-semibold text-zinc-900">
                              {offer.deliveryFee > 0 ? `GMD ${offer.deliveryFee}` : 'Free'}
                            </span>
                          </div>
                        </div>

                        {offer.notes && (
                          <p className="mt-3 text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-lg italic">
                            "{offer.notes}"
                          </p>
                        )}
                      </div>

                      {/* Total & Action */}
                      <div className="mt-5 pt-3 border-t border-zinc-100">
                        <div className="flex justify-between items-baseline mb-3">
                          <span className="text-xs text-zinc-500 font-medium">Total:</span>
                          <span className="text-base font-black text-zinc-950">
                            GMD {offer.totalPrice.toLocaleString()}
                          </span>
                        </div>

                        {isAccepted ? (
                          <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-600" /> Accepted
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedOffer(offer)}
                            className="w-full h-11 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                          >
                            Select Offer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Selected Offer Checkout Screen */
            <div className="max-w-xl mx-auto space-y-5">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Selected Quote</span>
                <div className="flex justify-between items-baseline mt-1">
                  <h3 className="font-bold text-zinc-950 text-base">{selectedOffer.partTitle}</h3>
                  <span className="text-xl font-black text-zinc-950">GMD {selectedOffer.totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-zinc-500">{selectedOffer.dealerName} · {selectedOffer.dealerTown}</p>
              </div>

              {/* Fulfilment Choice */}
              <div>
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">
                  Delivery or Collection
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <div className="text-left">
                      <p>Dealer Delivery</p>
                      <p className="text-[10px] opacity-80">+GMD {selectedOffer.deliveryFee}</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('collection')}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      deliveryMethod === 'collection'
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <div className="text-left">
                      <p>Shop Collection</p>
                      <p className="text-[10px] opacity-80">Free (GMD 0)</p>
                    </div>
                  </button>
                </div>
              </div>

              {deliveryMethod === 'delivery' ? (
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Delivery Address in The Gambia
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12 Kairaba Avenue, Serekunda"
                    className="w-full px-3.5 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                    required
                  />
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600">
                  <p className="font-semibold text-zinc-900">Pickup Location:</p>
                  <p>{selectedOffer.dealerTown} Main Road Shop • Mon-Sat 08:30-18:00</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    A secure 6-digit collection code will be generated upon confirmation.
                  </p>
                </div>
              )}

              {/* Total Summary */}
              <div className="p-4 bg-zinc-100 rounded-2xl flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-700">Amount Due (Pay on {deliveryMethod}):</span>
                <span className="text-xl font-black text-zinc-950">
                  GMD {(selectedOffer.partPrice + (deliveryMethod === 'delivery' ? selectedOffer.deliveryFee : 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-xs font-semibold hover:bg-zinc-50"
                >
                  ← Back to Quotes
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmAccept}
                  className="px-8 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-98"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Order & Lock Price'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
