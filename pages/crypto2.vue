<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1419] to-[#0a0e27] text-slate-100 font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
    
    <!-- Animated background -->
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none">
      <div class="absolute inset-0" style="background-image: linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <!-- Professional Header -->
    <div class="mb-6 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
            <span class="text-emerald-400">█</span>
            ULTRA-FAST AI TRADING SYSTEM
            <span class="text-xs bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-2 py-1 rounded">⚡ INSTANT</span>
          </h1>
          <p class="text-xs text-slate-500 font-bold tracking-wide uppercase">Ensemble ML • Zero-Lag • Multi-Algorithm • 0.2% Fees</p>
        </div>
        
        <!-- Key Metrics -->
        <div class="flex gap-2 flex-wrap">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-emerald-400 font-bold uppercase mb-0.5">Win Rate</div>
            <div class="text-lg font-black text-emerald-400">{{ netWinRate }}%</div>
          </div>
          <div class="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-cyan-400 font-bold uppercase mb-0.5">AI Score</div>
            <div class="text-lg font-black text-cyan-400">{{ aiScore }}%</div>
          </div>
          <div class="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-violet-400 font-bold uppercase mb-0.5">Sharpe</div>
            <div class="text-lg font-black text-violet-400">{{ metrics.sharpeRatio }}</div>
          </div>
          <div class="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-rose-400 font-bold uppercase mb-0.5">Max DD</div>
            <div class="text-lg font-black text-rose-400">{{ metrics.maxDrawdown }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Market Selector Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 relative z-10">
      <div v-for="(data, s) in marketData" :key="s" @click="switchSymbol(s)"
        :class="symbol === s ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]' : 'border-slate-800/50 hover:border-slate-700'"
        class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-xl relative overflow-hidden group">
        
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-2">
            <span class="font-black text-slate-400 text-xs tracking-widest">{{ s }}</span>
            <span :class="data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[9px] font-mono font-bold">
              {{ data.change >= 0 ? '▲' : '▼' }} {{ Math.abs(data.change).toFixed(2) }}%
            </span>
          </div>
          
          <div class="text-xl font-black text-white tracking-tighter mb-2">${{ data.price.toLocaleString() }}</div>
          
          <div class="space-y-1">
            <!-- Multi-Timeframe Indicators -->
            <div class="flex items-center gap-1">
              <span class="text-[7px] text-slate-500 font-bold uppercase w-8">MTF:</span>
              <div v-for="tf in ['15m', '1h', '4h']" :key="tf" 
                :class="data.timeframes[tf] === 'UP' ? 'bg-emerald-500' : data.timeframes[tf] === 'DOWN' ? 'bg-rose-500' : 'bg-slate-600'"
                class="w-3 h-3 rounded flex items-center justify-center">
                <span class="text-[6px] font-black text-white">{{ tf.charAt(0) }}</span>
              </div>
            </div>
            
            <!-- AI Prediction with multiple algorithms -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="text-[7px] text-slate-500 font-bold">AI:</span>
                <div :class="data.aiPrediction > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
                  class="px-1.5 py-0.5 rounded text-[7px] font-black">
                  {{ data.aiPrediction > 0 ? '+' : '' }}{{ (data.aiPrediction * 100).toFixed(1) }}%
                </div>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-1 h-1 rounded-full" :class="data.regime === 'TREND' ? 'bg-emerald-500' : 'bg-slate-500'"></div>
                <span :class="data.regime === 'TREND' ? 'text-emerald-400' : 'text-slate-500'" 
                  class="text-[7px] font-black">
                  {{ data.regime }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 relative z-10">
      
      <!-- Left Column -->
      <div class="xl:col-span-3 space-y-4">
        
        <!-- Multi-Timeframe & AI Dashboard -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-black text-slate-300 uppercase">Ensemble AI Analysis • {{ symbol }}</h3>
            <div class="flex items-center gap-2">
              <div :class="mtfAlignment >= 2 ? 'bg-emerald-500' : 'bg-slate-600'" 
                class="w-2 h-2 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">
                {{ mtfAlignment === 3 ? 'FULL ALIGN' : mtfAlignment === 2 ? 'PARTIAL' : 'MIXED' }}
              </span>
            </div>
          </div>
          
          <!-- AI Models Grid -->
          <div class="grid grid-cols-4 gap-2 mb-3">
            <div v-for="model in aiModels" :key="model.name"
              class="bg-slate-800/40 rounded-lg p-2 border border-slate-700/50">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">{{ model.name }}</div>
              <div class="text-sm font-black" :class="model.signal > 0 ? 'text-emerald-400' : 'text-rose-400'">
                {{ model.signal > 0 ? '↑' : '↓' }} {{ Math.abs(model.signal).toFixed(1) }}%
              </div>
              <div class="text-[7px] text-slate-600 mt-0.5">{{ model.confidence }}% conf</div>
            </div>
          </div>
          
          <!-- Multi-Timeframe Data -->
          <div class="grid grid-cols-3 gap-3 mb-3">
            <div v-for="(tf, idx) in mtfData" :key="idx"
              class="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-black text-slate-400">{{ tf.name }}</span>
                <div :class="tf.trend === 'UP' ? 'bg-emerald-500' : 'bg-rose-500'"
                  class="w-1.5 h-1.5 rounded-full"></div>
              </div>
              <div class="text-base font-black" :class="tf.trend === 'UP' ? 'text-emerald-400' : 'text-rose-400'">
                {{ tf.trend }}
              </div>
              <div class="text-[8px] text-slate-500 mt-1">RSI: {{ tf.rsi }} • ADX: {{ tf.adx }}</div>
            </div>
          </div>
          
          <!-- Signal Strength Bar -->
          <div class="relative h-5 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 to-emerald-500/30"></div>
            <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 transition-all duration-500"
              :style="{ width: signalStrength + '%' }"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-black text-white drop-shadow-lg">
                {{ Math.round(signalStrength) }}% SIGNAL • AI: {{ aiScore }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Main Chart -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-black text-white">
              {{ symbol }} 
              <span class="text-emerald-400 text-sm">15M</span>
              <span v-if="aiPredictedPrice" class="text-violet-400 text-sm ml-2">
                AI Target: ${{ aiPredictedPrice.toLocaleString() }}
              </span>
            </h2>
            <div class="flex gap-2">
              <div class="px-2 py-1 bg-violet-500/10 border border-violet-500/30 rounded text-[8px] text-violet-400 font-bold uppercase">
                🤖 ENSEMBLE
              </div>
              <div class="px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-[8px] text-rose-400 font-bold uppercase">
                SL: {{ (stopLoss * 100).toFixed(1) }}%
              </div>
              <div class="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] text-emerald-400 font-bold uppercase">
                TP: {{ (takeProfit * 100).toFixed(1) }}%
              </div>
            </div>
          </div>
          
          <div class="h-[450px] w-full relative">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- Performance Stats -->
        <div class="grid grid-cols-4 gap-3">
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-3 rounded-xl border border-slate-800/50">
            <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Avg Win</div>
            <div class="text-xl font-black text-emerald-400">${{ netAvgWin }}</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-3 rounded-xl border border-slate-800/50">
            <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Avg Loss</div>
            <div class="text-xl font-black text-rose-400">${{ netAvgLoss }}</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-3 rounded-xl border border-slate-800/50">
            <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Trades</div>
            <div class="text-xl font-black text-violet-400">{{ totalTrades }}</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-3 rounded-xl border border-slate-800/50">
            <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Win Streak</div>
            <div class="text-xl font-black text-cyan-400">{{ metrics.consecutiveWins }}</div>
          </div>
        </div>
      </div>

      <!-- Right Column - Trades -->
      <div class="space-y-4">
        
        <!-- CURRENT SIGNAL PANEL -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <div class="p-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900 to-slate-800">
            <h3 class="font-black text-sm text-white uppercase tracking-wide mb-1">🎯 CURRENT SIGNAL</h3>
            <p class="text-[8px] text-slate-500 font-bold uppercase">Live Trading Recommendation</p>
          </div>
          
          <div class="p-5">
            <!-- Current Position Status -->
            <div v-if="currentPosition" class="mb-4">
              <div class="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-500/40 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-black text-emerald-400 uppercase">IN POSITION</span>
                  </div>
                  <span class="text-[8px] text-emerald-400/80 font-mono">{{ currentPosition.time }}</span>
                </div>
                
                <div class="text-3xl font-black text-white mb-2 font-mono">
                  ${{ currentPosition.price.toLocaleString() }}
                </div>
                
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="bg-slate-900/50 rounded p-2">
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-1">Current P/L</div>
                    <div :class="currentPosition.currentPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-sm font-black font-mono">
                      {{ currentPosition.currentPL >= 0 ? '+' : '' }}${{ currentPosition.currentPL.toFixed(2) }}
                    </div>
                  </div>
                  <div class="bg-slate-900/50 rounded p-2">
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-1">% Change</div>
                    <div :class="currentPosition.currentPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-sm font-black font-mono">
                      {{ currentPosition.currentPercent >= 0 ? '+' : '' }}{{ currentPosition.currentPercent.toFixed(2) }}%
                    </div>
                  </div>
                </div>
                
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-[8px]">
                    <span class="text-slate-500 font-bold">Stop Loss:</span>
                    <span class="text-rose-400 font-black font-mono">${{ currentPosition.stopLoss.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[8px]">
                    <span class="text-slate-500 font-bold">Take Profit:</span>
                    <span class="text-emerald-400 font-black font-mono">${{ currentPosition.takeProfit.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[8px]">
                    <span class="text-slate-500 font-bold">Peak Price:</span>
                    <span class="text-cyan-400 font-black font-mono">${{ currentPosition.peak.toLocaleString() }}</span>
                  </div>
                </div>
                
                <div class="mt-3 p-2 bg-violet-500/10 rounded border border-violet-500/30">
                  <div class="text-[7px] text-violet-400 font-bold uppercase mb-1">Signal Strength</div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all"
                        :style="{ width: currentPosition.confidence + '%' }"></div>
                    </div>
                    <span class="text-[10px] font-black text-violet-400">{{ currentPosition.confidence }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Next Signal (When No Position) -->
            <div v-else class="mb-4">
              <div :class="nextSignal.action === 'BUY' ? 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/40' : nextSignal.action === 'SELL' ? 'from-rose-500/20 to-rose-500/10 border-rose-500/40' : 'from-slate-700/20 to-slate-700/10 border-slate-700/40'"
                class="bg-gradient-to-br border-2 rounded-xl p-4">
                
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div :class="nextSignal.action === 'BUY' ? 'bg-emerald-500' : nextSignal.action === 'SELL' ? 'bg-rose-500' : 'bg-slate-600'" 
                      class="w-3 h-3 rounded-full" ;class="nextSignal.action !== 'WAIT' ? 'animate-pulse' : ''"></div>
                    <span :class="nextSignal.action === 'BUY' ? 'text-emerald-400' : nextSignal.action === 'SELL' ? 'text-rose-400' : 'text-slate-400'" 
                      class="text-lg font-black uppercase">
                      {{ nextSignal.action }}
                    </span>
                  </div>
                  <span class="text-[8px] text-slate-500 font-mono">{{ new Date().toLocaleTimeString() }}</span>
                </div>
                
                <div class="text-3xl font-black text-white mb-3 font-mono">
                  ${{ marketData[symbol].price.toLocaleString() }}
                </div>
                
                <div class="space-y-2 mb-3">
                  <div class="flex items-center justify-between text-[9px]">
                    <span class="text-slate-500 font-bold">Signal Strength:</span>
                    <span :class="signalStrength >= 70 ? 'text-emerald-400' : signalStrength >= 50 ? 'text-yellow-400' : 'text-slate-400'" 
                      class="font-black">
                      {{ Math.round(signalStrength) }}%
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[9px]">
                    <span class="text-slate-500 font-bold">AI Confidence:</span>
                    <span class="text-violet-400 font-black">{{ aiScore }}%</span>
                  </div>
                  <div class="flex items-center justify-between text-[9px]">
                    <span class="text-slate-500 font-bold">MTF Alignment:</span>
                    <span :class="mtfAlignment === 3 ? 'text-emerald-400' : 'text-slate-400'" class="font-black">
                      {{ mtfAlignment }}/3
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[9px]">
                    <span class="text-slate-500 font-bold">AI Prediction:</span>
                    <span :class="marketData[symbol].aiPrediction > 0 ? 'text-emerald-400' : 'text-rose-400'" class="font-black">
                      {{ marketData[symbol].aiPrediction > 0 ? '+' : '' }}{{ (marketData[symbol].aiPrediction * 100).toFixed(2) }}%
                    </span>
                  </div>
                </div>
                
                <div class="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">Recommendation</div>
                  <p class="text-[10px] text-slate-300 leading-relaxed">
                    {{ nextSignal.message }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-slate-800/40 rounded-lg p-2">
                <div class="text-[7px] text-emerald-400 font-bold uppercase mb-1">Win Rate</div>
                <div class="text-lg font-black text-emerald-400">{{ netWinRate }}%</div>
              </div>
              <div class="bg-slate-800/40 rounded-lg p-2">
                <div class="text-[7px] text-cyan-400 font-bold uppercase mb-1">Total Trades</div>
                <div class="text-lg font-black text-cyan-400">{{ totalTrades }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- TRADE HISTORY PANEL -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <div class="p-4 border-b border-slate-800/50">
            <div class="flex justify-between items-center mb-2">
              <div>
                <h3 class="font-black text-xs text-white uppercase">📊 Trade History</h3>
                <p class="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Past Signals & Results</p>
              </div>
              <div class="text-right">
                <div class="text-[9px] text-emerald-400 font-black">{{ metrics.profitFactor }} PF</div>
                <div class="text-[7px] text-slate-500 font-bold">Profit Factor</div>
              </div>
            </div>
            
            <div class="flex items-center justify-between gap-2 p-2 bg-slate-800/40 rounded-lg">
              <div class="flex items-center gap-1">
                <div class="flex gap-0.5">
                  <div v-for="i in Math.min(metrics.consecutiveWins, 5)" :key="'w-'+i" 
                    class="w-1 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <span class="text-[8px] text-emerald-400 font-bold">{{ metrics.consecutiveWins }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[8px] text-rose-400 font-bold">{{ metrics.consecutiveLosses }}</span>
                <div class="flex gap-0.5">
                  <div v-for="i in Math.min(metrics.consecutiveLosses, 5)" :key="'l-'+i" 
                    class="w-1 h-2 bg-rose-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-3 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            <!-- Trade pairs showing BUY -> SELL with outcome -->
            <div v-for="(pair, i) in tradePairs.slice(0, 10)" :key="i" 
              class="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3 hover:bg-slate-800/60 transition-all">
              
              <!-- Trade Pair Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div :class="pair.netPL >= 0 ? 'bg-emerald-500' : 'bg-rose-500'" 
                    class="w-2 h-2 rounded-full"></div>
                  <span :class="pair.netPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                    class="text-[9px] font-black uppercase">
                    {{ pair.netPL >= 0 ? 'WIN' : 'LOSS' }}
                  </span>
                  <span v-if="pair.buy.aiBoosted" class="text-[8px] text-violet-400">🤖</span>
                </div>
                <div class="text-[7px] text-slate-600 font-mono">
                  {{ pair.duration }}
                </div>
              </div>
              
              <!-- BUY Signal -->
              <div class="mb-2 pb-2 border-b border-slate-700/30">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <div class="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    <span class="text-[8px] text-emerald-400 font-bold uppercase">BUY</span>
                  </div>
                  <span class="text-[7px] text-slate-500 font-mono">{{ pair.buy.time }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm font-black text-white font-mono">${{ pair.buy.price.toLocaleString() }}</div>
                  <div class="text-[7px] text-violet-400 font-black">{{ pair.buy.confidence }}% conf</div>
                </div>
                <div class="text-[7px] text-slate-500 mt-1">{{ pair.buy.reason }}</div>
              </div>
              
              <!-- SELL Signal -->
              <div class="mb-2">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <div class="w-1 h-1 bg-rose-500 rounded-full"></div>
                    <span class="text-[8px] text-rose-400 font-bold uppercase">SELL</span>
                  </div>
                  <span class="text-[7px] text-slate-500 font-mono">{{ pair.sell.time }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm font-black text-white font-mono">${{ pair.sell.price.toLocaleString() }}</div>
                  <div class="text-[7px] text-slate-500">{{ pair.sell.reason }}</div>
                </div>
              </div>
              
              <!-- Result -->
              <div :class="pair.netPL >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'"
                class="p-2 rounded border">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Net P/L</div>
                    <div :class="pair.netPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-base font-black font-mono">
                      {{ pair.netPL >= 0 ? '+' : '' }}${{ pair.netPL.toFixed(2) }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Return</div>
                    <div :class="pair.returnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-base font-black font-mono">
                      {{ pair.returnPercent >= 0 ? '+' : '' }}{{ pair.returnPercent.toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <div class="text-[7px] text-slate-600 mt-1 font-mono">
                  Fee: -${{ pair.sell.fees.toFixed(2) }}
                </div>
              </div>
            </div>
            
            <div v-if="tradePairs.length === 0" class="text-center py-16">
              <div class="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2"></div>
              <div class="text-slate-600 text-[9px] font-bold uppercase">Analyzing Markets...</div>
            </div>
          </div>

          <div class="p-4 bg-gradient-to-br from-emerald-600 to-violet-600 m-3 rounded-xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative z-10">
              <div class="text-[8px] text-emerald-100 font-bold mb-1 uppercase flex items-center justify-between">
                <span>Net P/L (After Fees)</span>
                <span class="text-white/80">{{ totalTrades }} Trades</span>
              </div>
              <div class="text-2xl font-black text-white font-mono">${{ netTotalPL.toFixed(2) }}</div>
              <div class="text-[7px] text-emerald-100 mt-1 font-bold">
                ROI: {{ netTotalPL > 0 ? '+' : '' }}{{ (netTotalPL / 10000 * 100).toFixed(2) }}% • AI Boost: {{ aiScore }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

Chart.register(...registerables, CandlestickController, CandlestickElement);

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];
const symbol = ref("BTCUSDT");

const marketData = reactive({
  BTCUSDT: { price: 0, change: 0, regime: 'LOAD', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, aiPrediction: 0 },
  ETHUSDT: { price: 0, change: 0, regime: 'LOAD', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, aiPrediction: 0 },
  SOLUSDT: { price: 0, change: 0, regime: 'LOAD', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, aiPrediction: 0 },
  BNBUSDT: { price: 0, change: 0, regime: 'LOAD', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, aiPrediction: 0 }
});

const candles = ref([]);
const trades = ref([]);
const netTotalPL = ref(0);
const chartCanvas = ref(null);
const signalStrength = ref(0);
const mtfData = ref([]);
const mtfAlignment = ref(0);
const aiScore = ref(0);
const aiPredictedPrice = ref(0);
const aiModels = ref([]);
const currentPosition = ref(null);
const nextSignal = ref({ action: 'WAIT', message: 'Analyzing market conditions...', confidence: 0 });
const tradePairs = ref([]);

const stopLoss = ref(0.025);
const takeProfit = ref(0.02);
const feePercent = 0.002;

const metrics = ref({
  sharpeRatio: '0.00',
  maxDrawdown: '0.00',
  profitFactor: '0.00',
  consecutiveWins: 0,
  consecutiveLosses: 0
});

let chartInst = null;
let dataCache = {};

const netWinRate = computed(() => {
  const sells = trades.value.filter(t => t.type === 'SELL' && t.netPL !== undefined);
  if (!sells.length) return 0;
  return ((sells.filter(t => t.netPL > 0).length / sells.length) * 100).toFixed(0);
});

const netAvgWin = computed(() => {
  const wins = trades.value.filter(t => t.type === 'SELL' && t.netPL > 0);
  if (!wins.length) return '0.00';
  return (wins.reduce((sum, t) => sum + t.netPL, 0) / wins.length).toFixed(2);
});

const netAvgLoss = computed(() => {
  const losses = trades.value.filter(t => t.type === 'SELL' && t.netPL < 0);
  if (!losses.length) return '0.00';
  return Math.abs(losses.reduce((sum, t) => sum + t.netPL, 0) / losses.length).toFixed(2);
});

const totalTrades = computed(() => trades.value.filter(t => t.type === 'SELL').length);

// Ultra-fast EMA
function calcEMA(data, period) {
  if (data.length < period) return Array(data.length).fill(data[0]);
  const k = 2 / (period + 1);
  let ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i-1] * (1-k));
  }
  return ema;
}

// Fast RSI
function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    change >= 0 ? gains += change : losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  return avgLoss > 0 ? 100 - (100 / (1 + avgGain / avgLoss)) : 100;
}

// Fast ADX
function calcADX(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return 0;
  
  let trSum = 0, plusDM = 0, minusDM = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const tr = Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i-1]), Math.abs(lows[i] - closes[i-1]));
    const pDM = highs[i] - highs[i-1] > lows[i-1] - lows[i] && highs[i] - highs[i-1] > 0 ? highs[i] - highs[i-1] : 0;
    const mDM = lows[i-1] - lows[i] > highs[i] - highs[i-1] && lows[i-1] - lows[i] > 0 ? lows[i-1] - lows[i] : 0;
    
    trSum += tr;
    plusDM += pDM;
    minusDM += mDM;
  }
  
  const plusDI = (plusDM / trSum) * 100;
  const minusDI = (minusDM / trSum) * 100;
  return Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
}

// ==================== ENSEMBLE AI MODELS ====================

// Model 1: Polynomial Regression (trend following)
function polynomialRegression(closes, degree = 2) {
  const n = Math.min(closes.length, 60);
  const recent = closes.slice(-n);
  
  // Normalize to prevent overflow
  const maxVal = Math.max(...recent);
  const normalized = recent.map(v => v / maxVal);
  
  // Build design matrix
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let d = 0; d <= degree; d++) {
      row.push(Math.pow(i / n, d));
    }
    X.push(row);
  }
  
  // Normal equation: (X^T X)^-1 X^T y
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const XtXinv = matInverse(XtX);
  const Xty = matMulVec(Xt, normalized);
  const coeffs = matMulVec(XtXinv, Xty);
  
  // Predict next value
  let pred = 0;
  for (let d = 0; d <= degree; d++) {
    pred += coeffs[d] * Math.pow(1, d);
  }
  
  return pred * maxVal;
}

// Model 2: Weighted Moving Average with momentum
function wmaWithMomentum(closes) {
  const n = Math.min(closes.length, 30);
  const recent = closes.slice(-n);
  
  let sum = 0, weightSum = 0;
  for (let i = 0; i < n; i++) {
    const weight = (i + 1);
    sum += recent[i] * weight;
    weightSum += weight;
  }
  const wma = sum / weightSum;
  
  // Add momentum
  const momentum = (recent[n-1] - recent[0]) / n;
  return wma + momentum * 5;
}

// Model 3: Mean Reversion with volatility adjustment
function meanReversionModel(closes) {
  const n = Math.min(closes.length, 50);
  const recent = closes.slice(-n);
  
  const mean = recent.reduce((a, b) => a + b) / n;
  const variance = recent.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  const current = recent[n-1];
  const zScore = (current - mean) / stdDev;
  
  // Predict reversion to mean with volatility adjustment
  return mean + (current - mean) * 0.7 + (stdDev * 0.3 * (zScore > 0 ? 1 : -1));
}

// Model 4: Exponential Smoothing with trend
function exponentialSmoothing(closes, alpha = 0.3, beta = 0.1) {
  const n = Math.min(closes.length, 40);
  const recent = closes.slice(-n);
  
  let level = recent[0];
  let trend = 0;
  
  for (let i = 1; i < n; i++) {
    const prevLevel = level;
    level = alpha * recent[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }
  
  return level + trend;
}

// Ensemble AI: Combine all models with confidence weighting
function ensembleAIPrediction(closes, highs, lows, volumes) {
  const current = closes[closes.length - 1];
  
  // Get predictions from all models
  const polyPred = polynomialRegression(closes);
  const wmaPred = wmaWithMomentum(closes);
  const meanRevPred = meanReversionModel(closes);
  const expPred = exponentialSmoothing(closes);
  
  // Calculate confidence based on market conditions
  const rsi = calcRSI(closes);
  const adx = calcADX(highs, lows, closes);
  const avgVol = volumes.slice(-20).reduce((a, b) => a + b) / 20;
  const currentVol = volumes[volumes.length - 1];
  const volRatio = currentVol / avgVol;
  
  // Dynamic weighting based on market regime
  let weights = {
    poly: 0.3,
    wma: 0.25,
    meanRev: 0.25,
    exp: 0.2
  };
  
  // Adjust weights based on market conditions
  if (adx > 25) {
    // Trending market: favor momentum models
    weights.poly = 0.4;
    weights.wma = 0.35;
    weights.meanRev = 0.15;
    weights.exp = 0.1;
  } else {
    // Ranging market: favor mean reversion
    weights.poly = 0.2;
    weights.wma = 0.2;
    weights.meanRev = 0.4;
    weights.exp = 0.2;
  }
  
  // Weighted ensemble prediction
  const ensemblePred = 
    polyPred * weights.poly +
    wmaPred * weights.wma +
    meanRevPred * weights.meanRev +
    expPred * weights.exp;
  
  // Calculate individual model signals
  aiModels.value = [
    {
      name: 'POLY',
      signal: ((polyPred - current) / current) * 100,
      confidence: Math.min(100, 70 + adx)
    },
    {
      name: 'WMA',
      signal: ((wmaPred - current) / current) * 100,
      confidence: Math.min(100, 65 + volRatio * 10)
    },
    {
      name: 'MEAN-REV',
      signal: ((meanRevPred - current) / current) * 100,
      confidence: Math.min(100, 60 + (50 - Math.abs(rsi - 50)))
    },
    {
      name: 'EXP',
      signal: ((expPred - current) / current) * 100,
      confidence: Math.min(100, 75 + (adx / 2))
    }
  ];
  
  // Overall AI confidence score
  const avgConfidence = aiModels.value.reduce((sum, m) => sum + m.confidence, 0) / 4;
  aiScore.value = Math.round(avgConfidence);
  
  return {
    predicted: ensemblePred,
    change: (ensemblePred - current) / current,
    confidence: avgConfidence
  };
}

// Matrix operations for polynomial regression
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function matMul(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function matMulVec(matrix, vector) {
  return matrix.map(row => 
    row.reduce((sum, val, i) => sum + val * vector[i], 0)
  );
}

function matInverse(matrix) {
  const n = matrix.length;
  const identity = Array(n).fill(0).map((_, i) => 
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  );
  
  const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
  
  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  for (let i = n - 1; i >= 0; i--) {
    for (let k = i - 1; k >= 0; k--) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
    const divisor = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor;
    }
  }
  
  return augmented.map(row => row.slice(n));
}

// ==================== END OF AI MODELS ====================

// Multi-Timeframe Analysis
async function analyzeTimeframes() {
  const timeframes = [
    { name: '15m', interval: '15m', limit: 200 },
    { name: '1h', interval: '1h', limit: 200 },
    { name: '4h', interval: '4h', limit: 200 }
  ];
  
  mtfData.value = [];
  let aligned = 0;
  
  const promises = timeframes.map(async (tf) => {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.value}&interval=${tf.interval}&limit=${tf.limit}`);
      const klines = await res.json();
      
      const closes = klines.map(k => parseFloat(k[4]));
      const highs = klines.map(k => parseFloat(k[2]));
      const lows = klines.map(k => parseFloat(k[3]));
      
      const ema200 = calcEMA(closes, 200);
      const rsi = calcRSI(closes);
      const adx = calcADX(highs, lows, closes);
      const trend = closes[closes.length - 1] > ema200[ema200.length - 1] ? 'UP' : 'DOWN';
      
      marketData[symbol.value].timeframes[tf.interval] = trend;
      if (trend === 'UP') aligned++;
      
      return { name: tf.name, trend, rsi: Math.round(rsi), adx: Math.round(adx) };
    } catch (e) {
      return { name: tf.name, trend: 'NEUTRAL', rsi: 50, adx: 0 };
    }
  });
  
  mtfData.value = await Promise.all(promises);
  mtfAlignment.value = aligned;
  return aligned;
}

async function fetchEngine() {
  try {
    const cacheKey = `${symbol.value}_15m`;
    const now = Date.now();
    
    if (dataCache[cacheKey] && now - dataCache[cacheKey].time < 60000) {
      processData(dataCache[cacheKey].data);
      return;
    }
    
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.value}&interval=15m&limit=500`);
    const klines = await res.json();
    
    dataCache[cacheKey] = { data: klines, time: now };
    processData(klines);
    
  } catch (e) {
    console.error("API Error", e);
  }
}

async function processData(klines) {
  const mappedCandles = klines.map(k => ({
    x: k[0],
    o: parseFloat(k[1]),
    h: parseFloat(k[2]),
    l: parseFloat(k[3]),
    c: parseFloat(k[4]),
    v: parseFloat(k[5])
  }));

  const closes = mappedCandles.map(c => c.c);
  const highs = mappedCandles.map(c => c.h);
  const lows = mappedCandles.map(c => c.l);
  const volumes = mappedCandles.map(c => c.v);
  
  marketData[symbol.value].price = closes[closes.length - 1];
  marketData[symbol.value].change = ((closes[closes.length - 1] - closes[closes.length - 2]) / closes[closes.length - 2]) * 100;
  
  const ema200 = calcEMA(closes, 200);
  const rsi = calcRSI(closes);
  const adx = calcADX(highs, lows, closes);
  
  marketData[symbol.value].regime = adx > 25 ? 'TREND' : 'RANGE';
  
  // Ensemble AI prediction
  const aiPrediction = ensembleAIPrediction(closes, highs, lows, volumes);
  marketData[symbol.value].aiPrediction = aiPrediction.change;
  aiPredictedPrice.value = aiPrediction.predicted;
  
  candles.value = mappedCandles;
  
  const alignment = await analyzeTimeframes();
  
  // Calculate signal strength
  let baseSignal = 0;
  const isUptrend = closes[closes.length - 1] > ema200[ema200.length - 1];
  const avgVol = volumes.slice(-50).reduce((a, b) => a + b) / 50;
  const volRatio = volumes[volumes.length - 1] / avgVol;
  
  if (rsi < 35) baseSignal += 25;
  else if (rsi < 45) baseSignal += 15;
  if (isUptrend) baseSignal += 20;
  if (alignment === 3) baseSignal += 20;
  else if (alignment === 2) baseSignal += 10;
  if (volRatio > 1.5) baseSignal += 10;
  
  // AI boost based on ensemble confidence
  if (aiPrediction.change > 0.005) {
    baseSignal += Math.min(20, aiPrediction.confidence / 5);
  }
  
  signalStrength.value = Math.max(0, Math.min(100, baseSignal));
  
  runBacktest(closes, ema200, volumes, rsi, highs, lows, adx, aiPrediction);
}

function runBacktest(closes, ema200, volumes, currentRSI, highs, lows, currentADX, aiPrediction) {
  trades.value = [];
  netTotalPL.value = 0;
  let position = null;
  let peakPrice = 0;

  const avgVolume = volumes.slice(0, 100).reduce((a, b) => a + b) / 100;

  for (let i = 200; i < closes.length; i++) {
    const rsi = calcRSI(closes.slice(0, i + 1));
    const adx = calcADX(highs.slice(0, i + 1), lows.slice(0, i + 1), closes.slice(0, i + 1));
    
    if (adx <= 25 && !position) continue;
    
    const isUptrend = closes[i] > ema200[i];
    const price = closes[i];
    const volRatio = volumes[i] / avgVolume;
    
    let buyScore = 0;
    if (rsi < 35) buyScore += 25;
    else if (rsi < 45) buyScore += 18;
    if (isUptrend) buyScore += 20;
    if (volRatio > 1.4) buyScore += 15;
    if (mtfAlignment.value === 3) buyScore += 20;
    
    const aiBoosted = aiPrediction.change > 0.005;
    if (aiBoosted) buyScore += Math.min(20, aiPrediction.confidence / 5);
    
    if (!position && buyScore >= 70 && adx > 25) {
      position = { 
        type: 'BUY', 
        price: price, 
        time: new Date(candles.value[i].x).toLocaleTimeString(),
        reason: aiBoosted ? "AI ENSEMBLE" : "CONFIRMED",
        confidence: buyScore,
        aiBoosted
      };
      peakPrice = price;
      trades.value.unshift(position);
    } 
    else if (position) {
      if (price > peakPrice) peakPrice = price;
      
      const stopLossPrice = position.price * (1 - stopLoss.value);
      const trailingExit = peakPrice * (1 - takeProfit.value);
      
      if (price <= stopLossPrice || (price <= trailingExit && price > position.price * 1.005) || rsi > 70 || adx <= 25) {
        const grossPL = price - position.price;
        const totalFees = (position.price + price) * feePercent;
        const netPL = grossPL - totalFees;
        
        let reason = "PROFIT";
        if (price <= stopLossPrice) reason = "STOP";
        else if (rsi > 70) reason = "RSI EXIT";
        else if (adx <= 25) reason = "REGIME";
        
        trades.value.unshift({ 
          type: 'SELL', 
          price: price, 
          grossPL,
          fees: totalFees,
          netPL,
          time: new Date(candles.value[i].x).toLocaleTimeString(),
          reason,
          confidence: position.confidence,
          aiBoosted: position.aiBoosted
        });
        
        netTotalPL.value += netPL;
        position = null;
      }
    }
  }
  
  calculateMetrics();
  nextTick(() => renderChart());
}

function calculateMetrics() {
  const sellTrades = trades.value.filter(t => t.type === 'SELL');
  if (!sellTrades.length) return;

  const returns = sellTrades.map(t => (t.netPL / (t.price - t.netPL)) * 100);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  metrics.value.sharpeRatio = (stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00');

  let peak = 0, maxDD = 0, cumPL = 0;
  sellTrades.forEach(t => {
    cumPL += t.netPL;
    if (cumPL > peak) peak = cumPL;
    const dd = peak > 0 ? ((peak - cumPL) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  });
  metrics.value.maxDrawdown = maxDD.toFixed(2);

  const grossProfit = sellTrades.filter(t => t.netPL > 0).reduce((sum, t) => sum + t.netPL, 0);
  const grossLoss = Math.abs(sellTrades.filter(t => t.netPL < 0).reduce((sum, t) => sum + t.netPL, 0));
  metrics.value.profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '999';

  let streak = 0, maxWin = 0, maxLoss = 0, lastWin = null;
  [...sellTrades].reverse().forEach(t => {
    const isWin = t.netPL > 0;
    if (lastWin === null || lastWin === isWin) {
      streak++;
    } else {
      if (lastWin) maxWin = Math.max(maxWin, streak);
      else maxLoss = Math.max(maxLoss, streak);
      streak = 1;
    }
    lastWin = isWin;
  });
  if (lastWin) maxWin = Math.max(maxWin, streak);
  else maxLoss = Math.max(maxLoss, streak);

  metrics.value.consecutiveWins = maxWin;
  metrics.value.consecutiveLosses = maxLoss;
}

function renderChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (chartInst) chartInst.destroy();
  
  chartInst = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [{
        label: symbol.value,
        data: candles.value,
        color: { up: '#10b981', down: '#ef4444', unchanged: '#6b7280' },
        borderColor: { up: '#059669', down: '#dc2626', unchanged: '#4b5563' },
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: 'time', display: true, grid: { display: false }, ticks: { color: '#64748b', maxTicksLimit: 8 } },
        y: { position: 'right', grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b' } }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      animation: { duration: 300 }
    }
  });
}

async function updateTickers() {
  try {
    const promises = symbols.map(async (s) => {
      const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`);
      const d = await r.json();
      marketData[s].price = parseFloat(d.lastPrice);
      marketData[s].change = parseFloat(d.priceChangePercent);
    });
    await Promise.all(promises);
    
    // Update current position P/L if we have one
    if (currentPosition.value && candles.value.length > 0) {
      const currentPrice = marketData[symbol.value].price;
      const currentGrossPL = currentPrice - currentPosition.value.price;
      const estimatedFees = (currentPosition.value.price + currentPrice) * feePercent;
      const currentNetPL = currentGrossPL - estimatedFees;
      
      currentPosition.value.currentPrice = currentPrice;
      currentPosition.value.currentPL = currentNetPL;
      currentPosition.value.currentPercent = (currentNetPL / currentPosition.value.price) * 100;
      
      // Update peak if current price is higher
      if (currentPrice > currentPosition.value.peak) {
        currentPosition.value.peak = currentPrice;
      }
      
      // Update trailing take profit
      currentPosition.value.takeProfit = currentPosition.value.peak * (1 - takeProfit.value);
    }
  } catch (e) {
    console.error('Ticker error:', e);
  }
}

function switchSymbol(newSymbol) {
  if (symbol.value === newSymbol) return;
  symbol.value = newSymbol;
  fetchEngine();
}

onMounted(async () => {
  await updateTickers();
  await fetchEngine();
  
  setInterval(updateTickers, 10000);
  setInterval(fetchEngine, 900000);
});

watch(symbol, () => fetchEngine());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.6); }
</style>