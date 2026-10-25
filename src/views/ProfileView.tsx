import React from 'react';
import { User as UserIcon, Phone, MapPin, Shield, RefreshCw, Car, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, vehicles, resetAllData, activeTown, availableUsers, switchUser } = useApp();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Profile</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Account & Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage your personal contact details, verified vehicles, and active workspace.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xl font-black">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-zinc-950">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> {currentUser.phone}
              <span>·</span>
              <MapPin className="w-3.5 h-3.5" /> {activeTown}, The Gambia
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-5 space-y-4 text-xs">
          <h3 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
            Demo Environment & Persona Switcher
          </h3>
          <p className="text-zinc-500">
            Switch between mechanic, approved dealer, pending dealer, and administrator personas to test all role-based permissions and workflows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  currentUser.id === u.id
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900'
                }`}
              >
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className={`text-[11px] capitalize ${currentUser.id === u.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {u.role} · {u.location}
                  </p>
                </div>
                {currentUser.id === u.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="border-t border-zinc-100 pt-5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs text-zinc-900">Reset Demo Data</h4>
            <p className="text-[11px] text-zinc-500">
              Clear local storage cache and reload pristine Gambian test database.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all demo marketplace records to default?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
