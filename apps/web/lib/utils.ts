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
