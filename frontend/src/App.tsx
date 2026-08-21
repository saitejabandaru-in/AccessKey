import { useState } from 'react'
import { Activity, Key, Shield, Zap, RefreshCw, LogOut } from 'lucide-react'

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'dashboard'>('discover');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Key className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                AccessKey
              </span>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsConnected(!isConnected)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isConnected 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
                }`}
              >
                {isConnected ? (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    0x8aF...3e9C
                  </span>
                ) : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Decentralized API Subscriptions
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Trustless metering, streaming escrow, and fiat-pegged pricing. 
            Subscribe to premium Web3 APIs securely.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-900 p-1 rounded-2xl inline-flex gap-1 border border-slate-800">
            <button 
              onClick={() => setActiveTab('discover')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'discover' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Discover Plans
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Subscriptions
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'discover' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan Card 1 */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="mb-8">
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Basic Tier
                </span>
                <h3 className="text-2xl font-bold mt-4">AI Vision API</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-slate-400 font-medium">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <span>10,000 Credits / Month</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <span>Trustless Session Keys</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold transition-all">
                Subscribe via USDC
              </button>
            </div>

            {/* Plan Card 2 */}
            <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/50 rounded-3xl p-8 border border-indigo-500/30 hover:border-indigo-500/60 transition-all relative overflow-hidden transform md:-translate-y-4 shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />
              <div className="mb-8">
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Pro Tier (Popular)
                </span>
                <h3 className="text-2xl font-bold mt-4">Enterprise Node RPC</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$199</span>
                  <span className="text-slate-400 font-medium">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span>1,000,000 Credits / Month</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  <span>Delegated Auto-Renewals</span>
                </li>
              </ul>
              
              <button className="w-full py-3 px-4 bg-white text-indigo-950 hover:bg-slate-100 rounded-xl font-bold transition-all">
                Subscribe via WETH
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            {!isConnected ? (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-300">Wallet Not Connected</h3>
                <p className="text-slate-500 mt-2">Connect your wallet to view active API subscriptions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-xl font-bold">Active Subscriptions</h3>
                    <p className="text-slate-400 text-sm mt-1">Manage your keys and stream balances.</p>
                  </div>
                </div>
                
                {/* Active Sub Item */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Activity className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">AI Vision API</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-sm text-slate-400">Active • Expires in 15 days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-48 bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-slate-300 whitespace-nowrap">4,500 / 10k Credits</span>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all">
                      Manage Keys
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" /> Cancel & Refund
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
