const SHARED = /^(?:\/assets(?:\/|$)|\/styles\.css$|\/script\.js$|\/legal(?:\/|$)|\/merci(?:\/|$))/;
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const path = url.pathname;
    if (host === "www.capellaenergy.fr") {
      url.hostname = "capellaenergy.fr";
      return Response.redirect(url.toString(), 301);
    }
    if (SHARED.test(path)) return env.ASSETS.fetch(request);
    let prefix = "";
    if (host === "capellaenergy.fr") {
      if (path === "/fr" || path === "/fr/" || path.startsWith("/fr/")) {
        url.pathname = path.slice(3) || "/";
        return Response.redirect(url.toString(), 301);
      }
      prefix = "/fr";
    } else if (host === "capellaenergy.be" || host === "www.capellaenergy.be") {
      if (path !== "/be" && !path.startsWith("/be/")) prefix = "/be";
    }
    if (!prefix) return env.ASSETS.fetch(request);
    url.pathname = prefix + path;
    const response = await env.ASSETS.fetch(new Request(url, request));
    const location = response.headers.get("location");
    if (location && response.status >= 300 && response.status < 400) {
      const target = new URL(location, url);
      if (target.origin === url.origin && (target.pathname === prefix || target.pathname.startsWith(prefix + "/"))) {
        target.pathname = target.pathname.slice(prefix.length) || "/";
        const headers = new Headers(response.headers);
        headers.set("location", target.toString());
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      }
    }
    return response;
  }
};
