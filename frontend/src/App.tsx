import { useState } from 'react';
import { Activity, Shield, Terminal, ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard'>('overview');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#ededed] selection:text-[#0a0a0a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <Lock className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">AccessKey</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#888] hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-sm text-[#888] hover:text-white transition-colors">Developers</a>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              {isConnected ? '0x8aF...3e9C' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tighter leading-tight mb-6">
            Verifiable API <br /> Access Protocol.
          </h1>
          <p className="text-xl text-[#888] leading-relaxed max-w-xl">
            A cryptographic authorization layer for data providers. Trustless metering, native stablecoin settlements, and session-key abstraction.
          </p>
          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview' ? 'bg-white text-black' : 'bg-white/5 text-[#888] hover:bg-white/10 hover:text-white'
              }`}
            >
              Explore Plans
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-white text-black' : 'bg-white/5 text-[#888] hover:bg-white/10 hover:text-white'
              }`}
            >
              Manage Subscriptions
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-24">
            {/* Bento Grid layout for plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Plan 1 */}
              <div className="group border border-white/10 rounded-2xl p-8 bg-[#111] hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-mono text-[#888] uppercase tracking-widest">Base Tier</span>
                    <Terminal className="w-5 h-5 text-[#888]" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">Standard Oracle Feed</h3>
                  <p className="text-[#888] text-sm leading-relaxed max-w-sm">
                    Access high-fidelity historical data endpoints. Ideal for indexing and standard analytics workflows.
                  </p>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-medium tracking-tight">49.00</span>
                    <span className="text-[#888] pb-1">USDC / mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-[#666]" />
                      <span>10,000 requests per month</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-[#666]" />
                      <span>L2 Settlement support</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    Initialize Stream <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="group border border-white/10 rounded-2xl p-8 bg-[#111] hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-mono text-white uppercase tracking-widest">Enterprise</span>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">High-Frequency Node</h3>
                  <p className="text-[#888] text-sm leading-relaxed max-w-sm">
                    Unrestricted mempool access and advanced state reads. Engineered for MEV searchers and institutional quant desks.
                  </p>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-medium tracking-tight">199.00</span>
                    <span className="text-[#888] pb-1">WETH / mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-[#666]" />
                      <span>1,000,000 requests per month</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#ccc]">
                      <CheckCircle2 className="w-4 h-4 text-[#666]" />
                      <span>Keeper-automated renewals</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-white text-black hover:bg-[#ccc] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    Initialize Stream <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Technical Detail Section */}
            <div className="border-t border-white/10 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center mb-6">
                    <Lock className="w-4 h-4 text-[#888]" />
                  </div>
                  <h4 className="text-base font-medium mb-2">Trustless Escrow</h4>
                  <p className="text-sm text-[#888] leading-relaxed">
                    Capital is locked in verifiable streaming contracts. Providers are only compensated for provably consumed requests.
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center mb-6">
                    <Terminal className="w-4 h-4 text-[#888]" />
                  </div>
                  <h4 className="text-base font-medium mb-2">Session Key Architecture</h4>
                  <p className="text-sm text-[#888] leading-relaxed">
                    Authorize ephemeral ECDSA keypairs to sign payload consumption without exposing primary custody wallets.
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center mb-6">
                    <Activity className="w-4 h-4 text-[#888]" />
                  </div>
                  <h4 className="text-base font-medium mb-2">Keeper Network</h4>
                  <p className="text-sm text-[#888] leading-relaxed">
                    Built-in bounty mechanisms incentivize decentralized infrastructure to automatically execute state renewals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-white/10 rounded-2xl bg-[#111] p-12 min-h-[500px]">
            {!isConnected ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-12">
                <div className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-[#161616]">
                  <Lock className="w-6 h-6 text-[#666]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
                  <p className="text-[#888] text-sm max-w-sm mx-auto">
                    Please connect your Ethereum wallet to query your active cryptographic access streams.
                  </p>
                </div>
                <button 
                  onClick={() => setIsConnected(true)}
                  className="px-6 py-2.5 bg-white text-black hover:bg-[#ccc] rounded-lg text-sm font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight mb-2">Active Streams</h3>
                    <p className="text-[#888] text-sm">Managing cryptographic access for 0x8aF...3e9C</p>
                  </div>
                  <button className="text-sm text-[#888] hover:text-white flex items-center gap-1 transition-colors">
                    View execution logs <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs text-[#666] font-mono uppercase tracking-wider">
                    <div className="col-span-4">Service Provider</div>
                    <div className="col-span-4">Consumption Status</div>
                    <div className="col-span-4 text-right">Actions</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-[#111] transition-colors">
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center bg-[#161616]">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Standard Oracle Feed</div>
                        <div className="text-xs text-[#888] mt-1 font-mono">ID: 0x4B2...F9A</div>
                      </div>
                    </div>
                    
                    <div className="col-span-4">
                      <div className="flex justify-between text-xs text-[#888] mb-2 font-mono">
                        <span>4,500 REQ</span>
                        <span>10,000 MAX</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[45%]" />
                      </div>
                    </div>
                    
                    <div className="col-span-4 flex justify-end gap-3">
                      <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-md text-xs font-medium transition-colors">
                        Rotate Key
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md text-xs font-medium transition-colors">
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12 flex justify-between items-center text-sm text-[#666]">
          <p>© 2026 AccessKey Protocol. MIT License.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Audit Report</a>
            <a href="#" className="hover:text-white transition-colors">Etherscan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
