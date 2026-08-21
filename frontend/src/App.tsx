import { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Terminal, ArrowRight, CheckCircle2, Lock, Command, Zap, Layers, BarChart3, Database } from 'lucide-react';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1200);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-white/20 relative overflow-hidden"
    >
      {/* Dynamic Ambient Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-400" />
              <Lock className="relative w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">AccessKey</span>
            <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#888] backdrop-blur-md">
              v3.0.0
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#888]">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Protocol</a>
              <a href="#" className="hover:text-white transition-colors">Governance</a>
            </div>
            
            <button 
              onClick={!isConnected ? handleConnect : () => setIsConnected(false)}
              disabled={isConnecting}
              className={`relative overflow-hidden rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-300 ${
                isConnected 
                  ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10' 
                  : 'bg-white text-black hover:scale-[1.02] active:scale-95'
              }`}
            >
              <div className="relative flex items-center gap-2">
                {isConnecting ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <span>Connecting...</span>
                  </>
                ) : isConnected ? (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="font-mono">saiteja.eth</span>
                  </>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#aaa] mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Introducing Session Keys for seamless automation</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
          
          <h1 className="text-[4rem] md:text-[5.5rem] font-semibold tracking-tighter leading-[0.95] mb-8 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
            Verifiable API <br /> Access Layer.
          </h1>
          <p className="text-[1.1rem] text-[#888] leading-relaxed max-w-xl font-medium tracking-tight">
            The cryptographic authorization standard for data providers. Trustless metering, native stablecoin settlements, and session-key abstraction.
          </p>
          
          {/* Custom Animated Tabs */}
          <div className="mt-12 flex gap-1 p-1 w-fit rounded-lg border border-white/10 bg-[#111]/50 backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`relative px-6 py-2 rounded-md text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'overview' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'overview' && (
                <div className="absolute inset-0 bg-white rounded-md shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Explore Plans</span>
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`relative px-6 py-2 rounded-md text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'dashboard' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'dashboard' && (
                <div className="absolute inset-0 bg-white rounded-md shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Manage Subscriptions</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Bento Grid layout for plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Plan 1 */}
              <div className="group relative rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-10 hover:border-white/15 transition-all duration-500 overflow-hidden min-h-[440px] flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[11px] font-mono text-[#888] uppercase tracking-widest border border-white/10 rounded-full px-3 py-1">Standard</span>
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-[#111] flex items-center justify-center">
                      <Database className="w-4 h-4 text-[#888]" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-medium tracking-tight mb-3">Oracle Feed</h3>
                  <p className="text-[#888] text-[15px] leading-relaxed max-w-[280px]">
                    High-fidelity historical data endpoints. Ideal for indexing and standard analytics workflows.
                  </p>
                </div>
                
                <div className="relative z-10 mt-12 border-t border-white/10 pt-8">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-medium tracking-tighter">49</span>
                    <span className="text-[#888] pb-1 font-medium text-sm tracking-tight">USDC / mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-10">
                    <div className="flex items-center gap-3 text-sm text-[#aaa]">
                      <CheckCircle2 className="w-4 h-4 text-white/40" />
                      <span>10,000 requests per month</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#aaa]">
                      <CheckCircle2 className="w-4 h-4 text-white/40" />
                      <span>L2 Settlement optimization</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:border-white/30">
                    Initialize Stream <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </button>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="group relative rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-10 hover:border-white/20 transition-all duration-500 overflow-hidden min-h-[440px] flex flex-col justify-between shadow-2xl">
                {/* Subtle gradient orb for enterprise */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/[0.05] rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[11px] font-mono text-white bg-white/10 uppercase tracking-widest border border-white/20 rounded-full px-3 py-1">Enterprise</span>
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-white flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-black" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-medium tracking-tight mb-3 text-white">High-Frequency Node</h3>
                  <p className="text-[#aaa] text-[15px] leading-relaxed max-w-[280px]">
                    Unrestricted mempool access and advanced state reads. Engineered for institutional quant desks.
                  </p>
                </div>
                
                <div className="relative z-10 mt-12 border-t border-white/10 pt-8">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-medium tracking-tighter text-white">199</span>
                    <span className="text-[#888] pb-1 font-medium text-sm tracking-tight">WETH / mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-10">
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>1,000,000 requests per month</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Keeper-automated renewals</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-white text-black hover:bg-[#e0e0e0] rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    Initialize Stream <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>

            {/* Technical Detail Section */}
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-12">Protocol Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
                <div className="group">
                  <div className="w-12 h-12 rounded-[14px] bg-[#111] border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
                    <Shield className="w-5 h-5 text-[#ccc]" />
                  </div>
                  <h4 className="text-lg font-medium mb-3">Trustless Escrow</h4>
                  <p className="text-[14px] text-[#888] leading-relaxed">
                    Capital is locked in verifiable streaming contracts. Providers are only compensated for cryptographically proven consumption.
                  </p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 rounded-[14px] bg-[#111] border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
                    <Terminal className="w-5 h-5 text-[#ccc]" />
                  </div>
                  <h4 className="text-lg font-medium mb-3">Session Key Delegation</h4>
                  <p className="text-[14px] text-[#888] leading-relaxed">
                    Authorize ephemeral ECDSA keypairs to sign payload consumption off-chain, eliminating the need to expose primary custody wallets.
                  </p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 rounded-[14px] bg-[#111] border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
                    <Layers className="w-5 h-5 text-[#ccc]" />
                  </div>
                  <h4 className="text-lg font-medium mb-3">Keeper Network</h4>
                  <p className="text-[14px] text-[#888] leading-relaxed">
                    Built-in native bounty mechanisms mathematically incentivize decentralized infrastructure to automatically execute state renewals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border border-white/10 rounded-[2rem] bg-[#0a0a0a] shadow-2xl relative overflow-hidden min-h-[500px]">
              
              {/* Top subtle gradient */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {!isConnected ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-[#111] shadow-xl">
                      <Lock className="w-6 h-6 text-[#888]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight mb-3">Authentication Required</h3>
                  <p className="text-[#888] text-[15px] max-w-sm mx-auto leading-relaxed mb-8">
                    Connect your Ethereum wallet via Web3 provider to query and manage your active cryptographic access streams.
                  </p>
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-8 py-3 bg-white text-black hover:bg-[#e0e0e0] rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {isConnecting ? 'Authenticating...' : 'Connect Wallet'}
                  </button>
                </div>
              ) : (
                <div className="p-10">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <h3 className="text-2xl font-medium tracking-tight mb-2">Active Streams</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <p className="text-[#888] text-sm font-mono">Managing access for saiteja.eth</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-md bg-[#111] text-xs text-[#888] font-mono">
                        <Command className="w-3 h-3" />
                        <span>K</span>
                        <span className="ml-1">to search</span>
                      </div>
                      <button className="text-[13px] font-medium text-white px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/5 transition-colors">
                        View Logs
                      </button>
                    </div>
                  </div>
                  
                  {/* High Fidelity Data Table */}
                  <div className="border border-white/10 rounded-2xl bg-[#050505] overflow-hidden shadow-inner">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-[#0a0a0a] text-[11px] text-[#666] font-mono uppercase tracking-widest">
                      <div className="col-span-5">Service Provider</div>
                      <div className="col-span-4">Bandwidth Consumption</div>
                      <div className="col-span-3 text-right">Actions</div>
                    </div>
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center bg-[#111] shadow-sm">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[14px]">Standard Oracle Feed</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-[#666] font-mono bg-white/5 px-1.5 py-0.5 rounded">ID: 0x4B2...F9A</span>
                            <span className="text-[11px] text-green-400">Streaming</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-4 pr-8">
                        <div className="flex justify-between text-[11px] text-[#888] mb-2 font-mono uppercase tracking-wider">
                          <span className="text-white">4,500 REQ</span>
                          <span>10,000 MAX</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-white w-[45%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="px-3 py-1.5 border border-white/10 hover:border-white/30 bg-[#111] rounded-md text-[12px] font-medium transition-all text-[#aaa] hover:text-white">
                          Rotate Key
                        </button>
                        <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-md text-[12px] font-medium transition-all">
                          Terminate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.04] bg-[#000000] relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-[#666]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/10 rounded-sm flex items-center justify-center">
              <Lock className="w-3 h-3 text-[#aaa]" />
            </div>
            <span>© 2026 AccessKey Protocol. Released under MIT.</span>
          </div>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-white transition-colors">GitHub Repository</a>
            <a href="#" className="hover:text-white transition-colors">Smart Contract Audit</a>
            <a href="#" className="hover:text-white transition-colors">Etherscan Explorer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
