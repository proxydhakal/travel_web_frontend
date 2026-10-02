import { Component, lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorState, PageSkeleton } from "./components/States";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminApp } from "./admin/AdminApp";
import { ContentProvider } from "./content/ContentContext";
import { MainLayout } from "./layouts/MainLayout";

const Home = lazy(() => import("./pages/Home"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Packages = lazy(() => import("./pages/Packages"));
const PackageDetails = lazy(() => import("./pages/PackageDetails"));
const Activities = lazy(() => import("./pages/Activities"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryDetails = lazy(() => import("./pages/Stories").then((module) => ({ default: module.StoryDetails })));
const Search = lazy(() => import("./pages/Search"));
const CmsPageView = lazy(() => import("./pages/CmsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InfoPage = lazy(() => import("./pages/InfoPages"));

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <ErrorState onRetry={() => this.setState({ failed: false })} />;
    }
    return this.props.children;
  }
}

function info(pageKey: "faq" | "terms" | "privacy" | "booking" | "careers" | "sitemap") {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InfoPage pageKey={pageKey} />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <ContentProvider>
          <Boundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="admin/*" element={<AdminApp />} />
                <Route element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="destinations" element={<Destinations />} />
                  <Route path="destinations/:slug" element={<DestinationDetails />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="packages/:slug" element={<PackageDetails />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="search" element={<Search />} />
                  <Route path="pages/:slug" element={<CmsPageView />} />
                  <Route path="stories" element={<Stories />} />
                  <Route path="stories/:slug" element={<StoryDetails />} />
                  <Route path="faq" element={info("faq")} />
                  <Route path="terms" element={info("terms")} />
                  <Route path="privacy" element={info("privacy")} />
                  <Route path="booking-policy" element={info("booking")} />
                  <Route path="careers" element={info("careers")} />
                  <Route path="sitemap" element={info("sitemap")} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </Boundary>
          </ContentProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
