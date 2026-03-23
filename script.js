/* =============================================
   TIIMHOTEL.VN - script.js
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================
       1. STICKY HEADER
       ======================== */
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ========================
       2. HAMBURGER MENU
       ======================== */
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("mainNav");
  hamburger.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    const isOpen = mainNav.classList.contains("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    // Animate spans → X
    const spans = hamburger.querySelectorAll("span");
    if (isOpen) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    }
  });
  // Close nav on link click
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      hamburger.querySelectorAll("span").forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    });
  });

  /* ========================
       3. DATE DEFAULTS
       ======================== */
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const fmt = (d) => d.toISOString().split("T")[0];
  const checkinEl = document.getElementById("checkin");
  const checkoutEl = document.getElementById("checkout");

  checkinEl.value = fmt(today);
  checkoutEl.value = fmt(tomorrow);
  checkinEl.min = fmt(today);
  checkoutEl.min = fmt(tomorrow);

  checkinEl.addEventListener("change", () => {
    const cin = new Date(checkinEl.value);
    const nextDay = new Date(cin);
    nextDay.setDate(nextDay.getDate() + 1);
    checkoutEl.min = fmt(nextDay);
    if (new Date(checkoutEl.value) <= cin) {
      checkoutEl.value = fmt(nextDay);
    }
  });

  /* ========================
       4. GUESTS POPUP
       ======================== */
  const guestsField = document.querySelector(".guests-field");
  const guestsPopup = document.getElementById("guestsPopup");
  const guestsDisplay = document.getElementById("guestsDisplay");
  const roomCount = document.getElementById("roomCount");
  const adultCount = document.getElementById("adultCount");
  const childCount = document.getElementById("childCount");
  const applyGuests = document.getElementById("applyGuests");

  let guests = { rooms: 1, adults: 2, children: 0 };

  guestsField.addEventListener("click", (e) => {
    if (applyGuests.contains(e.target)) return;
    guestsPopup.classList.toggle("show");
  });

  document.querySelectorAll(".count-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const type = btn.dataset.type;
      const action = btn.dataset.action;
      const min = type === "adults" ? 1 : 0;
      const max = type === "rooms" ? 10 : 20;
      if (action === "plus" && guests[type] < max) guests[type]++;
      if (action === "minus" && guests[type] > min) guests[type]--;
      updateGuestUI();
    });
  });

  function updateGuestUI() {
    roomCount.textContent = guests.rooms;
    adultCount.textContent = guests.adults;
    childCount.textContent = guests.children;
  }

  applyGuests.addEventListener("click", (e) => {
    e.stopPropagation();
    const r = guests.rooms;
    const a = guests.adults;
    const c = guests.children;
    guestsDisplay.textContent = `${r} phòng, ${a} người lớn${
      c > 0 ? `, ${c} trẻ em` : ""
    }`;
    guestsPopup.classList.remove("show");
  });

  document.addEventListener("click", (e) => {
    if (!guestsField.contains(e.target)) {
      guestsPopup.classList.remove("show");
    }
  });

  /* ========================
       5. SEARCH BUTTON
       ======================== */
  document.querySelector(".btn-search").addEventListener("click", () => {
    const loc = document.querySelector(".location-field select").value;
    const checkin = checkinEl.value;
    const checkout = checkoutEl.value;
    if (!loc) {
      alert("Vui lòng chọn điểm đến!");
      return;
    }
    // Redirect simulation
    window.open(
      `https://tiimhotel.vn/hotel?location=${encodeURIComponent(
        loc
      )}&checkin=${checkin}&checkout=${checkout}`,
      "_blank"
    );
  });

  /* ========================
       6. COUNTDOWN TIMER
       ======================== */
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    let diff = Math.max(0, Math.floor((end - now) / 1000));

    const h = Math.floor(diff / 3600);
    diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;

    hoursEl.textContent = String(h).padStart(2, "0");
    minutesEl.textContent = String(m).padStart(2, "0");
    secondsEl.textContent = String(s).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================
       7. TESTIMONIAL SLIDER
       ======================== */
  const cards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  let current = 0;
  let autoSlide;

  function goTo(index) {
    cards[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + cards.length) % cards.length;
    cards[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function startAuto() {
    autoSlide = setInterval(() => goTo(current + 1), 4500);
  }

  function resetAuto() {
    clearInterval(autoSlide);
    startAuto();
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  // Swipe support for mobile
  const slider = document.getElementById("testimonialSlider");
  let startX = 0;
  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  slider.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  startAuto();

  /* ========================
       8. LOGIN MODAL
       ======================== */
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const btnLogin = document.querySelector(".btn-login");
  const switchToReg = document.getElementById("switchToRegister");

  if (btnLogin) {
    btnLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  }

  function closeLoginModal() {
    loginModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  closeModal.addEventListener("click", closeLoginModal);
  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) closeLoginModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLoginModal();
  });

  if (switchToReg) {
    switchToReg.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Chức năng đăng ký sẽ được mở tại tiimhotel.vn/sign-in");
    });
  }

  /* ========================
       9. INTERSECTION OBSERVER
          (Scroll Animations)
       ======================== */
  const animateEls = document.querySelectorAll(
    ".why-card, .blog-card, .dest-card, .stat, .city-tag"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animateEls.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.5s ease ${
      i * 0.05
    }s, transform 0.5s ease ${i * 0.05}s`;
    observer.observe(el);
  });

  // Add "visible" class handler via CSS
  document.head.insertAdjacentHTML(
    "beforeend",
    `
      <style>
        .visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      </style>
    `
  );

  /* ========================
       10. CITY TAG CLICK
       ======================== */
  document.querySelectorAll(".city-tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.preventDefault();
      const city = tag.textContent.trim();
      window.open(
        `https://tiimhotel.vn/hotel?location=${encodeURIComponent(city)}`,
        "_blank"
      );
    });
  });

  /* ========================
       11. DESTINATION CARDS
       ======================== */
  document.querySelectorAll(".dest-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const city = card.querySelector("h3")?.textContent.trim();
      if (city) {
        window.open(
          `https://tiimhotel.vn/hotel?location=${encodeURIComponent(city)}`,
          "_blank"
        );
      }
    });
  });

  console.log("✅ TiimHotel UI loaded successfully");
});
