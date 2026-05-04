(() => {
  const root = document.querySelector(".hero-sections");
  if (!root) return;

  const sections = root.querySelectorAll(".hero-section");
  if (!sections.length) return;

  /* CSS 숨김은 이 클래스가 있을 때만 적용 → 스크립트 실패 시에도 본문이 보임 */
  root.classList.add("hero-scroll-anim");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealAll = () => {
    sections.forEach((section) => section.classList.add("is-inview"));
  };

  if (reduceMotion.matches) {
    revealAll();
    return;
  }

  const markRevealed = (section) => {
    section.classList.add("is-inview");
    observer.unobserve(section);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) markRevealed(entry.target);
      }
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  sections.forEach((section) => observer.observe(section));

  const syncVisible = () => {
    const h = window.innerHeight || document.documentElement.clientHeight;
    sections.forEach((section) => {
      if (section.classList.contains("is-inview")) return;
      const r = section.getBoundingClientRect();
      const intersects = r.top < h * 0.95 && r.bottom > h * 0.05;
      if (intersects) markRevealed(section);
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(syncVisible);
  });

  window.addEventListener("load", syncVisible, { once: true });

  let scrollTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        syncVisible();
        scrollTick = false;
      });
    },
    { passive: true }
  );

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      revealAll();
    }
  });
})();
