import React, { useState } from 'react';
import { ShieldCheck, Users, Package, Inbox, Truck, FileText, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DealerProfile } from '../../types';
import { AdminApprovalReviewModal } from './AdminApprovalReviewModal';

export const AdminDashboardView: React.FC = () => {
  const { dealers, inventory, requests, orders, auditLogs } = useApp();

  const [reviewingDealer, setReviewingDealer] = useState<DealerProfile | null>(null);

  const pendingDealers = dealers.filter((d) => d.status === 'pending');
  const approvedDealers = dealers.filter((d) => d.status === 'approved');

  const totalMarketplaceVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-zinc-400">Admin workspace / Dashboard</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Marketplace Administration</h1>
        <p className="text-sm text-zinc-500">
          Oversee Gambian dealer registrations, moderate listings, and monitor order fulfilments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pending Approvals</span>
          <div className="text-3xl font-black text-amber-600 mt-1">{pendingDealers.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Awaiting compliance verification</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Verified Dealers</span>
          <div className="text-3xl font-black text-zinc-950 mt-1">{approvedDealers.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Active across The Gambia</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Listings</span>
          <div className="text-3xl font-black text-zinc-950 mt-1">{inventory.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Live spare parts in catalog</p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Platform GMV</span>
          <div className="text-2xl font-black text-zinc-950 mt-1">
            GMD {totalMarketplaceVolume.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Total order throughput</p>
        </div>
      </div>

      {/* Dealer Approvals Table matching Figma Page 47 */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
              Dealer Applications & Approvals
            </h3>
            {pendingDealers.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {pendingDealers.length} need action
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400">Required for verified badge</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Business Name</th>
                <th className="py-3.5 px-6">Contact & Town</th>
                <th className="py-3.5 px-6">Reg Number</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {dealers.map((dealer) => {
                const isPending = dealer.status === 'pending';
                return (
                  <tr key={dealer.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={dealer.logoUrl || '/dealers/burgi.jpg'}
                            alt={dealer.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-950">{dealer.name}</p>
                          <p className="text-[11px] text-zinc-400">{dealer.address}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-zinc-900 font-semibold">{dealer.ownerName}</p>
                      <p className="text-[11px] text-zinc-500">{dealer.phone} · {dealer.town}</p>
                    </td>

                    <td className="py-4 px-6 font-mono text-zinc-600">
                      {dealer.registrationNumber}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          dealer.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dealer.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {dealer.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isPending ? (
                        <button
                          onClick={() => setReviewingDealer(dealer)}
                          className="px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                        >
                          Review Application →
                        </button>
                      ) : (
                        <button
                          onClick={() => setReviewingDealer(dealer)}
                          className="text-xs font-semibold text-zinc-500 hover:text-zinc-950"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Audit Trail */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
            Marketplace Audit Trail
          </h3>
          <span className="text-xs text-zinc-400">Immutable admin & transaction records</span>
        </div>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-200/60 px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                  <span className="font-semibold text-zinc-800">{log.target}</span>
                </div>
                <p className="text-zinc-500 mt-1">{log.details}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-zinc-400">
                  By {log.actorName} ({log.actorRole})
                </span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  {new Date(log.timestamp).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewingDealer && (
        <AdminApprovalReviewModal
          dealer={reviewingDealer}
          onClose={() => setReviewingDealer(null)}
          onSuccess={() => setReviewingDealer(null)}
        />
      )}
    </div>
  );
};
