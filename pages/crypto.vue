<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1419] to-[#0a0e27] text-slate-100 font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
    
    <!-- Animated background -->
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none">
      <div class="absolute inset-0" style="background-image: linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <!-- Professional Header -->
    <div class="mb-8 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
            <span class="text-emerald-400">█</span>
            PROFESSIONAL AI TRADING SYSTEM
            <span class="text-xs bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-2 py-1 rounded border border-emerald-500/30">v3.0 ML</span>
          </h1>
          <p class="text-xs text-slate-500 font-bold tracking-wide uppercase">TensorFlow.js LSTM • Multi-Timeframe • Adaptive Parameters • 0.2% Fees</p>
        </div>
        
        <!-- Key Metrics -->
        <div class="flex gap-3 flex-wrap">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-2">
            <div class="text-[9px] text-emerald-400 font-bold uppercase mb-0.5">Net Win Rate</div>
            <div class="text-xl font-black text-emerald-400">{{ netWinRate }}%</div>
          </div>
          <div class="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg px-4 py-2">
            <div class="text-[9px] text-cyan-400 font-bold uppercase mb-0.5">ML Accuracy</div>
            <div class="text-xl font-black text-cyan-400">{{ mlAccuracy }}%</div>
          </div>
          <div class="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-lg px-4 py-2">
            <div class="text-[9px] text-violet-400 font-bold uppercase mb-0.5">Sharpe Ratio</div>
            <div class="text-xl font-black text-violet-400">{{ advancedMetrics.sharpeRatio }}</div>
          </div>
          <div class="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-lg px-4 py-2">
            <div class="text-[9px] text-rose-400 font-bold uppercase mb-0.5">Max Drawdown</div>
            <div class="text-xl font-black text-rose-400">{{ advancedMetrics.maxDrawdown }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ML Training Status -->
    <div v-if="mlTraining" class="mb-6 relative z-10">
      <div class="bg-gradient-to-r from-violet-900/50 to-violet-800/50 backdrop-blur-xl p-4 rounded-xl border border-violet-500/30">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-black text-violet-300 uppercase">Training AI Model...</span>
          </div>
          <span class="text-xs text-violet-400 font-bold">Epoch {{ mlEpoch }}/{{ mlMaxEpochs }}</span>
        </div>
        <div class="relative h-2 bg-violet-950 rounded-full overflow-hidden">
          <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-300"
            :style="{ width: (mlEpoch / mlMaxEpochs * 100) + '%' }"></div>
        </div>
        <div class="text-[10px] text-violet-400 mt-2 font-mono">Loss: {{ mlLoss.toFixed(4) }}</div>
      </div>
    </div>

    <!-- Market Selector Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
      <div v-for="(data, s) in marketData" :key="s" @click="symbol = s"
        :class="symbol === s ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-emerald-500/20 scale-[1.02]' : 'border-slate-800/50 hover:border-slate-700'"
        class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-5 rounded-xl border cursor-pointer transition-all duration-300 shadow-2xl relative overflow-hidden group">
        
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-violet-500/0 group-hover:from-emerald-500/5 group-hover:to-violet-500/5 transition-all duration-500 rounded-xl"></div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-2">
            <span class="font-black text-slate-400 text-xs tracking-widest">{{ s }}</span>
            <span :class="data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-[10px] font-mono font-bold flex items-center gap-1">
              <span>{{ data.change >= 0 ? '▲' : '▼' }}</span>
              <span>{{ Math.abs(data.change).toFixed(2) }}%</span>
            </span>
          </div>
          
          <div class="text-2xl font-black text-white tracking-tighter mb-3">${{ data.price.toLocaleString() }}</div>
          
          <div class="space-y-2">
            <!-- Multi-Timeframe Alignment -->
            <div class="flex items-center gap-1 mb-1">
              <span class="text-[8px] text-slate-500 font-bold uppercase">MTF:</span>
              <div v-for="tf in ['15m', '1h', '4h']" :key="tf" 
                :class="data.timeframes[tf] === 'BUY' ? 'bg-emerald-500' : data.timeframes[tf] === 'SELL' ? 'bg-rose-500' : 'bg-slate-600'"
                class="w-4 h-4 rounded flex items-center justify-center">
                <span class="text-[6px] font-black text-white">{{ tf }}</span>
              </div>
            </div>
            
            <!-- ML Prediction -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="text-[8px] text-slate-500 font-bold uppercase">AI:</span>
                <div :class="data.mlPrediction > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
                  class="px-2 py-0.5 rounded text-[8px] font-black">
                  {{ data.mlPrediction > 0 ? '+' : '' }}{{ (data.mlPrediction * 100).toFixed(1) }}%
                </div>
              </div>
              <div :class="data.regime === 'TRENDING' ? 'text-emerald-400' : 'text-slate-500'" 
                class="text-[8px] font-black uppercase">
                {{ data.regime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 relative z-10">
      
      <!-- Left Column - Chart & Analysis -->
      <div class="xl:col-span-3 space-y-6">
        
        <!-- Multi-Timeframe Dashboard -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-black text-slate-300 uppercase tracking-wide">Multi-Timeframe Analysis • {{ symbol }}</h3>
            <div class="flex items-center gap-2">
              <div :class="timeframeAlignment >= 2 ? 'bg-emerald-500' : timeframeAlignment === 1 ? 'bg-yellow-500' : 'bg-rose-500'" 
                class="w-2 h-2 rounded-full animate-pulse"></div>
              <span class="text-xs font-bold text-slate-400 uppercase">
                {{ timeframeAlignment === 3 ? 'FULL ALIGN' : timeframeAlignment === 2 ? 'PARTIAL' : 'DIVERGENT' }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div v-for="(tf, idx) in multiTimeframeData" :key="idx"
              class="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-slate-400 uppercase">{{ tf.interval }}</span>
                <div :class="tf.trend === 'UP' ? 'bg-emerald-500' : tf.trend === 'DOWN' ? 'bg-rose-500' : 'bg-slate-600'"
                  class="w-2 h-2 rounded-full"></div>
              </div>
              <div class="text-lg font-black" :class="tf.trend === 'UP' ? 'text-emerald-400' : 'text-rose-400'">
                {{ tf.trend }}
              </div>
              <div class="text-[9px] text-slate-500 mt-1">RSI: {{ tf.rsi }} • ADX: {{ tf.adx }}</div>
            </div>
          </div>
          
          <div class="relative h-6 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 to-emerald-500/30"></div>
            <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 transition-all duration-1000"
              :style="{ width: signalStrength + '%' }"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-black text-white drop-shadow-lg">
                {{ Math.round(signalStrength) }}% CONFIDENCE • ML BOOST: +{{ mlBoost }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Main Chart -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black text-white">
              {{ symbol }} 
              <span class="text-emerald-400">• 15M</span>
              <span v-if="mlPredictionPrice" class="text-violet-400 text-sm ml-2">
                AI Next: ${{ mlPredictionPrice.toLocaleString() }}
              </span>
            </h2>
            <div class="flex gap-3">
              <div class="px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-lg text-[9px] text-violet-400 font-bold uppercase">
                🤖 AI: {{ mlEnabled ? 'ON' : 'OFF' }}
              </div>
              <div class="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[9px] text-rose-400 font-bold uppercase">
                🛡️ Stop: {{ (stopLossPercent * 100).toFixed(1) }}%
              </div>
              <div class="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[9px] text-emerald-400 font-bold uppercase">
                🎯 Target: {{ (takeProfitPercent * 100).toFixed(1) }}%
              </div>
            </div>
          </div>
          
          <div class="h-[500px] w-full relative">
            <canvas ref="chartCanvas" id="mainChart"></canvas>
          </div>
        </div>

        <!-- AI Model Performance -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-black text-violet-400 uppercase tracking-wide flex items-center gap-2">
              🤖 AI MODEL PERFORMANCE
              <span class="text-[8px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded border border-violet-500/30">LSTM RNN</span>
            </h3>
            <button @click="trainMLModel" :disabled="mlTraining"
              class="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 text-white rounded-lg text-[9px] font-bold uppercase transition-all">
              {{ mlTraining ? 'Training...' : 'Retrain Model' }}
            </button>
          </div>
          
          <div class="grid grid-cols-4 gap-4">
            <div class="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">ML Accuracy</div>
              <div class="text-2xl font-black text-violet-400">{{ mlAccuracy }}%</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Training Loss</div>
              <div class="text-2xl font-black text-cyan-400">{{ mlLoss.toFixed(4) }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Predictions</div>
              <div class="text-2xl font-black text-emerald-400">{{ mlPredictionCount }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Confidence</div>
              <div class="text-2xl font-black text-yellow-400">{{ mlConfidence }}%</div>
            </div>
          </div>
        </div>

        <!-- Performance Statistics -->
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
            <div class="text-[9px] text-slate-500 font-bold uppercase mb-2">Net Avg Win</div>
            <div class="text-2xl font-black text-emerald-400">${{ netAvgWin }}</div>
            <div class="text-[8px] text-slate-600 mt-1">After 0.2% fees</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
            <div class="text-[9px] text-slate-500 font-bold uppercase mb-2">Net Avg Loss</div>
            <div class="text-2xl font-black text-rose-400">${{ netAvgLoss }}</div>
            <div class="text-[8px] text-slate-600 mt-1">After 0.2% fees</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
            <div class="text-[9px] text-slate-500 font-bold uppercase mb-2">Total Trades</div>
            <div class="text-2xl font-black text-violet-400">{{ totalTrades }}</div>
            <div class="text-[8px] text-slate-600 mt-1">{{ trades.filter(t => t.type === 'BUY').length }} open</div>
          </div>
          <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
            <div class="text-[9px] text-slate-500 font-bold uppercase mb-2">Best Streak</div>
            <div class="text-2xl font-black text-cyan-400">{{ advancedMetrics.consecutiveWins }}</div>
            <div class="text-[8px] text-slate-600 mt-1">Consecutive wins</div>
          </div>
        </div>
      </div>

      <!-- Right Column - Trades -->
      <div class="space-y-6">
        
        <!-- Trade Execution Panel -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 overflow-hidden">
          <div class="p-5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/90 to-slate-800/50">
            <div class="flex justify-between items-center mb-3">
              <div>
                <h3 class="font-black text-sm text-white uppercase tracking-wide">AI Trading Signals</h3>
                <p class="text-[8px] text-slate-500 font-bold uppercase mt-1">ML-Enhanced</p>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-emerald-400 font-black">{{ netWinRate }}% WR</div>
                <div class="text-[8px] text-slate-500 font-bold">{{ trades.length }} signals</div>
              </div>
            </div>
            
            <div class="flex items-center justify-between gap-2 p-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
              <div class="flex items-center gap-2">
                <div class="flex gap-0.5">
                  <div v-for="i in Math.min(advancedMetrics.consecutiveWins, 5)" :key="'w-'+i" 
                    class="w-1 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span class="text-[9px] text-emerald-400 font-bold">{{ advancedMetrics.consecutiveWins }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[9px] text-rose-400 font-bold">{{ advancedMetrics.consecutiveLosses }}</span>
                <div class="flex gap-0.5">
                  <div v-for="i in Math.min(advancedMetrics.consecutiveLosses, 5)" :key="'l-'+i" 
                    class="w-1 h-3 bg-rose-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div v-for="(t, i) in trades.slice(0, 15)" :key="i" 
              class="p-4 rounded-xl border transition-all hover:scale-[1.01] relative overflow-hidden"
              :class="t.type === 'BUY' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30' : 'bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50'">
              
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <div :class="t.type === 'BUY' ? 'bg-emerald-500' : 'bg-slate-600'" 
                    class="w-1.5 h-1.5 rounded-full"></div>
                  <span :class="t.type === 'BUY' ? 'text-emerald-400' : 'text-slate-400'" 
                    class="text-[10px] font-black uppercase">
                    {{ t.type }}
                    <span v-if="t.mlBoosted" class="text-violet-400 ml-1">🤖</span>
                  </span>
                </div>
                <span class="text-[8px] text-slate-600 font-mono">{{ t.time }}</span>
              </div>
              
              <div class="text-xl font-black text-white mb-2 font-mono">${{ t.price.toLocaleString() }}</div>
              
              <div v-if="t.netPL !== undefined" class="mb-2">
                <div class="flex items-center gap-2 mb-1">
                  <div :class="t.netPL >= 0 ? 'bg-emerald-500' : 'bg-rose-500'" 
                    class="h-1.5 w-1.5 rounded-full"></div>
                  <div :class="t.netPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                    class="text-sm font-black font-mono">
                    {{ t.netPL >= 0 ? '+' : '' }}${{ t.netPL.toFixed(2) }}
                    <span class="text-[10px]">({{ ((t.netPL / t.price)*100).toFixed(2) }}%)</span>
                  </div>
                </div>
                <div class="text-[7px] text-slate-600 font-mono">
                  Gross: ${{ t.grossPL.toFixed(2) }} • Fees: -${{ t.fees.toFixed(2) }}
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="text-[8px] text-slate-500 font-bold uppercase">
                  {{ t.reason }}
                </div>
                <div v-if="t.confidence" class="text-[8px] font-black text-violet-400">
                  {{ t.confidence }}%
                </div>
              </div>
            </div>
            
            <div v-if="trades.length === 0" class="text-center py-20">
              <div class="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
              <div class="text-slate-600 text-[10px] font-bold uppercase">Training AI Model...</div>
              <div class="text-slate-700 text-[8px] mt-1">Multi-timeframe analysis</div>
            </div>
          </div>

          <div class="p-5 bg-gradient-to-br from-emerald-600 via-emerald-600 to-violet-600 m-4 rounded-xl shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative z-10">
              <div class="text-[9px] text-emerald-100 font-bold mb-1 uppercase tracking-wide flex items-center justify-between">
                <span>Net P/L (After Fees)</span>
                <span class="text-white/80">{{ totalTrades }} Trades</span>
              </div>
              <div class="text-3xl font-black text-white font-mono">${{ netTotalPL.toFixed(2) }}</div>
              <div class="text-[8px] text-emerald-100 mt-2 font-bold">
                ROI: {{ netTotalPL > 0 ? '+' : '' }}{{ (netTotalPL / 10000 * 100).toFixed(2) }}% on $10k • 
                Fees: ${{ totalFeesPaid.toFixed(2) }} • ML Boost: +{{ mlBoost }}%
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
import * as tf from '@tensorflow/tfjs';

Chart.register(...registerables, CandlestickController, CandlestickElement);

// Symbols
const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];
const symbol = ref("BTCUSDT");

// Market Data
const marketData = reactive({
  BTCUSDT: { price: 0, change: 0, rsi: 50, regime: 'ANALYZING', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, mlPrediction: 0 },
  ETHUSDT: { price: 0, change: 0, rsi: 50, regime: 'ANALYZING', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, mlPrediction: 0 },
  SOLUSDT: { price: 0, change: 0, rsi: 50, regime: 'ANALYZING', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, mlPrediction: 0 },
  BNBUSDT: { price: 0, change: 0, rsi: 50, regime: 'ANALYZING', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, mlPrediction: 0 }
});

// State
const candles = ref([]);
const trades = ref([]);
const netTotalPL = ref(0);
const totalFeesPaid = ref(0);
const chartCanvas = ref(null);
const signalStrength = ref(0);
const multiTimeframeData = ref([]);
const timeframeAlignment = ref(0);
const mlBoost = ref(0);

// ML State
const mlEnabled = ref(true);
const mlTraining = ref(false);
const mlEpoch = ref(0);
const mlMaxEpochs = ref(50);
const mlLoss = ref(0);
const mlAccuracy = ref(0);
const mlPredictionCount = ref(0);
const mlConfidence = ref(0);
const mlPredictionPrice = ref(0);
let mlModel = null;

// Trading parameters
const stopLossPercent = ref(0.025);
const takeProfitPercent = ref(0.02);
const transactionFeePercent = 0.002;

const advancedMetrics = ref({
  sharpeRatio: '0.00',
  maxDrawdown: '0.00',
  profitFactor: '0.00',
  consecutiveWins: 0,
  consecutiveLosses: 0
});

let chartInst = null;

// Computed properties
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

// Helper functions
function calculateEMA(data, period) {
  if (data.length < period) return Array(data.length).fill(data[0]);
  const k = 2 / (period + 1);
  let ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i-1] * (1-k));
  }
  return ema;
}

function calculateSMA(data, period) {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    sma.push(slice.reduce((a, b) => a + b) / period);
  }
  return sma;
}

function calculateMACD(closes) {
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signal = calculateEMA(macdLine, 9);
  return { 
    macdLine, 
    signal, 
    histogram: macdLine.map((v, i) => v - signal[i]) 
  };
}

function calculateBollingerBands(closes, period = 20) {
  const bands = [];
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b) / period;
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    bands.push({
      upper: mean + (2 * stdDev),
      middle: mean,
      lower: mean - (2 * stdDev),
      width: (4 * stdDev) / mean * 100
    });
  }
  return bands;
}

function calculateRSI(closes, period = 14) {
  const rsiValues = [];
  for (let i = period; i < closes.length; i++) {
    let gains = 0, losses = 0;
    for (let j = i - period; j < i; j++) {
      const change = closes[j] - closes[j - 1];
      change >= 0 ? gains += change : losses -= change;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    rsiValues.push(avgLoss > 0 ? 100 - (100 / (1 + avgGain / avgLoss)) : 100);
  }
  return rsiValues;
}

// Multi-Timeframe Analysis
async function analyzeMultipleTimeframes() {
  const timeframes = [
    { interval: '15m', period: 500 },
    { interval: '1h', period: 500 },
    { interval: '4h', period: 500 }
  ];
  
  multiTimeframeData.value = [];
  let alignedSignals = 0;
  
  for (const tf of timeframes) {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.value}&interval=${tf.interval}&limit=${tf.period}`);
      const klines = await res.json();
      
      const closes = klines.map(k => parseFloat(k[4]));
      const highs = klines.map(k => parseFloat(k[2]));
      const lows = klines.map(k => parseFloat(k[3]));
      
      const ema200 = calculateEMA(closes, 200);
      const rsi = calculateRSI(closes);
      const adx = calculateADX(highs, lows, closes);
      
      const trend = closes[closes.length - 1] > ema200[ema200.length - 1] ? 'UP' : 'DOWN';
      const signal = trend === 'UP' && rsi[rsi.length - 1] < 60 ? 'BUY' : trend === 'DOWN' || rsi[rsi.length - 1] > 60 ? 'SELL' : 'NEUTRAL';
      
      multiTimeframeData.value.push({
        interval: tf.interval,
        trend,
        rsi: Math.round(rsi[rsi.length - 1]),
        adx: Math.round(adx)
      });
      
      marketData[symbol.value].timeframes[tf.interval] = signal;
      if (signal === 'BUY') alignedSignals++;
      
    } catch (e) {
      console.error(`Error analyzing ${tf.interval}:`, e);
    }
  }
  
  timeframeAlignment.value = alignedSignals;
  return alignedSignals;
}

function calculateADX(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return 0;
  
  const plusDM = [];
  const minusDM = [];
  
  for (let i = 1; i < highs.length; i++) {
    const highDiff = highs[i] - highs[i-1];
    const lowDiff = lows[i-1] - lows[i];
    
    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
  }
  
  const tr = [];
  for (let i = 1; i < closes.length; i++) {
    const high = highs[i];
    const low = lows[i];
    const prevClose = closes[i-1];
    tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
  }
  
  const atr = calculateSMA(tr, period);
  const plusDI = calculateSMA(plusDM, period).map((v, i) => (v / atr[i]) * 100);
  const minusDI = calculateSMA(minusDM, period).map((v, i) => (v / atr[i]) * 100);
  
  const dx = plusDI.map((pdi, i) => {
    const sum = pdi + minusDI[i];
    return sum > 0 ? Math.abs(pdi - minusDI[i]) / sum * 100 : 0;
  });
  
  const adx = calculateSMA(dx, period);
  return adx[adx.length - 1] || 0;
}

// TensorFlow.js LSTM Model
async function createMLModel(inputShape) {
  const model = tf.sequential();
  
  // LSTM layers for time series
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: true,
    inputShape: [inputShape, 1]
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: false
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });
  
  return model;
}

function prepareTrainingData(closes, lookback = 60) {
  const X = [];
  const y = [];
  
  // Normalize data
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const normalized = closes.map(v => (v - min) / (max - min));
  
  for (let i = lookback; i < normalized.length; i++) {
    X.push(normalized.slice(i - lookback, i));
    y.push(normalized[i]);
  }
  
  return {
    X: tf.tensor3d(X.map(seq => seq.map(v => [v]))),
    y: tf.tensor2d(y.map(v => [v])),
    min,
    max
  };
}

async function trainMLModel() {
  if (mlTraining.value || candles.value.length < 200) return;
  
  mlTraining.value = true;
  mlEpoch.value = 0;
  
  try {
    const closes = candles.value.map(c => c.c);
    const { X, y, min, max } = prepareTrainingData(closes);
    
    if (mlModel) mlModel.dispose();
    mlModel = await createMLModel(60);
    
    await mlModel.fit(X, y, {
      epochs: mlMaxEpochs.value,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          mlEpoch.value = epoch + 1;
          mlLoss.value = logs.loss;
          mlAccuracy.value = Math.max(0, Math.min(100, (1 - logs.loss) * 100)).toFixed(1);
        }
      }
    });
    
    // Make prediction for next price
    const lastSequence = closes.slice(-60);
    const normalizedSeq = lastSequence.map(v => (v - min) / (max - min));
    const inputTensor = tf.tensor3d([normalizedSeq.map(v => [v])]);
    const prediction = mlModel.predict(inputTensor);
    const predValue = prediction.dataSync()[0];
    const predictedPrice = predValue * (max - min) + min;
    
    mlPredictionPrice.value = predictedPrice;
    mlPredictionCount.value++;
    mlConfidence.value = Math.min(100, mlAccuracy.value * 1.1).toFixed(0);
    
    // Calculate ML prediction change %
    const currentPrice = closes[closes.length - 1];
    marketData[symbol.value].mlPrediction = (predictedPrice - currentPrice) / currentPrice;
    
    // Cleanup
    X.dispose();
    y.dispose();
    inputTensor.dispose();
    prediction.dispose();
    
  } catch (e) {
    console.error('ML Training Error:', e);
  } finally {
    mlTraining.value = false;
  }
}

async function fetchEngine() {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.value}&interval=15m&limit=1000`);
    const klines = await res.json();
    
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
    
    const ema200 = calculateEMA(closes, 200);
    const ema50 = calculateEMA(closes, 50);
    const ema20 = calculateEMA(closes, 20);
    const macd = calculateMACD(closes);
    const bb = calculateBollingerBands(closes);
    const rsiValues = calculateRSI(closes);
    
    marketData[symbol.value].rsi = rsiValues[rsiValues.length - 1];
    const adx = calculateADX(highs, lows, closes);
    marketData[symbol.value].regime = adx > 25 ? 'TRENDING' : 'RANGING';
    
    candles.value = mappedCandles;
    
    // Multi-timeframe analysis
    const alignment = await analyzeMultipleTimeframes();
    
    // Train ML model if needed
    if (mlEnabled.value && !mlModel && !mlTraining.value) {
      await trainMLModel();
    }
    
    // Calculate signal with ML boost
    const currentRSI = rsiValues[rsiValues.length - 1];
    const isUptrend = closes[closes.length - 1] > ema200[ema200.length - 1];
    const avgVolume = volumes.slice(-50, -1).reduce((a, b) => a + b, 0) / 49;
    const volumeRatio = volumes[volumes.length - 1] / avgVolume;
    
    let baseSignal = 0;
    if (currentRSI < 35) baseSignal += 25;
    else if (currentRSI < 45) baseSignal += 15;
    if (isUptrend) baseSignal += 20;
    if (macd.histogram[macd.histogram.length - 1] > 0) baseSignal += 20;
    if (volumeRatio > 1.4) baseSignal += 15;
    if (alignment === 3) baseSignal += 15;
    else if (alignment === 2) baseSignal += 7;
    
    // ML Boost
    mlBoost.value = 0;
    if (mlEnabled.value && marketData[symbol.value].mlPrediction > 0.01) {
      mlBoost.value = Math.min(15, marketData[symbol.value].mlPrediction * 1000);
      baseSignal += mlBoost.value;
    }
    
    signalStrength.value = Math.max(0, Math.min(100, baseSignal));
    
    runAdvancedBacktest(closes, ema200, ema50, ema20, volumes, macd, bb, rsiValues, highs, lows);
    
  } catch (e) {
    console.error("API Error", e);
  }
}

