import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts, Link } from "@tanstack/react-router";
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
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yasin Adnan — Portfolio" }
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function Chrome({ children }: { children: React.ReactNode }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const bare = path.startsWith("/admin") || path === "/login";
  if (bare) return <>{children}</>;
  return <><NavBar /><main>{children}</main><Footer /></>;
}

function BootWrap({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== "undefined") return !sessionStorage.getItem("boot_seen");
    return true; // Server renders loader to completely block flash
  });

  return (
    <>
      {showLoader && <BootLoader onDone={() => { setShowLoader(false); sessionStorage.setItem("boot_seen", "true"); }} />}
      <div style={{ visibility: showLoader ? "hidden" : "visible", opacity: showLoader ? 0 : 1, transition: "opacity 0.8s ease-in-out" }}>
        {children}
      </div>
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
          <Chrome><Outlet /></Chrome>
        </BootWrap>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
