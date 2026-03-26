export const getURL = () => {
  // Check if we're on the client side
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin + '/';
  }

  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL during deployment.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}
