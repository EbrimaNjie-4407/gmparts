import React, { useState } from 'react';
import { Volume2, Camera, Car, Check, ArrowRight, ShieldCheck, X, Play, Pause, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PartRequest, PartCondition } from '../../types';

export const DealerRequestsView: React.FC = () => {
  const { requests, submitDealerOffer, currentUser, dealers } = useApp();

  const activeDealer = dealers.find((d) => d.id === currentUser.dealerId) || dealers[0];
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(requests[0] || null);
  const [isQuoting, setIsQuoting] = useState(false);

  // Quote form state
  const [partTitle, setPartTitle] = useState('');
  const [condition, setCondition] = useState<PartCondition>('Aftermarket');
  const [partPrice, setPartPrice] = useState(4800);
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [warranty, setWarranty] = useState('6 months');
  const [stockAvailability, setStockAvailability] = useState('2 in stock');
  const [estimatedFulfilment, setEstimatedFulfilment] = useState('Delivery tomorrow');
  const [notes, setNotes] = useState('Tested on bench, 14.2V output. Confirmed fit.');

  const handleOpenQuotation = (req: PartRequest) => {
    setSelectedRequest(req);
    setPartTitle(`${req.partName} for ${req.vehicleMake} ${req.vehicleModel}`);
    setIsQuoting(true);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    submitDealerOffer({
      requestId: selectedRequest.id,
      partTitle,
      condition,
      partPrice: Number(partPrice),
      deliveryFee: Number(deliveryFee),
      warranty,
      stockAvailability,
      estimatedFulfilment,
      notes
    });

    setIsQuoting(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="text-xs font-semibold text-zinc-400">Dealer workspace / Incoming requests</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Part Requests</h1>
        <p className="text-sm text-zinc-500">
          Listen to mechanic voice notes, inspect part photos, and submit competitive quotes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requests List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Requests Queue ({requests.length})
          </span>

          {requests.map((req) => {
            const isSelected = selectedRequest?.id === req.id;
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-md'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {req.reference}
                    </span>
                    <h4 className="font-black text-sm mt-0.5">{req.partName}</h4>
                    <p className={`text-xs ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {req.vehicleMake} {req.vehicleModel} · {req.buyerLocation}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {req.quotesCount} quoted
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Selected Request Details matching Figma Page 38 */}
        {selectedRequest ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950">{selectedRequest.partName} wanted.</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Request {selectedRequest.reference} · {selectedRequest.buyerName} · {selectedRequest.buyerLocation} ·{' '}
                    {new Date(selectedRequest.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <span className="self-start px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Open · {selectedRequest.quotesCount} dealers quoted
                </span>
              </div>

              {/* Photo & Audio Media */}
              <div className="space-y-4">
                {selectedRequest.attachments.filter((a) => a.type === 'image').length > 0 && (
                  <div>
                    <div className="aspect-16/9 max-h-72 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      <img
                        src={selectedRequest.attachments.find((a) => a.type === 'image')?.url || '/parts/alternator.jpg'}
                        alt="Buyer ref"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1.5 italic">
                      Buyer reference photo · Confirm connector and mounting points.
                    </p>
                  </div>
                )}

                {/* Voice Note Section */}
                {selectedRequest.attachments.some((a) => a.type === 'audio') && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">Mechanic Voice Recording</p>
                        <p className="text-[11px] text-emerald-700">Explaining symptom & part needs in detail</p>
                      </div>
                    </div>

                    <audio
                      controls
                      src={selectedRequest.attachments.find((a) => a.type === 'audio')?.url}
                      className="h-8 max-w-[220px]"
                    />
                  </div>
                )}
              </div>

              {/* Specs & Buyer Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs space-y-2">
                  <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Request details</h4>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Vehicle:</span>
                      <span className="font-semibold text-zinc-900">{selectedRequest.vehicleMake} {selectedRequest.vehicleModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Year / Engine:</span>
                      <span className="font-semibold text-zinc-900">{selectedRequest.vehicleYear} · {selectedRequest.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Part:</span>
                      <span className="font-semibold text-zinc-900">{selectedRequest.partName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Condition:</span>
                      <span className="font-semibold text-zinc-900">{selectedRequest.conditionPreference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fulfilment:</span>
                      <span className="font-semibold text-zinc-900 capitalize">{selectedRequest.preferredFulfilment}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Buyer's note</h4>
                    <p className="text-zinc-700 italic mt-2 leading-relaxed bg-white p-3 rounded-xl border border-zinc-200">
                      "{selectedRequest.notes}"
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenQuotation(selectedRequest)}
                      className="w-full h-12 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98"
                    >
                      Create Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Create Quotation Modal matching Figma Page 39 */}
      {isQuoting && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Dealer Workspace / Create Quotation
                </span>
                <h3 className="font-black text-lg text-zinc-950 mt-0.5">
                  Quote for {selectedRequest.reference}
                </h3>
              </div>
              <button onClick={() => setIsQuoting(false)} className="p-1.5 text-zinc-400 hover:text-zinc-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">Part Description *</label>
                <input
                  type="text"
                  value={partTitle}
                  onChange={(e) => setPartTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Aftermarket">Aftermarket</option>
                    <option value="OEM">OEM</option>
                    <option value="New">New</option>
                    <option value="Tested Used">Tested Used</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Stock Availability</label>
                  <input
                    type="text"
                    value={stockAvailability}
                    onChange={(e) => setStockAvailability(e.target.value)}
                    placeholder="e.g. 2 in stock"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Part Price (GMD) *</label>
                  <input
                    type="number"
                    value={partPrice}
                    onChange={(e) => setPartPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Delivery Fee (GMD)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 6 months"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Fulfilment Estimate</label>
                  <input
                    type="text"
                    value={estimatedFulfilment}
                    onChange={(e) => setEstimatedFulfilment(e.target.value)}
                    placeholder="e.g. Delivery tomorrow"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Dealer Notes for Mechanic</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="p-3 bg-zinc-100 rounded-xl flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-600">Total Quotation:</span>
                <span className="text-zinc-950 font-black">
                  GMD {(Number(partPrice) + Number(deliveryFee)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuoting(false)}
                  className="px-4 py-2 text-zinc-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-zinc-950 text-white rounded-full font-bold shadow-md"
                >
                  Submit Quote to Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
