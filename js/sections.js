(() => {
  const root = document.querySelector(".hero-sections");
  if (!root) return;

  const sections = root.querySelectorAll(".hero-section");
  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealAll = () => {
    sections.forEach((section) => section.classList.add("is-inview"));
  };

  if (reduceMotion.matches) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("is-inview");
        else entry.target.classList.remove("is-inview");
      }
    },
    { threshold: 0.42, rootMargin: "0px 0px -12% 0px" }
  );

  sections.forEach((section) => observer.observe(section));

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      revealAll();
    }
  });
})();
