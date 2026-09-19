import { createFileRoute } from "@tanstack/react-router";

/** Reject hostnames that resolve to private/loopback/link-local/metadata ranges. */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, ""); // strip IPv6 brackets

  // Obvious local names
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }

  // IPv6 loopback / link-local / unique-local
  if (host === "::1" || host === "::" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
    return true;
  }
  // IPv4-mapped IPv6 — extract the trailing IPv4 and check it
  const mapped = host.match(/::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  const ipv4Candidate = mapped ? mapped[1] : host;

  // IPv4 literal checks
  const m = ipv4Candidate.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const o = m.slice(1).map(Number);
    if (o.some((n) => n > 255)) return true; // malformed → block
    const [a, b] = o;
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local incl. 169.254.169.254
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a >= 224) return true; // multicast / reserved
  }

  return false;
}

/** Fetch Open Graph metadata for a URL. Public, read-only. SSRF-hardened. */
export const Route = createFileRoute("/api/public/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url).searchParams.get("url");
        if (!url) return Response.json({ error: "Missing url" }, { status: 400 });
        let target: URL;
        try {
          target = new URL(url);
        } catch {
          return Response.json({ error: "Invalid url" }, { status: 400 });
        }
        if (!/^https?:$/.test(target.protocol)) {
          return Response.json({ error: "Invalid scheme" }, { status: 400 });
        }
        if (isBlockedHost(target.hostname)) {
          return Response.json({ error: "Blocked host" }, { status: 400 });
        }

        try {
          // Manually follow redirects so each hop's host can be re-validated,
          // preventing a public host from redirecting to an internal address.
          let current = target;
          let res: Response | null = null;
          for (let hop = 0; hop < 5; hop++) {
            if (isBlockedHost(current.hostname)) {
              return Response.json({ error: "Blocked host" }, { status: 400 });
            }
            res = await fetch(current.toString(), {
              redirect: "manual",
              headers: {
                "User-Agent": "Mozilla/5.0 (compatible; LovableOG/1.0)",
                Accept: "text/html,application/xhtml+xml",
              },
            });
            if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
              const next = new URL(res.headers.get("location")!, current);
              if (!/^https?:$/.test(next.protocol)) {
                return Response.json({ error: "Invalid redirect scheme" }, { status: 400 });
              }
              current = next;
              continue;
            }
            break;
          }
          if (!res) return Response.json({ error: "Fetch failed" }, { status: 502 });

          const html = (await res.text()).slice(0, 200_000);
          const pick = (re: RegExp) => {
            const mm = html.match(re);
            return mm ? mm[1].trim() : "";
          };
          const meta = (prop: string) =>
            pick(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")) ||
            pick(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"));
          let image = meta("og:image") || meta("twitter:image");
          if (image && image.startsWith("/")) image = `${current.origin}${image}`;
          const title =
            meta("og:title") ||
            meta("twitter:title") ||
            pick(/<title>([^<]+)<\/title>/i) ||
            current.hostname;
          const description = meta("og:description") || meta("description") || meta("twitter:description") || "";
          const siteName = meta("og:site_name") || current.hostname.replace(/^www\./, "");
          return Response.json({ title, description, image, siteName, url: current.toString() });
        } catch (e) {
          return Response.json({ error: "Fetch failed" }, { status: 502 });
        }
      },
    },
  },
});
