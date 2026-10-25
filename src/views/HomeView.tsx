import React from 'react';
import { Search, ChevronDown, Check, ArrowRight, ShieldCheck, MapPin, Disc, Cog, Filter, Activity, Zap, Wind } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartCard } from '../components/PartCard';
import { InventoryItem } from '../types';
import { PART_CATEGORIES } from '../data/mockData';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onSelectPart: (part: InventoryItem) => void;
  onOpenRequestWizard: () => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectDealer: (dealerId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onSelectPart,
  onOpenRequestWizard,
  onSelectCategory,
  onSelectDealer
}) => {
  const { activeVehicle, inventory, dealers, activeTown } = useApp();

  // Filter parts for active vehicle
  const corollaParts = inventory.filter((p) =>
    p.compatibleVehicles.some(
      (v) =>
        v.toLowerCase().includes(activeVehicle?.make.toLowerCase() || 'toyota') ||
        v.toLowerCase().includes(activeVehicle?.model.toLowerCase() || 'corolla')
    )
  );

  const featuredDealers = dealers.filter((d) => d.status === 'approved').slice(0, 3);

  const categoryIcons: Record<string, any> = {
    Brakes: Disc,
    Engine: Cog,
    Filters: Filter,
    Suspension: Activity,
    Electrical: Zap,
    'Cooling & AC': Wind
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Welcome */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Home</p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          The right part. Closer to you.
        </h1>
        <p className="text-sm text-zinc-500">
          Find trusted spare parts for your next fix from verified Gambian dealers.
        </p>
      </div>

      {/* Hero Banner with Gambian Context */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-6 sm:p-10 shadow-lg border border-zinc-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url('/parts/hero_banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-800/80 border border-zinc-700 text-zinc-300">
            Spare Parts · Local Connections
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            EVERYTHING YOUR VEHICLE NEEDS,{' '}
            <span className="text-emerald-400">IN ONE PLACE.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300">
            Mechanics · Parts · Rapid Delivery in Serekunda, Jeshwang, Bakau & Brikama.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenRequestWizard}
              className="px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <span>Request a Part</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectTab('search')}
              className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <Search className="w-3.5 h-3.5 text-zinc-950" />
              <span>Buy Parts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Products / Categories, Right Context cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Categories & Picked for your car */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shop by Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-zinc-950 tracking-tight">Shop by category</h2>
              <button
                onClick={() => onSelectTab('categories')}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                View all categories →
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {['Brakes', 'Engine', 'Filters'].map((catName) => {
                const IconComponent = categoryIcons[catName] || Cog;
                return (
                  <button
                    key={catName}
                    onClick={() => {
                      onSelectCategory(catName);
                      onSelectTab('search');
                    }}
                    className="flex flex-col items-start p-4 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 rounded-2xl transition-all duration-150 text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5 text-zinc-800" />
                    </div>
                    <span className="font-bold text-sm text-zinc-950 mt-3">{catName}</span>
                    <span className="text-[11px] text-zinc-400">Available locally</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Picked for your Vehicle */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-zinc-950 tracking-tight">
                  Picked for your {activeVehicle?.model || 'Vehicle'}
                </h2>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {corollaParts.length} verified fits
                </span>
              </div>
              <button
                onClick={() => onSelectTab('search')}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950"
              >
                See all →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {corollaParts.slice(0, 4).map((part) => (
                <PartCard key={part.id} part={part} onSelect={onSelectPart} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Context Widgets */}
        <div className="space-y-5">
          {/* Active Garage Vehicle Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Vehicle</span>
                <h3 className="font-black text-base text-zinc-950 mt-0.5">
                  {activeVehicle?.make} {activeVehicle?.model} {activeVehicle?.year}
                </h3>
                <p className="text-xs text-zinc-500">{activeVehicle?.engine} · {activeVehicle?.registrationPlate}</p>
              </div>
              <button
                onClick={() => onSelectTab('garage')}
                className="text-xs font-semibold text-zinc-950 underline hover:text-zinc-700"
              >
                Change ∨
              </button>
            </div>
          </div>

          {/* "Can't find it? Ask for it." Card */}
          <div className="bg-zinc-950 text-white rounded-3xl p-6 shadow-md border border-zinc-800 space-y-3">
            <h3 className="text-lg font-black tracking-tight text-white">
              Can't find it? Ask for it.
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              One request. Quotes from local verified dealers. Voice notes & photos supported. Compare before you buy.
            </p>
            <button
              onClick={onOpenRequestWizard}
              className="w-full h-11 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-sm"
            >
              <span>Request a part ↗</span>
            </button>
          </div>

          {/* Dealers Near You */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-zinc-950">Dealers near you</h3>
              <button
                onClick={() => onSelectTab('dealers')}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950"
              >
                Explore dealers
              </button>
            </div>

            <div className="divide-y divide-zinc-200/60">
              {featuredDealers.map((d) => (
                <div
                  key={d.id}
                  onClick={() => onSelectDealer(d.id)}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors">
                      {d.name}
                    </span>
                    {d.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{d.town} · {d.distanceKm} km away · ★ {d.rating}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {d.categories.slice(0, 3).join(', ')} · Open until {d.openUntil}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab('dealers')}
              className="w-full py-2.5 rounded-full border border-zinc-300 hover:bg-white text-xs font-semibold text-zinc-800 transition-colors text-center block"
            >
              Explore all verified dealers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
