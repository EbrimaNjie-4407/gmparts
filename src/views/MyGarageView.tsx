import React, { useState } from 'react';
import { Car, Plus, Check, Star, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';

export const MyGarageView: React.FC = () => {
  const { vehicles, activeVehicle, setActiveVehicle, addVehicle } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2015);
  const [engine, setEngine] = useState('');
  const [plate, setPlate] = useState('');

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model) return;

    addVehicle({
      make,
      model,
      year: Number(year),
      engine: engine || '2.0 petrol',
      registrationPlate: plate || 'BJL 1234 A'
    });

    setIsAdding(false);
    setMake('');
    setModel('');
    setPlate('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400">Home / My garage</p>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Your Garage</h1>
          <p className="text-sm text-zinc-500">
            Manage your vehicles to verify fitment and get personalized spare parts recommendations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="h-11 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Add Vehicle Form */}
      {isAdding && (
        <form onSubmit={handleAddCar} className="p-6 bg-zinc-50 border border-zinc-200 rounded-3xl space-y-4 animate-in fade-in">
          <h3 className="font-bold text-base text-zinc-900">Add Vehicle to Garage</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Make</label>
              <input
                type="text"
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Model</label>
              <input
                type="text"
                placeholder="e.g. Corolla"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Engine / Spec</label>
              <input
                type="text"
                placeholder="e.g. 1.6 petrol"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-950 text-white rounded-full text-xs font-bold"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      )}

      {/* Vehicles List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vehicles.map((veh) => {
          const isActive = activeVehicle?.id === veh.id;
          return (
            <div
              key={veh.id}
              className={`rounded-3xl p-6 border transition-all ${
                isActive
                  ? 'bg-white border-zinc-950 shadow-md ring-2 ring-zinc-950/10'
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <Car className="w-5 h-5 text-zinc-800" />
                </div>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Primary Fit
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveVehicle(veh)}
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-950 underline"
                  >
                    Set as active
                  </button>
                )}
              </div>

              <h3 className="text-lg font-black text-zinc-950">
                {veh.make} {veh.model}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Year {veh.year} · {veh.engine}
              </p>
              {veh.registrationPlate && (
                <p className="text-[11px] font-mono text-zinc-400 mt-2">
                  Reg: {veh.registrationPlate}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
