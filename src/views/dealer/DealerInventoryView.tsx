import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, PartCondition } from '../../types';

interface DealerInventoryViewProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const DealerInventoryView: React.FC<DealerInventoryViewProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, currentUser, dealers } = useApp();

  const activeDealer = dealers.find((d) => d.id === currentUser.dealerId) || dealers[0];
  const dealerParts = inventory.filter((p) => p.dealerId === activeDealer.id);

  const [editingPart, setEditingPart] = useState<InventoryItem | null>(null);

  // Add Part Form State
  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('Brakes');
  const [condition, setCondition] = useState<PartCondition>('Aftermarket');
  const [price, setPrice] = useState(1500);
  const [stock, setStock] = useState(5);
  const [compatibleVehicles, setCompatibleVehicles] = useState('Toyota Corolla, Toyota Auris');
  const [warranty, setWarranty] = useState('6 months warranty');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/parts/brake_pads.jpg');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addInventoryItem({
      name,
      partNumber,
      category,
      condition,
      price: Number(price),
      stock: Number(stock),
      status: Number(stock) > 2 ? 'in_stock' : Number(stock) > 0 ? 'low_stock' : 'out_of_stock',
      compatibleVehicles: compatibleVehicles.split(',').map((v) => v.trim()),
      warranty,
      description: description || 'Genuine quality tested automotive spare part.',
      imageUrl
    });

    onCloseAddModal();
    setName('');
    setPartNumber('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPart) return;

    updateInventoryItem(editingPart);
    setEditingPart(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400">Dealer workspace / Inventory</p>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-zinc-500">
            Publish and manage active vehicle spare parts for your Gambian dealership.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-12 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Part</span>
        </button>
      </div>

      {/* Table matching Figma Page 64 */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Searchable Inventory Records ({dealerParts.length})
          </span>
          <span className="text-xs text-zinc-400">Currency: Gambian Dalasi (GMD)</span>
        </div>

        {dealerParts.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            No parts in your inventory. Click "Add Part" to create your first listing.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Part / Reference</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {dealerParts.map((part) => (
                  <tr key={part.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={part.imageUrl}
                          alt={part.name}
                          className="w-10 h-10 object-cover rounded-xl border border-zinc-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-zinc-950">
                            {part.name} {part.partNumber ? `· ${part.partNumber}` : ''}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {part.condition} · {part.category} · {part.compatibleVehicles.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-zinc-950 text-sm whitespace-nowrap">
                      GMD {part.price.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          part.stock > 2
                            ? 'bg-emerald-50 text-emerald-700'
                            : part.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {part.stock > 2
                          ? `In stock · ${part.stock} sets`
                          : part.stock > 0
                          ? `Low stock · ${part.stock}`
                          : 'Out of stock'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPart(part)}
                          className="text-xs font-bold text-zinc-900 hover:underline px-2 py-1"
                        >
                          Edit part →
                        </button>
                        <button
                          onClick={() => deleteInventoryItem(part.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg"
                          title="Delete part"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Part Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-black text-lg text-zinc-950">Add Spare Part</h3>
              <button onClick={onCloseAddModal} className="p-1.5 text-zinc-400 hover:text-zinc-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Part Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Front brake pads"
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Part Number</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. BP-COR-2010"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Brakes">Brakes</option>
                    <option value="Engine">Engine</option>
                    <option value="Filters">Filters</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Transmission">Transmission</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Aftermarket">Aftermarket</option>
                    <option value="OEM">OEM</option>
                    <option value="New">New</option>
                    <option value="Tested Used">Tested Used</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Price (GMD) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Compatible Vehicles (comma separated)</label>
                <input
                  type="text"
                  value={compatibleVehicles}
                  onChange={(e) => setCompatibleVehicles(e.target.value)}
                  placeholder="Toyota Corolla, Toyota Auris, Honda Civic..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Warranty Term</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 6 months warranty"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="px-4 py-2 text-zinc-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 text-white rounded-full font-bold"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Part Modal */}
      {editingPart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-black text-base text-zinc-950">Edit {editingPart.name}</h3>
              <button onClick={() => setEditingPart(null)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">Price (GMD)</label>
                <input
                  type="number"
                  value={editingPart.price}
                  onChange={(e) => setEditingPart({ ...editingPart, price: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={editingPart.stock}
                  onChange={(e) =>
                    setEditingPart({
                      ...editingPart,
                      stock: Number(e.target.value),
                      status: Number(e.target.value) > 2 ? 'in_stock' : Number(e.target.value) > 0 ? 'low_stock' : 'out_of_stock'
                    })
                  }
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPart(null)}
                  className="px-4 py-2 text-zinc-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-950 text-white rounded-full font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
