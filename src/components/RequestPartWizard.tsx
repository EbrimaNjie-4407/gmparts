import React, { useState } from 'react';
import { X, Camera, Mic, Check, ArrowRight, Car, Wrench, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';

interface RequestPartWizardProps {
  onClose: () => void;
  onRequestSubmitted: (requestId: string) => void;
}

export const RequestPartWizard: React.FC<RequestPartWizardProps> = ({
  onClose,
  onRequestSubmitted
}) => {
  const { createPartRequest, activeVehicle, currentUser, activeTown } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  // Form state
  const [vehicleMake, setVehicleMake] = useState(activeVehicle?.make || 'Toyota');
  const [vehicleModel, setVehicleModel] = useState(activeVehicle?.model || 'Corolla');
  const [vehicleYear, setVehicleYear] = useState(activeVehicle?.year || 2010);
  const [engine, setEngine] = useState(activeVehicle?.engine || '1.6 petrol');

  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [conditionPreference, setConditionPreference] = useState('OEM, aftermarket or tested used');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [preferredFulfilment, setPreferredFulfilment] = useState<'delivery' | 'collection' | 'either'>('either');

  const [attachments, setAttachments] = useState<
    { type: 'image' | 'audio'; name: string; url: string; size?: string; durationSeconds?: number }[]
  >([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddSampleImage = () => {
    setAttachments((prev) => [
      ...prev,
      {
        type: 'image',
        name: 'part_reference_sample.jpg',
        url: '/parts/alternator.jpg',
        size: '1.2 MB'
      }
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAttachments((prev) => [
            ...prev,
            {
              type: 'image',
              name: file.name,
              url: uploadEvent.target!.result as string,
              size: `${Math.round(file.size / 1024)} KB`
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceNoteRecorded = (audioData: {
    url: string;
    name: string;
    size: string;
    durationSeconds: number;
  }) => {
    setAttachments((prev) => [
      ...prev.filter((a) => a.type !== 'audio'),
      {
        type: 'audio',
        ...audioData
      }
    ]);
  };

  const handleClearVoiceNote = () => {
    setAttachments((prev) => prev.filter((a) => a.type !== 'audio'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!partName.trim()) {
      setErrorMsg('Please specify the part name you need.');
      return;
    }

    try {
      const req = createPartRequest({
        vehicleMake,
        vehicleModel,
        vehicleYear: Number(vehicleYear),
        engine,
        partName,
        partNumber,
        conditionPreference,
        notes: notes || 'Need quotation with warranty and confirmed fit.',
        quantity,
        preferredFulfilment,
        attachments
      });

      onRequestSubmitted(req.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Mechanic Part Sourcing
            </span>
            <h2 className="text-xl font-black text-zinc-950 mt-0.5">Request a Part</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-800 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Vehicle Information */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-zinc-700" /> Vehicle Identification
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Make</label>
                <input
                  type="text"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                  placeholder="Toyota"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                  placeholder="Corolla"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Year</label>
                <input
                  type="number"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                  placeholder="2010"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Engine / Fuel</label>
                <input
                  type="text"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                  placeholder="1.6 petrol"
                />
              </div>
            </div>
          </div>

          {/* Part Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">
                  Part Name or Description *
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Alternator 12V, Steering Rack, Brake Master..."
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">
                  Part Number (if visible on part)
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g. ALT-COR-16 or OE number"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">
                  Condition Preference
                </label>
                <select
                  value={conditionPreference}
                  onChange={(e) => setConditionPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                >
                  <option value="OEM, aftermarket or tested used">Any (OEM, aftermarket or tested used)</option>
                  <option value="New OEM only">New OEM Only</option>
                  <option value="New Aftermarket only">New Aftermarket Only</option>
                  <option value="Tested Used only">Tested Used Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">
                  Fulfilment Preference
                </label>
                <select
                  value={preferredFulfilment}
                  onChange={(e) => setPreferredFulfilment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                >
                  <option value="either">Delivery or Collection</option>
                  <option value="delivery">Dealer Delivery to Serekunda/Location</option>
                  <option value="collection">Shop Collection only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">
                Symptoms & Detailed Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Explain the vehicle problem or specific mounting connectors (e.g. Battery warning light is on when driving, need a tested unit with warranty...)"
                className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl focus:ring-1 focus:ring-zinc-950 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-zinc-700" /> Reference Photos
              </label>
              <span className="text-[11px] text-zinc-400">Photos of old part or label</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 bg-white border border-zinc-300 hover:border-zinc-500 rounded-xl text-xs font-semibold text-zinc-700 transition-colors shadow-2xs">
                <Camera className="w-4 h-4 text-zinc-500" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleAddSampleImage}
                className="text-xs text-zinc-600 hover:text-zinc-950 underline font-medium"
              >
                + Add sample part photo
              </button>
            </div>

            {/* Attachments preview */}
            {attachments.filter((a) => a.type === 'image').length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-200">
                {attachments
                  .filter((a) => a.type === 'image')
                  .map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-300 group"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setAttachments((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Voice Note Recording Component */}
          <VoiceNoteRecorder
            onAudioRecorded={handleVoiceNoteRecorded}
            onClearAudio={handleClearVoiceNote}
          />

          {/* Submission CTA */}
          <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">
              Your request will be routed to verified dealers in <strong className="text-zinc-900">{activeTown}</strong> and Greater Banjul Area.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <span>Submit Request to Dealers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
