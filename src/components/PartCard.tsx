import React from 'react';
import { Heart, Check, MapPin, ShieldCheck } from 'lucide-react';
import { InventoryItem } from '../types';
import { useApp } from '../context/AppContext';

interface PartCardProps {
  part: InventoryItem;
  onSelect: (part: InventoryItem) => void;
}

export const PartCard: React.FC<PartCardProps> = ({ part, onSelect }) => {
  const { savedPartIds, toggleSavedPart, activeVehicle } = useApp();
  const isSaved = savedPartIds.includes(part.id);

  const fitsCurrentVehicle = activeVehicle
    ? part.compatibleVehicles.some(
        (v) =>
          v.toLowerCase().includes(activeVehicle.make.toLowerCase()) ||
          v.toLowerCase().includes(activeVehicle.model.toLowerCase())
      )
    : false;

  return (
    <div
      onClick={() => onSelect(part)}
      className="group relative bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col"
    >
      {/* Image Container with Heart Button */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden flex items-center justify-center">
        <img
          src={part.imageUrl}
          alt={part.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedPart(part.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved
              ? 'bg-red-50 text-red-600 shadow-sm'
              : 'bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-950 shadow-2xs'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save part'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
        </button>

        {part.stock <= 2 && part.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Low stock · {part.stock} left
          </span>
        )}

        {part.stock === 0 && (
          <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Out of stock
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-zinc-950 group-hover:text-zinc-700 transition-colors line-clamp-1">
            {part.name}
          </h3>
          <p className="text-xs font-medium text-zinc-500 mt-0.5">
            {part.condition} · {part.partNumber || 'General fit'}
          </p>

          <div className="mt-2.5">
            <span className="text-lg font-black text-zinc-950">
              GMD {part.price.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-400" />
            <span className="truncate">{part.dealerName} · {part.dealerTown}</span>
          </p>
        </div>

        {/* Fitment Indicator */}
        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
          {fitsCurrentVehicle ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <Check className="w-3.5 h-3.5" /> Fits your {activeVehicle?.model}
            </span>
          ) : (
            <span className="text-[11px] text-zinc-400">
              Check vehicle fit
            </span>
          )}

          <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all">
            View →
          </span>
        </div>
      </div>
    </div>
  );
};
