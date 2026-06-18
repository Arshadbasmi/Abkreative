'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Maximize2, Layers, SunMoon, Move3d, Compass, Sliders, CheckCircle } from 'lucide-react';

const ZONES = [
  { id: 'zone1', name: '01. Walnut Media Wall',      desc: 'Concealed storage tracks & motorized panels.',           hud: 'PANEL STATUS: CLOSED',              spec: '3× Book-matched · 2,400H × 3,600W' },
  { id: 'zone2', name: '02. Quartz Indoor Bar',       desc: '4-Meter monolithic structure with seamless transitions.', hud: 'SURFACE: LEATHERED ARCTIC WHITE',    spec: '4,000mm Run · 900D · Chrome Base' },
  { id: 'zone3', name: '03. Sky-View Roof Enclosure', desc: 'Automated retractable glass panels for thermal control.', hud: 'PANELS: RETRACTED · SKY OPEN', spec: '13,700 × 7,000mm · Structural Glass' },
];

const MATERIALS = ['Book-matched Walnut Veneer', 'Mitered Quartz Monolith', 'Structural Glass'];

// ─── Scene 1: Walnut Media Wall ───────────────────────────────────────────────

function MediaWallScene() {
  const accent = '#D9FA54';
  const panelStops = [
    { offset: '0%', color: '#4A2E0F' }, { offset: '18%', color: '#7A5220' },
    { offset: '35%', color: '#9B6B28' }, { offset: '52%', color: '#6E4A1C' },
    { offset: '68%', color: '#8A5F24' }, { offset: '84%', color: '#7B5220' },
    { offset: '100%', color: '#4A2E0F' },
  ];
  const panelStopsB = [...panelStops].reverse();
  return (
    <svg viewBox='0 0 900 540' className='w-full h-full' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <linearGradient id='mw-a' x1='0' y1='0' x2='1' y2='0.06'>
          {panelStops.map((s, i) => <stop key={i} offset={s.offset} stopColor={s.color} />)}
        </linearGradient>
        <linearGradient id='mw-b' x1='1' y1='0.06' x2='0' y2='0'>
          {panelStopsB.map((s, i) => <stop key={i} offset={s.offset} stopColor={s.color} />)}
        </linearGradient>
        <linearGradient id='mw-floor' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#141418' />
          <stop offset='100%' stopColor='#0A0A0C' />
        </linearGradient>
        <linearGradient id='mw-led' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%'   stopColor={accent} stopOpacity='0' />
          <stop offset='20%'  stopColor={accent} stopOpacity='0.4' />
          <stop offset='50%'  stopColor={accent} stopOpacity='0.65' />
          <stop offset='80%'  stopColor={accent} stopOpacity='0.4' />
          <stop offset='100%' stopColor={accent} stopOpacity='0' />
        </linearGradient>
        <linearGradient id='mw-ceil' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%'   stopColor='#000' stopOpacity='0.7' />
          <stop offset='100%' stopColor='#000' stopOpacity='0' />
        </linearGradient>
        <pattern id='mw-grain' x='0' y='0' width='3' height='60' patternUnits='userSpaceOnUse'>
          <path d='M1.5,0 Q2.5,15 1.5,30 Q0.5,45 1.5,60' stroke='#00000018' strokeWidth='0.6' fill='none' />
        </pattern>
        <filter id='mw-glow'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='4' result='b' />
          <feMerge><feMergeNode in='b' /><feMergeNode in='SourceGraphic' /></feMerge>
        </filter>
      </defs>

      <rect width='900' height='540' fill='#080809' />
      <polygon points='80,448 820,448 900,540 0,540' fill='url(#mw-floor)' />
      <line x1='80' y1='448' x2='820' y2='448' stroke='#1E1E24' strokeWidth='1' />
      <rect x='0' y='0' width='900' height='65' fill='url(#mw-ceil)' />

      <rect x='100' y='62' width='115' height='386' fill='url(#mw-a)' />
      <rect x='100' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <rect x='215' y='62' width='115' height='386' fill='url(#mw-b)' />
      <rect x='215' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <line x1='215' y1='62' x2='215' y2='448' stroke='#2A1A08' strokeWidth='1.5' />

      <rect x='350' y='62' width='115' height='386' fill='url(#mw-a)' />
      <rect x='350' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <rect x='465' y='62' width='115' height='386' fill='url(#mw-b)' />
      <rect x='465' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <line x1='465' y1='62' x2='465' y2='448' stroke='#2A1A08' strokeWidth='1.5' />

      <rect x='600' y='62' width='115' height='386' fill='url(#mw-a)' />
      <rect x='600' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <rect x='715' y='62' width='115' height='386' fill='url(#mw-b)' />
      <rect x='715' y='62' width='115' height='386' fill='url(#mw-grain)' opacity='0.5' />
      <line x1='715' y1='62' x2='715' y2='448' stroke='#2A1A08' strokeWidth='1.5' />

      <rect x='330' y='62' width='20' height='386' fill='#080809' />
      <rect x='580' y='62' width='20' height='386' fill='#080809' />

      <rect x='100' y='54' width='730' height='8' fill='#111114' />
      <line x1='100' y1='54' x2='830' y2='54' stroke='#2A2A34' strokeWidth='0.5' />
      <rect x='100' y='448' width='730' height='8' fill='#111114' />

      <rect x='100' y='51' width='730' height='3' fill='url(#mw-led)' filter='url(#mw-glow)' />
      <rect x='100' y='456' width='730' height='2' fill='url(#mw-led)' opacity='0.5' />

      <line x1='100' y1='508' x2='830' y2='508' stroke={accent} strokeWidth='0.5' strokeDasharray='5,3' opacity='0.4' />
      <line x1='100' y1='503' x2='100' y2='513' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <line x1='830' y1='503' x2='830' y2='513' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <text x='465' y='505' fill={accent} fontSize='8.5' textAnchor='middle' fontFamily='monospace' opacity='0.5'>3,600mm TOTAL WIDTH</text>

      <line x1='50' y1='62' x2='50' y2='448' stroke={accent} strokeWidth='0.5' strokeDasharray='5,3' opacity='0.4' />
      <line x1='45' y1='62' x2='55' y2='62' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <line x1='45' y1='448' x2='55' y2='448' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <text x='38' y='258' fill={accent} fontSize='8.5' textAnchor='middle' fontFamily='monospace' opacity='0.5' transform='rotate(-90,38,258)'>2,400mm H</text>

      <line x1='100' y1='36' x2='330' y2='36' stroke={accent} strokeWidth='0.4' strokeDasharray='4,3' opacity='0.3' />
      <text x='215' y='30' fill={accent} fontSize='7.5' textAnchor='middle' fontFamily='monospace' opacity='0.35'>1,200mm</text>

      <line x1='580' y1='456' x2='580' y2='488' stroke={accent} strokeWidth='0.4' strokeDasharray='3,3' opacity='0.3' />
      <rect x='505' y='470' width='210' height='20' rx='2' fill={accent} fillOpacity='0.04' stroke={accent} strokeWidth='0.4' strokeOpacity='0.3' />
      <text x='610' y='483' fill={accent} fontSize='7.5' textAnchor='middle' fontFamily='monospace' opacity='0.4'>CONCEALED DRAWER CAVITY</text>

      <text x='826' y='26' fill={accent} fontSize='7.5' textAnchor='end' fontFamily='monospace' opacity='0.4'>ELEVATION · NORTH WALL</text>
      <text x='826' y='38' fill='#555' fontSize='7' textAnchor='end' fontFamily='monospace'>SCALE 1:40 · BOOK-MATCHED WALNUT</text>
    </svg>
  );
}

