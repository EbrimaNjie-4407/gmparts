import React, { useState } from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartCard } from '../components/PartCard';
import { InventoryItem } from '../types';

interface SavedPartsViewProps {
  onSelectPart: (part: InventoryItem) => void;
  onBrowseParts: () => void;
}

export const SavedPartsView: React.FC<SavedPartsViewProps> = ({
  onSelectPart,
  onBrowseParts
}) => {
  const { savedPartIds, inventory } = useApp();

  const [filter, setFilter] = useState<'all' | 'in_stock'>('all');

  const savedParts = inventory.filter((p) => savedPartIds.includes(p.id));
  const inStockSaved = savedParts.filter((p) => p.stock > 0);

  const displayedParts = filter === 'all' ? savedParts : inStockSaved;

  return (
    <div className="space-y-6 pb-12">
      {/* Title matching Figma Page 13 */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Saved parts</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Keep the good finds.</h1>
        <p className="text-sm text-zinc-500">
          Save verified vehicle spare parts to compare quotes or purchase when ready.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          All · {savedParts.length}
        </button>
        <button
          onClick={() => setFilter('in_stock')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filter === 'in_stock'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          In stock · {inStockSaved.length}
        </button>
      </div>

      {displayedParts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-3xl p-8">
          <Bookmark className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">No saved parts yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Click the heart icon on any spare part listing across the marketplace to save it here for later.
          </p>
          <button
            onClick={onBrowseParts}
            className="mt-4 px-6 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold"
          >
            Browse parts
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedParts.map((part) => (
              <PartCard key={part.id} part={part} onSelect={onSelectPart} />
            ))}
          </div>

          <button
            onClick={onBrowseParts}
            className="w-full h-13 rounded-full border border-zinc-300 hover:border-zinc-500 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <span>Browse more parts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
