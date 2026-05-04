(() => {
  const wrap = document.querySelector("[data-reserve-root]");
  if (!wrap) return;

  const guestsEl = document.getElementById("reserveGuests");
  const roomEl = document.getElementById("reserveRoom");
  const dateSummaryEl = document.getElementById("reserveDateSummary");
  const submitBtn = document.getElementById("reserveSubmit");
  const calendarWrap = document.querySelector("[data-calendar-wrap]");
  const calTitle = document.getElementById("reserveCalTitle");
  const calGrid = document.getElementById("reserveCalGrid");
  const prevBtn = document.querySelector("[data-cal-prev]");
  const nextBtn = document.querySelector("[data-cal-next]");

  const stepEls = {
    1: wrap.querySelector('[data-reserve-step="1"]'),
    2: wrap.querySelector('[data-reserve-step="2"]'),
    3: wrap.querySelector('[data-reserve-step="3"]'),
    4: wrap.querySelector('[data-reserve-step="4"]'),
  };

  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let checkIn = null;
  let checkOut = null;

  const pad = (n) => String(n).padStart(2, "0");
  const toYmd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const isSameDay = (a, b) => a && b && toYmd(a) === toYmd(b);
  const isBetween = (d, a, b) => {
    if (!a || !b) return false;
    const t = d.getTime();
    return t > a.getTime() && t < b.getTime();
  };

  const startOfMonth = (y, m) => new Date(y, m, 1);
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

  const setStepVisible = (step, visible) => {
    const el = stepEls[step];
    if (!el) return;
    if (visible) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "");
  };

  const updateCalendarLock = () => {
    const unlocked = Boolean(guestsEl?.value && roomEl?.value);
    calendarWrap?.classList.toggle("reserve-calendar-wrap--locked", !unlocked);
  };

  const syncSteps = () => {
    const g = guestsEl?.value;
    const r = roomEl?.value;

    setStepVisible(2, Boolean(g));
    setStepVisible(3, Boolean(g && r));
    setStepVisible(4, Boolean(g && r && checkIn && checkOut));

    if (roomEl) roomEl.disabled = !g;

    if (dateSummaryEl) {
      if (!g) {
        dateSummaryEl.textContent = "인원을 먼저 선택해 주세요.";
      } else if (!r) {
        dateSummaryEl.textContent = "객실을 먼저 선택해 주세요.";
      } else if (!checkIn) {
        dateSummaryEl.textContent = "캘린더에서 체크인 날짜를 선택해 주세요.";
      } else if (!checkOut) {
        dateSummaryEl.textContent = `체크인: ${toYmd(checkIn)} — 체크아웃 날짜를 선택해 주세요.`;
      } else {
        dateSummaryEl.textContent = `체크인 ${toYmd(checkIn)} · 체크아웃 ${toYmd(checkOut)}`;
      }
    }

    if (submitBtn) submitBtn.disabled = !(g && r && checkIn && checkOut);

    updateCalendarLock();
    renderCalendar();
  };

  const renderCalendar = () => {
    if (!calGrid || !calTitle) return;

    const y = viewYear;
    const m = viewMonth;
    calTitle.textContent = `${y}년 ${m + 1}월`;

    const first = startOfMonth(y, m);
    const skip = (first.getDay() + 6) % 7;
    const total = daysInMonth(y, m);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    calGrid.innerHTML = "";

    const prevLast = daysInMonth(y, m - 1);
    for (let i = 0; i < skip; i += 1) {
      const dayNum = prevLast - skip + i + 1;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reserve-cal-day reserve-cal-day--muted";
      btn.textContent = String(dayNum);
      btn.disabled = true;
      calGrid.appendChild(btn);
    }

    for (let d = 1; d <= total; d += 1) {
      const date = new Date(y, m, d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reserve-cal-day";
      btn.textContent = String(d);

      const past = date < today;
      btn.disabled = past || !guestsEl?.value || !roomEl?.value;

      if (checkIn && isSameDay(date, checkIn)) btn.classList.add("reserve-cal-day--checkin");
      if (checkOut && isSameDay(date, checkOut)) btn.classList.add("reserve-cal-day--checkout");
      if (checkIn && checkOut && isBetween(date, checkIn, checkOut)) btn.classList.add("reserve-cal-day--in-range");

      btn.addEventListener("click", () => {
        if (!guestsEl?.value || !roomEl?.value) return;
        if (past) return;

        if (!checkIn || (checkIn && checkOut)) {
          checkIn = date;
          checkOut = null;
        } else if (date < checkIn) {
          checkIn = date;
          checkOut = null;
        } else if (isSameDay(date, checkIn)) {
          checkOut = null;
        } else {
          checkOut = date;
        }
        syncSteps();
      });

      calGrid.appendChild(btn);
    }

    const cells = 42;
    const used = skip + total;
    for (let i = used; i < cells; i += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reserve-cal-day reserve-cal-day--muted";
      btn.textContent = String(i - used + 1);
      btn.disabled = true;
      calGrid.appendChild(btn);
    }
  };

  guestsEl?.addEventListener("change", () => {
    if (!guestsEl.value) {
      roomEl.value = "";
      checkIn = null;
      checkOut = null;
    }
    syncSteps();
  });

  roomEl?.addEventListener("change", () => {
    if (!roomEl.value) {
      checkIn = null;
      checkOut = null;
    }
    syncSteps();
  });

  prevBtn?.addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderCalendar();
  });

  nextBtn?.addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderCalendar();
  });

  submitBtn?.addEventListener("click", () => {
    if (submitBtn.disabled) return;
    const msg = `예약 요청\n인원: ${guestsEl.value}명\n객실: ${roomEl.options[roomEl.selectedIndex].text}\n체크인: ${toYmd(checkIn)}\n체크아웃: ${toYmd(checkOut)}`;
    alert(msg);
  });

  setStepVisible(1, true);
  setStepVisible(2, false);
  setStepVisible(3, false);
  setStepVisible(4, false);
  if (roomEl) roomEl.disabled = true;
  updateCalendarLock();
  renderCalendar();
  syncSteps();
})();