function calculateAdvancedMetrics(sellTrades) {
  if (!sellTrades.length) return;

  const returns = sellTrades.map(t => (t.netPL / (t.price - t.netPL)) * 100);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  advancedMetrics.value.sharpeRatio = (stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00');

  let peak = 0;
  let maxDD = 0;
  let cumPL = 0;
  sellTrades.forEach(t => {
    cumPL += t.netPL;
    if (cumPL > peak) peak = cumPL;
    const dd = peak > 0 ? ((peak - cumPL) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  });
  advancedMetrics.value.maxDrawdown = maxDD.toFixed(2);

  const grossProfit = sellTrades.filter(t => t.netPL > 0).reduce((sum, t) => sum + t.netPL, 0);
  const grossLoss = Math.abs(sellTrades.filter(t => t.netPL < 0).reduce((sum, t) => sum + t.netPL, 0));
  advancedMetrics.value.profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? '999' : '0.00';

  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let lastWasWin = null;

  [...sellTrades].reverse().forEach(t => {
    const isWin = t.netPL > 0;
    if (lastWasWin === null || lastWasWin === isWin) {
      currentStreak++;
    } else {
      if (lastWasWin) maxWinStreak = Math.max(maxWinStreak, currentStreak);
      else maxLossStreak = Math.max(maxLossStreak, currentStreak);
      currentStreak = 1;
    }
    lastWasWin = isWin;
  });

  if (lastWasWin) maxWinStreak = Math.max(maxWinStreak, currentStreak);
  else maxLossStreak = Math.max(maxLossStreak, currentStreak);

  advancedMetrics.value.consecutiveWins = maxWinStreak;
  advancedMetrics.value.consecutiveLosses = maxLossStreak;
}

function runAdvancedBacktest(closes, ema200, ema50, ema20, volumes, macd, bb, rsiValues, highs, lows) {
  trades.value = [];
  netTotalPL.value = 0;
  totalFeesPaid.value = 0;
  let position = null;
  let peakPrice = 0;

  const avgVolume = volumes.slice(0, 100).reduce((a, b) => a + b, 0) / 100;

  for (let i = 200; i < closes.length; i++) {
    const adx = calculateADX(highs.slice(0, i), lows.slice(0, i), closes.slice(0, i));
    if (adx <= 25 && !position) continue;
    
    const rsi = rsiValues[i - 14] || 50;
    const isUptrend = closes[i] > ema200[i];
    const price = closes[i];
    const volumeRatio = volumes[i] / avgVolume;
    
    const macdValue = macd.histogram[i];
    const prevMacdValue = i > 0 ? macd.histogram[i - 1] : 0;
    const macdCrossover = macdValue > 0 && prevMacdValue <= 0;
    
    let buyScore = 0;
    if (rsi < 35) buyScore += 25;
    else if (rsi < 45) buyScore += 18;
    if (isUptrend) buyScore += 20;
    if (macdCrossover) buyScore += 20;
    if (volumeRatio > 1.4) buyScore += 15;
    if (timeframeAlignment.value === 3) buyScore += 15;
    
    const mlBoosted = mlEnabled.value && marketData[symbol.value].mlPrediction > 0.01;
    if (mlBoosted) buyScore += Math.min(15, marketData[symbol.value].mlPrediction * 1000);
    
    if (!position && buyScore >= 70 && adx > 25) {
      position = { 
        type: 'BUY', 
        price: price, 
        time: new Date(candles.value[i].x).toLocaleTimeString(),
        reason: mlBoosted ? "AI SIGNAL" : "STRONG SIGNAL",
        confidence: buyScore,
        mlBoosted
      };
      peakPrice = price;
      trades.value.unshift(position);
    } 
    else if (position) {
      if (price > peakPrice) peakPrice = price;
      
      const stopLoss = position.price * (1 - stopLossPercent.value);
      const trailingExit = peakPrice * (1 - takeProfitPercent.value);
      
      const hitStopLoss = price <= stopLoss;
      const hitTrailingTP = price <= trailingExit && price > position.price * 1.005;
      const overboughtExit = rsi > 70;
      const regimeChange = adx <= 25 && price > position.price;
      
      if (hitStopLoss || hitTrailingTP || overboughtExit || regimeChange) {
        const grossPL = price - position.price;
        const totalFees = (position.price + price) * transactionFeePercent;
        const netPL = grossPL - totalFees;
        
        let exitReason = "TAKE PROFIT";
        if (hitStopLoss) exitReason = "STOP LOSS";
        else if (overboughtExit) exitReason = "RSI EXIT";
        else if (regimeChange) exitReason = "REGIME CHANGE";
        
        trades.value.unshift({ 
          type: 'SELL', 
          price: price, 
          grossPL,
          fees: totalFees,
          netPL,
          time: new Date(candles.value[i].x).toLocaleTimeString(),
          reason: exitReason,
          confidence: position.confidence,
          mlBoosted: position.mlBoosted
        });
        
        netTotalPL.value += netPL;
        totalFeesPaid.value += totalFees;
        position = null;
      }
    }
  }
  
  const sellTrades = trades.value.filter(t => t.type === 'SELL');
  calculateAdvancedMetrics([...sellTrades]);
  
  nextTick(() => renderChart());
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
        color: { 
          up: '#10b981', 
          down: '#ef4444', 
          unchanged: '#6b7280' 
        },
        borderColor: { 
          up: '#059669', 
          down: '#dc2626', 
          unchanged: '#4b5563' 
        },
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { 
          type: 'time', 
          display: true,
          grid: { display: false },
          ticks: { color: '#64748b', maxTicksLimit: 10 }
        },
        y: { 
          position: 'right', 
          grid: { color: 'rgba(100, 116, 139, 0.08)', drawBorder: false }, 
          ticks: { 
            color: '#64748b',
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: { 
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: false
        }
      },
      animation: {
        duration: 500,
        easing: 'easeInOutQuart'
      }
    }
  });
}

async function updateAllTickers() {
  try {
    for (const s of symbols) {
      const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`);
      const d = await r.json();
      marketData[s].price = parseFloat(d.lastPrice);
      marketData[s].change = parseFloat(d.priceChangePercent);
    }
  } catch (e) {
    console.error('Ticker update error:', e);
  }
}

onMounted(async () => {
  await updateAllTickers();
  await fetchEngine();
  
  setInterval(() => {
    updateAllTickers();
  }, 10000);
  
  setInterval(() => {
    fetchEngine();
  }, 900000); // 15 minutes
});

watch(symbol, () => {
  fetchEngine();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}
</style>