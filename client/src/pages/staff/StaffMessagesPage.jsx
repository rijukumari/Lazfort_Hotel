import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import {
  MessageSquare,
  Search,
  Send,
  User,
  CheckCheck,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffMessagesPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [contacts] = useState([
    {
      id: 'c-01',
      name: 'Julian St. Clair',
      role: 'General Manager',
      status: 'online',
      avatar: 'JS',
      lastMessage: 'Ensure the Prince of Monaco helipad escort is verified.',
      lastTime: '10:42 AM',
      unread: 1,
    },
    {
      id: 'c-02',
      name: 'Svetlana Ivanova',
      role: 'Head Housekeeper',
      status: 'online',
      avatar: 'SI',
      lastMessage: 'Suite 801 turnover inspection completed with 100% score.',
      lastTime: '10:15 AM',
      unread: 0,
    },
    {
      id: 'c-03',
      name: 'Marco Bellini',
      role: 'Chief Engineer',
      status: 'offline',
      avatar: 'MB',
      lastMessage: 'Penthouse Jacuzzi hydro-pump tested and signed off.',
      lastTime: 'Yesterday',
      unread: 0,
    },
    {
      id: 'c-04',
      name: 'Henri Delacroix',
      role: 'Head Sommelier',
      status: 'online',
      avatar: 'HD',
      lastMessage: 'Vintage Dom Pérignon 2012 flutes prepped on trolley.',
      lastTime: 'Yesterday',
      unread: 0,
    },
  ]);

  const [activeContactId, setActiveContactId] = useState(contacts[0].id);
  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  const [messages, setMessages] = useState({
    'c-01': [
      { id: 'm-1', sender: 'Julian St. Clair', text: 'Good morning Sebastian. How is the Monaco Yacht delegation reception progressing?', time: '10:30 AM', isMe: false },
      { id: 'm-2', sender: 'Me', text: 'Good morning Monsieur St. Clair. All luggage tags verified. Rolls Royce limousine waiting at Port Hercule.', time: '10:35 AM', isMe: true },
      { id: 'm-3', sender: 'Julian St. Clair', text: 'Ensure the Prince of Monaco helipad escort is verified.', time: '10:42 AM', isMe: false },
    ],
    'c-02': [
      { id: 'm-4', sender: 'Svetlana Ivanova', text: 'Suite 801 turnover inspection completed with 100% score.', time: '10:15 AM', isMe: false },
    ],
    'c-03': [
      { id: 'm-5', sender: 'Marco Bellini', text: 'Penthouse Jacuzzi hydro-pump tested and signed off.', time: 'Yesterday', isMe: false },
    ],
    'c-04': [
      { id: 'm-6', sender: 'Henri Delacroix', text: 'Vintage Dom Pérignon 2012 flutes prepped on trolley.', time: 'Yesterday', isMe: false },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));

    setInputText('');
    showToast('Message Sent', `Dispatched to ${activeContact.name}.`, 'info');
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Staff & Department Messenger"
        subtitle="Encrypted real-time communication between executive management, concierges, engineering, and butlers."
        icon={MessageSquare}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/staff/communication/announcements')}
            >
              Palace Directives
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/staff/communication/notifications')}
            >
              My Notifications
            </Button>
          </div>
        }
      />

      {/* Chat Messenger Container */}
      <div className="luxury-card rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left 4 Cols: Contact List */}
        <div className="lg:col-span-4 border-r border-primary/10 dark:border-white/5 flex flex-col">
          <div className="p-4 border-b border-primary/10 dark:border-white/5 space-y-3">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white flex items-center justify-between">
              <span>Palace Directory</span>
              <span className="badge badge-gold font-mono text-[10px]">Encrypted</span>
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent" />
              <input
                type="text"
                placeholder="Search staff, GM, engineers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="luxury-input w-full pl-8 pr-3 py-1.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredContacts.map(c => {
              const isActive = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                    isActive
                      ? 'border-accent bg-accent/15 dark:bg-accent/20 shadow-sm'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold font-serif text-xs">
                        {c.avatar}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-charcoal-card dark:border-[#0c1424] ${
                        c.status === 'online' ? 'bg-emerald-400' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-xs text-primary dark:text-white block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-charcoal-muted dark:text-gray-400 block">
                        {c.role}
                      </span>
                      <p className="text-[11px] text-charcoal dark:text-gray-300 truncate max-w-[150px] mt-0.5">
                        {c.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-charcoal-muted dark:text-gray-400 block font-mono">
                      {c.lastTime}
                    </span>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-accent text-primary dark:text-[#080d19] font-bold text-[9px] flex items-center justify-center ml-auto mt-1">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Live Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-charcoal-bg/40 dark:bg-[#080d19]/40">
          {/* Header */}
          <div className="p-4 border-b border-primary/10 dark:border-white/5 flex items-center justify-between bg-charcoal-card dark:bg-[#0c1424]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold font-serif text-xs">
                {activeContact.avatar}
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                  {activeContact.name}
                </h4>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  {activeContact.role} • <span className="text-emerald-400">Active Station</span>
                </p>
              </div>
            </div>

            <span className="badge badge-gold font-mono text-[10px] flex items-center gap-1.5 px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Sovereign Channel
            </span>
          </div>

          {/* Messages Feed */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {(messages[activeContactId] || []).map(m => (
              <div
                key={m.id}
                className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                  m.isMe
                    ? 'bg-accent/20 border border-accent/40 text-primary dark:text-white rounded-br-none'
                    : 'bg-charcoal-card dark:bg-[#0c1424] border border-primary/10 dark:border-white/10 text-charcoal dark:text-gray-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <div className={`flex items-center gap-1 text-[9px] font-mono text-charcoal-muted dark:text-gray-400 ${
                    m.isMe ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{m.time}</span>
                    {m.isMe && <CheckCheck className="w-3 h-3 text-accent" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/10 dark:border-white/5 bg-charcoal-card dark:bg-[#0c1424] flex items-center gap-3">
            <input
              type="text"
              placeholder={`Message ${activeContact.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="luxury-input flex-1 px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Send}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffMessagesPage;

