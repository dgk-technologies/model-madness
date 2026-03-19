// Dynamic Open Graph image generator
// Returns a PNG image for social media previews

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Simple SVG-based OG image (Edge runtime can't use canvas)
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#080809"/>
      <text x="600" y="250" font-family="system-ui, sans-serif" font-size="120" font-weight="bold" fill="#eeebe4" text-anchor="middle">Model</text>
      <text x="600" y="380" font-family="system-ui, sans-serif" font-size="120" font-weight="bold" fill="#ff6b2b" text-anchor="middle">Madness</text>
      <text x="600" y="480" font-family="system-ui, sans-serif" font-size="36" fill="#68665f" text-anchor="middle">Four AI models. One bracket. Who called it?</text>
      <text x="600" y="560" font-family="system-ui, sans-serif" font-size="28" fill="#ffd166" text-anchor="middle">Claude vs ChatGPT vs Gemini vs Grok</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
