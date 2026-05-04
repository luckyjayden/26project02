(() => {
  const run = () => {
    if (typeof AOS === "undefined") return;
    AOS.init({
      easing: "ease-out-circ",
      duration: 900,
      once: true,
      offset: 80,
      anchorPlacement: "top-bottom",
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    requestAnimationFrame(() => {
      if (typeof AOS !== "undefined") AOS.refresh();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  window.addEventListener("load", () => {
    if (typeof AOS !== "undefined") AOS.refresh();
  });
})();
