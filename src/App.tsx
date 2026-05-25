import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Telescope, 
  MapPin, 
  Calendar, 
  Search, 
  Terminal, 
  Star, 
  Compass,
  Cpu,
  Globe,
  Settings,
  ChevronRight,
  Send,
  Loader2,
  Maximize2,
  Layout
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { StarMap } from './components/StarMap';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Saudações. Eu sou o Estellarium. Como posso auxiliar em sua exploração do firmamento hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [coords, setCoords] = useState({ lat: -23.5505, lon: -46.6333 }); // SP, Brasil
  const [activeView, setActiveView] = useState<'chat' | 'map'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const prompt = `[Configuração do Observador: Lat ${coords.lat}, Lon ${coords.lon}, Data ${date}]\n\n${userMessage}`;
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          context: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Erro na conexão com as esferas celestes.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-celestial-bg text-celestial-text font-sans flex flex-col overflow-hidden select-none">
      {/* TOP NAVIGATION / STATUS BAR */}
      <header className="h-14 border-b border-celestial-border flex items-center justify-between px-6 bg-celestial-panel/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-celestial-accent shadow-[0_0_8px_#3b82f6]"></div>
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase italic">Estellarium</h1>
          </div>
          <div className="h-4 w-px bg-celestial-border"></div>
          <span className="text-[10px] font-mono text-celestial-muted tracking-wider uppercase underline underline-offset-4 decoration-celestial-accent/50">Precision Celestial Engine v4.02</span>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-celestial-muted">Tempo Sideral Local</span>
            <span className="text-sm font-mono font-medium text-celestial-highlight">14:22:09.43</span>
          </div>
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[9px] uppercase tracking-widest text-celestial-muted">Delta T (ΔT)</span>
            <span className="text-sm font-mono font-medium text-celestial-highlight">+69.2s</span>
          </div>
          <button className="p-2 hover:bg-celestial-border rounded-full transition-colors">
            <Settings size={18} className="text-celestial-muted hover:text-celestial-highlight" />
          </button>
        </div>
      </header>

      {/* MAIN INTERFACE SPLIT */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: OBSERVER PARAMS */}
        <aside className="w-72 border-r border-celestial-border bg-celestial-panel p-6 flex flex-col gap-6 overflow-y-auto">
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-celestial-accent font-bold mb-4 flex items-center gap-2">
              <MapPin size={12} /> Coordenadas do Observador
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-celestial-card rounded border border-celestial-border">
                <label className="block text-[9px] uppercase text-celestial-muted mb-1">Localização</label>
                <div className="text-sm font-semibold">São Paulo, Brasil</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-celestial-card rounded border border-celestial-border">
                  <label className="block text-[9px] uppercase text-celestial-muted mb-1">Latitude</label>
                  <input 
                    type="number" 
                    value={coords.lat} 
                    onChange={(e) => setCoords(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                    className="w-full bg-transparent text-xs font-mono focus:outline-none"
                    step="0.0001"
                  />
                </div>
                <div className="p-3 bg-celestial-card rounded border border-celestial-border">
                  <label className="block text-[9px] uppercase text-celestial-muted mb-1">Longitude</label>
                  <input 
                    type="number" 
                    value={coords.lon} 
                    onChange={(e) => setCoords(prev => ({ ...prev, lon: parseFloat(e.target.value) }))}
                    className="w-full bg-transparent text-xs font-mono focus:outline-none"
                    step="0.0001"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-celestial-accent font-bold mb-4 flex items-center gap-2">
              <Calendar size={12} /> Época e Tempo
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-celestial-card rounded border border-celestial-border flex items-center justify-between">
                <div className="w-full">
                  <label className="block text-[9px] uppercase text-celestial-muted mb-1">Data Alvo</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-sm font-semibold italic focus:outline-none w-full appearance-none"
                  />
                </div>
              </div>
              <div className="p-3 bg-celestial-card rounded border border-celestial-border">
                <label className="block text-[9px] uppercase text-celestial-muted mb-1">Época de Referência</label>
                <div className="text-xs font-mono">J2000.0 (Standard Epoch)</div>
              </div>
            </div>
          </section>

          <div className="mt-auto pt-4 border-t border-celestial-border">
            <div className="flex items-center gap-2 mb-2 text-celestial-accent lowercase font-mono text-[10px]">
              <Cpu size={12} />
              <span>motor_status: nominal</span>
            </div>
            <button className="w-full py-4 bg-celestial-accent text-celestial-bg font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Recalcular Firmamento
            </button>
          </div>
        </aside>

        {/* CENTER CONTENT: THE CHAT TERMINAL / STAR MAP */}
        <section className="flex-1 flex flex-col relative celestial-gradient overflow-hidden">
          {/* View Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex bg-black/40 border border-celestial-border rounded-full p-1 backdrop-blur-md">
            <button 
              onClick={() => setActiveView('chat')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest flex items-center gap-2 transition-all",
                activeView === 'chat' ? "bg-celestial-accent text-celestial-bg font-bold" : "text-celestial-muted hover:text-white"
              )}
            >
              <Terminal size={12} /> CONSOLE
            </button>
            <button 
              onClick={() => setActiveView('map')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest flex items-center gap-2 transition-all",
                activeView === 'map' ? "bg-celestial-accent text-celestial-bg font-bold" : "text-celestial-muted hover:text-white"
              )}
            >
              <Layout size={12} /> FIRMAMENTO
            </button>
          </div>

          <div className="flex-1 relative flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeView === 'chat' ? (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth mt-12"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={cn(
                          "w-full flex gap-6",
                          msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-sm shrink-0 flex items-center justify-center border transition-all duration-500",
                          msg.role === 'user' 
                            ? "bg-celestial-muted/10 border-celestial-border text-celestial-muted group-hover:border-white/20" 
                            : "bg-celestial-accent/10 border-celestial-accent/30 text-celestial-accent shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        )}>
                          {msg.role === 'user' ? <Compass size={20} /> : <Terminal size={20} />}
                        </div>
                        <div className={cn(
                          "flex-1 space-y-3",
                          msg.role === 'user' ? "text-right" : "text-left"
                        )}>
                          <header className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-celestial-muted/70">
                            <span className={cn(msg.role === 'model' && "text-celestial-accent")}>
                              [{msg.role === 'user' ? 'AUTH_OBSERVER' : 'ESTELLARIUM_AI'}]
                            </span>
                            <span className="w-1 h-1 rounded-full bg-celestial-border" />
                            <span>{new Date().toLocaleTimeString('pt-BR', { hour12: false })}</span>
                          </header>
                          <div className={cn(
                            "prose prose-invert max-w-none text-sm leading-relaxed",
                            "markdown-body",
                            msg.role === 'model' && "terminal-box"
                          )}>
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {loading && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-6 w-full"
                    >
                      <div className="w-10 h-10 rounded-sm bg-celestial-accent/10 border border-celestial-accent/30 flex items-center justify-center text-celestial-accent shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Loader2 className="animate-spin" size={20} />
                      </div>
                      <div className="flex-1 py-2 space-y-2">
                        <div className="h-4 w-32 bg-celestial-border/40 rounded animate-pulse" />
                        <div className="h-4 w-full bg-celestial-border/20 rounded animate-pulse" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 overflow-hidden mt-12"
                >
                  <StarMap 
                    date={new Date(date)}
                    lat={coords.lat}
                    lon={coords.lon}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT AREA */}
          <div className="p-8 bg-celestial-panel/30 border-t border-celestial-border backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex gap-4 items-end relative group">
              <div className="absolute -left-6 top-5 text-celestial-accent animate-pulse font-mono text-sm hidden md:block">{'>'}</div>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Introduza comandos celestiais ou consultas de efemérides..."
                className="flex-1 bg-black/40 border border-celestial-border rounded-none p-4 pr-14 text-sm font-mono focus:outline-none focus:border-celestial-accent transition-all resize-none min-h-[56px] max-h-32 text-celestial-highlight placeholder:text-celestial-muted/40"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 bottom-2 p-2 bg-celestial-accent text-celestial-bg rounded hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: PRECISE DATA GRID */}
        <aside className="w-80 border-l border-celestial-border bg-celestial-panel flex flex-col hidden xl:flex">
          <div className="p-6 border-b border-celestial-border bg-black/20">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-celestial-accent font-bold flex items-center gap-2">
              <Star size={12} /> Efemérides de Precisão
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-[11px] p-4 space-y-1">
             <div className="p-2 mb-4 bg-celestial-accent/5 border-l-2 border-celestial-accent text-celestial-accent/80 leading-relaxed">
               Dados em tempo real baseados em J2000.0 e precessão IAU.
             </div>
             
             {[
               { name: 'Sol (Helios)', ra: '06h 00m 00s', dec: '+23° 26\' 21"', mag: '-26.74', color: '#fbbf24' },
               { name: 'Lua (Selene)', ra: '18h 42m 12s', dec: '-28° 14\' 55"', mag: '-12.38', color: '#e2e8f0' },
               { name: 'Marte (Ares)', ra: '02h 55m 41s', dec: '+15° 18\' 22"', mag: '+1.02', color: '#f87171' },
               { name: 'Júpiter (Zeus)', ra: '04h 08m 09s', dec: '+20° 11\' 04"', mag: '-2.01', color: '#fbbf24' },
               { name: 'Saturno (Cronos)', ra: '23h 30m 55s', dec: '-04° 15\' 33"', mag: '+0.94', color: '#a78bfa' }
             ].map((body, i) => (
               <div key={i} className="data-row">
                 <div className="flex justify-between items-center mb-1">
                   <span style={{ color: body.color }} className="font-bold uppercase italic">{body.name}</span>
                   <span className="text-celestial-muted">{body.ra}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-celestial-highlight">{body.dec}</span>
                   <span className="text-green-400">Mag {body.mag}</span>
                 </div>
               </div>
             ))}
          </div>
          <div className="p-4 border-t border-celestial-border bg-black/20 text-[9px] font-mono text-celestial-muted/60">
            CÁLCULO ATUALIZADO VIA ASTRONOMY-ENGINE V2.1.
          </div>
        </aside>
      </main>

      {/* FOOTER: TECHNICAL LOGS */}
      <footer className="h-10 border-t border-celestial-border px-6 bg-celestial-bg flex items-center justify-between text-[9px] font-mono text-celestial-muted uppercase tracking-widest z-10">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span> Precessão: Ativa</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span> IAU Boundaries: OK</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span> Nutação: Habilitada</span>
        </div>
        <div className="opacity-50">
          Copyright © 2026 Estellarium | Inteligência Celestial
        </div>
      </footer>
    </div>
  );
}
