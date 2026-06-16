'use client';

import { useState, useCallback, useRef } from 'react';

type TrendType = 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
type StrengthType = 'STRONG' | 'MODERATE' | 'WEAK';
type ConfidenceType = 'HIGH' | 'MEDIUM' | 'LOW';
type LevelType = 'SUPPORT' | 'RESISTANCE' | 'PIVOT';

interface TradeAnalysis {
  asset: string;
  timeframe: string;
  current_price: string | null;
  trend: TrendType;
  trend_strength: StrengthType;
  setup_type: string;
  entry: {
    price: number | null;
    zone: string;
    condition: string;
  };
  take_profit: {
    tp1: number | null;
    tp2: number | null;
    tp1_pct: number | null;
    tp2_pct: number | null;
  };
  stop_loss: {
    price: number | null;
    pct: number | null;
    placement: string;
  };
  risk_reward_ratio: number | null;
  confidence: ConfidenceType;
  key_levels: Array<{ level: string | number; type: LevelType }>;
  analysis: string;
  warnings: string[];
  suggested_position_size: string;
}

const trendConfig = {
  BULLISH: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: '▲',
  },
  BEARISH: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '▼',
  },
  SIDEWAYS: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: '◆',
  },
};

const confidenceColor: Record<ConfidenceType, string> = {
  HIGH: 'text-emerald-400',
  MEDIUM: 'text-yellow-400',
  LOW: 'text-red-400',
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    setImageFile(file);
    setAnalysis(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const analyzeChart = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze chart');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setImage(null);
    setImageFile(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const trend = (analysis?.trend ?? 'SIDEWAYS') as TrendType;

  return (
    <div className="min-h-screen bg-[#060b18] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#060b18]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/30">
              S
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">ScalpAI</h1>
              <p className="text-[10px] text-gray-500 leading-tight">AI Chart Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Upload ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Chart Screenshot
              </h2>
              {image && (
                <button
                  onClick={resetUpload}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
                isDragging
                  ? 'border-blue-400 bg-blue-500/10'
                  : image
                  ? 'border-white/10 bg-[#0d1525]'
                  : 'border-white/10 bg-[#0d1525] hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => !image && fileInputRef.current?.click()}
            >
              {image ? (
                <div className="p-2">
                  <img
                    src={image}
                    alt="Chart screenshot"
                    className="w-full rounded-xl max-h-80 object-contain"
                  />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300 font-medium text-sm">
                    Drop your chart screenshot here
                  </p>
                  <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {!image ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-colors"
              >
                Upload Screenshot
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={analyzeChart}
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Chart'
                  )}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
                >
                  Change
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* ── Right: Analysis ── */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Trade Setup
            </h2>

            {/* Idle state */}
            {!analysis && !loading && (
              <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Upload a chart to get AI scalping analysis</p>
                <div className="flex justify-center gap-3 mt-3">
                  {['Entry', 'Take Profit', 'Stop Loss'].map((label) => (
                    <span
                      key={label}
                      className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded-lg"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-8 text-center">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-300 text-sm font-medium">Analyzing chart patterns...</p>
                <p className="text-gray-600 text-xs mt-1">
                  Identifying entry, TP &amp; SL levels
                </p>
              </div>
            )}

            {/* Results */}
            {analysis && !loading && (
              <div className="space-y-3">
                {/* Asset + confidence */}
                <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400">
                      {analysis.asset.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{analysis.asset}</p>
                      <p className="text-xs text-gray-500">{analysis.timeframe}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg bg-white/5 ${
                      confidenceColor[analysis.confidence]
                    }`}
                  >
                    {analysis.confidence} CONF.
                  </span>
                </div>

                {/* Trend */}
                <div
                  className={`border rounded-2xl p-4 flex items-center justify-between ${
                    trendConfig[trend].bg
                  } ${trendConfig[trend].border}`}
                >
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Trend</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black ${trendConfig[trend].color}`}>
                        {analysis.trend}
                      </span>
                      <span className={`text-sm ${trendConfig[trend].color}`}>
                        {trendConfig[trend].icon}
                      </span>
                    </div>
                    <p className={`text-[10px] ${trendConfig[trend].color} opacity-70`}>
                      {analysis.trend_strength} momentum
                    </p>
                  </div>
                  <div className="text-right max-w-[140px]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Setup</p>
                    <p className="text-sm font-medium text-white">{analysis.setup_type}</p>
                  </div>
                </div>

                {/* Entry / TP / SL */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#0d1525] border border-blue-500/20 rounded-xl p-3">
                    <p className="text-blue-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                      Entry
                    </p>
                    <p className="text-white font-bold text-base leading-tight">
                      {analysis.entry.price != null ? analysis.entry.price : '—'}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-1 leading-tight">
                      {analysis.entry.zone}
                    </p>
                  </div>

                  <div className="bg-[#0d1525] border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-emerald-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                      Take Profit
                    </p>
                    <p className="text-emerald-400 font-bold text-base leading-tight">
                      {analysis.take_profit.tp1 != null ? analysis.take_profit.tp1 : '—'}
                    </p>
                    {analysis.take_profit.tp1_pct != null && (
                      <p className="text-emerald-600 text-[10px]">+{analysis.take_profit.tp1_pct}%</p>
                    )}
                    {analysis.take_profit.tp2 != null && (
                      <p className="text-emerald-600/70 text-[10px]">
                        TP2: {analysis.take_profit.tp2}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#0d1525] border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                      Stop Loss
                    </p>
                    <p className="text-red-400 font-bold text-base leading-tight">
                      {analysis.stop_loss.price != null ? analysis.stop_loss.price : '—'}
                    </p>
                    {analysis.stop_loss.pct != null && (
                      <p className="text-red-600 text-[10px]">-{analysis.stop_loss.pct}%</p>
                    )}
                  </div>
                </div>

                {/* Risk/Reward + Position size */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0d1525] border border-white/5 rounded-xl p-3">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                      Risk / Reward
                    </p>
                    <p className="text-white font-bold text-lg">
                      {analysis.risk_reward_ratio != null
                        ? `1 : ${analysis.risk_reward_ratio}`
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-[#0d1525] border border-white/5 rounded-xl p-3">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                      Position Size
                    </p>
                    <p className="text-yellow-400 font-medium text-sm leading-tight">
                      {analysis.suggested_position_size}
                    </p>
                  </div>
                </div>

                {/* Entry trigger */}
                <div className="bg-[#0d1525] border border-blue-500/10 rounded-xl p-3">
                  <p className="text-blue-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                    Entry Trigger
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {analysis.entry.condition}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1">
                    SL placement: {analysis.stop_loss.placement}
                  </p>
                </div>

                {/* Key levels */}
                {analysis.key_levels && analysis.key_levels.length > 0 && (
                  <div className="bg-[#0d1525] border border-white/5 rounded-xl p-3">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                      Key Levels
                    </p>
                    <div className="space-y-1.5">
                      {analysis.key_levels.map((lvl, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-gray-300 text-xs">{lvl.level}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              lvl.type === 'SUPPORT'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : lvl.type === 'RESISTANCE'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {lvl.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analysis text */}
                <div className="bg-[#0d1525] border border-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Analysis</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{analysis.analysis}</p>
                </div>

                {/* Warnings */}
                {analysis.warnings && analysis.warnings.length > 0 && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-yellow-400 text-[10px] uppercase tracking-wider mb-2 font-semibold">
                      Warnings
                    </p>
                    <ul className="space-y-1">
                      {analysis.warnings.map((w, i) => (
                        <li key={i} className="text-yellow-300/70 text-xs flex gap-1.5">
                          <span>•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-gray-700 text-[10px] text-center">
                  Educational purposes only — not financial advice. Always use risk management.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
