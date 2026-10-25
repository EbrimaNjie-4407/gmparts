import React, { useState } from 'react';
import { X, Check, FileText, Image as ImageIcon, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { DealerProfile } from '../../types';
import { useApp } from '../../context/AppContext';

interface AdminApprovalReviewModalProps {
  dealer: DealerProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminApprovalReviewModal: React.FC<AdminApprovalReviewModalProps> = ({
  dealer,
  onClose,
  onSuccess
}) => {
  const { approveDealerApplication, rejectDealerApplication } = useApp();

  const [reviewNote, setReviewNote] = useState('Business details and uploaded document match.');
  const [nameChecked, setNameChecked] = useState(true);
  const [addressChecked, setAddressChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dealer) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    approveDealerApplication(dealer.id, reviewNote);
    setIsSubmitting(false);
    onSuccess();
  };

  const handleReject = () => {
    const reason = prompt('Please specify rejection reason or missing documents:');
    if (!reason) return;
    setIsSubmitting(true);
    rejectDealerApplication(dealer.id, reason);
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching Figma Page 48 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Admin workspace / Dealer approval review
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-2xl font-black text-zinc-950">{dealer.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                {dealer.status} · {dealer.registrationNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left 3 cols: Application details & documents */}
            <div className="md:col-span-3 space-y-5">
              {/* Application Details */}
              <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Application details</h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Contact person:</span>
                    <span className="font-semibold text-zinc-900">{dealer.ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Phone:</span>
                    <span className="font-semibold text-zinc-900">{dealer.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Address:</span>
                    <span className="font-semibold text-zinc-900">{dealer.address}, {dealer.town}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Registration:</span>
                    <span className="font-semibold text-zinc-900 font-mono">{dealer.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Submitted:</span>
                    <span className="font-semibold text-zinc-900">
                      {new Date(dealer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Submitted documents</h3>

                {/* PDF Document */}
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-700" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Business registration scan</p>
                      <p className="text-[11px] text-zinc-500">
                        {dealer.name} • {dealer.registrationNumber} • Registration scan.pdf (2.1 MB)
                      </p>
                    </div>
                  </div>
                  <a
                    href="/public/assets/aistudio/ui_04fd776e.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-800 flex items-center justify-center transition-colors block text-center"
                  >
                    Open document
                  </a>
                </div>

                {/* Shopfront Photo */}
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-zinc-700" />
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Shopfront photo</p>
                        <p className="text-[11px] text-zinc-500">Signage and shop entrance • 2.4 MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-16/9 rounded-lg overflow-hidden bg-zinc-200 border border-zinc-300">
                    <img
                      src={dealer.shopfrontImage || '/parts/hero_banner.jpg'}
                      alt="Shopfront"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 cols: Review Decision Controls matching Figma */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Review decision</h3>

                {/* Checkbox 1 */}
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nameChecked}
                    onChange={(e) => setNameChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900"
                  />
                  <span>Name matches registration ✓</span>
                </label>

                {/* Checkbox 2 */}
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressChecked}
                    onChange={(e) => setAddressChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900"
                  />
                  <span>Contact & shop address checked ✓</span>
                </label>

                {/* Review Note */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 block mb-1">Review note</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 text-xs bg-white border border-zinc-300 rounded-xl"
                  />
                </div>

                {/* Record notice */}
                <div className="p-3 bg-zinc-100 rounded-xl text-[11px] text-zinc-500 space-y-1">
                  <p className="font-bold text-zinc-800">Record every decision</p>
                  <p>
                    Approval publishes the verified badge and allows this dealer to list parts and quote on mechanic requests.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || !nameChecked || !addressChecked}
                    className="w-full h-12 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Approve Dealer</span>
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Reject & Request Corrections
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
