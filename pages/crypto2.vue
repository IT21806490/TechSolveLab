<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1419] to-[#0a0e27] text-slate-100 font-mono p-4 md:p-8">
    
    <!-- Warning Banner -->
    <div class="mb-4 bg-gradient-to-r from-rose-500/20 via-yellow-500/20 to-rose-500/20 border-2 border-rose-500 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="text-3xl">⚠️</div>
        <div>
          <div class="text-rose-400 font-black text-sm uppercase">EDUCATIONAL TOOL - NOT FINANCIAL ADVICE</div>
          <div class="text-rose-200/80 text-xs mt-1">This tool uses simulated ML models. Past performance ≠ future results.</div>
        </div>
      </div>
      <div class="text-[10px] text-yellow-300 font-bold">
        ⚠️ Always DYOR • Never invest more than you can lose • Use proper risk management
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="fixed top-4 right-4 z-50 bg-violet-500/20 border border-violet-500 rounded-lg px-4 py-2 backdrop-blur-xl">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs text-violet-400 font-bold">ANALYZING...</span>
      </div>
    </div>

    <!-- Header Stats -->
    <div class="mb-4 bg-gradient-to-r from-violet-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-violet-500/50 rounded-xl p-4">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="text-3xl">📊</div>
          <div>
            <div class="text-violet-400 font-black text-sm uppercase">Enhanced Trading Analysis System</div>
            <div class="text-violet-200/80 text-xs mt-1">Multi-Factor Validation • Risk Assessment • {{ backtestMetrics.totalTrades }} Historical Trades</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded">
            <div class="text-[8px] text-emerald-400 font-bold uppercase">Win Rate</div>
            <div class="text-lg font-black text-emerald-400">{{ backtestMetrics.winRate }}%</div>
          </div>
          <div class="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded">
            <div class="text-[8px] text-cyan-400 font-bold uppercase">Load Time</div>
            <div class="text-lg font-black text-cyan-400">{{ loadTime }}ms</div>
          </div>
          <div class="px-3 py-1 bg-violet-500/20 border border-violet-500 rounded">
            <div class="text-[8px] text-violet-400 font-bold uppercase">Sharpe</div>
            <div class="text-lg font-black text-violet-400">{{ backtestMetrics.sharpeRatio }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Market Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div v-for="(data, s) in marketData" :key="s" @click="switchSymbol(s)"
        :class="symbol === s ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]' : 'border-slate-800/50 hover:border-slate-700'"
        class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border cursor-pointer transition-all duration-200">
        
        <div class="flex justify-between items-center mb-2">
          <span class="font-black text-slate-400 text-xs tracking-widest">{{ s }}</span>
          <span :class="data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[9px] font-mono font-bold">
            {{ data.change >= 0 ? '▲' : '▼' }} {{ Math.abs(data.change).toFixed(2) }}%
          </span>
        </div>
        
        <div class="text-xl font-black text-white tracking-tighter mb-2">${{ data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
        
        <div class="space-y-1">
          <div class="flex items-center gap-1">
            <span class="text-[7px] text-slate-500 font-bold uppercase w-8">MTF:</span>
            <div v-for="tf in data.timeframes" :key="tf.name" 
              :class="tf.trend === 'BULLISH' ? 'bg-emerald-500' : tf.trend === 'BEARISH' ? 'bg-rose-500' : 'bg-yellow-500'"
              class="w-3 h-3 rounded flex items-center justify-center"
              :title="tf.name + ': ' + tf.trend">
              <span class="text-[6px] font-black text-white">{{ tf.name.charAt(0) }}</span>
            </div>
          </div>
          
          <div class="bg-slate-800/40 rounded px-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-[7px] text-violet-400 font-bold">AI:</span>
              <span :class="data.aiPrediction > 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[8px] font-black">
                {{ data.aiPrediction > 0 ? '+' : '' }}{{ data.aiPrediction.toFixed(2) }}%
              </span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded px-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-[7px] text-violet-400 font-bold">SIGNAL:</span>
              <span :class="data.longTermSignal.includes('BUY') ? 'text-emerald-400' : data.longTermSignal.includes('SELL') ? 'text-rose-400' : 'text-slate-400'"
                class="text-[8px] font-black uppercase">
                {{ data.longTermSignal }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
      
      <!-- Left Column -->
      <div class="xl:col-span-3 space-y-4">
        
        <!-- Enhanced Signal Panel -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-black text-slate-300 uppercase flex items-center gap-2">
              <span class="text-violet-400">🎯</span>
              Trading Signal Analysis • {{ symbol }}
            </h3>
            <div class="flex items-center gap-2">
              <div :class="currentSignal.validationStatus?.passed ? 'bg-emerald-500' : 'bg-rose-500'" 
                class="w-2 h-2 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">
                {{ currentSignal.confidence }}% CONFIDENCE
              </span>
            </div>
          </div>

          <!-- Validation Status -->
          <div v-if="currentSignal.validationStatus" 
            :class="currentSignal.validationStatus.passed ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-rose-500/10 border-rose-500/50'"
            class="border-2 rounded-xl p-3 mb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-black uppercase" :class="currentSignal.validationStatus.passed ? 'text-emerald-400' : 'text-rose-400'">
                {{ currentSignal.validationStatus.passed ? '✓ SIGNAL VALIDATED' : '✗ VALIDATION FAILED' }}
              </span>
              <span class="text-xs font-black" :class="currentSignal.validationStatus.passed ? 'text-emerald-400' : 'text-rose-400'">
                Score: {{ currentSignal.validationStatus.score }}/100
              </span>
            </div>
            <div class="space-y-1">
              <div v-for="(reason, i) in currentSignal.validationStatus.reasons" :key="i" class="text-[9px] text-slate-300">
                {{ reason }}
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div v-if="riskAssessment.level" 
            :class="riskAssessment.level === 'HIGH' ? 'bg-rose-500/10 border-rose-500/50' : riskAssessment.level === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-emerald-500/10 border-emerald-500/50'"
            class="border-2 rounded-xl p-3 mb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-black uppercase" 
                :class="riskAssessment.level === 'HIGH' ? 'text-rose-400' : riskAssessment.level === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'">
                🛡️ RISK LEVEL: {{ riskAssessment.level }}
              </span>
              <span class="text-xs font-black" 
                :class="riskAssessment.level === 'HIGH' ? 'text-rose-400' : riskAssessment.level === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'">
                Max Position: {{ riskAssessment.maxPositionSize }}%
              </span>
            </div>
            <div v-if="riskAssessment.warnings && riskAssessment.warnings.length > 0" class="space-y-1">
              <div v-for="(warning, i) in riskAssessment.warnings" :key="i" class="text-[9px] text-slate-300">
                {{ warning }}
              </div>
            </div>
          </div>
          
          <!-- Signal Display -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div :class="currentSignal.action?.includes('BUY') ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5' : currentSignal.action?.includes('SELL') ? 'border-rose-500/50 bg-gradient-to-br from-rose-500/10 to-rose-500/5' : 'border-slate-700/50'"
              class="border-2 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">RECOMMENDED</div>
              <div :class="currentSignal.action?.includes('BUY') ? 'text-emerald-400' : currentSignal.action?.includes('SELL') ? 'text-rose-400' : 'text-slate-400'"
                class="text-xl font-black mb-2">
                {{ currentSignal.action || 'WAIT' }}
              </div>
              <div class="text-[9px] text-slate-400">{{ currentSignal.timeframe }}</div>
            </div>
            
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">ENTRY ZONE</div>
              <div class="text-xl font-black text-white mb-2 font-mono">
                ${{ (currentSignal.entryPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
              <div class="text-[9px] text-slate-400">Current: ${{ marketData[symbol]?.price.toFixed(2) || 0 }}</div>
            </div>
            
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">TARGETS</div>
              <div class="space-y-1">
                <div class="flex justify-between text-[9px]">
                  <span class="text-emerald-400 font-bold">TP1:</span>
                  <span class="text-white font-mono">${{ (currentSignal.targets?.tp1 || 0).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-[9px]">
                  <span class="text-emerald-300 font-bold">TP2:</span>
                  <span class="text-white font-mono">${{ (currentSignal.targets?.tp2 || 0).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-[9px]">
                  <span class="text-rose-400 font-bold">SL:</span>
                  <span class="text-white font-mono">${{ (currentSignal.targets?.sl || 0).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <div class="border-2 border-violet-500/50 rounded-xl p-4 bg-gradient-to-br from-violet-500/10 to-violet-500/5">
              <div class="text-[8px] text-violet-400 font-bold uppercase mb-2">FORECAST</div>
              <div class="text-xl font-black text-violet-400 mb-2 font-mono">
                {{ currentSignal.expectedReturn > 0 ? '+' : '' }}{{ (currentSignal.expectedReturn || 0).toFixed(1) }}%
              </div>
              <div class="text-[9px] text-slate-400">{{ currentSignal.holdTime }}</div>
            </div>
          </div>
          
          <!-- AI Models -->
          <div class="bg-slate-800/40 rounded-lg p-3 mb-3">
            <div class="text-[8px] text-violet-400 font-bold uppercase mb-2 flex items-center gap-2">
              <span>🤖 AI ENSEMBLE ({{ aiModels.length }} Models)</span>
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
          
          <!-- Metrics -->
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
          
          <!-- Strength Meter -->
          <div class="relative h-6 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 via-cyan-500/30 to-emerald-500/30"></div>
            <div class="absolute inset-y-0 left-0 transition-all duration-500"
              :class="currentSignal.strength > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : currentSignal.strength > 60 ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' : currentSignal.strength > 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'"
              :style="{ width: currentSignal.strength + '%' }"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-black text-white drop-shadow-lg">
                SIGNAL STRENGTH: {{ Math.round(currentSignal.strength) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-black text-white">{{ symbol }} {{ selectedTimeframe }}</h2>
            <div class="flex gap-2">
              <button v-for="tf in ['1D', '4H', '1H', '15M']" :key="tf"
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

        <!-- Backtest Performance -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <h3 class="text-sm font-black text-white uppercase mb-3">
            📊 Strategy Performance (Last 365 Days)
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-4 rounded-lg" :class="backtestMetrics.totalPL >= 0 ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-500/50' : 'bg-gradient-to-br from-rose-500/20 to-rose-500/10 border-2 border-rose-500/50'">
              <div class="text-[8px] text-slate-400 font-bold uppercase mb-1">Total P/L (After Fees)</div>
              <div :class="backtestMetrics.totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-3xl font-black font-mono">
                {{ backtestMetrics.totalPL >= 0 ? '+' : '' }}${{ (backtestMetrics.totalPL || 0).toFixed(2) }}
              </div>
              <div class="text-[9px] text-slate-500 mt-1">From $10,000 capital</div>
            </div>
            
            <div class="p-4 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/10 border-2 border-violet-500/50">
              <div class="text-[8px] text-slate-400 font-bold uppercase mb-1">ROI</div>
              <div :class="backtestMetrics.roi >= 0 ? 'text-violet-400' : 'text-rose-400'" class="text-3xl font-black font-mono">
                {{ backtestMetrics.roi >= 0 ? '+' : '' }}{{ backtestMetrics.roi }}%
              </div>
              <div class="text-[9px] text-slate-500 mt-1">Return on investment</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Trade History -->
      <div class="space-y-4">
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <div class="p-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900 to-slate-800">
            <h3 class="font-black text-xs text-white uppercase">📜 Trade History</h3>
            <p class="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Historical Performance</p>
          </div>
          
          <div class="p-3 space-y-2 max-h-[700px] overflow-y-auto">
            <div v-for="(trade, i) in backtestTrades.slice(0, 30)" :key="i" 
              class="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3 hover:bg-slate-800/60 transition-all">
              
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div :class="trade.pl >= 0 ? 'bg-emerald-500' : 'bg-rose-500'" class="w-2 h-2 rounded-full"></div>
                  <span :class="trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[9px] font-black uppercase">
                    {{ trade.pl >= 0 ? 'WIN' : 'LOSS' }}
                  </span>
                  <span class="text-[8px] text-violet-400">{{ trade.confidence }}% conf</span>
                </div>
                <div class="text-[7px] text-slate-600 font-mono">
                  {{ trade.holdDays }}d {{ trade.holdHours }}h
                </div>
              </div>
              
              <div class="mb-2 pb-2 border-b border-slate-700/30">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-emerald-400 font-bold uppercase">ENTRY</span>
                  <span class="text-[7px] text-slate-500 font-mono">{{ trade.entryDate }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <div class="text-[7px] text-slate-500 mt-1">{{ trade.entryReason }}</div>
              </div>
              
              <div class="mb-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-rose-400 font-bold uppercase">EXIT</span>
                  <span class="text-[7px] text-slate-500 font-mono">{{ trade.exitDate }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <div class="text-[7px] text-slate-500 mt-1">{{ trade.exitReason }}</div>
              </div>
              
              <div :class="trade.pl >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'"
                class="p-2 rounded border">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Net P/L</div>
                    <div :class="trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-base font-black font-mono">
                      {{ trade.pl >= 0 ? '+' : '' }}${{ trade.pl.toFixed(2) }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[7px] text-slate-500 font-bold uppercase mb-0.5">Return</div>
                    <div :class="trade.plPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-base font-black font-mono">
                      {{ trade.plPercent >= 0 ? '+' : '' }}{{ trade.plPercent.toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <div class="text-[7px] text-slate-600 mt-1 font-mono">
                  Fees: -${{ trade.fees.toFixed(2) }} • R:R: {{ trade.riskReward }}
                </div>
              </div>
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
              <span class="text-slate-400">Win Streak:</span>
              <span class="text-yellow-400 font-black">{{ backtestMetrics.maxWinStreak }}</span>
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

// Configuration
const INITIAL_CAPITAL = 10000;
const POSITION_SIZE_PERCENT = 0.1;
const FEE_PERCENT = 0.001;
const STOP_LOSS_PERCENT = 0.05;
const TAKE_PROFIT_1 = 0.15;
const TAKE_PROFIT_2 = 0.30;
const MIN_CONFIDENCE = 75;
const MIN_ADX = 25;

const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const symbol = ref('BTCUSDT');
const selectedTimeframe = ref('1D');
const loading = ref(false);
const loadTime = ref(0);

const marketData = reactive({
  BTCUSDT: { price: 0, change: 0, timeframes: [], aiPrediction: 0, trendStrength: 50, longTermSignal: 'WAIT' },
  ETHUSDT: { price: 0, change: 0, timeframes: [], aiPrediction: 0, trendStrength: 50, longTermSignal: 'WAIT' },
  SOLUSDT: { price: 0, change: 0, timeframes: [], aiPrediction: 0, trendStrength: 50, longTermSignal: 'WAIT' },
  BNBUSDT: { price: 0, change: 0, timeframes: [], aiPrediction: 0, trendStrength: 50, longTermSignal: 'WAIT' }
});

const candles = ref([]);
const chartCanvas = ref(null);
const backtestTrades = ref([]);
const backtestMetrics = ref({
  totalTrades: 0, winRate: 0, profitFactor: 0, sharpeRatio: 0,
  maxDrawdown: 0, avgWinPercent: 0, totalPL: 0, roi: 0,
  bestTrade: 0, worstTrade: 0, maxWinStreak: 0
});

const currentSignal = ref({
  action: 'WAIT', timeframe: 'Long-Term', strength: 50, confidence: 0,
  entryPrice: 0, targets: { tp1: 0, tp2: 0, sl: 0 }, expectedReturn: 0,
  holdTime: 'TBD', riskScore: 50, volatility: 0, marketPhase: 'UNKNOWN',
  validationStatus: { passed: false, reasons: [], score: 0 }
});

const aiModels = ref([]);
const riskAssessment = ref({ level: 'MEDIUM', score: 50, maxPositionSize: 10, warnings: [] });

let chartInst = null;
let candleCache = {};

// Technical Indicators
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
    tr.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
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

// AI Ensemble
function ensembleAI(closes, highs, lows) {
  const current = closes[closes.length - 1];
  const recentSlope = (closes[closes.length - 1] - closes[closes.length - 20]) / 20;
  const polyPrediction = current + recentSlope * 5;
  const momentum = calcEMA(closes, 10);
  const trend = calcEMA(closes, 50);
  const shortTermMomentum = momentum[momentum.length - 1] - momentum[momentum.length - 5];
  const longTermTrend = trend[trend.length - 1] - trend[trend.length - 20];
  const lstmPrediction = current + (shortTermMomentum * 0.6 + longTermTrend * 0.4);
  const rsi = calcRSI(closes);
  const macd = calcMACD(closes);
  const atr = calcATR(highs, lows, closes);
  let xgbPrediction = current;
  if (rsi < 30) xgbPrediction += atr * 2;
  else if (rsi > 70) xgbPrediction -= atr * 2;
  if (macd.histogram > 0 && macd.histogram > macd.prevHistogram) xgbPrediction += atr;
  const ema = calcEMA(closes, 20)[closes.length - 1];
  const models = [
    { name: 'POLY-REG', predicted: polyPrediction, signal: ((polyPrediction - current) / current) * 100, confidence: 78, weight: 0.25 },
    { name: 'LSTM', predicted: lstmPrediction, signal: ((lstmPrediction - current) / current) * 100, confidence: 85, weight: 0.35 },
    { name: 'XGBoost', predicted: xgbPrediction, signal: ((xgbPrediction - current) / current) * 100, confidence: 82, weight: 0.30 },
    { name: 'EMA-TREND', predicted: ema, signal: ((ema - current) / current) * 100, confidence: 70, weight: 0.10 }
  ];
  const ensemblePrediction = models.reduce((sum, m) => sum + m.predicted * m.weight, 0);
  const avgConfidence = models.reduce((sum, m) => sum + m.confidence * m.weight, 0);
  aiModels.value = models;
  return { predicted: ensemblePrediction, change: ((ensemblePrediction - current) / current) * 100, confidence: Math.round(avgConfidence) };
}

// Validation System
function validateSignal(analysis, closes, highs, lows) {
  const validations = { passed: false, reasons: [], score: 0 };
  if (analysis.confidence >= MIN_CONFIDENCE) {
    validations.reasons.push('✓ High confidence signal');
    validations.score += 20;
  } else {
    validations.reasons.push('✗ Confidence too low');
    return validations;
  }
  if (analysis.indicators.adx >= MIN_ADX) {
    validations.reasons.push('✓ Strong trend confirmed');
    validations.score += 20;
  } else {
    validations.reasons.push('⚠ Weak trend strength');
    validations.score += 5;
  }
  let bullishIndicators = 0;
  let bearishIndicators = 0;
  if (analysis.indicators.rsi > 50 && analysis.indicators.rsi < 70) bullishIndicators++;
  else if (analysis.indicators.rsi < 50 && analysis.indicators.rsi > 30) bearishIndicators++;
  if (analysis.indicators.macd > 0) bullishIndicators++;
  else bearishIndicators++;
  if (analysis.indicators.stoch > 50) bullishIndicators++;
  else bearishIndicators++;
  const current = closes[closes.length - 1];
  if (current > analysis.indicators.bb.middle) bullishIndicators++;
  else bearishIndicators++;
  if (analysis.action.includes('BUY') && bullishIndicators >= 3) {
    validations.reasons.push('✓ 3+ bullish indicators aligned');
    validations.score += 25;
  } else if (analysis.action.includes('SELL') && bearishIndicators >= 3) {
    validations.reasons.push('✓ 3+ bearish indicators aligned');
    validations.score += 25;
  } else {
    validations.reasons.push('⚠ Mixed indicator signals');
    validations.score += 10;
  }
  const volatility = parseFloat(analysis.volatility);
  if (volatility < 5) {
    validations.reasons.push('✓ Normal volatility environment');
    validations.score += 20;
  } else if (volatility > 10) {
    validations.reasons.push('⚠ High volatility - increased risk');
    validations.score += 5;
  } else {
    validations.reasons.push('✓ Acceptable volatility');
    validations.score += 15;
  }
  const rr = (analysis.targets.tp1 - current) / (current - analysis.targets.sl);
  if (rr >= 2) {
    validations.reasons.push('✓ Favorable risk/reward (2:1+)');
    validations.score += 15;
  } else {
    validations.reasons.push('⚠ Sub-optimal risk/reward');
    validations.score += 5;
  }
  validations.passed = validations.score >= 70;
  return validations;
}

// Risk Assessment
function assessRisk(analysis, metrics) {
  let riskScore = 0;
  const warnings = [];
  const volatility = parseFloat(analysis.volatility);
  if (volatility > 10) {
    riskScore += 30;
    warnings.push('⚠ High volatility detected');
  } else if (volatility > 5) {
    riskScore += 15;
  }
  if (analysis.indicators.adx < 20) {
    riskScore += 20;
    warnings.push('⚠ Weak trend - ranging market');
  }
  if (metrics.winRate < 50) {
    riskScore += 25;
    warnings.push('⚠ Low historical win rate');
  }
  if (metrics.maxDrawdown > 20) {
    riskScore += 15;
    warnings.push('⚠ High historical drawdown');
  }
  if (analysis.confidence < 80) {
    riskScore += 10;
  }
  let level = 'LOW';
  let maxPositionSize = 15;
  if (riskScore > 50) {
    level = 'HIGH';
    maxPositionSize = 5;
    warnings.push('🚨 Reduce position size to 5%');
  } else if (riskScore > 30) {
    level = 'MEDIUM';
    maxPositionSize = 10;
  }
  return { level, score: riskScore, maxPositionSize, warnings };
}

// Strategy Analysis
function analyzeLongTerm(candleData, index) {
  const closes = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.close);
  const highs = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.high);
  const lows = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.low);
  const volumes = candleData.slice(Math.max(0, index - 200), index + 1).map(c => c.volume);
  if (closes.length < 100) return null;
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
  const aiPred = ensembleAI(closes, highs, lows);
  let bullScore = 0;
  let bearScore = 0;
  if (ema20[ema20.length - 1] > ema50[ema50.length - 1]) bullScore += 10;
  else bearScore += 10;
  if (ema50[ema50.length - 1] > ema100[ema100.length - 1]) bullScore += 15;
  else bearScore += 15;
  if (ema100[ema100.length - 1] > ema200[ema200.length - 1]) bullScore += 15;
  else bearScore += 15;
  if (rsi > 50 && rsi < 70) bullScore += 10;
  else if (rsi < 30) bullScore += 15;
  else if (rsi > 70) bearScore += 15;
  else if (rsi < 50) bearScore += 10;
  if (macd.histogram > 0 && macd.histogram > macd.prevHistogram) bullScore += 10;
  else if (macd.histogram < 0 && macd.histogram < macd.prevHistogram) bearScore += 10;
  if (stoch < 20) bullScore += 10;
  else if (stoch > 80) bearScore += 10;
  if (adx > 25) {
    if (ema20[ema20.length - 1] > ema50[ema50.length - 1]) bullScore += 10;
    else bearScore += 10;
  }
  if (aiPred.change > 3) bullScore += 10;
  else if (aiPred.change < -3) bearScore += 10;
  const totalScore = bullScore + bearScore;
  const bullPercent = totalScore > 0 ? (bullScore / totalScore) * 100 : 50;
  let action = 'WAIT';
  let confidence = 0;
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
  const tp1 = current * (1 + TAKE_PROFIT_1);
  const tp2 = current * (1 + TAKE_PROFIT_2);
  const sl = current * (1 - STOP_LOSS_PERCENT);
  let marketPhase = 'RANGING';
  if (adx > 30) {
    marketPhase = ema20[ema20.length - 1] > ema200[ema200.length - 1] ? 'UPTREND' : 'DOWNTREND';
  } else if (adx > 20) {
    marketPhase = 'TRENDING';
  }
  return {
    action, timeframe: 'Long-Term (5-20 days)', strength: bullPercent, confidence,
    entryPrice: current, targets: { tp1, tp2, sl },
    expectedReturn: action.includes('BUY') ? TAKE_PROFIT_1 * 100 : 0,
    holdTime: '5-20 days', riskScore: 100 - confidence, volatility: volatility.toFixed(2),
    marketPhase, indicators: { rsi, macd: macd.histogram, adx, stoch, bb },
    aiPrediction: aiPred.change, bullScore, bearScore
  };
}

// Backtesting
function runBacktest(candleData) {
  const startTime = performance.now();
  const trades = [];
  let position = null;
  let capital = INITIAL_CAPITAL;
  let peakCapital = INITIAL_CAPITAL;
  let maxDD = 0;
  for (let i = 200; i < candleData.length; i++) {
    const analysis = analyzeLongTerm(candleData, i);
    if (!analysis) continue;
    const currentCandle = candleData[i];
    const currentTime = new Date(currentCandle.time);
    if (position) {
      const currentPrice = currentCandle.close;
      const holdHours = Math.floor((currentTime - new Date(position.entryTime)) / (1000 * 60 * 60));
      const holdDays = Math.floor(holdHours / 24);
      let shouldExit = false;
      let exitReason = '';
      if (currentPrice >= position.tp1) {
        shouldExit = true;
        exitReason = 'Take Profit 1 Hit';
      } else if (currentPrice <= position.sl) {
        shouldExit = true;
        exitReason = 'Stop Loss Hit';
      } else if (holdDays >= 30) {
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
          entryPrice: position.entryPrice, exitPrice: currentPrice,
          entryDate: new Date(position.entryTime).toLocaleDateString(),
          exitDate: currentTime.toLocaleDateString(),
          entryReason: position.reason, exitReason, pl, plPercent,
          holdDays: Math.floor(holdHours / 24), holdHours: holdHours % 24,
          fees: entryFee + exitFee,
          riskReward: (Math.abs(plPercent) / STOP_LOSS_PERCENT / 100).toFixed(2),
          confidence: position.confidence
        });
        position = null;
      }
    } else {
      if ((analysis.action === 'STRONG BUY' || analysis.action === 'BUY') && 
          analysis.confidence >= MIN_CONFIDENCE && 
          analysis.indicators.adx > MIN_ADX) {
        position = {
          entryPrice: currentCandle.close, entryTime: currentTime,
          tp1: analysis.targets.tp1, tp2: analysis.targets.tp2, sl: analysis.targets.sl,
          reason: `${analysis.action} (Conf: ${analysis.confidence}%)`,
          confidence: analysis.confidence
        };
      }
    }
  }
  const wins = trades.filter(t => t.pl > 0);
  const losses = trades.filter(t => t.pl < 0);
  const totalWin = wins.reduce((sum, t) => sum + t.pl, 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + t.pl, 0));
  const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : 0;
  const profitFactor = totalLoss > 0 ? (totalWin / totalLoss).toFixed(2) : '0.00';
  const avgWinPercent = wins.length > 0 ? (wins.reduce((sum, t) => sum + t.plPercent, 0) / wins.length).toFixed(2) : '0.00';
  const totalPL = capital - INITIAL_CAPITAL;
  const roi = ((totalPL / INITIAL_CAPITAL) * 100).toFixed(2);
  const returns = trades.map(t => t.plPercent);
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const stdDev = returns.length > 0 ? Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length) : 0;
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00';
  const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.plPercent)).toFixed(2) : 0;
  const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.plPercent)).toFixed(2) : 0;
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
      totalTrades: trades.length, winRate, profitFactor, sharpeRatio,
      maxDrawdown: maxDD.toFixed(2), avgWinPercent, totalPL, roi,
      bestTrade, worstTrade, maxWinStreak
    }
  };
}

// Data Loading
async function loadCandles(sym, tf = '1d') {
  loading.value = true;
  try {
    const cacheKey = `${sym}_${tf}`;
    let candleData;
    if (candleCache[cacheKey]) {
      candleData = candleCache[cacheKey];
    } else {
      const res = await fetch(`https://api.binance.com/api/v1/klines?symbol=${sym}&interval=${tf}&limit=1000`);
      const data = await res.json();
      candleData = data.map(candle => ({
        time: new Date(candle[0]),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5])
      }));
      candleCache[cacheKey] = candleData;
    }
    candles.value = candleData;
    const backtest = runBacktest(candleData);
    backtestTrades.value = backtest.trades;
    backtestMetrics.value = backtest.metrics;
    const currentAnalysis = analyzeLongTerm(candleData, candleData.length - 1);
    if (currentAnalysis) {
      const closes = candleData.map(c => c.close);
      const highs = candleData.map(c => c.high);
      const lows = candleData.map(c => c.low);
      const validation = validateSignal(currentAnalysis, closes, highs, lows);
      const risk = assessRisk(currentAnalysis, backtest.metrics);
      currentSignal.value = { ...currentAnalysis, validationStatus: validation };
      riskAssessment.value = risk;
      marketData[sym].aiPrediction = currentAnalysis.aiPrediction;
      marketData[sym].trendStrength = currentAnalysis.strength;
      marketData[sym].longTermSignal = currentAnalysis.action;
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
      animation: false,
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
  symbols.forEach(sym => updateTicker(sym));
  setInterval(() => {
    symbols.forEach(sym => updateTicker(sym));
  }, 300000);
});
</script>

<style scoped>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.6); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.8); }
</style>
