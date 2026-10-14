/**
 * Cloudflare Worker Edge Host for Agent-d007/autonoma-vectra-maglev-systems-62
 * Compatible with Public & Private GitHub Pages repositories
 * Deployed globally across Cloudflare's 300+ edge locations with SSL & DDoS protection
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    // In a private repository, configure GITHUB_TOKEN in Cloudflare Secrets (npx wrangler secret put GITHUB_TOKEN)
    const githubToken = env.GITHUB_TOKEN || '';
    const rawGitHubUrl = `https://raw.githubusercontent.com/Agent-d007/autonoma-vectra-maglev-systems-62/main${pathname}`;

    const headers = new Headers();
    headers.set('User-Agent', 'Autonoma-Cloudflare-Worker-Edge-Host');
    if (githubToken) {
      headers.set('Authorization', `token ${githubToken}`);
    }

    try {
      const response = await fetch(rawGitHubUrl, { headers });
      if (response.ok) {
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('X-Edge-Powered-By', 'Autonoma-Cloudflare-Worker');
        responseHeaders.set('X-Content-Type-Options', 'nosniff');
        responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');
        responseHeaders.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
        
        if (pathname.endsWith('.html')) {
          responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
        } else if (pathname.endsWith('.css')) {
          responseHeaders.set('Content-Type', 'text/css');
        } else if (pathname.endsWith('.js')) {
          responseHeaders.set('Content-Type', 'application/javascript');
        } else if (pathname.endsWith('.json')) {
          responseHeaders.set('Content-Type', 'application/json');
        }

        return new Response(response.body, {
          status: 200,
          headers: responseHeaders
        });
      }
    } catch (err) {
      // fallback
    }

    // If private or asset not found directly, proxy root index for SPA or return 404
    return new Response('404 Not Found - Autonoma Edge Host (Agent-d007/autonoma-vectra-maglev-systems-62)', { status: 404 });
  }
};
