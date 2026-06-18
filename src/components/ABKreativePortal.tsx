'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Shield, Maximize2, Layers, SunMoon, Move3d, Compass, Sliders, CheckCircle } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
          'events-target'?: string;
          hint?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function ABKreativePortal() {
  const [activeZone, setActiveZone] = useState('zone1');
  const [isNightMode, setIsNightMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const projectSpecs = {
    title: 'The Kinetic Luxury Sunroom',
    location: 'Emirates Hills, Dubai',
    scale: '13,700mm × 7,000mm Retrofit',
    materials: ['Book-matched Walnut Veneer', 'Mitered Quartz Monolith', 'Structural Glass'],
  };

  const interactiveZones = [
    { id: 'zone1', name: '01. Walnut Media Wall', desc: 'Concealed storage tracks & motorized panels.' },
    { id: 'zone2', name: '02. Quartz Indoor Bar', desc: '4-Meter monolithic structure with seamless transitions.' },
    { id: 'zone3', name: '03. Sky-View Roof Enclosure', desc: 'Automated retractable glass panels for thermal control.' },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 ${isNightMode ? 'bg-[#0A0A0C] text-white' : 'bg-[#F4F4F6] text-black'}`}>

      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.5.5/build/spline-viewer.js"
        strategy="lazyOnload"
      />

      {/* Dynamic Ambient Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/40 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-[#D9FA54] animate-pulse" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase opacity-90">AB KREATIVE</span>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="flex items-center space-x-2 text-xs font-mono border border-zinc-800 rounded-full px-4 py-1.5 transition-all hover:border-[#D9FA54]"
          >
            <SunMoon size={14} className="text-[#D9FA54]" />
            <span>{isNightMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>
          <span className="text-xs font-mono px-3 py-1 rounded bg-[#D9FA54]/10 text-[#D9FA54] border border-[#D9FA54]/20">
            PROPOSAL STAGE v3
          </span>
        </div>
      </header>

      {/* Main Presentation Layout */}
      <main className="relative z-10 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-72px)]">

        {/* Left Side: Technical Briefing Panel */}
        <div className="lg:col-span-4 p-8 flex flex-col justify-between border-r border-zinc-800/40">
          <div>
            <span className="text-xs font-mono text-[#D9FA54] tracking-widest uppercase block mb-2">PREMIUM RESIDENTIAL FITOUT</span>
            <h1 className="text-4xl font-light tracking-tight mb-4 leading-none">
              {projectSpecs.title}
            </h1>
            <p className="text-sm opacity-60 font-mono mb-8">{projectSpecs.location} // {projectSpecs.scale}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center">
                  <Compass size={14} className="mr-2 text-[#D9FA54]" /> INTERACTIVE VIEWPORTS
                </h3>
                <div className="space-y-2">
                  {interactiveZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                        activeZone === zone.id
                          ? 'bg-[#D9FA54]/5 border-[#D9FA54] text-white'
                          : 'bg-zinc-900/20 border-zinc-800/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${activeZone === zone.id ? 'text-[#D9FA54]' : ''}`}>{zone.name}</span>
                        {activeZone === zone.id && <Move3d size={14} className="text-[#D9FA54]" />}
                      </div>
                      <p className="text-xs opacity-50">{zone.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center">
                  <Sliders size={14} className="mr-2 text-[#D9FA54]" /> PREMIUM CORE SPECIFICATION
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {projectSpecs.materials.map((mat, i) => (
                    <div key={i} className="flex items-center space-x-3 bg-zinc-900/40 p-3 rounded border border-zinc-800/30 text-xs">
                      <CheckCircle size={14} className="text-[#D9FA54]" />
                      <span className="opacity-80">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800/40 mt-8">
            <div className="flex items-center space-x-3 text-xs opacity-50 font-mono">
              <Shield size={14} />
              <span>INTERACTIVE CANVAS POWERED BY SPLINE RUNTIME v1.5</span>
            </div>
          </div>
        </div>

        {/* Right Side: Immersive 3D Spline Canvas */}
        <div className="lg:col-span-8 relative h-[60vh] lg:h-auto bg-black flex items-center justify-center overflow-hidden">

          {loading && (
            <div className="absolute inset-0 bg-[#0A0A0C] z-20 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-2 border-zinc-800 border-t-[#D9FA54] rounded-full animate-spin mb-4" />
              <p className="text-xs font-mono tracking-widest opacity-60">GENERATING INTERACTIVE ENVIRONMENT...</p>
            </div>
          )}

          {/* Core Embedded Spline Viewer */}
          <div className="w-full h-full relative z-10">
            <spline-viewer
              url="https://prod.spline.design/o3v1HPnOwXUx88B6/scene.splinecode"
              events-target="global"
              hint="true"
            />
          </div>

          {/* Contextual Canvas HUD Controls */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
            <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 p-3 rounded-md flex items-center space-x-4 pointer-events-auto">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <Layers size={14} className="text-[#D9FA54]" />
                <span className="text-zinc-400">CAMERA STATE:</span>
                <span className="text-white uppercase">{activeZone} ENGINE MATCH</span>
              </div>
            </div>
            <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 p-3 rounded-md pointer-events-auto flex space-x-2">
              <button className="p-1 hover:text-[#D9FA54] transition-colors"><Maximize2 size={16} /></button>
            </div>
          </div>

          {/* HUD Branding Tag */}
          <div className="absolute top-6 right-6 z-20 pointer-events-none">
            <div className="text-right">
              <p className="text-[10px] font-mono tracking-widest opacity-40">PROJECT SERIAL</p>
              <p className="text-xs font-mono tracking-wider text-[#D9FA54]">#ABK-2026-SUNROOM</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
