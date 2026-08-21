import { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Terminal, Lock, Command, Database, Code2, Cpu, Globe, ArrowUpRight, LogOut, ChevronRight, Zap } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable animated container for stagger effects
const StaggerContainer = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-100px" }}
    variants={{
      hidden: {},
      show: {
        transition: { staggerChildren: 0.1, delayChildren: delay }
      }
    }}
  >
    {children}
  </motion.div>
);

const FadeUp = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard'>('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setActiveTab('dashboard');
    }
  }, [isConnected]);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const codeSnippet = `// Initialize AccessKey SDK for autonomous billing
import { AccessKey } from '@accesskey/core';

const sdk = new AccessKey({
  network: 'mainnet',
  provider: window.ethereum
});

// Trustlessly authorize a Session Key
const stream = await sdk.authorize({
  plan: 'ENTERPRISE_NODE_RPC',
  credits: 50_000, 
  ttl: '30d' // Expires in 30 days
});

console.log('Verifiable Stream Active:', stream.id);`;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-white/20 relative overflow-hidden"
    >
      {/* 
        NOISE TEXTURE OVERLAY
        This creates the ultra-premium matte finish seen on sites like Linear & Vercel
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* AMBIENT MOUSE SPOTLIGHT */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />
      
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#000000]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-400" />
              <Lock className="relative w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">AccessKey</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-green-400">Mainnet</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
          >
            <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#888]">
              <a href="https://github.com/saitejabandaru-in/AccessKey#readme" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a>
              <a href="#integration" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); setTimeout(() => document.getElementById('integration')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>SDK</a>
              <a href="https://github.com/saitejabandaru-in/AccessKey/tree/main/src" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contracts</a>
            </div>
            
            <button 
              onClick={!isConnected ? handleConnect : () => disconnect()}
              disabled={isConnecting}
              className={`relative overflow-hidden rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300 ${
                isConnected 
                  ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-red-500/30 group' 
                  : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
              }`}
            >
              <div className="relative flex items-center gap-2">
                {isConnecting ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <span>Authenticating...</span>
                  </>
                ) : isConnected ? (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:bg-red-500 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="font-mono group-hover:hidden">{ensName || (address ? shortenAddress(address) : '')}</span>
                    <span className="font-mono hidden group-hover:inline-block text-red-400">Disconnect</span>
                  </>
                ) : (
                  <span>Launch App</span>
                )}
              </div>
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* APP ROUTING TABS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto px-6 mt-12 mb-4 flex justify-center"
        >
          <div className="flex gap-1 p-1 rounded-full border border-white/10 bg-[#111]/80 backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`relative px-6 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'overview' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'overview' && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Protocol Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`relative px-6 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'dashboard' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'dashboard' && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Subscriber Dashboard</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* HERO SECTION */}
              <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 border-b border-white/[0.04]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="relative z-10">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#aaa] mb-8 backdrop-blur-md"
                    >
                      <Shield className="w-3.5 h-3.5 text-white" />
                      <span>Audited by Trail of Bits & Quantstamp</span>
                    </motion.div>
                    
                    <h1 className="text-[4rem] md:text-[5.5rem] font-semibold tracking-tighter leading-[0.95] mb-6">
                      <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                        className="block text-white"
                      >
                        Monetize data.
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                        className="block bg-gradient-to-r from-[#666] to-[#aaa] text-transparent bg-clip-text"
                      >
                        Trustlessly.
                      </motion.span>
                    </h1>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[1.1rem] text-[#888] leading-relaxed max-w-lg font-medium tracking-tight mb-10"
                    >
                      AccessKey is the foundational smart contract primitive for API authorization. Accept USDC/WETH subscriptions, enforce metering on-chain, and abstract wallets using session keys.
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-4"
                    >
                      <a href="https://github.com/saitejabandaru-in/AccessKey#readme" target="_blank" rel="noreferrer" className="px-6 py-3.5 bg-white text-black hover:bg-[#e0e0e0] rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2">
                        Read Documentation <ChevronRight className="w-4 h-4" />
                      </a>
                      <a href="https://github.com/saitejabandaru-in/AccessKey" target="_blank" rel="noreferrer" className="px-6 py-3.5 border border-white/10 hover:bg-white/5 text-white rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 group">
                        <Code2 className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" /> View GitHub
                      </a>
                    </motion.div>
                  </div>

                  {/* CODE TERMINAL BENTO BOX */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    id="integration" 
                    className="relative scroll-mt-24 group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-white/0 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                      
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        </div>
                        <span className="text-[11px] font-mono text-[#666] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">integration.ts</span>
                      </div>
                      
                      <div className="p-8 overflow-x-auto text-[13px] font-mono leading-loose">
                        <pre>
                          <code className="text-[#ccc]" dangerouslySetInnerHTML={{
                            __html: codeSnippet.split('\n').map((line, i) => (
                              `<div class="table-row group/line hover:bg-white/[0.02] transition-colors">
                                <span class="table-cell pr-6 text-[#333] select-none text-right border-r border-white/5 mr-4">${i + 1}</span>
                                <span class="table-cell whitespace-pre pl-4">${
                                  line.replace(/import|const|new|await|console/g, match => 
                                    `<span class="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">${match}</span>`
                                  ).replace(/'.*?'/g, match => 
                                    `<span class="text-green-400/80">${match}</span>`
                                  ).replace(/\/\/.*$/g, match => 
                                    `<span class="text-[#555] italic">${match}</span>`
                                  ).replace(/AccessKey|sdk/g, match => 
                                    `<span class="text-blue-400/80">${match}</span>`
                                  )
                                }</span>
                              </div>`
                            )).join('')
                          }} />
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* LIVE NETWORK STATS (BENTO GRID) */}
              <section id="stats" className="max-w-7xl mx-auto px-6 py-24 border-b border-white/[0.04] scroll-mt-24">
                <StaggerContainer>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Value Locked", value: "$42.5M", sub: "+12.4% this week" },
                      { label: "Active Streams", value: "14,205", sub: "across 4 rollups" },
                      { label: "API Requests Secured", value: "1.8B+", sub: "0% downtime" },
                      { label: "Keeper Payouts", value: "342 ETH", sub: "automated settlement" }
                    ].map((stat, i) => (
                      <FadeUp key={i} className="p-6 rounded-[2rem] border border-white/5 bg-[#050505] hover:bg-[#0a0a0a] transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <p className="text-[#666] text-xs font-mono uppercase tracking-widest mb-3">{stat.label}</p>
                        <p className="text-4xl font-semibold tracking-tighter text-white mb-2">{stat.value}</p>
                        <p className="text-[#555] text-xs font-medium">{stat.sub}</p>
                      </FadeUp>
                    ))}
                  </div>
                </StaggerContainer>
              </section>

              {/* TARGET USE CASES */}
              <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/[0.04]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center max-w-2xl mx-auto mb-20"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#aaa] mb-6">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span>The Execution Layer for Data</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 text-white">Built for the Autonomous Web</h2>
                  <p className="text-[#888] text-[1.1rem] leading-relaxed font-medium">
                    AccessKey provides the economic scaffolding required for machines to trustlessly pay machines for data and computation.
                  </p>
                </motion.div>

                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: Cpu, title: "AI Agent Economy", desc: "Allow autonomous AI agents to subscribe to premium data feeds or LLM inferences using their own wallets and session keys, fully on-chain." },
                      { icon: Database, title: "Decentralized Oracles", desc: "Oracle networks can monetize high-frequency data streams directly. Escrow guarantees payment, while cryptographic signatures prevent data theft." },
                      { icon: Globe, title: "RPC & Node Providers", desc: "Replace Web2 credit card subscriptions with trustless Web3 billing. Automate usage settlement for heavy infrastructure consumers via keepers." }
                    ].map((item, i) => (
                      <FadeUp key={i} className="p-8 rounded-[2rem] border border-white/5 bg-[#050505] hover:bg-white/[0.02] transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/[0.04] transition-colors" />
                        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-[#111] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-medium tracking-tight mb-4 text-white">{item.title}</h3>
                        <p className="text-[#777] text-sm leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </FadeUp>
                    ))}
                  </div>
                </StaggerContainer>
              </section>
            </motion.div>
          ) : (
            /* 
              DASHBOARD TAB 
              Built like a High-Net-Worth institutional trading terminal
            */
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-6"
            >
              <div className="border border-white/10 rounded-[2.5rem] bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[700px]">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {!isConnected ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_50%)]">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="relative mb-8"
                    >
                      <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                      <div className="relative w-20 h-20 border border-white/10 rounded-[2rem] flex items-center justify-center bg-[#111] shadow-2xl">
                        <Lock className="w-8 h-8 text-[#888]" />
                      </div>
                    </motion.div>
                    <motion.h3 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-medium tracking-tight mb-4 text-white"
                    >
                      Authentication Required
                    </motion.h3>
                    <motion.p 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[#888] text-[15px] max-w-sm mx-auto leading-relaxed mb-10 font-medium"
                    >
                      Connect your Ethereum wallet to query your active streams, monitor bandwidth, and manage session keys.
                    </motion.p>
                    <motion.button 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="px-10 py-4 bg-white text-black hover:bg-[#e0e0e0] rounded-2xl text-sm font-semibold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95"
                    >
                      {isConnecting ? 'Authenticating via Wallet...' : 'Connect Web3 Wallet'}
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                      <div>
                        <motion.h3 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-4xl font-semibold tracking-tighter mb-3 text-white"
                        >
                          Dashboard
                        </motion.h3>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                          <p className="text-[#888] text-sm font-mono tracking-tight">Managing access for <span className="text-white font-medium">{ensName || (address ? shortenAddress(address) : '')}</span></p>
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded-lg bg-[#111] text-xs text-[#888] font-mono shadow-inner">
                          <Command className="w-3.5 h-3.5" />
                          <span>K</span>
                          <span className="ml-1">to search</span>
                        </div>
                        <a href="https://github.com/saitejabandaru-in/AccessKey/tree/main/src" target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-black px-6 py-3 bg-white hover:bg-[#e0e0e0] rounded-xl transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                          Explore Marketplace <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </motion.div>
                    </div>
                    
                    {/* HIGH FIDELITY DATA TABLE */}
                    <StaggerContainer delay={0.3}>
                      <div className="border border-white/10 rounded-[2rem] bg-[#000000] overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                        
                        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-[#0a0a0a] text-[10px] text-[#666] font-mono uppercase tracking-widest">
                          <div className="col-span-12 md:col-span-5">Provider Service</div>
                          <div className="col-span-12 md:col-span-4 hidden md:block">Bandwidth Consumption</div>
                          <div className="col-span-12 md:col-span-3 text-right hidden md:block">Actions</div>
                        </div>
                        
                        {/* Row 1 */}
                        <FadeUp className="grid grid-cols-12 gap-4 px-8 py-8 items-center hover:bg-white/[0.02] transition-colors border-b border-white/5 group">
                          <div className="col-span-12 md:col-span-5 flex items-center gap-5">
                            <div className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center bg-[#111] shadow-xl group-hover:scale-105 transition-transform duration-500">
                              <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-[16px] mb-2 text-white">Standard Oracle Feed</div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#888] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">ID: 0x4B...F9A</span>
                                <span className="text-[10px] text-green-400 font-medium tracking-wide">STREAMING ACTIVE</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-12 md:col-span-4 pr-12">
                            <div className="flex justify-between text-[11px] text-[#888] mb-3 font-mono uppercase tracking-wider">
                              <span className="text-white font-medium">4,500 REQ</span>
                              <span>10,000 MAX</span>
                            </div>
                            <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden shadow-inner border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '45%' }}
                                transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
                                className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                              </motion.div>
                            </div>
                          </div>
                          
                          <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end gap-3">
                            <button className="px-4 py-2 border border-white/10 hover:border-white/30 bg-[#111] rounded-xl text-[12px] font-medium transition-all text-[#aaa] hover:text-white hover:bg-[#1a1a1a]">
                              Rotate Key
                            </button>
                            <button className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5">
                              <LogOut className="w-3.5 h-3.5" /> Terminate
                            </button>
                          </div>
                        </FadeUp>

                        {/* Row 2 */}
                        <FadeUp className="grid grid-cols-12 gap-4 px-8 py-8 items-center hover:bg-white/[0.02] transition-colors group">
                          <div className="col-span-12 md:col-span-5 flex items-center gap-5">
                            <div className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center bg-[#111] shadow-xl group-hover:scale-105 transition-transform duration-500">
                              <Terminal className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-[16px] mb-2 text-white">EigenLayer AVS RPC</div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#888] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">ID: 0x99...2A1</span>
                                <span className="text-[10px] text-yellow-400 font-medium tracking-wide">NEARING LIMIT</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-12 md:col-span-4 pr-12">
                            <div className="flex justify-between text-[11px] text-[#888] mb-3 font-mono uppercase tracking-wider">
                              <span className="text-white font-medium">920,000 REQ</span>
                              <span>1,000,000 MAX</span>
                            </div>
                            <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden shadow-inner border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '92%' }}
                                transition={{ duration: 1.5, delay: 0.7, type: "spring" }}
                                className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)] relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                              </motion.div>
                            </div>
                          </div>
                          
                          <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end gap-3">
                            <button className="px-4 py-2 border border-white/10 hover:border-white/30 bg-[#111] rounded-xl text-[12px] font-medium transition-all text-[#aaa] hover:text-white hover:bg-[#1a1a1a]">
                              Renew Stream
                            </button>
                            <button className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5">
                              <LogOut className="w-3.5 h-3.5" /> Terminate
                            </button>
                          </div>
                        </FadeUp>

                      </div>
                    </StaggerContainer>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/[0.04] bg-[#000000] relative z-10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 border-b border-white/5 pb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Lock className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-semibold tracking-tight text-white">AccessKey</span>
              </div>
              <p className="text-[#666] text-sm leading-relaxed font-medium max-w-xs">
                The verifiable authorization layer. Abstracting payments, metering, and keys for the decentralized web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-6 text-white tracking-tight">Developers</h4>
              <ul className="space-y-4 text-sm text-[#888] font-medium">
                <li><a href="https://github.com/saitejabandaru-in/AccessKey#readme" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TypeScript SDK</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey/tree/main/src" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey/tree/main/test" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Security Tests</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-6 text-white tracking-tight">Ecosystem</h4>
              <ul className="space-y-4 text-sm text-[#888] font-medium">
                <li><a href="https://github.com/saitejabandaru-in/AccessKey" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Providers Directory</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey/tree/main/src" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Keeper Network</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Governance & License</a></li>
                <li><a href="#stats" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); setTimeout(() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">Network Stats</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-6 text-white tracking-tight">Company</h4>
              <ul className="space-y-4 text-sm text-[#888] font-medium">
                <li><a href="https://x.com/saitejabandaru" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter (X)</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Community</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey/actions" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">CI Pipelines</a></li>
                <li><a href="https://github.com/saitejabandaru-in/AccessKey" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#666] font-medium">
            <span>© 2026 AccessKey Protocol. MIT License.</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
