import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Bookmark,
  MessageSquare,
  Bell,
  UserCheck,
  Search,
  Shield,
  Briefcase,
  Wrench,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMBIAN_TOWNS } from '../data/mockData';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  const {
    currentUser,
    switchUser,
    availableUsers,
    activeTown,
    setActiveTown,
    savedPartIds,
    notifications
  } = useApp();

  const [townDropdownOpen, setTownDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      {/* Top Global Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Town Selector */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab(currentUser.role === 'admin' ? 'admin_dashboard' : currentUser.role === 'dealer' ? 'dealer_dashboard' : 'home')}
            className="flex items-center gap-1.5 focus:outline-none group text-left"
          >
            <span className="text-2xl font-black tracking-tight text-zinc-950 font-sans">
              partna<span className="text-emerald-500">.</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              The Gambia
            </span>
          </button>

          {/* Location dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTownDropdownOpen(!townDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1 px-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{activeTown}, The Gambia</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
            </button>

            {townDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Select Gambian Town
                </div>
                {GAMBIAN_TOWNS.map((town) => (
                  <button
                    key={town}
                    onClick={() => {
                      setActiveTown(town);
                      setTownDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                      activeTown === town
                        ? 'bg-zinc-100 font-semibold text-zinc-950'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{town}</span>
                    {activeTown === town && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation & Role Switcher */}
        <div className="flex items-center gap-3 sm:gap-5">
          {currentUser.role === 'mechanic' && (
            <button
              onClick={() => onSelectTab('saved')}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                currentTab === 'saved' ? 'text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline">Saved</span>
              {savedPartIds.length > 0 && (
                <span className="bg-zinc-100 text-zinc-800 text-xs px-1.5 py-0.2 rounded-full font-bold ml-0.5 border border-zinc-200">
                  {savedPartIds.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onSelectTab('messages')}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              currentTab === 'messages' ? 'text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Messages</span>
          </button>

          {/* Alerts */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <div className="relative">
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className="hidden md:inline">Alerts</span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Marketplace Alerts</span>
                  <span className="text-[11px] text-emerald-600 font-medium">Real-time</span>
                </div>
                <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto mt-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkTab) onSelectTab(n.linkTab);
                        setNotificationsOpen(false);
                      }}
                      className="py-2.5 px-2 hover:bg-zinc-50 rounded-xl cursor-pointer text-left transition-colors"
                    >
                      <p className="text-xs font-semibold text-zinc-900">{n.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{n.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account / Role Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setTownDropdownOpen(false);
              }}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white transition-all text-xs font-semibold text-zinc-800"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left leading-tight hidden sm:block">
                <span className="text-zinc-950 font-bold truncate max-w-[100px]">{currentUser.name}</span>
                <span className="text-[10px] text-zinc-500 capitalize">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'dealer' ? 'Dealer' : 'Mechanic'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-xs font-bold text-zinc-900">{currentUser.name}</p>
                  <p className="text-xs text-zinc-500">{currentUser.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-zinc-900 text-white">
                    {currentUser.role} Workspace
                  </span>
                </div>

                <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Switch Demo Persona
                </div>

                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u);
                      setRoleDropdownOpen(false);
                      if (u.role === 'admin') onSelectTab('admin_dashboard');
                      else if (u.role === 'dealer') onSelectTab('dealer_dashboard');
                      else onSelectTab('home');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                      currentUser.id === u.id ? 'bg-zinc-100/80 font-bold text-zinc-950' : 'text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-xs">
                        {u.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : u.role === 'dealer' ? <Briefcase className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{u.name}</p>
                        <p className="text-[10px] text-zinc-500 capitalize">{u.role} • {u.location}</p>
                      </div>
                    </div>
                    {currentUser.id === u.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Sub-Navigation Tabs */}
      <div className="border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentUser.role === 'mechanic' && (
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'search', label: 'Search' },
                { id: 'requests', label: 'Requests' },
                { id: 'orders', label: 'Orders' },
                { id: 'profile', label: 'Profile' },
                { id: 'categories', label: 'Categories' },
                { id: 'dealers', label: 'See dealers' },
                { id: 'garage', label: 'My garage' }
              ].map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-0.5 inline-block" />}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {currentUser.role === 'dealer' && (
            <div className="flex items-center justify-between py-2.5 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500" /> Dealer Workspace:
                </span>
                {[
                  { id: 'dealer_dashboard', label: 'Dashboard' },
                  { id: 'dealer_inventory', label: 'Inventory' },
                  { id: 'dealer_requests', label: 'Incoming Requests' },
                  { id: 'dealer_quotations', label: 'Offer Management' },
                  { id: 'dealer_orders', label: 'Orders & Fulfilment' },
                  { id: 'dealer_profile', label: 'Business Profile' }
                ].map((tab) => {
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onSelectTab(tab.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-0.5 inline-block" />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const mech = availableUsers.find((u) => u.role === 'mechanic') || availableUsers[0];
                  switchUser(mech);
                  onSelectTab('home');
                }}
                className="hidden lg:flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                Switch to buyer account ↗
              </button>
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="flex items-center justify-between py-2.5 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mr-2 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> Admin Oversight:
                </span>
                {[
                  { id: 'admin_dashboard', label: 'Dashboard' },
                  { id: 'admin_dealers', label: 'Dealer Approvals' },
                  { id: 'admin_users', label: 'Users' },
                  { id: 'admin_listings', label: 'Listings' },
                  { id: 'admin_requests', label: 'Requests' },
                  { id: 'admin_orders', label: 'Orders & Deliveries' },
                  { id: 'admin_audit', label: 'Audit Trail' }
                ].map((tab) => {
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onSelectTab(tab.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-0.5 inline-block" />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar (Mechanic mode) */}
      {currentUser.role === 'mechanic' && (
        <div className="bg-zinc-50 border-t border-zinc-200/80 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              className="w-full relative"
            >
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search part name or number (e.g. Front brake pads, Alternator, Oil filter...)"
                  className="w-full pl-11 pr-24 py-2.5 bg-white border border-zinc-200 rounded-full text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
