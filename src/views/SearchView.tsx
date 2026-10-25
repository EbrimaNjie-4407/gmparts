import React, { useState, useMemo } from 'react';
import { Search, Filter, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartCard } from '../components/PartCard';
import { InventoryItem } from '../types';
import { GAMBIAN_TOWNS } from '../data/mockData';

interface SearchViewProps {
  onSelectPart: (part: InventoryItem) => void;
  initialQuery?: string;
  initialCategory?: string;
  onClearCategory?: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onSelectPart,
  initialQuery = '',
  initialCategory
}) => {
  const { inventory, activeVehicle } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [onlyFitsVehicle, setOnlyFitsVehicle] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'best' | 'price_asc' | 'price_desc'>('best');

  // Categories list from inventory
  const categories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [inventory]);

  const conditions = ['All', 'OEM', 'Aftermarket', 'New', 'Tested Used'];

  // Filter logic
  const filteredParts = useMemo(() => {
    return inventory.filter((part) => {
      // Must not be inactive
      if (part.status === 'inactive') return false;

      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = part.name.toLowerCase().includes(q);
        const matchesPn = (part.partNumber || '').toLowerCase().includes(q);
        const matchesDesc = part.description.toLowerCase().includes(q);
        const matchesDealer = part.dealerName.toLowerCase().includes(q);
        if (!matchesName && !matchesPn && !matchesDesc && !matchesDealer) return false;
      }

      // Category
      if (selectedCategory !== 'All' && part.category !== selectedCategory) {
        return false;
      }

      // Condition
      if (selectedCondition !== 'All' && part.condition !== selectedCondition) {
        return false;
      }

      // Town
      if (selectedTown !== 'All' && part.dealerTown !== selectedTown) {
        return false;
      }

      // Fits vehicle
      if (onlyFitsVehicle && activeVehicle) {
        const fits = part.compatibleVehicles.some(
          (v) =>
            v.toLowerCase().includes(activeVehicle.make.toLowerCase()) ||
            v.toLowerCase().includes(activeVehicle.model.toLowerCase())
        );
        if (!fits) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      // 'best' fit prioritizes in-stock and vehicle compatibility
      return b.stock - a.stock;
    });
  }, [inventory, query, selectedCategory, selectedCondition, selectedTown, onlyFitsVehicle, sortBy, activeVehicle]);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Search</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Find Parts</h1>
        <p className="text-sm text-zinc-500">
          Search inventory from verified spare-parts dealers across all Gambian commercial centres.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by part name, OEM number, vehicle, or dealer..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-1 focus:ring-zinc-950 focus:outline-none"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none"
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  Condition: {c}
                </option>
              ))}
            </select>

            {/* Town Filter */}
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none"
            >
              <option value="All">All Locations</option>
              {GAMBIAN_TOWNS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Fits vehicle toggle */}
            {activeVehicle && (
              <button
                type="button"
                onClick={() => setOnlyFitsVehicle(!onlyFitsVehicle)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  onlyFitsVehicle
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${onlyFitsVehicle ? 'text-white' : 'text-zinc-400'}`} />
                <span>Fits my {activeVehicle.model}</span>
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none"
            >
              <option value="best">Best Match & Availability</option>
              <option value="price_asc">Price: Low to High (GMD)</option>
              <option value="price_desc">Price: High to Low (GMD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Showing {filteredParts.length} spare parts across approved dealers</span>
        {(selectedCategory !== 'All' || selectedCondition !== 'All' || selectedTown !== 'All' || onlyFitsVehicle || query) && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('All');
              setSelectedCondition('All');
              setSelectedTown('All');
              setOnlyFitsVehicle(false);
            }}
            className="text-xs font-semibold text-zinc-900 underline hover:text-zinc-600"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Parts Grid */}
      {filteredParts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-3xl p-8">
          <p className="text-base font-bold text-zinc-800">No matching parts found</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Try adjusting your search query, selecting another category, or submit a request to let dealers source it for you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredParts.map((part) => (
            <PartCard key={part.id} part={part} onSelect={onSelectPart} />
          ))}
        </div>
      )}
    </div>
  );
};
