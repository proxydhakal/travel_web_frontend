import { ButtonLink } from "../components/Button";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found", "That page is not on the Enlighten Himalays site.");
  return (
    <section className="container-page py-20 text-center">
      <p className="text-sm font-semibold tracking-[0.2em] text-sun">404</p>
      <h1 className="mt-3 text-4xl font-extrabold">This trail does not go through.</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">The page is missing or the link is out of date. Head back to the trips, or tell us what you were looking for.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Go home</ButtonLink>
        <ButtonLink to="/packages" variant="outline">
          Browse packages
        </ButtonLink>
      </div>
    </section>
  );
}
