import { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Terminal, Lock, Command, Database, Code2, Cpu, Globe, ArrowUpRight } from 'lucide-react';

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
      setActiveTab('dashboard'); // Auto switch to dashboard on connect
    }, 1200);
  };

  const codeSnippet = `// Integrate AccessKey natively into your protocol
import { AccessKeySDK } from '@accesskey/sdk';

const sdk = new AccessKeySDK({
  provider: window.ethereum,
  network: 'mainnet'
});

// Authorize a session key for an AI Agent
const session = await sdk.authorizeSession({
  planId: 42,
  allocatedCredits: 10_000,
  duration: 30 * 24 * 60 * 60, // 30 days
});

console.log('Stream initialized:', session.streamId);`;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-white/20 relative overflow-hidden"
    >
      {/* Ambient Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-400" />
              <Lock className="relative w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">AccessKey</span>
            <span className="hidden sm:inline-block ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#888]">
              Mainnet Live
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#888]">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">SDK Reference</a>
              <a href="#" className="hover:text-white transition-colors">Smart Contracts</a>
              <a href="#" className="hover:text-white transition-colors">Network Status</a>
            </div>
            
            <button 
              onClick={!isConnected ? handleConnect : () => setIsConnected(false)}
              disabled={isConnecting}
              className={`relative overflow-hidden rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300 ${
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
                  <span>Launch App</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-8 flex justify-center">
          <div className="flex gap-1 p-1 rounded-lg border border-white/10 bg-[#111]/50 backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`relative px-8 py-2 rounded-md text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'overview' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'overview' && (
                <div className="absolute inset-0 bg-white rounded-md shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Protocol Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`relative px-8 py-2 rounded-md text-[13px] font-medium transition-colors duration-300 ${
                activeTab === 'dashboard' ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {activeTab === 'dashboard' && (
                <div className="absolute inset-0 bg-white rounded-md shadow-sm pointer-events-none" />
              )}
              <span className="relative z-10">Subscriber Dashboard</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 border-b border-white/[0.04]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#aaa] mb-8">
                    <Shield className="w-3.5 h-3.5 text-white" />
                    <span>Audited by Trail of Bits & Quantstamp</span>
                  </div>
                  <h1 className="text-[3.5rem] md:text-[5rem] font-semibold tracking-tighter leading-[1.05] mb-6">
                    Monetize data. <br/> <span className="text-[#888]">Trustlessly.</span>
                  </h1>
                  <p className="text-[1.1rem] text-[#888] leading-relaxed max-w-lg font-medium tracking-tight mb-8">
                    AccessKey is the foundational smart contract primitive for API authorization. Accept USDC/WETH subscriptions, enforce metering on-chain, and abstract wallets using session keys.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white text-black hover:bg-[#e0e0e0] rounded-xl text-sm font-semibold transition-all">
                      Read Documentation
                    </button>
                    <button className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                      <Code2 className="w-4 h-4" /> View GitHub
                    </button>
                  </div>
                </div>

                {/* Code Terminal Visual */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/0 rounded-2xl blur-xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-[#050505] overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a0a0a]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs font-mono text-[#666]">integration.ts</span>
                    </div>
                    <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                      <pre>
                        <code className="text-[#ccc]">
                          {codeSnippet.split('\n').map((line, i) => (
                            <div key={i} className="table-row">
                              <span className="table-cell pr-4 text-[#444] select-none text-right">{i + 1}</span>
                              <span className="table-cell whitespace-pre">
                                {line.replace(/import|const|new|await|console/g, match => 
                                  `<span class="text-white font-medium">${match}</span>`
                                ).replace(/'.*?'/g, match => 
                                  `<span class="text-[#888]">${match}</span>`
                                ).replace(/\/\/.*$/g, match => 
                                  `<span class="text-[#555]">${match}</span>`
                                )}
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Network Stats */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/[0.04]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-[#666] text-sm font-medium mb-1">Total Value Locked</p>
                  <p className="text-3xl font-medium tracking-tight">$42.5M</p>
                </div>
                <div>
                  <p className="text-[#666] text-sm font-medium mb-1">Active Streams</p>
                  <p className="text-3xl font-medium tracking-tight">14,205</p>
                </div>
                <div>
                  <p className="text-[#666] text-sm font-medium mb-1">API Requests Secured</p>
                  <p className="text-3xl font-medium tracking-tight">1.8B+</p>
                </div>
                <div>
                  <p className="text-[#666] text-sm font-medium mb-1">Keeper Payouts</p>
                  <p className="text-3xl font-medium tracking-tight">342 ETH</p>
                </div>
              </div>
            </section>

            {/* Target Use Cases */}
            <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/[0.04]">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-medium tracking-tight mb-4">Built for the Autonomous Web</h2>
                <p className="text-[#888] text-[15px] leading-relaxed">
                  AccessKey provides the economic scaffolding required for machines to trustlessly pay machines for data and computation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors">
                  <Cpu className="w-8 h-8 text-white mb-6" />
                  <h3 className="text-xl font-medium mb-3">AI Agent Economy</h3>
                  <p className="text-[#888] text-sm leading-relaxed">
                    Allow autonomous AI agents to subscribe to premium data feeds or LLM inferences using their own wallets and session keys, fully on-chain.
                  </p>
                </div>
                <div className="p-8 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors">
                  <Database className="w-8 h-8 text-white mb-6" />
                  <h3 className="text-xl font-medium mb-3">Decentralized Oracles</h3>
                  <p className="text-[#888] text-sm leading-relaxed">
                    Oracle networks can monetize high-frequency data streams directly. Escrow guarantees payment, while cryptographic signatures prevent data theft.
                  </p>
                </div>
                <div className="p-8 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors">
                  <Globe className="w-8 h-8 text-white mb-6" />
                  <h3 className="text-xl font-medium mb-3">RPC & Node Providers</h3>
                  <p className="text-[#888] text-sm leading-relaxed">
                    Replace Web2 credit card subscriptions with trustless Web3 billing. Automate usage settlement for heavy infrastructure consumers via keepers.
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Dashboard Tab */
          <div className="max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border border-white/10 rounded-[2rem] bg-[#0a0a0a] shadow-2xl relative overflow-hidden min-h-[600px]">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {!isConnected ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-[#111] shadow-xl">
                      <Lock className="w-6 h-6 text-[#888]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight mb-3">Access Denied</h3>
                  <p className="text-[#888] text-[15px] max-w-sm mx-auto leading-relaxed mb-8">
                    Connect your Ethereum wallet to query your active streams, monitor bandwidth, and manage session keys.
                  </p>
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-8 py-3 bg-white text-black hover:bg-[#e0e0e0] rounded-xl text-sm font-semibold transition-all"
                  >
                    {isConnecting ? 'Authenticating...' : 'Connect Wallet'}
                  </button>
                </div>
              ) : (
                <div className="p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                      <h3 className="text-3xl font-medium tracking-tight mb-2">Subscriber Dashboard</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        <p className="text-[#888] text-sm font-mono">Managing access for 0x8aF...3e9C</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-md bg-[#111] text-xs text-[#888] font-mono">
                        <Command className="w-3 h-3" />
                        <span>K</span>
                        <span className="ml-1">to search</span>
                      </div>
                      <button className="text-[13px] font-medium text-black px-5 py-2.5 bg-white hover:bg-[#e0e0e0] rounded-md transition-colors flex items-center gap-2">
                        Explore Marketplace <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* High Fidelity Data Table */}
                  <div className="border border-white/10 rounded-2xl bg-[#050505] overflow-hidden shadow-inner">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-[#0a0a0a] text-[11px] text-[#666] font-mono uppercase tracking-widest">
                      <div className="col-span-12 md:col-span-5">Provider Service</div>
                      <div className="col-span-12 md:col-span-4 hidden md:block">Bandwidth Consumption</div>
                      <div className="col-span-12 md:col-span-3 text-right hidden md:block">Actions</div>
                    </div>
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-white/[0.02] transition-colors border-b border-white/5 group">
                      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                        <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center bg-[#111] shadow-sm">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[15px] mb-1">Standard Oracle Feed</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#888] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded">ID: 0x4B...F9A</span>
                            <span className="text-[11px] text-green-400 font-medium">Streaming Active</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-12 md:col-span-4 pr-8">
                        <div className="flex justify-between text-[11px] text-[#888] mb-2 font-mono uppercase tracking-wider">
                          <span className="text-white">4,500 REQ</span>
                          <span>10,000 MAX</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-white w-[45%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                      </div>
                      
                      <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end gap-2">
                        <button className="px-3 py-1.5 border border-white/10 hover:border-white/30 bg-[#111] rounded-md text-[12px] font-medium transition-all text-[#aaa] hover:text-white">
                          Rotate Key
                        </button>
                        <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-md text-[12px] font-medium transition-all">
                          Terminate
                        </button>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                        <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center bg-[#111] shadow-sm">
                          <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[15px] mb-1">EigenLayer AVS RPC</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#888] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded">ID: 0x99...2A1</span>
                            <span className="text-[11px] text-yellow-400 font-medium">Nearing Limit</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-12 md:col-span-4 pr-8">
                        <div className="flex justify-between text-[11px] text-[#888] mb-2 font-mono uppercase tracking-wider">
                          <span className="text-white">920,000 REQ</span>
                          <span>1,000,000 MAX</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-yellow-400 w-[92%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        </div>
                      </div>
                      
                      <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end gap-2">
                        <button className="px-3 py-1.5 border border-white/10 hover:border-white/30 bg-[#111] rounded-md text-[12px] font-medium transition-all text-[#aaa] hover:text-white">
                          Renew Stream
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

      <footer className="border-t border-white/[0.04] bg-[#000000] relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-white/5 pb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 bg-white/10 rounded-sm flex items-center justify-center">
                  <Lock className="w-3 h-3 text-[#aaa]" />
                </div>
                <span className="font-medium text-sm">AccessKey</span>
              </div>
              <p className="text-[#666] text-sm leading-relaxed">
                The verifiable authorization layer. Abstracting payments, metering, and keys for the decentralized web.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Developers</h4>
              <ul className="space-y-3 text-sm text-[#888]">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TypeScript SDK</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bug Bounty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Ecosystem</h4>
              <ul className="space-y-3 text-sm text-[#888]">
                <li><a href="#" className="hover:text-white transition-colors">Providers Directory</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Keeper Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Network Stats</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-[#888]">
                <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Audits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#666]">
            <span>© 2026 AccessKey Protocol. MIT License.</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
