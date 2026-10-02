import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar, SearchDialog } from "../components/Navbar";
import { ErrorState, PageSkeleton } from "../components/States";
import { useContentState } from "../content/ContentContext";

export function MainLayout() {
  const [search, setSearch] = useState(false);
  const { pathname } = useLocation();
  const content = useContentState();

  useEffect(() => {
    window.scrollTo(0, 0);
    const key = "eh-visits";
    const seen = sessionStorage.getItem(key) || "";
    if (seen.split("|").includes(pathname)) return;
    sessionStorage.setItem(key, `${seen}|${pathname}`.slice(-800));
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => undefined);
  }, [pathname]);

  if (content.error) {
    return (
      <div className="grid min-h-screen place-items-center bg-sand p-6">
        <ErrorState onRetry={content.reload} />
      </div>
    );
  }

  if (!content.ready) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-sand">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar onSearch={() => setSearch(true)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
