(() => {
  const header = document.querySelector(".site-header");
  const toggleButton = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const nav = document.getElementById("primaryNav");

  if (!header || !toggleButton || !overlay || !nav) return;

  const setOpen = (isOpen) => {
    header.dataset.navOpen = String(isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    overlay.setAttribute("aria-hidden", String(!isOpen));
  };

  const isOpen = () => header.dataset.navOpen === "true";

  toggleButton.addEventListener("click", () => setOpen(!isOpen()));
  overlay.addEventListener("click", () => setOpen(false));

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  setOpen(false);
})();
