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
