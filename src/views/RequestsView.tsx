import React from 'react';
import { Plus, Volume2, Camera, Clock, CheckCircle2, ArrowRight, MessageSquare, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartRequest } from '../types';

interface RequestsViewProps {
  onOpenWizard: () => void;
  onCompareQuotes: (request: PartRequest) => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  onOpenWizard,
  onCompareQuotes
}) => {
  const { requests, currentUser } = useApp();

  // Mechanic's requests (or all if reviewing)
  const myRequests = requests.filter(
    (r) => currentUser.role === 'admin' || r.buyerId === currentUser.id || true
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400">Home / Requests</p>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Part Requests</h1>
          <p className="text-sm text-zinc-500">
            Track requested parts, listen to your audio notes, and compare dealer quotes.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="h-12 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Part Request</span>
        </button>
      </div>

      {/* Requests list */}
      {myRequests.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-3xl p-8">
          <Clock className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">No active requests</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Can't find a part in the listings? Submit a request with vehicle details and a voice note.
          </p>
          <button
            onClick={onOpenWizard}
            className="mt-4 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold"
          >
            Create first request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myRequests.map((req) => {
            const hasVoice = req.attachments.some((a) => a.type === 'audio');
            const hasPhoto = req.attachments.some((a) => a.type === 'image');
            const audioAtt = req.attachments.find((a) => a.type === 'audio');
            const photoAtt = req.attachments.find((a) => a.type === 'image');

            return (
              <div
                key={req.id}
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all space-y-4"
              >
                {/* Top Info Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-zinc-100 text-zinc-800 rounded-lg">
                      {req.reference}
                    </span>
                    <h3 className="text-base font-black text-zinc-950">{req.partName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.quotesCount > 0
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {req.status === 'quotes_received'
                        ? `${req.quotesCount} quotes received`
                        : req.status}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Vehicle Spec */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-zinc-500" /> Vehicle
                    </span>
                    <p className="font-bold text-zinc-900 text-sm">
                      {req.vehicleMake} {req.vehicleModel} ({req.vehicleYear})
                    </p>
                    <p className="text-zinc-500">{req.engine} · Preferred: {req.conditionPreference}</p>
                  </div>

                  {/* Notes & Symptoms */}
                  <div className="space-y-1 md:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Symptoms & Instructions
                    </span>
                    <p className="text-zinc-700 italic bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60 leading-relaxed">
                      "{req.notes}"
                    </p>
                  </div>

                  {/* Attachments preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Media Attachments
                    </span>
                    <div className="flex items-center gap-3">
                      {photoAtt && (
                        <div className="flex items-center gap-2 p-1.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                          <img
                            src={photoAtt.url}
                            alt="Ref"
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <span className="text-[11px] font-semibold text-zinc-700">Photo Ref</span>
                        </div>
                      )}

                      {audioAtt && (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-emerald-700" />
                          <div>
                            <p className="text-[11px] font-bold text-emerald-950">Voice Note</p>
                            <audio
                              controls
                              src={audioAtt.url}
                              className="h-6 w-36 mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">
                    Location: <strong className="text-zinc-900">{req.buyerLocation}</strong> · Preferred: {req.preferredFulfilment}
                  </p>

                  <div className="flex items-center gap-2">
                    {req.quotesCount > 0 ? (
                      <button
                        onClick={() => onCompareQuotes(req)}
                        className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>Compare {req.quotesCount} Quotes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">
                        Waiting for dealers to quote...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