// ─── Scene 2: Quartz Indoor Bar ───────────────────────────────────────────────

function QuartzBarScene() {
  const accent = '#D9FA54';
  return (
    <svg viewBox='0 0 900 540' className='w-full h-full' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <linearGradient id='qb-top' x1='0' y1='0' x2='0.04' y2='1'>
          <stop offset='0%'   stopColor='#ECEAE6' />
          <stop offset='45%'  stopColor='#D8D4CF' />
          <stop offset='100%' stopColor='#C0BCB8' />
        </linearGradient>
        <linearGradient id='qb-face' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%'   stopColor='#C8C3BE' />
          <stop offset='100%' stopColor='#9A9591' />
        </linearGradient>
        <linearGradient id='qb-floor' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%'   stopColor='#141418' />
          <stop offset='100%' stopColor='#0A0A0C' />
        </linearGradient>
        <radialGradient id='qb-pglow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%'   stopColor='#FFF8E0' stopOpacity='0.12' />
          <stop offset='100%' stopColor='#FFF8E0' stopOpacity='0' />
        </radialGradient>
        <pattern id='qb-vein' x='0' y='0' width='200' height='100' patternUnits='userSpaceOnUse'>
          <path d='M0,28 Q50,22 100,30 Q150,36 200,28' stroke='#C0BCBA' strokeWidth='0.5' fill='none' opacity='0.4' />
          <path d='M0,58 Q60,52 120,60 Q170,66 200,58' stroke='#B8B4B2' strokeWidth='0.3' fill='none' opacity='0.3' />
          <path d='M18,0 Q22,50 16,100' stroke='#CCCCCA' strokeWidth='0.4' fill='none' opacity='0.2' />
          <path d='M80,0 Q85,50 78,100' stroke='#C4C0BE' strokeWidth='0.3' fill='none' opacity='0.15' />
        </pattern>
        <filter id='qb-blur'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='10' />
        </filter>
      </defs>

      <rect width='900' height='540' fill='#080809' />
      <polygon points='0,418 900,418 900,540 0,540' fill='url(#qb-floor)' />
      <line x1='0' y1='418' x2='900' y2='418' stroke='#1E1E24' strokeWidth='1' />

      <ellipse cx='240' cy='432' rx='90' ry='18' fill='#FFF8E0' opacity='0.04' filter='url(#qb-blur)' />
      <ellipse cx='530' cy='432' rx='90' ry='18' fill='#FFF8E0' opacity='0.04' filter='url(#qb-blur)' />
      <ellipse cx='760' cy='432' rx='65' ry='14' fill='#FFF8E0' opacity='0.03' filter='url(#qb-blur)' />

      <rect x='80' y='55' width='740' height='210' fill='#0D0D10' />
      <line x1='80' y1='265' x2='820' y2='265' stroke='#181820' strokeWidth='1' />
      <line x1='80' y1='160' x2='820' y2='160' stroke='#141418' strokeWidth='0.4' />

      <polygon points='80,262 820,262 780,316 120,316' fill='url(#qb-top)' />
      <polygon points='80,262 820,262 780,316 120,316' fill='url(#qb-vein)' />
      <line x1='80' y1='262' x2='820' y2='262' stroke='#F0EDE9' strokeWidth='1.5' opacity='0.7' />

      <polygon points='120,316 780,316 758,418 142,418' fill='url(#qb-face)' />
      <polygon points='120,316 780,316 758,418 142,418' fill='url(#qb-vein)' opacity='0.25' />

      <polygon points='142,416 758,416 756,426 144,426' fill='#2E2E34' />
      <line x1='142' y1='416' x2='758' y2='416' stroke='#606068' strokeWidth='0.8' />

      <polygon points='820,262 862,220 862,385 780,316' fill='#C0BBB6' />
      <polygon points='820,262 862,220 862,385 780,316' fill='url(#qb-vein)' opacity='0.15' />
      <line x1='820' y1='262' x2='862' y2='220' stroke='#F0EDE9' strokeWidth='0.8' opacity='0.5' />

      <line x1='240' y1='55' x2='240' y2='152' stroke='#222228' strokeWidth='1' />
      <ellipse cx='240' cy='164' rx='22' ry='11' fill='#181820' stroke='#333340' strokeWidth='0.5' />
      <ellipse cx='240' cy='161' rx='14' ry='7' fill='#222228' />
      <circle cx='240' cy='164' r='30' fill='url(#qb-pglow)' />
      <ellipse cx='240' cy='174' rx='85' ry='55' fill='#FFF8E0' opacity='0.03' filter='url(#qb-blur)' />

      <line x1='530' y1='55' x2='530' y2='145' stroke='#222228' strokeWidth='1' />
      <ellipse cx='530' cy='157' rx='22' ry='11' fill='#181820' stroke='#333340' strokeWidth='0.5' />
      <ellipse cx='530' cy='154' rx='14' ry='7' fill='#222228' />
      <circle cx='530' cy='157' r='30' fill='url(#qb-pglow)' />
      <ellipse cx='530' cy='167' rx='85' ry='55' fill='#FFF8E0' opacity='0.03' filter='url(#qb-blur)' />

      <line x1='765' y1='55' x2='765' y2='140' stroke='#222228' strokeWidth='1' />
      <ellipse cx='765' cy='151' rx='18' ry='9' fill='#181820' stroke='#333340' strokeWidth='0.5' />
      <ellipse cx='765' cy='148' rx='11' ry='6' fill='#222228' />
      <circle cx='765' cy='151' r='24' fill='url(#qb-pglow)' />

      {[195, 360, 525].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy='395' rx='22' ry='5' fill='#181820' />
          <polygon points={`${cx - 5},395 ${cx - 9},300 ${cx + 9},300 ${cx + 5},395`} fill='#141418' />
          <ellipse cx={cx} cy='298' rx='28' ry='7' fill='#1E1E22' />
        </g>
      ))}

      <path d='M678,262 Q688,244 698,236 Q708,226 714,236 Q720,244 730,262' stroke='#555560' strokeWidth='0.8' fill='none' opacity='0.55' />
      <line x1='704' y1='236' x2='704' y2='218' stroke='#555560' strokeWidth='0.8' opacity='0.55' />
      <line x1='695' y1='218' x2='713' y2='218' stroke='#555560' strokeWidth='0.8' opacity='0.55' />

      <line x1='80' y1='490' x2='820' y2='490' stroke={accent} strokeWidth='0.5' strokeDasharray='5,3' opacity='0.4' />
      <line x1='80' y1='485' x2='80' y2='495' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <line x1='820' y1='485' x2='820' y2='495' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <text x='450' y='487' fill={accent} fontSize='8.5' textAnchor='middle' fontFamily='monospace' opacity='0.5'>4,000mm CONTINUOUS RUN</text>

      <line x1='857' y1='262' x2='868' y2='418' stroke={accent} strokeWidth='0.4' strokeDasharray='4,3' opacity='0.3' />
      <text x='882' y='345' fill={accent} fontSize='7.5' textAnchor='middle' fontFamily='monospace' opacity='0.35' transform='rotate(90,882,345)'>900mm D</text>

      <text x='826' y='26' fill={accent} fontSize='7.5' textAnchor='end' fontFamily='monospace' opacity='0.4'>PERSPECTIVE · INTERIOR VIEW</text>
      <text x='826' y='38' fill='#555' fontSize='7' textAnchor='end' fontFamily='monospace'>LEATHERED ARCTIC WHITE QUARTZ</text>
    </svg>
  );
}

