import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { BootLoader } from "@/components/BootLoader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border px-4 py-2 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yasin Adnan — Portfolio" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Yasin Adnan" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0f1424" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Chrome({ children }: { children: React.ReactNode }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const bare = path.startsWith("/admin") || path === "/login";
  if (bare) return <>{children}</>;
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function BootWrap({ children }: { children: React.ReactNode }) {
  // Show on every fresh page load when landing on the home route.
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/";
  });

  return (
    <>
      {showLoader && <BootLoader onDone={() => setShowLoader(false)} />}
      {children}
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster position="top-right" richColors />
        <BootWrap>
          <Chrome>
            <Outlet />
          </Chrome>
        </BootWrap>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
