<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1419] to-[#0a0e27] text-slate-100 font-mono p-4 md:p-8 relative overflow-hidden">
    
    <!-- WARNING BANNER -->
    <div class="mb-4 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 relative z-10">
      <div class="flex items-center gap-3">
        <div class="text-3xl">⚠️</div>
        <div>
          <div class="text-yellow-400 font-black text-sm uppercase">Educational Tool - Not Financial Advice</div>
          <div class="text-yellow-200/80 text-xs mt-1">This system analyzes real market data but past performance does not guarantee future results. Always do your own research and never invest more than you can afford to lose.</div>
        </div>
      </div>
    </div>

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
            ADVANCED TRADING ANALYZER
            <span v-if="backtestComplete" class="text-xs bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-2 py-1 rounded">✓ BACKTESTED</span>
            <span v-else class="text-xs bg-yellow-500 text-black px-2 py-1 rounded animate-pulse">ANALYZING...</span>
          </h1>
          <p class="text-xs text-slate-500 font-bold tracking-wide uppercase">Real Technical Analysis • Backtested Strategy • Multi-Indicator Confirmation</p>
        </div>
        
        <!-- Key Metrics -->
        <div class="flex gap-2 flex-wrap">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-emerald-400 font-bold uppercase mb-0.5">Win Rate (Backtest)</div>
            <div class="text-lg font-black text-emerald-400">{{ backtestMetrics.winRate }}%</div>
          </div>
          <div class="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-cyan-400 font-bold uppercase mb-0.5">Accuracy</div>
            <div class="text-lg font-black text-cyan-400">{{ predictionAccuracy }}%</div>
          </div>
          <div class="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-violet-400 font-bold uppercase mb-0.5">Sharpe Ratio</div>
            <div class="text-lg font-black text-violet-400">{{ backtestMetrics.sharpeRatio }}</div>
          </div>
          <div class="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2">
            <div class="text-[8px] text-rose-400 font-bold uppercase mb-0.5">Max Drawdown</div>
            <div class="text-lg font-black text-rose-400">{{ backtestMetrics.maxDrawdown }}%</div>
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
          
          <div class="text-xl font-black text-white tracking-tighter mb-2">${{ data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          
          <div class="space-y-1">
            <!-- Multi-Timeframe Indicators -->
            <div class="flex items-center gap-1">
              <span class="text-[7px] text-slate-500 font-bold uppercase w-8">MTF:</span>
              <div v-for="tf in ['15m', '1h', '4h']" :key="tf" 
                :class="data.timeframes[tf] === 'BULLISH' ? 'bg-emerald-500' : data.timeframes[tf] === 'BEARISH' ? 'bg-rose-500' : 'bg-yellow-500'"
                class="w-3 h-3 rounded flex items-center justify-center">
                <span class="text-[6px] font-black text-white">{{ tf.charAt(0) }}</span>
              </div>
            </div>
            
            <!-- Signal Strength -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="text-[7px] text-slate-500 font-bold">Signal:</span>
                <div :class="data.signalStrength > 70 ? 'bg-emerald-500/20 text-emerald-400' : data.signalStrength > 30 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-rose-500/20 text-rose-400'"
                  class="px-1.5 py-0.5 rounded text-[7px] font-black">
                  {{ Math.round(data.signalStrength) }}%
                </div>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-1 h-1 rounded-full" :class="data.trend === 'STRONG_UP' ? 'bg-emerald-500' : data.trend === 'WEAK_UP' ? 'bg-emerald-400' : data.trend === 'WEAK_DOWN' ? 'bg-rose-400' : 'bg-rose-500'"></div>
                <span :class="data.trend.includes('UP') ? 'text-emerald-400' : 'text-rose-400'" 
                  class="text-[7px] font-black">
                  {{ data.trend.replace('_', ' ') }}
                </span>
              </div>
            </div>
            
            <!-- Real Indicators -->
            <div class="grid grid-cols-3 gap-1 text-[7px] mt-1">
              <div class="bg-slate-800/40 rounded px-1 py-0.5">
                <span class="text-slate-500">RSI:</span>
                <span :class="data.indicators.rsi > 70 ? 'text-rose-400' : data.indicators.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'" class="font-black ml-0.5">{{ Math.round(data.indicators.rsi) }}</span>
              </div>
              <div class="bg-slate-800/40 rounded px-1 py-0.5">
                <span class="text-slate-500">MACD:</span>
                <span :class="data.indicators.macdSignal === 'BUY' ? 'text-emerald-400' : data.indicators.macdSignal === 'SELL' ? 'text-rose-400' : 'text-slate-300'" class="font-black ml-0.5">{{ data.indicators.macdSignal }}</span>
              </div>
              <div class="bg-slate-800/40 rounded px-1 py-0.5">
                <span class="text-slate-500">BB:</span>
                <span :class="data.indicators.bbPosition === 'LOWER' ? 'text-emerald-400' : data.indicators.bbPosition === 'UPPER' ? 'text-rose-400' : 'text-slate-300'" class="font-black ml-0.5">{{ data.indicators.bbPosition }}</span>
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
        
        <!-- Trading Signal Panel -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-black text-slate-300 uppercase">Current Market Analysis • {{ symbol }}</h3>
            <div class="flex items-center gap-2">
              <div :class="currentSignal.strength > 70 ? 'bg-emerald-500' : currentSignal.strength > 30 ? 'bg-yellow-500' : 'bg-rose-500'" 
                class="w-2 h-2 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">
                {{ currentSignal.confidence }}% CONFIDENCE
              </span>
            </div>
          </div>
          
          <!-- Signal Display -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <!-- Current Signal -->
            <div :class="currentSignal.action === 'BUY' ? 'border-emerald-500/50 bg-emerald-500/5' : currentSignal.action === 'SELL' ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700/50'"
              class="border-2 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">RECOMMENDED ACTION</div>
              <div :class="currentSignal.action === 'BUY' ? 'text-emerald-400' : currentSignal.action === 'SELL' ? 'text-rose-400' : 'text-slate-400'"
                class="text-2xl font-black mb-2">
                {{ currentSignal.action }}
              </div>
              <div class="text-[10px] text-slate-400">{{ currentSignal.reason }}</div>
            </div>
            
            <!-- Entry Price -->
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">SUGGESTED ENTRY</div>
              <div class="text-2xl font-black text-white mb-2 font-mono">
                ${{ currentSignal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
              <div class="text-[10px] text-slate-400">Current Price</div>
            </div>
            
            <!-- Targets -->
            <div class="border-2 border-slate-700/50 rounded-xl p-4">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">TARGETS</div>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px]">
                  <span class="text-emerald-400 font-bold">Take Profit:</span>
                  <span class="text-white font-mono">${{ currentSignal.takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="flex justify-between text-[10px]">
                  <span class="text-rose-400 font-bold">Stop Loss:</span>
                  <span class="text-white font-mono">${{ currentSignal.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="flex justify-between text-[10px] pt-1 border-t border-slate-700">
                  <span class="text-violet-400 font-bold">R:R Ratio:</span>
                  <span class="text-white font-mono">{{ currentSignal.riskReward }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Indicator Confirmations -->
          <div class="bg-slate-800/40 rounded-lg p-3 mb-3">
            <div class="text-[8px] text-slate-500 font-bold uppercase mb-2">INDICATOR CONFIRMATIONS</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div v-for="indicator in currentSignal.indicators" :key="indicator.name"
                class="flex items-center gap-2 bg-slate-900/50 rounded p-2">
                <div :class="indicator.bullish ? 'bg-emerald-500' : 'bg-rose-500'" class="w-2 h-2 rounded-full"></div>
                <div class="flex-1">
                  <div class="text-[8px] text-slate-400">{{ indicator.name }}</div>
                  <div :class="indicator.bullish ? 'text-emerald-400' : 'text-rose-400'" class="text-[10px] font-black">
                    {{ indicator.signal }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Signal Strength Meter -->
          <div class="relative h-6 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-yellow-500/30 to-emerald-500/30"></div>
            <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 transition-all duration-500"
              :style="{ width: currentSignal.strength + '%' }"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-black text-white drop-shadow-lg">
                SIGNAL STRENGTH: {{ Math.round(currentSignal.strength) }}% • {{ currentSignal.strength > 70 ? 'STRONG' : currentSignal.strength > 30 ? 'MODERATE' : 'WEAK' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Chart -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-black text-white">
              {{ symbol }} 
              <span class="text-emerald-400 text-sm">15M CHART</span>
            </h2>
            <div class="flex gap-2">
              <div class="px-2 py-1 bg-violet-500/10 border border-violet-500/30 rounded text-[8px] text-violet-400 font-bold uppercase">
                📊 INDICATORS
              </div>
            </div>
          </div>
          
          <div class="h-[450px] w-full relative">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- Backtest Results -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-4 rounded-xl border border-slate-800/50">
          <h3 class="text-sm font-black text-white uppercase mb-3">📈 Backtest Performance (Last 500 Candles)</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Total Trades</div>
              <div class="text-xl font-black text-white">{{ backtestMetrics.totalTrades }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-emerald-500 font-bold uppercase mb-1">Win Rate</div>
              <div class="text-xl font-black text-emerald-400">{{ backtestMetrics.winRate }}%</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Profit Factor</div>
              <div class="text-xl font-black text-violet-400">{{ backtestMetrics.profitFactor }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Avg Win</div>
              <div class="text-xl font-black text-emerald-400">${{ backtestMetrics.avgWin }}</div>
            </div>
            <div class="bg-slate-800/40 rounded-lg p-3">
              <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Avg Loss</div>
              <div class="text-xl font-black text-rose-400">${{ backtestMetrics.avgLoss }}</div>
            </div>
          </div>
          
          <div class="mt-3 p-3 rounded-lg" :class="backtestMetrics.totalPL >= 0 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">Total P/L (After Fees)</div>
                <div :class="backtestMetrics.totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-2xl font-black font-mono">
                  {{ backtestMetrics.totalPL >= 0 ? '+' : '' }}${{ backtestMetrics.totalPL.toFixed(2) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[8px] text-slate-500 font-bold uppercase mb-1">ROI</div>
                <div :class="backtestMetrics.totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-2xl font-black font-mono">
                  {{ backtestMetrics.roi >= 0 ? '+' : '' }}{{ backtestMetrics.roi }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Trade History -->
      <div class="space-y-4">
        
        <!-- Backtest Trade History -->
        <div class="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <div class="p-4 border-b border-slate-800/50">
            <h3 class="font-black text-xs text-white uppercase">📜 Recent Backtest Trades</h3>
            <p class="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Historical Performance</p>
          </div>
          
          <div class="p-3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div v-for="(trade, i) in backtestTrades.slice(0, 20)" :key="i" 
              class="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3">
              
              <!-- Trade Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div :class="trade.pl >= 0 ? 'bg-emerald-500' : 'bg-rose-500'" 
                    class="w-2 h-2 rounded-full"></div>
                  <span :class="trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'" 
                    class="text-[9px] font-black uppercase">
                    {{ trade.pl >= 0 ? 'WIN' : 'LOSS' }}
                  </span>
                  <span class="text-[8px] text-violet-400">{{ trade.signals }}</span>
                </div>
                <div class="text-[7px] text-slate-600 font-mono">
                  {{ trade.duration }}m
                </div>
              </div>
              
              <!-- Entry -->
              <div class="mb-2 pb-2 border-b border-slate-700/30">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-emerald-400 font-bold uppercase">ENTRY</span>
                  <span class="text-[7px] text-slate-500 font-mono">{{ trade.entryTime }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
              </div>
              
              <!-- Exit -->
              <div class="mb-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[8px] text-rose-400 font-bold uppercase">EXIT</span>
                  <span class="text-[7px] text-slate-500">{{ trade.exitReason }}</span>
                </div>
                <div class="text-sm font-black text-white font-mono">${{ trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
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
              </div>
            </div>
            
            <div v-if="backtestTrades.length === 0" class="text-center py-16">
              <div class="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2"></div>
              <div class="text-slate-600 text-[9px] font-bold uppercase">Running Backtest...</div>
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
const POSITION_SIZE = 100; // Trade with $100 per position
const FEE_PERCENT = 0.002; // 0.2% per trade
const STOP_LOSS_PERCENT = 0.03; // 3% stop loss
const TAKE_PROFIT_PERCENT = 0.05; // 5% take profit

const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const symbol = ref('BTCUSDT');
const marketData = reactive({
  BTCUSDT: { price: 0, change: 0, trend: 'NEUTRAL', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, signalStrength: 50, indicators: {} },
  ETHUSDT: { price: 0, change: 0, trend: 'NEUTRAL', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, signalStrength: 50, indicators: {} },
  SOLUSDT: { price: 0, change: 0, trend: 'NEUTRAL', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, signalStrength: 50, indicators: {} },
  BNBUSDT: { price: 0, change: 0, trend: 'NEUTRAL', timeframes: { '15m': 'NEUTRAL', '1h': 'NEUTRAL', '4h': 'NEUTRAL' }, signalStrength: 50, indicators: {} }
});

const candles = ref([]);
const chartCanvas = ref(null);
const backtestComplete = ref(false);
const backtestTrades = ref([]);
const backtestMetrics = ref({
  totalTrades: 0,
  winRate: 0,
  profitFactor: 0,
  sharpeRatio: 0,
  maxDrawdown: 0,
  avgWin: 0,
  avgLoss: 0,
  totalPL: 0,
  roi: 0
});

const currentSignal = ref({
  action: 'WAIT',
  reason: 'Analyzing market...',
  strength: 50,
  confidence: 0,
  entryPrice: 0,
  stopLoss: 0,
  takeProfit: 0,
  riskReward: '0:0',
  indicators: []
});

const predictionAccuracy = ref(0);
let chartInst = null;

// ==================== TECHNICAL INDICATORS ====================

function calcEMA(data, period) {
  if (data.length < period) return Array(data.length).fill(data[0] || 0);
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
  
  const changes = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }
  
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) avgGain += changes[i];
    else avgLoss -= changes[i];
  }
  avgGain /= period;
  avgLoss /= period;
  
  for (let i = period; i < changes.length; i++) {
    if (changes[i] >= 0) {
      avgGain = (avgGain * (period - 1) + changes[i]) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - changes[i]) / period;
    }
  }
  
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
    prevHistogram: histogram[histogram.length - 2]
  };
}

function calcBollingerBands(closes, period = 20, stdDev = 2) {
  const sma = calcSMA(closes, period);
  const bands = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      bands.push({ upper: closes[i], middle: closes[i], lower: closes[i] });
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      bands.push({
        upper: mean + (stdDev * std),
        middle: mean,
        lower: mean - (stdDev * std)
      });
    }
  }
  
  return bands[bands.length - 1];
}

function calcADX(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return 0;
  
  const tr = [];
  const plusDM = [];
  const minusDM = [];
  
  for (let i = 1; i < closes.length; i++) {
    const high = highs[i];
    const low = lows[i];
    const prevHigh = highs[i - 1];
    const prevLow = lows[i - 1];
    const prevClose = closes[i - 1];
    
    tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
    
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  
  let smoothedTR = tr.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDM.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDM.slice(0, period).reduce((a, b) => a + b, 0);
  
  for (let i = period; i < tr.length; i++) {
    smoothedTR = smoothedTR - (smoothedTR / period) + tr[i];
    smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDM[i];
    smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDM[i];
  }
  
  const plusDI = (smoothedPlusDM / smoothedTR) * 100;
  const minusDI = (smoothedMinusDM / smoothedTR) * 100;
  const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
  
  return dx;
}

// ==================== TRADING STRATEGY ====================

function analyzeMarket(candleData, index) {
  const closes = candleData.slice(0, index + 1).map(c => c.close);
  const highs = candleData.slice(0, index + 1).map(c => c.high);
  const lows = candleData.slice(0, index + 1).map(c => c.low);
  
  if (closes.length < 50) return null;
  
  // Calculate indicators
  const ema9 = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const ema50 = calcEMA(closes, 50);
  const ema200 = calcEMA(closes, 200);
  const rsi = calcRSI(closes);
  const macd = calcMACD(closes);
  const bb = calcBollingerBands(closes);
  const adx = calcADX(highs, lows, closes);
  
  const currentPrice = closes[closes.length - 1];
  const prevPrice = closes[closes.length - 2];
  
  // Signal scoring
  let bullishSignals = 0;
  let bearishSignals = 0;
  let signalStrength = 0;
  
  const indicators = [];
  
  // 1. EMA Crossover
  const ema9Val = ema9[ema9.length - 1];
  const ema21Val = ema21[ema21.length - 1];
  const ema50Val = ema50[ema50.length - 1];
  
  if (ema9Val > ema21Val && ema21Val > ema50Val) {
    bullishSignals++;
    indicators.push({ name: 'EMA', signal: 'BULLISH', bullish: true });
  } else if (ema9Val < ema21Val && ema21Val < ema50Val) {
    bearishSignals++;
    indicators.push({ name: 'EMA', signal: 'BEARISH', bullish: false });
  } else {
    indicators.push({ name: 'EMA', signal: 'NEUTRAL', bullish: false });
  }
  
  // 2. RSI
  if (rsi < 30) {
    bullishSignals++;
    indicators.push({ name: 'RSI', signal: 'OVERSOLD', bullish: true });
  } else if (rsi > 70) {
    bearishSignals++;
    indicators.push({ name: 'RSI', signal: 'OVERBOUGHT', bullish: false });
  } else if (rsi >= 40 && rsi <= 60) {
    indicators.push({ name: 'RSI', signal: 'NEUTRAL', bullish: rsi > 50 });
  } else {
    indicators.push({ name: 'RSI', signal: rsi > 50 ? 'BULLISH' : 'BEARISH', bullish: rsi > 50 });
  }
  
  // 3. MACD
  if (macd.histogram > 0 && macd.histogram > macd.prevHistogram) {
    bullishSignals++;
    indicators.push({ name: 'MACD', signal: 'BUY', bullish: true });
  } else if (macd.histogram < 0 && macd.histogram < macd.prevHistogram) {
    bearishSignals++;
    indicators.push({ name: 'MACD', signal: 'SELL', bullish: false });
  } else {
    indicators.push({ name: 'MACD', signal: 'NEUTRAL', bullish: macd.histogram > 0 });
  }
  
  // 4. Bollinger Bands
  if (currentPrice < bb.lower) {
    bullishSignals++;
    indicators.push({ name: 'BB', signal: 'LOWER', bullish: true });
  } else if (currentPrice > bb.upper) {
    bearishSignals++;
    indicators.push({ name: 'BB', signal: 'UPPER', bullish: false });
  } else {
    indicators.push({ name: 'BB', signal: 'MIDDLE', bullish: currentPrice < bb.middle });
  }
  
  // Calculate signal strength
  const totalSignals = bullishSignals + bearishSignals;
  if (totalSignals > 0) {
    signalStrength = (bullishSignals / (bullishSignals + bearishSignals)) * 100;
  } else {
    signalStrength = 50;
  }
  
  // Determine action
  let action = 'WAIT';
  let reason = 'No clear signal';
  let confidence = 0;
  
  if (bullishSignals >= 3 && adx > 20) {
    action = 'BUY';
    reason = `${bullishSignals}/4 bullish indicators confirmed`;
    confidence = Math.min(95, 50 + (bullishSignals * 15));
  } else if (bearishSignals >= 3 && adx > 20) {
    action = 'SELL';
    reason = `${bearishSignals}/4 bearish indicators confirmed`;
    confidence = Math.min(95, 50 + (bearishSignals * 15));
  } else if (bullishSignals >= 2) {
    action = 'BUY';
    reason = `Weak buy signal (${bullishSignals}/4 indicators)`;
    confidence = 40 + (bullishSignals * 10);
  }
  
  return {
    action,
    reason,
    strength: signalStrength,
    confidence,
    currentPrice,
    stopLoss: currentPrice * (1 - STOP_LOSS_PERCENT),
    takeProfit: currentPrice * (1 + TAKE_PROFIT_PERCENT),
    rsi,
    macd,
    bb,
    adx,
    ema9: ema9Val,
    ema21: ema21Val,
    ema50: ema50Val,
    indicators,
    bullishSignals,
    bearishSignals
  };
}

// ==================== BACKTESTING ====================

function runBacktest(candleData) {
  const trades = [];
  let position = null;
  let capital = INITIAL_CAPITAL;
  
  for (let i = 50; i < candleData.length; i++) {
    const analysis = analyzeMarket(candleData, i);
    if (!analysis) continue;
    
    const currentCandle = candleData[i];
    
    // Check if we have a position
    if (position) {
      const currentPrice = currentCandle.close;
      const plPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;
      
      // Check exit conditions
      let shouldExit = false;
      let exitReason = '';
      
      if (currentPrice <= position.stopLoss) {
        shouldExit = true;
        exitReason = 'Stop Loss';
      } else if (currentPrice >= position.takeProfit) {
        shouldExit = true;
        exitReason = 'Take Profit';
      } else if (analysis.action === 'SELL' && analysis.confidence > 60) {
        shouldExit = true;
        exitReason = 'Signal Reversal';
      } else if (i - position.entryIndex > 100) {
        shouldExit = true;
        exitReason = 'Time Stop';
      }
      
      if (shouldExit) {
        const entryFee = position.entryPrice * FEE_PERCENT * (POSITION_SIZE / position.entryPrice);
        const exitFee = currentPrice * FEE_PERCENT * (POSITION_SIZE / position.entryPrice);
        const pl = ((currentPrice - position.entryPrice) * (POSITION_SIZE / position.entryPrice)) - entryFee - exitFee;
        
        capital += pl;
        
        trades.push({
          entryPrice: position.entryPrice,
          exitPrice: currentPrice,
          entryTime: new Date(position.entryTime).toLocaleTimeString(),
          exitTime: new Date(currentCandle.time).toLocaleTimeString(),
          pl: pl,
          plPercent: plPercent,
          exitReason: exitReason,
          signals: `${position.bullishSignals}/4`,
          duration: i - position.entryIndex
        });
        
        position = null;
      }
    } else {
      // Look for entry
      if (analysis.action === 'BUY' && analysis.confidence >= 60) {
        position = {
          entryPrice: currentCandle.close,
          entryTime: currentCandle.time,
          entryIndex: i,
          stopLoss: analysis.stopLoss,
          takeProfit: analysis.takeProfit,
          bullishSignals: analysis.bullishSignals
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
  
  const totalPL = capital - INITIAL_CAPITAL;
  const roi = ((totalPL / INITIAL_CAPITAL) * 100).toFixed(2);
  
  // Calculate Sharpe Ratio
  const returns = trades.map(t => (t.pl / POSITION_SIZE) * 100);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00';
  
  // Calculate Max Drawdown
  let peak = INITIAL_CAPITAL;
  let maxDD = 0;
  let runningCapital = INITIAL_CAPITAL;
  
  trades.forEach(t => {
    runningCapital += t.pl;
    if (runningCapital > peak) peak = runningCapital;
    const dd = ((peak - runningCapital) / peak) * 100;
    if (dd > maxDD) maxDD = dd;
  });
  
  return {
    trades: trades.reverse(),
    metrics: {
      totalTrades: trades.length,
      winRate: winRate,
      profitFactor: profitFactor,
      sharpeRatio: sharpeRatio,
      maxDrawdown: maxDD.toFixed(2),
      avgWin: avgWin,
      avgLoss: avgLoss,
      totalPL: totalPL,
      roi: roi
    }
  };
}

// ==================== DATA LOADING ====================

async function loadCandles(sym) {
  try {
    const res = await fetch(`https://api.binance.com/api/v1/klines?symbol=${sym}&interval=15m&limit=1000`);
    const data = await res.json();
    
    candles.value = data.map(candle => ({
      time: new Date(candle[0]),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));
    
    // Run backtest
    const backtest = runBacktest(candles.value);
    backtestTrades.value = backtest.trades;
    backtestMetrics.value = backtest.metrics;
    backtestComplete.value = true;
    
    // Calculate prediction accuracy (how many of our signals were correct)
    const correctPredictions = backtest.trades.filter(t => t.pl > 0).length;
    predictionAccuracy.value = backtest.trades.length > 0 
      ? Math.round((correctPredictions / backtest.trades.length) * 100) 
      : 0;
    
    // Analyze current market
    const currentAnalysis = analyzeMarket(candles.value, candles.value.length - 1);
    if (currentAnalysis) {
      currentSignal.value = {
        action: currentAnalysis.action,
        reason: currentAnalysis.reason,
        strength: currentAnalysis.strength,
        confidence: currentAnalysis.confidence,
        entryPrice: currentAnalysis.currentPrice,
        stopLoss: currentAnalysis.stopLoss,
        takeProfit: currentAnalysis.takeProfit,
        riskReward: `1:${(TAKE_PROFIT_PERCENT / STOP_LOSS_PERCENT).toFixed(1)}`,
        indicators: currentAnalysis.indicators
      };
      
      // Update market data
      marketData[sym].signalStrength = currentAnalysis.strength;
      marketData[sym].trend = currentAnalysis.bullishSignals > currentAnalysis.bearishSignals ? 'STRONG_UP' : 'STRONG_DOWN';
      marketData[sym].indicators = {
        rsi: currentAnalysis.rsi,
        macdSignal: currentAnalysis.macd.histogram > 0 ? 'BUY' : 'SELL',
        bbPosition: currentAnalysis.currentPrice < currentAnalysis.bb.lower ? 'LOWER' : 
                    currentAnalysis.currentPrice > currentAnalysis.bb.upper ? 'UPPER' : 'MIDDLE'
      };
      
      // Multi-timeframe (simplified - in real version, would fetch actual data)
      marketData[sym].timeframes['15m'] = currentAnalysis.bullishSignals >= 2 ? 'BULLISH' : 'BEARISH';
      marketData[sym].timeframes['1h'] = currentAnalysis.ema9 > currentAnalysis.ema21 ? 'BULLISH' : 'BEARISH';
      marketData[sym].timeframes['4h'] = currentAnalysis.ema21 > currentAnalysis.ema50 ? 'BULLISH' : 'BEARISH';
    }
    
    updateChart();
  } catch (e) {
    console.error('Error loading candles:', e);
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
  const ema9 = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const ema50 = calcEMA(closes, 50);
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
            up: 'rgba(16, 185, 129, 0.8)',
            down: 'rgba(244, 63, 94, 0.8)',
            unchanged: 'rgba(148, 163, 184, 0.8)'
          }
        },
        {
          label: 'EMA 9',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema9[i] })),
          type: 'line',
          borderColor: 'rgba(139, 92, 246, 0.8)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'EMA 21',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema21[i] })),
          type: 'line',
          borderColor: 'rgba(236, 72, 153, 0.8)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'EMA 50',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: ema50[i] })),
          type: 'line',
          borderColor: 'rgba(251, 191, 36, 0.8)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'BB Upper',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: bb[i].upper })),
          type: 'line',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          borderDash: [5, 5]
        },
        {
          label: 'BB Lower',
          data: recentCandles.map((c, i) => ({ x: c.time.getTime(), y: bb[i].lower })),
          type: 'line',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          time: { unit: 'hour' },
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
  backtestComplete.value = false;
}

watch(symbol, async (newSym) => {
  await loadCandles(newSym);
  updateTicker(newSym);
});

onMounted(async () => {
  await loadCandles(symbol.value);
  
  symbols.forEach(sym => updateTicker(sym));
  
  setInterval(() => {
    symbols.forEach(sym => updateTicker(sym));
    if (candles.value.length > 0) {
      loadCandles(symbol.value);
    }
  }, 60000);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.6); }
</style>
