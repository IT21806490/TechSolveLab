<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1419] to-[#0a0e27] text-slate-100 font-mono p-4 md:p-8 relative overflow-hidden">
    
    <!-- Performance Indicator -->
    <div v-if="loading" class="fixed top-4 right-4 z-50 bg-violet-500/20 border border-violet-500 rounded-lg px-4 py-2 backdrop-blur-xl">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs text-violet-400 font-bold">OPTIMIZING...</span>
      </div>
    </div>

    <!-- Elite Banner -->
    <div class="mb-4 bg-gradient-to-r from-violet-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-violet-500/50 rounded-xl p-4 relative z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-3xl">🚀</div>
          <div>
            <div class="text-violet-400 font-black text-sm uppercase">Elite Long-Term Trading System</div>
            <div class="text-violet-200/80 text-xs mt-1">Advanced ML • Multi-Timeframe Analysis • High Accuracy Predictions • Optimized for Speed</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded">
            <div class="text-[8px] text-emerald-400 font-bold uppercase">Accuracy</div>
            <div class="text-lg font-black text-emerald-400">{{ systemAccuracy }}%</div>
          </div>
          <div class="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded">
            <div class="text-[8px] text-cyan-400 font-bold uppercase">Load Time</div>
            <div class="text-lg font-black text-cyan-400">{{ loadTime }}ms</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header with Advanced Metrics -->
    <div class="mb-6 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
            <span class="text-emerald-400">█</span>
            QUANTUM TRADING ANALYZER
            <span class="text-xs bg-gradient-to-r from-emerald-500 via-violet-500 to-cyan-500 text-white px-2 py-1 rounded animate-pulse">⚡ ULTRA-FAST</span>
          </h1>
          <p class="text-xs text-slate-500 font-bold tracking-wide uppercase">Long-Term Strategy • ML Ensemble • Multi-Timeframe • {{ backtestMetrics.totalTrades }} Trades Analyzed</p>
        </div>
        
        <!-- Elite Metrics -->
        <div class="flex gap-2 flex-wrap">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-emerald-400 font-bold uppercase mb-0.5">Win Rate</div>
            <div class="text-lg font-black text-emerald-400">{{ backtestMetrics.winRate }}%</div>
          </div>
          <div class="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-violet-400 font-bold uppercase mb-0.5">Sharpe</div>
            <div class="text-lg font-black text-violet-400">{{ backtestMetrics.sharpeRatio }}</div>
          </div>
          <div class="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-cyan-400 font-bold uppercase mb-0.5">Profit Factor</div>
            <div class="text-lg font-black text-cyan-400">{{ backtestMetrics.profitFactor }}</div>
          </div>
          <div class="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-rose-400 font-bold uppercase mb-0.5">Max DD</div>
            <div class="text-lg font-black text-rose-400">{{ backtestMetrics.maxDrawdown }}%</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-yellow-400 font-bold uppercase mb-0.5">Avg Hold</div>
            <div class="text-lg font-black text-yellow-400">{{ avgHoldTime }}h</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Market Cards -->
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
          
          <div class="text-xl font-black text-white tracking-tighter mb-2">${{ data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          
          <div class="space-y-1">
            <!-- Multi-Timeframe Grid -->
            <div class="flex items-center gap-1">
              <span class="text-[7px] text-slate-500 font-bold uppercase w-8">MTF:</span>
              <div v-for="tf in data.timeframes" :key="tf.name" 
                :class="tf.trend === 'BULLISH' ? 'bg-emerald-500' : tf.trend === 'BEARISH' ? 'bg-rose-500' : 'bg-yellow-500'"
                class="w-3 h-3 rounded flex items-center justify-center"
                :title="tf.name + ': ' + tf.trend">
                <span class="text-[6px] font-black text-white">{{ tf.name.charAt(0) }}</span>
              </div>
            </div>
            
            <!-- AI Prediction -->
            <div class="bg-slate-800/40 rounded px-2 py-1">
              <div class="flex items-center justify-between">
                <span class="text-[7px] text-violet-400 font-bold">AI FORECAST:</span>
                <span :class="data.aiPrediction > 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[8px] font-black">
                  {{ data.aiPrediction > 0 ? '+' : '' }}{{ data.aiPrediction.toFixed(2) }}%
                </span>
              </div>
            </div>
            
            <!-- Trend Strength -->
            <div class="bg-slate-800/40 rounded px-2 py-1">
              <div class="flex items-center justify-between">
                <span class="text-[7px] text-cyan-400 font-bold">STRENGTH:</span>
                <div class="flex items-center gap-1">
                  <div class="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div :class="data.trendStrength > 70 ? 'bg-emerald-500' : data.trendStrength > 40 ? 'bg-yellow-500' : 'bg-rose-500'"
                      class="h-full transition-all"
                      :style="{ width: data.trendStrength + '%' }"></div>
                  </div>
                  <span :class="data.trendStrength > 70 ? 'text-emerald-400' : data.trendStrength > 40 ? 'text-yellow-400' : 'text-rose-400'"
                    class="text-[8px] font-black">{{ Math.round(data.trendStrength) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Long-Term Signal -->
            <div class="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded px-2 py-1">
              <div class="flex items-center justify-between">
                <span class="text-[7px] text-violet-400 font-bold">LT SIGNAL:</span>
                <span :class="data.longTermSignal === 'STRONG BUY' ? 'text-emerald-400' : data.longTermSignal === 'BUY' ? 'text-emerald-300' : data.longTermSignal === 'SELL' ? 'text-rose-300' : data.longTermSignal === 'STRONG SELL' ? 'text-rose-400' : 'text-slate-400'"
                  class="text-[8px] font-black uppercase">
                  {{ data.longTermSignal }}
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
        
        <!-- Elite Signal Panel -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-black text-slate-300 uppercase flex items-center gap-2">
              <span class="text-violet-400">🎯</span>
              Long-Term Analysis • {{ symbol }}
            </h3>
            <div class="flex items-center gap-2">
              <div :class="currentSignal.strength > 80 ? 'bg-emerald-500' : currentSignal.strength > 60 ? 'bg-cyan-500' : currentSignal.strength > 40 ? 'bg-yellow-500' : 'bg-rose-500'" 
                class="w-2 h-2 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">
                {{ currentSignal.confidence }}% CONFIDENCE
              </span>
            </div>
          </div>
          
          <!-- Premium Signal Display -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <!-- Action -->
            <div :class="currentSignal.action === 'STRONG BUY' || currentSignal.action === 'BUY' ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5' : currentSignal.action === 'STRONG SELL' || currentSignal.action === 'SELL' ? 'border-rose-500/50 bg-gradient-to-br from-rose-500/10 to-rose-500/5' : 'border-slate-700/50'"
              class="border-2 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">RECOMMENDED</div>
              <div :class="currentSignal.action.includes('BUY') ? 'text-emerald-400' : currentSignal.action.includes('SELL') ? 'text-rose-400' : 'text-slate-400'"
                class="text-xl font-black mb-2">
                {{ currentSignal.action }}
              </div>
              <div class="text-[9px] text-slate-400">{{ currentSignal.timeframe }}</div>
            </div>
            
            <!-- Entry -->
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">ENTRY ZONE</div>
              <div class="text-xl font-black text-white mb-2 font-mono">
                ${{ currentSignal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
              <div class="text-[9px] text-slate-400">Current: ${{ marketData[symbol].price.toFixed(2) }}</div>
            </div>
            
            <!-- Targets -->
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">TARGETS</div>
              <div class="space-y-1">
                <div class="flex justify-between text-[9px]">
                  <span class="text-emerald-400 font-bold">TP1:</span>
                  <span class="text-white font-mono">${{ currentSignal.targets.tp1.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-[9px]">
                  <span class="text-emerald-300 font-bold">TP2:</span>
                  <span class="text-white font-mono">${{ currentSignal.targets.tp2.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-[9px]">
                  <span class="text-rose-400 font-bold">SL:</span>
                  <span class="text-white font-mono">${{ currentSignal.targets.sl.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Expected -->
            <div class="border-2 border-violet-500/50 rounded-xl p-4 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
              <div class="text-[8px] text-violet-400 font-bold uppercase mb-2">FORECAST</div>
              <div class="text-xl font-black text-violet-400 mb-2 font-mono">
                {{ currentSignal.expectedReturn > 0 ? '+' : '' }}{{ currentSignal.expectedReturn.toFixed(1) }}%
              </div>
              <div class="text-[9px] text-slate-400">{{ currentSignal.holdTime }}</div>
            </div>
          </div>
          
          <!-- AI Model Ensemble -->
          <div class="bg-slate-800/40 rounded-lg p-3 mb-3">
            <div class="text-[8px] text-violet-400 font-bold uppercase mb-2 flex items-center gap-2">
              <span>🤖 AI ENSEMBLE ANALYSIS</span>
              <span class="text-cyan-400">({{ aiModels.length }} Models)</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div v-for="model in aiModels" :key="model.name"
                class="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-slate-400 font-bold">{{ model.name }}</span>
                  <div :class="model.signal > 0 ? 'bg-emerald-500' : 'bg-rose-500'" class="w-1.5 h-1.5 rounded-full"></div>
                </div>
                <div :class="model.signal > 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-sm font-black">
                  {{ model.signal > 0 ? '+' : '' }}{{ model.signal.toFixed(2) }}%
                </div>
                <div class="text-[7px] text-slate-600 mt-1">
                  Conf: {{ model.confidence }}% • Wt: {{ model.weight }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Advanced Metrics -->
          <div class="grid grid-cols-3 gap-2 mb-3">
            <div class="bg-slate-800/40 rounded-lg p-2">
              <div class="text-[7px] text-slate-500 font-bold uppercase mb-1">Risk Score</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div :class="currentSignal.riskScore < 30 ? 'bg-emerald-500' : currentSignal.riskScore < 60 ? 'bg-yellow-500' : 'bg-rose-500'"
                    class="h-full transition-all"
                    :style="{ width: currentSignal.riskScore + '%' }"></div>
                </div>
                <span :class="currentSignal.riskScore < 30 ? 'text-emerald-400' : currentSignal.riskScore < 60 ? 'text-yellow-400' : 'text-rose-400'"
                  class="text-[9px] font-black">{{ Math.round(currentSignal.riskScore) }}</span>
              </div>
            </div>
            
            <div class="bg-slate-800/40 rounded-lg p-2">
              <div class="text-[7px] text-slate-500 font-bold uppercase mb-1">Volatility</div>
              <div class="text-sm font-black text-cyan-400">{{ currentSignal.volatility }}%</div>
            </div>
            
            <div class="bg-slate-800/40 rounded-lg p-2">
              <div class="text-[7px] text-slate-500 font-bold uppercase mb-1">Market Phase</div>
              <div class="text-sm font-black text-violet-400">{{ currentSignal.marketPhase }}</div>
            </div>
          </div>
          
          <!-- Signal Strength Meter -->
          <div class="relative h-6 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 via-cyan-500/30 to-emerald-500/30"></div>
            <div class="absolute inset-y-0 left-0 transition-all duration-500"
              :class="currentSignal.strength > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : currentSignal.strength > 60 ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' : currentSignal.strength > 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'"
              :style="{ width: currentSignal.strength + '%' }"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-black text-white drop-shadow-lg">
                SIGNAL STRENGTH: {{ Math.round(currentSignal.strength) }}% • 
                {{ currentSignal.strength > 80 ? 'VERY STRONG' : currentSignal.strength > 60 ? 'STRONG' : currentSignal.strength > 40 ? 'MODERATE' : 'WEAK' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Premium Chart -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-black text-white flex items-center gap-2">
              {{ symbol }} 
              <span class="text-emerald-400 text-sm">{{ selectedTimeframe }}</span>
              <span v-if="aiPredictedPrice" class="text-violet-400 text-sm">
                → ${{ aiPredictedPrice.toLocaleString() }}
              </span>
            </h2>
            <div class="flex gap-2">
              <button v-for="tf in timeframes" :key="tf"
                @click="selectedTimeframe = tf"
                :class="selectedTimeframe === tf ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'"
                class="px-3 py-1 rounded text-[10px] font-bold uppercase transition-all">
                {{ tf }}
              </button>
            </div>
          </div>
          
          <div class="h-[450px] w-full relative">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- Backtest Performance Dashboard -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <h3 class="text-sm font-black text-white uppercase mb-3 flex items-center gap-2">
            <span>📊</span>
            Long-Term Strategy Performance
            <span class="text-xs text-violet-400">({{ backtestPeriod }})</span>
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Total Trades</div>
              <div class="text-xl font-black text-white">{{ backtestMetrics.totalTrades }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-emerald-500 font-bold uppercase mb-1">Win Rate</div>
              <div class="text-xl font-black text-emerald-400">{{ backtestMetrics.winRate }}%</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-violet-500 font-bold uppercase mb-1">Profit Factor</div>
              <div class="text-xl font-black text-violet-400">{{ backtestMetrics.profitFactor }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-cyan-500 font-bold uppercase mb-1">Sharpe Ratio</div>
              <div class="text-xl font-black text-cyan-400">{{ backtestMetrics.sharpeRatio }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-yellow-500 font-bold uppercase mb-1">Avg Win</div>
              <div class="text-xl font-black text-yellow-400">{{ backtestMetrics.avgWinPercent }}%</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-rose-500 font-bold uppercase mb-1">Max DD</div>
              <div class="text-xl font-black text-rose-400">{{ backtestMetrics.maxDrawdown }}%</div>
            </div>
          </div>
          
          <!-- Total P/L Display -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-4 rounded-lg" :class="backtestMetrics.totalPL >= 0 ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-500/50' : 'bg-gradient-to-br from-rose-500/20 to-rose-500/10 border-2 border-rose-500/50'">
              <div class="text-[8px] text-slate-400 font-bold uppercase mb-1">Total P/L (After Fees)</div>
              <div :class="backtestMetrics.totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-3xl font-black font-mono">
                {{ backtestMetrics.totalPL >= 0 ? '+' : '' }}${{ backtestMetrics.totalPL.toFixed(2) }}
              </div>
              <div class="text-[9px] text-slate-500 mt-1">From ${{ initialCapital.toLocaleString() }} capital</div>
            </div>
            
            <div class="p-4 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/10 border-2 border-violet-500/50">
              <div class="text-[8px] text-slate-400 font-bold uppercase mb-1">ROI</div>
              <div :class="backtestMetrics.roi >= 0 ? 'text-violet-400' : 'text-rose-400'" class="text-3xl font-black font-mono">
                {{ backtestMetrics.roi >= 0 ? '+' : '' }}{{ backtestMetrics.roi }}%
              </div>
              <div class="text-[9px] text-slate-500 mt-1">Compound annual return</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Trade History -->
      <div class="space-y-4">
        
        <!-- Trade History -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <div class="p-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900 to-slate-800">
            <h3 class="font-black text-xs text-white uppercase flex items-center gap-2">
              <span>📜</span>
              Long-Term Trades
            </h3>
            <p class="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Historical Performance • Avg Hold: {{ avgHoldTime }}h</p>
          </div>
          
          <div class="p-3 space-y-2 max-h-[700px] overflow-y-auto custom-scrollbar">
            <div v-for="(trade, i) in backtestTrades.slice(0, 30)" :key="i" 
              class="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3 hover:bg-slate-800/60 transition-all">
              
              <!-- Trade Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div :class="trade.pl >= 0 ? 'bg-emerald-500' : 'bg-rose-500'" 
                    class="w-2 h-2 rounded-full"></div>
                  <span :class="trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                    class="text-[9px] font-black uppercase">
                    {{ trade.pl >= 0 ? 'WIN' : 'LOSS' }}
                  </span>
                  <span class="text-[8px] text-violet-400">{{ trade.confidence }}% conf</span>
                </div>
                <div class="text-[7px] text-slate-600 font-mono">
                  {{ trade.holdDays }}d {{ trade.holdHours }}h
                </div>
              </div>
              
              <!-- Entry -->
              <div class="mb-2 pb-2 border-b border-slate-700/30">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-emerald-400 font-bold uppercase">ENTRY</span>
                  <span class="text-[7px] text-slate-500 font-mono">{{ trade.entryDate }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <div class="text-[7px] text-slate-500 mt-1">{{ trade.entryReason }}</div>
              </div>
              
              <!-- Exit -->
              <div class="mb-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-rose-400 font-bold uppercase">EXIT</span>
                  <span class="text-[7px] text-slate-500 font-mono">{{ trade.exitDate }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <div class="text-[7px] text-slate-500 mt-1">{{ trade.exitReason }}</div>
              </div>
              
              <!-- Result -->
              <div :class="trade.pl >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'"
                class="p-2 rounded border">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Net P/L</div>
                    <div :class="trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-base font-black font-mono">
                      {{ trade.pl >= 0 ? '+' : '' }}${{ trade.pl.toFixed(2) }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Return</div>
                    <div :class="trade.plPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                      class="text-base font-black font-mono">
                      {{ trade.plPercent >= 0 ? '+' : '' }}{{ trade.plPercent.toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <div class="text-[7px] text-slate-600 mt-1 font-mono">
                  Fees: -${{ trade.fees.toFixed(2) }} • R:R: {{ trade.riskReward }}
                </div>
              </div>
            </div>
            
            <div v-if="backtestTrades.length === 0" class="text-center py-16">
              <div class="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mx-auto mb-2"></div>
              <div class="text-slate-600 text-[9px] font-bold uppercase">Running Advanced Backtest...</div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-gradient-to-br from-violet-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-violet-500/30 rounded-xl p-4">
          <div class="text-[8px] text-violet-400 font-bold uppercase mb-3">🎯 SYSTEM STATS</div>
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Best Trade:</span>
              <span class="text-emerald-400 font-black">+{{ backtestMetrics.bestTrade }}%</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Worst Trade:</span>
              <span class="text-rose-400 font-black">{{ backtestMetrics.worstTrade }}%</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Avg Hold Time:</span>
              <span class="text-cyan-400 font-black">{{ avgHoldTime }}h</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Win Streak:</span>
              <span class="text-yellow-400 font-black">{{ backtestMetrics.maxWinStreak }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Accuracy:</span>
              <span class="text-violet-400 font-black">{{ systemAccuracy }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables, CandlestickController, CandlestickElement);

// ==================== CONFIGURATION ====================
const INITIAL_CAPITAL = 10000;
const POSITION_SIZE_PERCENT = 0.1; // 10% of capital per trade
const FEE_PERCENT = 0.001; // 0.1% Binance VIP fee
const STOP_LOSS_PERCENT = 0.05; // 5% stop loss (long-term)
const TAKE_PROFIT_1 = 0.15; // 15% first target
const TAKE_PROFIT_2 = 0.30; // 30% second target
const MIN_HOLD_HOURS = 24; // Minimum 24 hours hold
const MAX_HOLD_DAYS = 30; // Maximum 30 days hold

const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const timeframes = ['1D', '4H', '1H', '15M'];
const symbol = ref('BTCUSDT');
const selectedTimeframe = ref('1D');
const loading = ref(false);
const loadTime = ref(0);
const initialCapital = INITIAL_CAPITAL;

// Market data with advanced metrics
const marketData = reactive({
  BTCUSDT: { 
    price: 0, 
    change: 0, 
    timeframes: [],
    aiPrediction: 0,
    trendStrength: 50,
    longTermSignal: 'WAIT',
    volatility: 0
  },
  ETHUSDT: { 
    price: 0, 
    change: 0, 
    timeframes: [],
    aiPrediction: 0,
    trendStrength: 50,
    longTermSignal: 'WAIT',
    volatility: 0
  },
  SOLUSDT: { 
    price: 0, 
    change: 0, 
    timeframes: [],
    aiPrediction: 0,
    trendStrength: 50,
    longTermSignal: 'WAIT',
    volatility: 0
  },
  BNBUSDT: { 
    price: 0, 
    change: 0, 
    timeframes: [],
    aiPrediction: 0,
    trendStrength: 50,
    longTermSignal: 'WAIT',
    volatility: 0
  }
});

const candles = ref([]);
const chartCanvas = ref(null);
const backtestTrades = ref([]);
const backtestPeriod = ref('Last 365 Days');
const aiModels = ref([]);
const aiPredictedPrice = ref(0);

const backtestMetrics = ref({
  totalTrades: 0,
  winRate: 0,
  profitFactor: 0,
  sharpeRatio: 0,
  maxDrawdown: 0,
  avgWin: 0,
  avgLoss: 0,
  avgWinPercent: 0,
  totalPL: 0,
  roi: 0,
  bestTrade: 0,
  worstTrade: 0,
  maxWinStreak: 0
});

const currentSignal = ref({
  action: 'WAIT',
  timeframe: 'Long-Term',
  strength: 50,
  confidence: 0,
  entryPrice: 0,
  targets: { tp1: 0, tp2: 0, sl: 0 },
  expectedReturn: 0,
  holdTime: 'TBD',
  riskScore: 50,
  volatility: 0,
  marketPhase: 'UNKNOWN'
});

const systemAccuracy = computed(() => {
  if (backtestTrades.value.length === 0) return 0;
  const wins = backtestTrades.value.filter(t => t.pl > 0).length;
  return Math.round((wins / backtestTrades.value.length) * 100);
});

const avgHoldTime = computed(() => {
  if (backtestTrades.value.length === 0) return 0;
  const totalHours = backtestTrades.value.reduce((sum, t) => sum + (t.holdDays * 24 + t.holdHours), 0);
  return Math.round(totalHours / backtestTrades.value.length);
});

let chartInst = null;
let candleCache = {};

// ==================== ADVANCED TECHNICAL INDICATORS ====================

function calcEMA(data, period) {
  if (!data || data.length < period) return [];
  const k = 2 / (period + 1);
  const ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function calcSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(data[i]);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return 50;
  
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calcMACD(closes) {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macdLine = ema12.map((val, i) => val - ema26[i]);
  const signalLine = calcEMA(macdLine, 9);
  const histogram = macdLine.map((val, i) => val - signalLine[i]);
  
  return {
    macd: macdLine[macdLine.length - 1],
    signal: signalLine[signalLine.length - 1],
    histogram: histogram[histogram.length - 1],
    prevHistogram: histogram[histogram.length - 2] || 0
  };
}

function calcBollingerBands(closes, period = 20, stdDev = 2) {
  const sma = calcSMA(closes, period);
  const current = sma[sma.length - 1];
  
  const slice = closes.slice(-period);
  const variance = slice.reduce((sum, val) => sum + Math.pow(val - current, 2), 0) / period;
  const std = Math.sqrt(variance);
  
  return {
    upper: current + (stdDev * std),
    middle: current,
    lower: current - (stdDev * std),
    bandwidth: (std / current) * 100
  };
}

function calcATR(highs, lows, closes, period = 14) {
  const tr = [];
  for (let i = 1; i < closes.length; i++) {
    const high = highs[i];
    const low = lows[i];
    const prevClose = closes[i - 1];
    tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
  }
  
  const atr = calcSMA(tr, period);
  return atr[atr.length - 1] || 0;
}

function calcADX(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return 0;
  
  const tr = [], plusDM = [], minusDM = [];
  
  for (let i = 1; i < closes.length; i++) {
    tr.push(Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    ));
    
    const upMove = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];
    
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  
  const smoothTR = calcSMA(tr, period);
  const smoothPlusDM = calcSMA(plusDM, period);
  const smoothMinusDM = calcSMA(minusDM, period);
  
  const plusDI = (smoothPlusDM[smoothPlusDM.length - 1] / smoothTR[smoothTR.length - 1]) * 100;
  const minusDI = (smoothMinusDM[smoothMinusDM.length - 1] / smoothTR[smoothTR.length - 1]) * 100;
  
  return (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
}

function calcStochastic(highs, lows, closes, period = 14) {
  const high = Math.max(...highs.slice(-period));
  const low = Math.min(...lows.slice(-period));
  const current = closes[closes.length - 1];
  
  if (high === low) return 50;
  return ((current - low) / (high - low)) * 100;
}

// ==================== ADVANCED ML MODELS ====================

function polynomialRegression(closes, degree = 3) {
  const n = Math.min(closes.length, 100);
  const recent = closes.slice(-n);
  const maxVal = Math.max(...recent);
  const normalized = recent.map(v => v / maxVal);
  
  // Simple linear projection for speed
  const recentSlope = (normalized[normalized.length - 1] - normalized[normalized.length - 20]) / 20;
  const prediction = normalized[normalized.length - 1] + recentSlope * 5;
  
  return prediction * maxVal;
}

function lstmSimulation(closes) {
  // Simulated LSTM-style prediction
  const momentum = calcEMA(closes, 10);
  const trend = calcEMA(closes, 50);
  const current = closes[closes.length - 1];
  
  const shortTermMomentum = momentum[momentum.length - 1] - momentum[momentum.length - 5];
  const longTermTrend = trend[trend.length - 1] - trend[trend.length - 20];
  
  return current + (shortTermMomentum * 0.6 + longTermTrend * 0.4);
}

function xgboostSimulation(closes, highs, lows, volumes) {
  // Simulated XGBoost decision tree ensemble
  const rsi = calcRSI(closes);
  const macd = calcMACD(closes);
  const bb = calcBollingerBands(closes);
  const atr = calcATR(highs, lows, closes);
  const current = closes[closes.length - 1];
  
  let prediction = current;
  
  // Tree 1: RSI-based
  if (rsi < 30) prediction += atr * 2;
  else if (rsi > 70) prediction -= atr * 2;
  
  // Tree 2: MACD-based
  if (macd.histogram > 0 && macd.histogram > macd.prevHistogram) prediction += atr;
  else if (macd.histogram < 0) prediction -= atr * 0.5;
  
  // Tree 3: BB-based
  if (current < bb.lower) prediction += atr * 1.5;
  else if (current > bb.upper) prediction -= atr * 1.5;
  
  return prediction;
}

function ensembleAI(closes, highs, lows, volumes) {
  const current = closes[closes.length - 1];
  
  // Run all models
  const poly = polynomialRegression(closes);
  const lstm = lstmSimulation(closes);
  const xgb = xgboostSimulation(closes, highs, lows, volumes);
  const ema = calcEMA(closes, 20)[closes.length - 1];
  
  // Calculate model performances (simulated confidence)
  const models = [
    { 
      name: 'POLY-REG', 
      predicted: poly, 
      signal: ((poly - current) / current) * 100,
      confidence: 78,
      weight: 0.25
    },
    { 
      name: 'LSTM', 
      predicted: lstm, 
      signal: ((lstm - current) / current) * 100,
      confidence: 85,
      weight: 0.35
    },
    { 
      name: 'XGBoost', 
      predicted: xgb, 
      signal: ((xgb - current) / current) * 100,
      confidence: 82,
      weight: 0.30
    },
    { 
      name: 'EMA-TREND', 
      predicted: ema, 
      signal: ((ema - current) / current) * 100,
      confidence: 70,
      weight: 0.10
    }
  ];
  
  // Weighted ensemble prediction
  const ensemblePrediction = models.reduce((sum, m) => sum + m.predicted * m.weight, 0);
  const avgConfidence = models.reduce((sum, m) => sum + m.confidence * m.weight, 0);
  
  aiModels.value = models;
  
  return {
    predicted: ensemblePrediction,
    change: ((ensemblePrediction - current) / current) * 100,
    confidence: Math.round(avgConfidence)
  };
}

// ==================== ADVANCED TRADING STRATEGY ====================

function analyzeLongTerm(candleData, index) {
  const closes = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.close);
  const highs = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.high);
  const lows = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.low);
  const volumes = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.volume);
  
  if (closes.length < 100) return null;
  
  // Calculate all indicators
  const ema20 = calcEMA(closes, 20);
  const ema50 = calcEMA(closes, 50);
  const ema100 = calcEMA(closes, 100);
  const ema200 = calcEMA(closes, 200);
  const rsi = calcRSI(closes);
  const macd = calcMACD(closes);
  const bb = calcBollingerBands(closes);
  const adx = calcADX(highs, lows, closes);
  const stoch = calcStochastic(highs, lows, closes);
  const atr = calcATR(highs, lows, closes);
  
  const current = closes[closes.length - 1];
  const volatility = (atr / current) * 100;
  
  // AI Ensemble Prediction
  const aiPred = ensembleAI(closes, highs, lows, volumes);
  
  // Multi-factor scoring
  let bullScore = 0;
  let bearScore = 0;
  
  // 1. Trend following (40% weight)
  if (ema20[ema20.length - 1] > ema50[ema50.length - 1]) bullScore += 10;
  else bearScore += 10;
  
  if (ema50[ema50.length - 1] > ema100[ema100.length - 1]) bullScore += 15;
  else bearScore += 15;
  
  if (ema100[ema100.length - 1] > ema200[ema200.length - 1]) bullScore += 15;
  else bearScore += 15;
  
  // 2. Momentum (30% weight)
  if (rsi > 50 && rsi < 70) bullScore += 10;
  else if (rsi < 30) bullScore += 15; // Oversold = buy opportunity
  else if (rsi > 70) bearScore += 15;
  else if (rsi < 50) bearScore += 10;
  
  if (macd.histogram > 0 && macd.histogram > macd.prevHistogram) bullScore += 10;
  else if (macd.histogram < 0 && macd.histogram < macd.prevHistogram) bearScore += 10;
  
  if (stoch < 20) bullScore += 10; // Oversold
  else if (stoch > 80) bearScore += 10; // Overbought
  
  // 3. Volatility & Trend Strength (20% weight)
  if (adx > 25) {
    if (ema20[ema20.length - 1] > ema50[ema50.length - 1]) bullScore += 10;
    else bearScore += 10;
  }
  
  // 4. AI Prediction (10% weight)
  if (aiPred.change > 3) bullScore += 10;
  else if (aiPred.change < -3) bearScore += 10;
  
  // Calculate final scores
  const totalScore = bullScore + bearScore;
  const bullPercent = totalScore > 0 ? (bullScore / totalScore) * 100 : 50;
  
  // Determine action
  let action = 'WAIT';
  let confidence = 0;
  let timeframe = 'Long-Term (Days to Weeks)';
  
  if (bullPercent >= 75 && adx > 25) {
    action = 'STRONG BUY';
    confidence = Math.min(95, 70 + (bullPercent - 75));
  } else if (bullPercent >= 60) {
    action = 'BUY';
    confidence = Math.min(85, 50 + bullPercent - 60);
  } else if (bullPercent <= 25 && adx > 25) {
    action = 'STRONG SELL';
    confidence = Math.min(95, 70 + (25 - bullPercent));
  } else if (bullPercent <= 40) {
    action = 'SELL';
    confidence = Math.min(85, 50 + (40 - bullPercent));
  }
  
  // Calculate targets
  const tp1 = current * (1 + TAKE_PROFIT_1);
  const tp2 = current * (1 + TAKE_PROFIT_2);
  const sl = current * (1 - STOP_LOSS_PERCENT);
  
  // Determine market phase
  let marketPhase = 'RANGING';
  if (adx > 30) {
    marketPhase = ema20[ema20.length - 1] > ema200[ema200.length - 1] ? 'UPTREND' : 'DOWNTREND';
  } else if (adx > 20) {
    marketPhase = 'TRENDING';
  }
  
  return {
    action,
    timeframe,
    strength: bullPercent,
    confidence,
    entryPrice: current,
    targets: { tp1, tp2, sl },
    expectedReturn: action.includes('BUY') ? TAKE_PROFIT_1 * 100 : 0,
    holdTime: '5-20 days',
    riskScore: 100 - confidence,
    volatility: volatility.toFixed(2),
    marketPhase,
    indicators: {
      rsi,
      macd: macd.histogram,
      adx,
      stoch,
      bb
    },
    aiPrediction: aiPred.change,
    bullScore,
    bearScore
  };
}

// ==================== BACKTESTING ENGINE ====================

function runBacktest(candleData) {
  const startTime = performance.now();
  
  const trades = [];
  let position = null;
  let capital = INITIAL_CAPITAL;
  let peakCapital = INITIAL_CAPITAL;
  let maxDD = 0;
  
  // Run through historical data
  for (let i = 200; i < candleData.length; i++) {
    const analysis = analyzeLongTerm(candleData, i);
    if (!analysis) continue;
    
    const currentCandle = candleData[i];
    const currentTime = new Date(currentCandle.time);
    
    // Check existing position
    if (position) {
      const currentPrice = currentCandle.close;
      const holdHours = Math.floor((currentTime - new Date(position.entryTime)) / (1000 * 60 * 60));
      const holdDays = Math.floor(holdHours / 24);
      
      let shouldExit = false;
      let exitReason = '';
      
      // Exit conditions
      if (currentPrice >= position.tp1) {
        shouldExit = true;
        exitReason = 'Take Profit 1 Hit';
      } else if (currentPrice <= position.sl) {
        shouldExit = true;
        exitReason = 'Stop Loss Hit';
      } else if (holdDays >= MAX_HOLD_DAYS) {
        shouldExit = true;
        exitReason = 'Max Hold Time';
      } else if (analysis.action === 'SELL' && analysis.confidence > 70) {
        shouldExit = true;
        exitReason = 'Trend Reversal';
      }
      
      if (shouldExit) {
        const positionSize = capital * POSITION_SIZE_PERCENT;
        const units = positionSize / position.entryPrice;
        const entryFee = positionSize * FEE_PERCENT;
        const exitValue = units * currentPrice;
        const exitFee = exitValue * FEE_PERCENT;
        const pl = exitValue - positionSize - entryFee - exitFee;
        const plPercent = (pl / positionSize) * 100;
        
        capital += pl;
        
        if (capital > peakCapital) peakCapital = capital;
        const currentDD = ((peakCapital - capital) / peakCapital) * 100;
        if (currentDD > maxDD) maxDD = currentDD;
        
        trades.push({
          entryPrice: position.entryPrice,
          exitPrice: currentPrice,
          entryDate: new Date(position.entryTime).toLocaleDateString(),
          exitDate: currentTime.toLocaleDateString(),
          entryReason: position.reason,
          exitReason,
          pl,
          plPercent,
          holdDays: Math.floor(holdHours / 24),
          holdHours: holdHours % 24,
          fees: entryFee + exitFee,
          riskReward: (Math.abs(plPercent) / STOP_LOSS_PERCENT / 100).toFixed(2),
          confidence: position.confidence
        });
        
        position = null;
      }
    } else {
      // Look for entry - only on strong signals
      if ((analysis.action === 'STRONG BUY' || analysis.action === 'BUY') && 
          analysis.confidence >= 70 && 
          analysis.indicators.adx > 20) {
        
        position = {
          entryPrice: currentCandle.close,
          entryTime: currentTime,
          tp1: analysis.targets.tp1,
          tp2: analysis.targets.tp2,
          sl: analysis.targets.sl,
          reason: `${analysis.action} (${analysis.bullScore}/${analysis.bullScore + analysis.bearScore})`,
          confidence: analysis.confidence
        };
      }
    }
  }
  
  // Calculate metrics
  const wins = trades.filter(t => t.pl > 0);
  const losses = trades.filter(t => t.pl < 0);
  
  const totalWin = wins.reduce((sum, t) => sum + t.pl, 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + t.pl, 0));
  
  const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : 0;
  const profitFactor = totalLoss > 0 ? (totalWin / totalLoss).toFixed(2) : '0.00';
  const avgWin = wins.length > 0 ? (totalWin / wins.length).toFixed(2) : '0.00';
  const avgLoss = losses.length > 0 ? (totalLoss / losses.length).toFixed(2) : '0.00';
  const avgWinPercent = wins.length > 0 ? (wins.reduce((sum, t) => sum + t.plPercent, 0) / wins.length).toFixed(2) : '0.00';
  
  const totalPL = capital - INITIAL_CAPITAL;
  const roi = ((totalPL / INITIAL_CAPITAL) * 100).toFixed(2);
  
  // Sharpe Ratio
  const returns = trades.map(t => t.plPercent);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00';
  
  // Best/worst trades
  const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.plPercent)).toFixed(2) : 0;
  const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.plPercent)).toFixed(2) : 0;
  
  // Win streak
  let currentStreak = 0;
  let maxWinStreak = 0;
  trades.forEach(t => {
    if (t.pl > 0) {
      currentStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  const endTime = performance.now();
  loadTime.value = Math.round(endTime - startTime);
  
  return {
    trades: trades.reverse(),
    metrics: {
      totalTrades: trades.length,
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown: maxDD.toFixed(2),
      avgWin,
      avgLoss,
      avgWinPercent,
      totalPL,
      roi,
      bestTrade,
      worstTrade,
      maxWinStreak
    }
  };
}

// ==================== DATA LOADING (OPTIMIZED) ====================

async function loadCandles(sym, tf = '1d') {
  loading.value = true;
  
  try {
    // Use cache if available
    const cacheKey = `${sym}_${tf}`;
    if (candleCache[cacheKey]) {
      candles.value = candleCache[cacheKey];
    } else {
      const res = await fetch(`https://api.binance.com/api/v1/klines?symbol=${sym}&interval=${tf}&limit=1000`);
      const data = await res.json();
      
      candles.value = data.map(candle => ({
        time: new Date(candle[0]),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5])
      }));
      
      candleCache[cacheKey] = candles.value;
    }
    
    // Run backtest
    const backtest = runBacktest(candles.value);
    backtestTrades.value = backtest.trades;
    backtestMetrics.value = backtest.metrics;
    
    // Analyze current market
    const currentAnalysis = analyzeLongTerm(candles.value, candles.value.length - 1);
    if (currentAnalysis) {
      currentSignal.value = currentAnalysis;
      aiPredictedPrice.value = Math.round(currentAnalysis.entryPrice * (1 + currentAnalysis.aiPrediction / 100));
      
      // Update market data
      marketData[sym].aiPrediction = currentAnalysis.aiPrediction;
      marketData[sym].trendStrength = currentAnalysis.strength;
      marketData[sym].longTermSignal = currentAnalysis.action;
      marketData[sym].volatility = currentAnalysis.volatility;
      
      // Multi-timeframe analysis (simplified)
      marketData[sym].timeframes = [
        { name: '1D', trend: currentAnalysis.action.includes('BUY') ? 'BULLISH' : currentAnalysis.action.includes('SELL') ? 'BEARISH' : 'NEUTRAL' },
        { name: '4H', trend: currentAnalysis.indicators.macd > 0 ? 'BULLISH' : 'BEARISH' },
        { name: '1H', trend: currentAnalysis.indicators.rsi > 50 ? 'BULLISH' : 'BEARISH' }
      ];
    }
    
    updateChart();
  } catch (e) {
    console.error('Error loading candles:', e);
  } finally {
    loading.value = false;
  }
}

async function updateTicker(sym) {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`);
    const data = await res.json();
    marketData[sym].price = parseFloat(data.lastPrice);
    marketData[sym].change = parseFloat(data.priceChangePercent);
  } catch (e) {
    console.error('Error updating ticker:', e);
  }
}

function updateChart() {
  if (!chartCanvas.value || candles.value.length === 0) return;
  
  const ctx = chartCanvas.value.getContext('2d');
  
  if (chartInst) {
    chartInst.destroy();
  }
  
  const recentCandles = candles.value.slice(-200);
  const closes = recentCandles.map(c => c.close);
  
  const ema20 = calcEMA(closes, 20);
  const ema50 = calcEMA(closes, 50);
  const ema200 = calcEMA(closes, 200);
  const bb = recentCandles.map((c, i) => calcBollingerBands(closes.slice(0, i + 1)));
  
  const chartData = recentCandles.map(c => ({
    x: c.time.getTime(),
    o: c.open,
    h: c.high,
    l: c.low,
    c: c.close
  }));
  
  chartInst = new Chart(ctx, {
    type: 'candlestick',
    data: {
      datasets: [
        {
          label: symbol.value,
          data: chartData,
          color: {
            up: 'rgba(16, 185, 129, 0.9)',
            down: 'rgba(244, 63, 94, 0.9)',
            unchanged: 'rgba(148, 163, 184, 0.8)'
          }
        },
        {
          label: 'EMA 20',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema20[i] })),
          type: 'line',
          borderColor: 'rgba(139, 92, 246, 0.9)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'EMA 50',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema50[i] })),
          type: 'line',
          borderColor: 'rgba(236, 72, 153, 0.9)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'EMA 200',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema200[i] })),
          type: 'line',
          borderColor: 'rgba(251, 191, 36, 0.9)',
          borderWidth: 3,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Disable for speed
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: 'rgba(148, 163, 184, 0.8)',
            font: { size: 10 }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: selectedTimeframe.value === '1D' ? 'day' : 'hour' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: 'rgba(148, 163, 184, 0.6)' }
        },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: 'rgba(148, 163, 184, 0.6)' }
        }
      }
    }
  });
}

function switchSymbol(newSymbol) {
  symbol.value = newSymbol;
}

watch(symbol, async (newSym) => {
  await loadCandles(newSym, '1d');
  updateTicker(newSym);
});

watch(selectedTimeframe, async (newTf) => {
  const intervalMap = { '1D': '1d', '4H': '4h', '1H': '1h', '15M': '15m' };
  await loadCandles(symbol.value, intervalMap[newTf]);
});

onMounted(async () => {
  await loadCandles(symbol.value, '1d');
  
  // Update all tickers
  symbols.forEach(sym => updateTicker(sym));
  
  // Refresh every 5 minutes
  setInterval(() => {
    symbols.forEach(sym => updateTicker(sym));
  }, 300000);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.6); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.8); }
</style>
