import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const client = new Anthropic();

const PROMPT = `You are an expert scalp trader and technical analyst. Analyze this trading chart screenshot carefully.

Look for:
- Current price trend and momentum direction
- Key support and resistance levels visible on the chart
- Candlestick patterns (pin bars, engulfing, hammer, doji, etc.)
- Chart patterns (flags, triangles, wedges, double tops/bottoms, breakouts)
- Volume patterns if visible
- Technical indicators if visible (RSI, MACD, Bollinger Bands, Moving Averages, etc.)
- Current price location relative to key levels

Based on your analysis, provide a precise SCALPING trade setup for the next likely move.

Respond with ONLY valid JSON — no markdown, no explanation text, just the raw JSON object:

{
  "asset": "asset name (e.g. BTC/USDT, EUR/USD, SPY, AAPL, or Unknown)",
  "timeframe": "timeframe visible (e.g. 1m, 5m, 15m, 1H, 4H, or Unknown)",
  "current_price": "current price as string if visible, or null",
  "trend": "BULLISH or BEARISH or SIDEWAYS",
  "trend_strength": "STRONG or MODERATE or WEAK",
  "setup_type": "setup name (e.g. Bull Flag Breakout, Support Bounce, Resistance Rejection, EMA Cross)",
  "entry": {
    "price": exact entry price as number or null,
    "zone": "brief entry zone description",
    "condition": "specific trigger to enter the trade"
  },
  "take_profit": {
    "tp1": first target price as number or null,
    "tp2": second target price as number or null,
    "tp1_pct": percentage gain from entry as number or null,
    "tp2_pct": percentage gain from entry as number or null
  },
  "stop_loss": {
    "price": stop loss price as number or null,
    "pct": percentage loss from entry as number or null,
    "placement": "where to place the stop (e.g. below recent low, above resistance)"
  },
  "risk_reward_ratio": ratio to TP1 as number (e.g. 2.5) or null,
  "confidence": "HIGH or MEDIUM or LOW",
  "key_levels": [
    {"level": price or description, "type": "SUPPORT or RESISTANCE or PIVOT"}
  ],
  "analysis": "3-4 sentence detailed analysis of the chart and trade rationale",
  "warnings": ["invalidation condition 1", "risk warning 2"],
  "suggested_position_size": "conservative suggestion (e.g. 1-2% of trading capital)"
}`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported image type. Use PNG, JPG, or WebP.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = (file.type === 'image/jpg' ? 'image/jpeg' : file.type) as
      | 'image/jpeg'
      | 'image/png'
      | 'image/gif'
      | 'image/webp';

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: PROMPT,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from AI.');
    }

    // Handle both raw JSON and markdown-wrapped JSON
    let jsonStr = content.text;
    const codeBlockMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const rawJsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (rawJsonMatch) jsonStr = rawJsonMatch[0];
    }

    const analysis = JSON.parse(jsonStr);
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error('Chart analysis error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
