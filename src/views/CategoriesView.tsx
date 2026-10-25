import React from 'react';
import { Disc, Cog, Filter, Activity, Zap, Wind, Eye, Settings, ArrowRight } from 'lucide-react';
import { PART_CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface CategoriesViewProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onSelectCategory }) => {
  const { inventory } = useApp();

  const iconMap: Record<string, any> = {
    Disc,
    Cog,
    Filter,
    Activity,
    Zap,
    Settings,
    Wind,
    Eye
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Categories</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Every part of your car.</h1>
        <p className="text-sm text-zinc-500">
          Explore vehicle components classified by automotive systems and serviced by Gambian suppliers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {PART_CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Cog;
          const count = inventory.filter((p) => p.category.toLowerCase().includes(cat.name.toLowerCase())).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-3xl p-5 text-left transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-800 flex items-center justify-center transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="font-bold text-base text-zinc-950 mt-4 group-hover:text-zinc-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {count > 0 ? `${count} active listings` : 'Sourced on demand'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-950">
                <span>View listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
