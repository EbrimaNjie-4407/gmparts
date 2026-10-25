import React, { useState } from 'react';
import { MapPin, Phone, ShieldCheck, ArrowRight, Store, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DealerProfile, InventoryItem } from '../types';
import { PartCard } from '../components/PartCard';

interface DealersViewProps {
  onSelectPart: (part: InventoryItem) => void;
  onOpenRequestWizard: () => void;
  selectedDealerId?: string | null;
  onClearSelectedDealer?: () => void;
}

export const DealersView: React.FC<DealersViewProps> = ({
  onSelectPart,
  onOpenRequestWizard,
  selectedDealerId,
  onClearSelectedDealer
}) => {
  const { dealers, inventory, activeTown } = useApp();

  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [activeDealerId, setActiveDealerId] = useState<string | null>(selectedDealerId || null);

  const towns = ['All', 'Serekunda', 'Jeshwang', 'Latrikunda', 'Bambo', 'Bakau', 'Brikama'];

  // Approved dealers
  const approvedDealers = dealers.filter((d) => d.status === 'approved');

  const filteredDealers = approvedDealers.filter((d) => {
    if (locationFilter === 'All') return true;
    return d.town.toLowerCase() === locationFilter.toLowerCase();
  });

  const currentDealer = dealers.find((d) => d.id === activeDealerId);
  const dealerParts = inventory.filter((p) => p.dealerId === activeDealerId && p.status !== 'inactive');

  return (
    <div className="space-y-6 pb-12">
      {/* If viewing a single dealer's storefront */}
      {currentDealer ? (
        <div className="space-y-6">
          <button
            onClick={() => {
              setActiveDealerId(null);
              if (onClearSelectedDealer) onClearSelectedDealer();
            }}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1"
          >
            ← Back to all dealers
          </button>

          {/* Dealer Storefront Header */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center p-2">
                <img
                  src={currentDealer.logoUrl || '/dealers/burgi.jpg'}
                  alt={currentDealer.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-950">{currentDealer.name}</h1>
                  {currentDealer.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Dealer
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentDealer.address}, {currentDealer.town}</span>
                  <span>·</span>
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <a href={`tel:${currentDealer.phone}`} className="font-semibold hover:underline">
                    {currentDealer.phone}
                  </a>
                </p>

                <p className="text-xs text-zinc-400 mt-1">
                  Categories: {currentDealer.categories.join(' · ')} · Open until {currentDealer.openUntil}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={onOpenRequestWizard}
                className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
              >
                Request Part from Dealer
              </button>
            </div>
          </div>

          {/* Dealer's inventory */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-zinc-950">
                Active Store Inventory ({dealerParts.length})
              </h2>
              <span className="text-xs text-zinc-400">All prices in Gambian Dalasi (GMD)</span>
            </div>

            {dealerParts.length === 0 ? (
              <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-500">
                No active listings published yet by this dealer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dealerParts.map((part) => (
                  <PartCard key={part.id} part={part} onSelect={onSelectPart} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dealers Directory List matching Figma page 9 */
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400">Home / See dealers</p>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Dealers</h1>
            <p className="text-sm text-zinc-500">
              Browse approved physical spare-parts dealers with registered premises across The Gambia.
            </p>
          </div>

          {/* Location filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {towns.map((t) => (
              <button
                key={t}
                onClick={() => setLocationFilter(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  locationFilter === t
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Dealers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDealers.map((dealer) => {
              const partCount = inventory.filter((p) => p.dealerId === dealer.id).length;
              return (
                <div
                  key={dealer.id}
                  onClick={() => setActiveDealerId(dealer.id)}
                  className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Logo */}
                    <div className="aspect-16/10 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 p-4 flex items-center justify-center mb-4">
                      <img
                        src={dealer.logoUrl || '/dealers/burgi.jpg'}
                        alt={dealer.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <h3 className="font-bold text-base text-zinc-950 group-hover:text-zinc-700 transition-colors">
                      {dealer.name}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      Tel: {dealer.phone}
                    </p>

                    <p className="text-xs font-semibold text-zinc-900 mt-2">
                      {dealer.town}
                    </p>

                    <p className="text-xs text-zinc-400 mt-0.5">
                      {dealer.categories.slice(0, 2).join(' and ')} parts
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      ✓ Verified
                    </span>

                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-950 flex items-center gap-0.5 transition-colors">
                      <span>Inventory ({partCount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
