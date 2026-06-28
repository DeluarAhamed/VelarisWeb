import { useEffect } from "react";

const siteBase = "/velaris-design-system/ui_kits/web-app";
const homeUrl = `${siteBase}/home-figma.html`;

const pages = [
  ["Home", "home-figma.html"],
  ["Services", "services.html"],
  ["Service detail", "service.html?s=conversion-uiux"],
  ["Work", "work.html"],
  ["Case study", "case.html?c=hazelwood"],
  ["Pricing", "pricing.html"],
  ["Resources", "resources.html"],
  ["Blog", "blog.html"],
  ["Blog post", "post.html?slug=the-2026-local-seo-checklist-for-service-businesses"],
  ["About / contact", "about.html"],
];

function App() {
  useEffect(() => {
    window.location.replace(homeUrl);
  }, []);

  return (
    <main className="handoff">
      <img src="/velaris-design-system/assets/velaris-app-icon.jpg" alt="Velaris Web" />
      <h1>Opening Velaris Web</h1>
      <p>The complete multi-page site from the supplied design system is installed.</p>
      <a className="primaryLink" href={homeUrl}>Open home page</a>
      <nav>
        {pages.map(([label, href]) => (
          <a key={label} href={`${siteBase}/${href}`}>{label}</a>
        ))}
      </nav>
    </main>
  );
}

export default App;
