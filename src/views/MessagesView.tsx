import React, { useState } from 'react';
import { Send, Phone, MapPin, CheckCheck, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesView: React.FC = () => {
  const { currentUser, dealers } = useApp();

  const [activeConversationDealerId, setActiveConversationDealerId] = useState<string>('dealer_1');
  const [messages, setMessages] = useState<
    { id: string; sender: 'me' | 'them'; text: string; time: string }[]
  >([
    {
      id: 'm1',
      sender: 'them',
      text: 'Good morning! We received your inquiry regarding the Corolla 2010 alternator. We have the tested 80A unit ready.',
      time: '09:30'
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Does it come with the original connector plug or do I need to splice it?',
      time: '09:42'
    },
    {
      id: 'm3',
      sender: 'them',
      text: 'It is a 100% direct plug & play OEM fit, no splicing required. Tested at 14.2V on our bench here at Kairaba Avenue.',
      time: '09:45'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const currentChatDealer = dealers.find((d) => d.id === activeConversationDealerId) || dealers[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'me' as const,
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_reply_${Date.now()}`,
          sender: 'them',
          text: `Noted, ${currentUser.name}! You can place the order directly through Partna or call us at ${currentChatDealer.phone}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400">Home / Messages</p>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Dealer Conversations</h1>
        <p className="text-sm text-zinc-500">
          Chat directly with approved spare-parts dealers to confirm fitment and delivery specifics.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-3 min-h-[520px]">
        {/* Left conversations list */}
        <div className="border-r border-zinc-100 bg-zinc-50/50 p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-2">
            Dealers
          </span>
          {dealers.slice(0, 4).map((d) => (
            <div
              key={d.id}
              onClick={() => setActiveConversationDealerId(d.id)}
              className={`p-3 rounded-2xl cursor-pointer transition-all ${
                activeConversationDealerId === d.id
                  ? 'bg-white border border-zinc-200 shadow-xs'
                  : 'hover:bg-zinc-100/70'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-xs text-zinc-900">{d.name}</h4>
                <span className="text-[10px] text-zinc-400">{d.town}</span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate mt-1">
                {d.id === activeConversationDealerId ? messages[messages.length - 1]?.text : 'Tap to open chat...'}
              </p>
            </div>
          ))}
        </div>

        {/* Right Chat Thread */}
        <div className="md:col-span-2 flex flex-col justify-between h-[520px]">
          {/* Thread header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
            <div>
              <h3 className="font-bold text-sm text-zinc-950">{currentChatDealer.name}</h3>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {currentChatDealer.address}, {currentChatDealer.town}
              </p>
            </div>
            <a
              href={`tel:${currentChatDealer.phone}`}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              title="Call dealer"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Messages body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-zinc-950 text-white rounded-br-none'
                        : 'bg-zinc-100 text-zinc-900 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 px-1">{m.time}</span>
                </div>
              );
            })}
          </div>

          {/* Input bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-100 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Message ${currentChatDealer.name}...`}
              className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
