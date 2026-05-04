(() => {
  const header = document.querySelector(".site-header");
  const toggleButton = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const nav = document.getElementById("primaryNav");

  let setNavOpen = () => {};

  if (header && toggleButton && overlay && nav) {
    setNavOpen = (isOpen) => {
      header.dataset.navOpen = String(isOpen);
      toggleButton.setAttribute("aria-expanded", String(isOpen));
      toggleButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
      overlay.setAttribute("aria-hidden", String(!isOpen));
    };

    const isNavOpen = () => header.dataset.navOpen === "true";

    toggleButton.addEventListener("click", () => setNavOpen(!isNavOpen()));
    overlay.addEventListener("click", () => setNavOpen(false));

    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) setNavOpen(false);
    });

    setNavOpen(false);
  }

  let modalEl = null;
  let lastFocus = null;

  const closeBookModal = () => {
    if (!modalEl || modalEl.hasAttribute("hidden")) return;
    modalEl.setAttribute("hidden", "");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
    lastFocus = null;
  };

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (modalEl && !modalEl.hasAttribute("hidden")) {
      closeBookModal();
      return;
    }
    setNavOpen(false);
  });

  const bookTriggers = document.querySelectorAll('.site-header .header-actions a[href="#book"]');
  if (!bookTriggers.length) return;

  const buildModal = () => {
    if (modalEl) return modalEl;

    const root = document.createElement("div");
    root.id = "bookActionModal";
    root.className = "book-modal";
    root.setAttribute("hidden", "");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <div class="book-modal__backdrop" data-book-modal-close tabindex="-1"></div>
      <div class="book-modal__panel" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle" tabindex="-1">
        <h2 id="bookModalTitle" class="book-modal__title">예약</h2>
        <div class="book-modal__actions">
          <a class="btn btn-primary book-modal__cta book-modal__cta--primary" href="./reserve.html">예약하기</a>
          <a class="btn book-modal__cta book-modal__cta--outline" href="#">예약 확인하기</a>
        </div>
        <button type="button" class="book-modal__close" data-book-modal-close aria-label="닫기">×</button>
      </div>
    `;
    document.body.appendChild(root);
    modalEl = root;

    root.addEventListener("click", (e) => {
      const t = e.target;
      if (t instanceof HTMLElement && t.closest("[data-book-modal-close]")) closeBookModal();
    });

    root.querySelector(".book-modal__cta--outline")?.addEventListener("click", (e) => {
      e.preventDefault();
      closeBookModal();
    });
    root.querySelector(".book-modal__cta--primary")?.addEventListener("click", () => {
      closeBookModal();
    });

    return root;
  };

  const openBookModal = () => {
    lastFocus = document.activeElement;
    buildModal();
    setNavOpen(false);
    modalEl.removeAttribute("hidden");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const panel = modalEl.querySelector(".book-modal__panel");
    panel?.focus();
  };

  bookTriggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openBookModal();
    });
  });
})();
