/* Dharshan India Traders — Site Interactions */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Sticky header shadow
  const onScroll = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav + backdrop
  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  const setNavOpen = (open) => {
    if (!menuToggle || !nav) return;
    menuToggle.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    backdrop.classList.toggle("show", open);
    document.body.style.overflow = open ? "hidden" : "";
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const closeNav = () => setNavOpen(false);

  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "main-nav");
    if (!nav.id) nav.id = "main-nav";

    menuToggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("open"));
    });

    backdrop.addEventListener("click", closeNav);

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 900) closeNav();
      },
      { passive: true }
    );
  }

  // Scroll reveal with staggered support
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Contact form — mailto fallback (no backend)
  const form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const email = data.get("email") || "";
      const product = data.get("product") || "";
      const message = data.get("message") || "";

      const subject = encodeURIComponent(`Quote Request — ${product || "General Enquiry"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProduct Interest: ${product}\n\nMessage:\n${message}`
      );
      window.location.href = `mailto:dharshanindiatraders@gmail.com?subject=${subject}&body=${body}`;

      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        success.textContent =
          "Your email client should open shortly. If it does not, please email us at dharshanindiatraders@gmail.com or call +91 98840 43544.";
      }
      form.reset();
    });

    // Prefill product from URL ?product=
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product");
    if (productParam) {
      const select = form.querySelector('[name="product"]');
      if (select) {
        const option = [...select.options].find(
          (o) => o.value.toLowerCase() === productParam.toLowerCase() ||
                 o.text.toLowerCase().includes(productParam.toLowerCase())
        );
        if (option) select.value = option.value;
        else {
          select.value = productParam;
        }
      }
    }
  }

  // Set active nav link from current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
});