// ─── Scene 3: Sky-View Roof ───────────────────────────────────────────────────

function RoofScene() {
  const accent = '#D9FA54';
  const colX = [60, 258, 456, 654, 822];
  const rowY = [40, 195, 335, 486];
  const boltPositions = [78, 272, 470, 668].flatMap(x =>
    [54, 205, 345].map(y => ({ cx: x + 9, cy: y + 8 }))
  );
  return (
    <svg viewBox='0 0 900 540' className='w-full h-full' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <linearGradient id='rs-sky' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%'   stopColor='#162A42' />
          <stop offset='45%'  stopColor='#1E4A72' />
          <stop offset='75%'  stopColor='#2A6898' />
          <stop offset='100%' stopColor='#3A7EA8' />
        </linearGradient>
        <linearGradient id='rs-glass' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%'   stopColor='#5A8BAC' stopOpacity='0.28' />
          <stop offset='50%'  stopColor='#7AB0CC' stopOpacity='0.14' />
          <stop offset='100%' stopColor='#4A7A9A' stopOpacity='0.22' />
        </linearGradient>
        <linearGradient id='rs-frame' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%'   stopColor='#1A1A20' />
          <stop offset='100%' stopColor='#0E0E12' />
        </linearGradient>
        <filter id='rs-sun'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='18' />
        </filter>
        <filter id='rs-glow'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='4' result='b' />
          <feMerge><feMergeNode in='b' /><feMergeNode in='SourceGraphic' /></feMerge>
        </filter>
      </defs>

      <rect width='900' height='540' fill='url(#rs-sky)' />
      <circle cx='710' cy='75' r='130' fill='#FFF0C0' opacity='0.07' filter='url(#rs-sun)' />
      <circle cx='710' cy='75' r='50'  fill='#FFF8E0' opacity='0.10' filter='url(#rs-sun)' />

      {colX.map((x, i) => (
        <rect key={`col${i}`} x={x} y={40} width={i === 0 || i === 4 ? 18 : 14} height={460} fill='url(#rs-frame)' stroke='#28282E' strokeWidth='0.3' />
      ))}
      {rowY.map((y, i) => (
        <rect key={`row${i}`} x={60} y={y} width={780} height={i === 0 || i === 3 ? 14 : 10} fill='url(#rs-frame)' stroke='#28282E' strokeWidth='0.3' />
      ))}

      <rect x='78'  y='54' width='180' height='141' fill='url(#rs-glass)' />
      <rect x='272' y='54' width='184' height='141' fill='url(#rs-glass)' opacity='0.85' />
      <rect x='470' y='54' width='184' height='141' fill='url(#rs-glass)' opacity='0.90' />
      <rect x='668' y='54' width='154' height='141' fill='url(#rs-glass)' opacity='0.95' />
      <rect x='78'  y='205' width='180' height='130' fill='url(#rs-glass)' opacity='0.88' />
      <rect x='272' y='205' width='184' height='130' fill='url(#rs-glass)' />
      <rect x='470' y='205' width='184' height='130' fill='url(#rs-glass)' opacity='0.82' />
      <rect x='668' y='205' width='154' height='130' fill='url(#rs-glass)' opacity='0.78' />
      <rect x='78'  y='345' width='180' height='141' fill='url(#rs-glass)' opacity='0.88' />
      <rect x='272' y='345' width='184' height='141' fill='url(#rs-glass)' opacity='0.92' />
      <rect x='470' y='345' width='184' height='141' fill='url(#rs-glass)' opacity='0.96' />
      <rect x='668' y='345' width='154' height='141' fill='url(#rs-glass)' opacity='0.80' />

      <rect x='272' y='54' width='184' height='141' fill='#162A42' opacity='0.55' />
      <line x1='272' y1='54'  x2='456' y2='195' stroke={accent} strokeWidth='0.4' opacity='0.18' />
      <line x1='456' y1='54'  x2='272' y2='195' stroke={accent} strokeWidth='0.4' opacity='0.18' />
      <text x='364' y='130' fill={accent} fontSize='7.5' textAnchor='middle' fontFamily='monospace' opacity='0.5'>OPEN</text>

      <line x1='80'  y1='54'  x2='102' y2='195' stroke='#FFF' strokeWidth='0.3' opacity='0.08' />
      <line x1='472' y1='54'  x2='484' y2='195' stroke='#FFF' strokeWidth='0.3' opacity='0.06' />
      <line x1='670' y1='205' x2='692' y2='335' stroke='#FFF' strokeWidth='0.3' opacity='0.08' />

      {boltPositions.map((b, i) => (
        <circle key={`bolt${i}`} cx={b.cx} cy={b.cy} r={2} fill='#111115' stroke='#30303A' strokeWidth='0.3' />
      ))}

      <line x1='60'  y1='516' x2='840' y2='516' stroke={accent} strokeWidth='0.5' strokeDasharray='5,3' opacity='0.4' />
      <line x1='60'  y1='511' x2='60'  y2='521' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <line x1='840' y1='511' x2='840' y2='521' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <text x='450' y='513' fill={accent} fontSize='8.5' textAnchor='middle' fontFamily='monospace' opacity='0.5'>13,700mm SPAN</text>

      <line x1='22' y1='40'  x2='22' y2='500' stroke={accent} strokeWidth='0.5' strokeDasharray='5,3' opacity='0.4' />
      <line x1='17' y1='40'  x2='27' y2='40'  stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <line x1='17' y1='500' x2='27' y2='500' stroke={accent} strokeWidth='0.5' opacity='0.4' />
      <text x='12' y='275' fill={accent} fontSize='8.5' textAnchor='middle' fontFamily='monospace' opacity='0.5' transform='rotate(-90,12,275)'>7,000mm</text>

      <circle cx='710' cy='76' r='9'  fill='none' stroke={accent} strokeWidth='0.5' opacity='0.4' filter='url(#rs-glow)' />
      <circle cx='710' cy='76' r='3'  fill={accent} opacity='0.45' />
      <line x1='710' y1='63' x2='710' y2='57' stroke={accent} strokeWidth='0.4' opacity='0.35' />
      <line x1='710' y1='89' x2='710' y2='95' stroke={accent} strokeWidth='0.4' opacity='0.35' />
      <line x1='697' y1='76' x2='691' y2='76' stroke={accent} strokeWidth='0.4' opacity='0.35' />
      <line x1='723' y1='76' x2='729' y2='76' stroke={accent} strokeWidth='0.4' opacity='0.35' />
      <text x='736' y='74' fill={accent} fontSize='7' fontFamily='monospace' opacity='0.4'>SUN</text>

      <text x='826' y='26' fill={accent} fontSize='7.5' textAnchor='end' fontFamily='monospace' opacity='0.4'>REFLECTED CEILING PLAN</text>
      <text x='826' y='38' fill='#555' fontSize='7'   textAnchor='end' fontFamily='monospace'>12× PANELS · 4 RETRACTED · SCALE 1:80</text>
    </svg>
  );
}

