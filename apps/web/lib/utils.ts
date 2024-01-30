export function isSlugValid(slug: string) {
  // check if slug contains invalid characters
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(slug.toLowerCase())) {
    return false;
  }

  return true;
}

export function formatRootUrl(subdomain?: string, path?: string) {
  const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${subdomain ? `${subdomain}.` : ''}${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${
    path ? path : ''
  }`;
}

/* eslint-disable */
// TODO: Fix eslint-disable
export const formatHtmlToMd = (htmlString: string): string => {
  // Replace <strong> with ** for bold text
  htmlString = htmlString.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

  // Replace <em> with * for italic text
  htmlString = htmlString.replace(/<em>(.*?)<\/em>/g, '*$1*');

  // Replace <a> with [text](url) for links
  htmlString = htmlString.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

  // Replace <ul> and <li> with dashes for unordered lists
  htmlString = htmlString.replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
    const listItems = p1.trim().replace(/<li>(.*?)<\/li>/g, '- $1');
    return listItems;
  });

  // Replace <ol> and <li> with numbers for ordered lists
  htmlString = htmlString.replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
    const listItems = p1.trim().replace(/<li>(.*?)<\/li>/g, (_: string, item: string) => `1. ${item}`);
    return listItems;
  });

  // Replace <p> tags with two spaces and a newline character
  htmlString = htmlString.replace(/<p>(.*?)<\/p>/gs, '$1  \n');

  // Replace <code> with backticks for inline code
  htmlString = htmlString.replace(/<code>(.*?)<\/code>/g, '`$1`');

  // Replace <pre> and <code> with triple backticks for code blocks
  htmlString = htmlString.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```');

  // Handle line breaks
  htmlString = htmlString.replace(/<br\s*\/?>/g, '  \n');

  return htmlString;
};
/* eslint-enable */

// Create api key token
export function generateApiToken(prefix: string, length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset.charAt(randomIndex);
  }

  return `${prefix}_${token}`;
}

interface SWRError extends Error {
  status: number;
}

// Fetcher function for SWR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Is valid email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Hex to hsl
export function hexToHSL(H: string | null | undefined) {
  if (!H) return;

  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length === 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = parseInt(H[1] + H[2], 16);
    g = parseInt(H[3] + H[4], 16);
    b = parseInt(H[5] + H[6], 16);
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

// hsl to hex
export function hslToHex(hsl: string | null) {
  if (!hsl) return;

  const [hStr, sStr, lStr] = hsl.replaceAll('%', '').split(' ');

  const h: number = parseFloat(hStr) / 360;
  const s: number = parseFloat(sStr) / 100;
  const l: number = parseFloat(lStr) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      const t1: number = t < 0 ? t + 1 : t;
      const t2: number = t1 > 1 ? t1 - 1 : t1;
      if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
      if (t2 < 1 / 2) return q;
      if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// is valid url
export function isValidUrl(url: string): boolean {
  if (
    !/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9()!@:%_+.~#?&//=]*)/i.test(
      url.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}
