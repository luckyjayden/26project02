(() => {
  const family = document.querySelector("[data-family-site]");
  const familyToggle = family?.querySelector("[data-family-toggle]");
  const familyList = family?.querySelector("[data-family-list]");
  const backTop = document.querySelector("[data-back-top]");

  const setFamilyOpen = (open) => {
    if (!family || !familyToggle || !familyList) return;
    family.dataset.open = String(open);
    familyToggle.setAttribute("aria-expanded", String(open));
    if (open) familyList.removeAttribute("hidden");
    else familyList.setAttribute("hidden", "");
  };

  if (family && familyToggle && familyList) {
    familyToggle.addEventListener("click", () => {
      const next = family.dataset.open !== "true";
      setFamilyOpen(next);
    });

    document.addEventListener("click", (e) => {
      if (!family.contains(e.target)) setFamilyOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setFamilyOpen(false);
    });

    setFamilyOpen(false);
  }

  backTop?.addEventListener("click", () => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" });
  });
})();