// ─── Mock Viewer ────────────────────────────────────────────────────────────────────────

function MockViewer({ activeZone }: { activeZone: string }) {
  const [displayed, setDisplayed] = useState(activeZone);
  const [fading, setFading]       = useState(false);

  useEffect(() => {
    if (activeZone === displayed) return;
    setFading(true);
    const t = setTimeout(() => { setDisplayed(activeZone); setFading(false); }, 320);
    return () => clearTimeout(t);
  }, [activeZone, displayed]);

  return (
    <div className='w-full h-full relative bg-[#080809] overflow-hidden'>
      <div className={`absolute inset-0 transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        {displayed === 'zone1' && <MediaWallScene />}
        {displayed === 'zone2' && <QuartzBarScene />}
        {displayed === 'zone3' && <RoofScene />}
      </div>
      <div
        className='absolute inset-0 pointer-events-none'
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)' }}
      />
      <div
        className='absolute inset-0 pointer-events-none'
        style={{ background: 'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.5) 100%)' }}
      />
    </div>
  );
}

// ─── Main Portal ───────────────────────────────────────────────────────────────────────────

export default function ABKreativePortal() {
  const [activeZone, setActiveZone] = useState('zone1');
  const [isNightMode, setIsNightMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const activeZoneData = ZONES.find(z => z.id === activeZone)!;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 ${isNightMode ? 'bg-[#0A0A0C] text-white' : 'bg-[#F4F4F6] text-black'}`}>

      <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none' />

      <header className='relative z-10 border-b border-zinc-800/40 backdrop-blur-md px-6 py-4 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          <div className='h-2 w-2 rounded-full bg-[#D9FA54] animate-pulse' />
          <span className='font-mono text-sm tracking-[0.3em] uppercase opacity-90'>AB KREATIVE</span>
        </div>
        <div className='flex items-center space-x-6'>
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className='flex items-center space-x-2 text-xs font-mono border border-zinc-800 rounded-full px-4 py-1.5 transition-all hover:border-[#D9FA54]'
          >
            <SunMoon size={14} className='text-[#D9FA54]' />
            <span>{isNightMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>
          <span className='text-xs font-mono px-3 py-1 rounded bg-[#D9FA54]/10 text-[#D9FA54] border border-[#D9FA54]/20'>
            PROPOSAL STAGE v3
          </span>
        </div>
      </header>

      <main className='relative z-10 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-72px)]'>

        <div className='lg:col-span-4 p-8 flex flex-col justify-between border-r border-zinc-800/40'>
          <div>
            <span className='text-xs font-mono text-[#D9FA54] tracking-widest uppercase block mb-2'>PREMIUM RESIDENTIAL FITOUT</span>
            <h1 className='text-4xl font-light tracking-tight mb-4 leading-none'>The Kinetic Luxury Sunroom</h1>
            <p className='text-sm opacity-60 font-mono mb-8'>Emirates Hills, Dubai // 13,700mm × 7,000mm Retrofit</p>

            <div className='space-y-6'>
              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center'>
                  <Compass size={14} className='mr-2 text-[#D9FA54]' /> INTERACTIVE VIEWPORTS
                </h3>
                <div className='space-y-2'>
                  {ZONES.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                        activeZone === zone.id
                          ? 'bg-[#D9FA54]/5 border-[#D9FA54] text-white'
                          : 'bg-zinc-900/20 border-zinc-800/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className='flex justify-between items-center mb-1'>
                        <span className={`text-sm font-medium ${activeZone === zone.id ? 'text-[#D9FA54]' : ''}`}>{zone.name}</span>
                        {activeZone === zone.id && <Move3d size={14} className='text-[#D9FA54]' />}
                      </div>
                      <p className='text-xs opacity-50'>{zone.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center'>
                  <Sliders size={14} className='mr-2 text-[#D9FA54]' /> PREMIUM CORE SPECIFICATION
                </h3>
                <div className='grid grid-cols-1 gap-2'>
                  {MATERIALS.map((mat, i) => (
                    <div key={i} className='flex items-center space-x-3 bg-zinc-900/40 p-3 rounded border border-zinc-800/30 text-xs'>
                      <CheckCircle size={14} className='text-[#D9FA54]' />
                      <span className='opacity-80'>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='pt-8 border-t border-zinc-800/40 mt-8'>
            <div className='flex items-center space-x-3 text-xs opacity-50 font-mono'>
              <Shield size={14} />
              <span>ARCHITECTURAL VISUALISATION · PROPOSAL STAGE</span>
            </div>
          </div>
        </div>

        <div className='lg:col-span-8 relative h-[60vh] lg:h-auto bg-black flex items-center justify-center overflow-hidden'>

          {loading && (
            <div className='absolute inset-0 bg-[#0A0A0C] z-20 flex flex-col items-center justify-center'>
              <div className='h-8 w-8 border-2 border-zinc-800 border-t-[#D9FA54] rounded-full animate-spin mb-4' />
              <p className='text-xs font-mono tracking-widest opacity-60'>GENERATING INTERACTIVE ENVIRONMENT...</p>
            </div>
          )}

          <div className='w-full h-full relative z-10'>
            <MockViewer activeZone={activeZone} />
          </div>

          <div className='absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none'>
            <div className='bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 p-3 rounded-md flex items-center space-x-4 pointer-events-auto'>
              <div className='flex items-center space-x-2 text-xs font-mono'>
                <Layers size={14} className='text-[#D9FA54]' />
                <span className='text-zinc-400'>VIEW:</span>
                <span className='text-[#D9FA54] uppercase'>{activeZoneData.hud}</span>
              </div>
            </div>
            <div className='bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 p-3 rounded-md pointer-events-auto'>
              <button className='p-1 hover:text-[#D9FA54] transition-colors'><Maximize2 size={16} /></button>
            </div>
          </div>

          <div className='absolute top-6 left-6 z-20 pointer-events-none'>
            <div className='bg-zinc-950/70 backdrop-blur-sm border border-zinc-800/50 px-3 py-2 rounded'>
              <p className='text-[10px] font-mono tracking-widest text-zinc-500'>SPECIFICATION</p>
              <p className='text-xs font-mono text-[#D9FA54] mt-0.5'>{activeZoneData.spec}</p>
            </div>
          </div>

          <div className='absolute top-6 right-6 z-20 pointer-events-none text-right'>
            <p className='text-[10px] font-mono tracking-widest opacity-40'>PROJECT SERIAL</p>
            <p className='text-xs font-mono tracking-wider text-[#D9FA54]'>#ABK-2026-SUNROOM</p>
          </div>

        </div>
      </main>
    </div>
  );
}
