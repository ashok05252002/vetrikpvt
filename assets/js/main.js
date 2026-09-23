/* ==========================================================================
   Vetrik — interactions & scroll animations (no dependencies)
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.innerWidth > 860;
  let vh = window.innerHeight;

  /* ---------- Page transition ---------- */
  const veil = document.createElement("div");
  veil.className = "page-transition";
  document.body.appendChild(veil);
  if (!reduced && sessionStorageGet("vetrik-nav")) {
    veil.classList.add("is-entering");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.remove("is-entering");
      veil.classList.add("is-entered");
    }));
  }
  sessionStorageSet("vetrik-nav", "");
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) veil.className = "page-transition";
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const url = new URL(a.href, location.href);
    if (a.target === "_blank" || url.origin !== location.origin || url.protocol.indexOf("http") !== 0) return;
    if (url.pathname === location.pathname && url.hash) return;
    if (a.hasAttribute("download")) return;
    e.preventDefault();
    sessionStorageSet("vetrik-nav", "1");
    veil.className = "page-transition is-leaving";
    setTimeout(() => { location.href = url.href; }, 480);
  });

  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (_) { /* ignore */ } }

  /* ---------- Header / progress / mobile menu ---------- */
  const header = $(".header");
  const progress = $(".progress");
  let lastY = window.scrollY;

  const burger = $(".burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.documentElement.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => {
      document.documentElement.classList.remove("menu-open");
    }));
  }

  /* ---------- Split text into animated words ---------- */
  let wordIndex = 0;
  function splitNode(node, wrapClass) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
          const outer = document.createElement("span");
          outer.className = wrapClass;
          const inner = document.createElement("span");
          inner.textContent = p;
          inner.style.setProperty("--i", wordIndex++);
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        splitNode(child, wrapClass);
      }
    });
  }
  $$("[data-split]").forEach((el) => {
    wordIndex = 0;
    const d = el.getAttribute("data-split-delay");
    if (d) el.style.setProperty("--d", d + "ms");
    splitNode(el, "split-word");
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  });

  /* Scroll-lit statement words */
  const statements = $$("[data-statement]").map((el) => {
    const words = [];
    const walk = (node, hl) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            const s = document.createElement("span");
            s.className = "w" + (hl ? " hl" : "");
            s.textContent = p;
            words.push(s);
            frag.appendChild(s);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) {
          walk(c, hl || c.tagName === "MARK");
        }
      });
    };
    walk(el, false);
    $$("mark", el).forEach((m) => m.replaceWith(...m.childNodes));
    return { el, words };
  });

  /* ---------- Stagger groups ---------- */
  $$("[data-stagger]").forEach((group) => {
    const step = parseInt(group.getAttribute("data-stagger"), 10) || 90;
    $$("[data-reveal]", group).forEach((el, i) => el.style.setProperty("--delay", i * step + "ms"));
  });

  /* ---------- Reveal on view ---------- */
  const revealEls = $$("[data-reveal], [data-split], [data-inview]");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    const dur = 1800;
    const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduced) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Horizontal scroll section ---------- */
  const hscrolls = $$("[data-hscroll]").map((sec) => ({
    sec,
    track: $(".hscroll__track", sec),
    bar: $(".hscroll__bar span", sec),
    counter: $(".hscroll__counter b", sec),
    total: $$(".pcard", sec).length,
    dist: 0,
  }));
  function sizeHscroll() {
    hscrolls.forEach((h) => {
      if (!isDesktop() || reduced) { h.sec.style.height = ""; h.track.style.transform = ""; return; }
      h.dist = Math.max(0, h.track.scrollWidth - window.innerWidth);
      h.sec.style.height = (h.dist + vh) + "px";
    });
  }

  /* ---------- Stacking cards ---------- */
  const stackItems = $$(".stack__item");
  stackItems.forEach((el, i) => el.style.setProperty("--i", i));

  /* ---------- Process timeline ---------- */
  const processes = $$("[data-process]").map((el) => ({
    el,
    line: $(".process__line span", el),
    steps: $$(".process__step", el),
  }));

  /* ---------- Sticky storytelling ---------- */
  const stories = $$("[data-story]").map((el) => ({
    el,
    steps: $$(".story__step", el),
    screens: $$(".story__screen", el),
    bar: $(".story__progress span", el),
    active: -1,
  }));
  function setStory(s, idx) {
    if (s.active === idx) return;
    s.active = idx;
    s.steps.forEach((st, i) => st.classList.toggle("is-active", i === idx));
    s.screens.forEach((sc, i) => {
      sc.classList.toggle("is-active", i === idx);
      if (i === idx) $$("[data-inview]", sc).concat(sc).forEach((n) => n.classList.add("is-in"));
    });
  }
  stories.forEach((s) => setStory(s, 0));

  /* ---------- Scroll-linked transforms ---------- */
  const tilts = $$("[data-tilt-scroll]");
  const parallaxes = $$("[data-parallax]");

  function onScroll() {
    const y = window.scrollY;

    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
    if (header) {
      header.classList.toggle("is-scrolled", y > 20);
      const goingDown = y > lastY && y > 400;
      if (!document.documentElement.classList.contains("menu-open")) header.classList.toggle("is-hidden", goingDown);
    }
    lastY = y;

    // statements
    statements.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      const p = reduced ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    });

    if (reduced) return;

    // hero tilt
    tilts.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = clamp(1 - (r.top - vh * 0.1) / (vh * 0.7));
      const rot = lerp(22, 0, p);
      const sc = lerp(0.88, 1, p);
      el.style.transform = `rotateX(${rot}deg) scale(${sc})`;
    });

    // parallax
    parallaxes.forEach((el) => {
      const f = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-c * f).toFixed(1)}px, 0)`;
    });

    // horizontal scroll
    hscrolls.forEach((h) => {
      if (!isDesktop()) return;
      const r = h.sec.getBoundingClientRect();
      const p = clamp(-r.top / (h.dist || 1));
      h.track.style.transform = `translate3d(${(-p * h.dist).toFixed(1)}px,0,0)`;
      if (h.bar) h.bar.style.transform = `scaleX(${p})`;
      if (h.counter) h.counter.textContent = String(Math.min(h.total, Math.floor(p * h.total * 0.999) + 1)).padStart(2, "0");
    });

    // stacking cards
    stackItems.forEach((el, i) => {
      const next = stackItems[i + 1];
      if (!next) return;
      const nr = next.getBoundingClientRect();
      const stickTop = parseFloat(getComputedStyle(next).top) || 0;
      const p = clamp(1 - (nr.top - stickTop) / (vh * 0.8));
      el.style.transform = `scale(${lerp(1, 0.94, p)})`;
      el.style.filter = `brightness(${lerp(1, 0.93, p)})`;
    });

    // process timeline
    processes.forEach(({ el, line, steps }) => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh * 0.6 - r.top) / r.height);
      if (line) line.style.transform = `scaleY(${p})`;
      steps.forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle("is-active", sr.top + 40 < vh * 0.6);
      });
    });

    // storytelling
    stories.forEach((s) => {
      let idx = 0;
      s.steps.forEach((st, i) => {
        const r = st.getBoundingClientRect();
        if (r.top + r.height / 2 < vh * 0.62) idx = i;
      });
      setStory(s, idx);
      if (s.bar) {
        const r = s.el.getBoundingClientRect();
        s.bar.style.transform = `scaleY(${clamp((vh * 0.5 - r.top) / r.height)})`;
      }
    });
  }

  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { onScroll(); ticking = false; });
    }
  };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => { vh = window.innerHeight; sizeHscroll(); requestTick(); });
  window.addEventListener("load", () => { sizeHscroll(); requestTick(); });
  sizeHscroll();
  onScroll();

  /* ---------- Pointer effects ---------- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !reduced) {
    // card spotlight
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });

    // magnetic buttons
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    // hero orb follows the cursor softly
    const orb = $("[data-orb]");
    if (orb) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      window.addEventListener("pointermove", (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 120;
        ty = (e.clientY / window.innerHeight - 0.5) * 80;
      });
      const loop = () => {
        cx = lerp(cx, tx, 0.05); cy = lerp(cy, ty, 0.05);
        orb.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();
    }

    // subtle 3D tilt on hover
    $$("[data-hover-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- FAQ ---------- */
  $$(".faq__item").forEach((item) => {
    const q = $(".faq__q", item);
    q.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Contact form ---------- */
  const form = $("[data-contact-form]");
  if (form) {
    const params = new URLSearchParams(location.search);
    const pre = params.get("product");
    if (pre) {
      const opt = $(`input[name="interest"][value="${CSS.escape(pre)}"]`, form);
      if (opt) opt.checked = true;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const body = [
        `Name: ${data.get("name")}`,
        `Company: ${data.get("company") || "-"}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone") || "-"}`,
        `Interested in: ${data.getAll("interest").join(", ") || "-"}`,
        "",
        String(data.get("message") || ""),
      ].join("\n");
      const to = form.getAttribute("data-mailto");
      const subject = `Enquiry from ${data.get("name")} — ${data.getAll("interest").join(", ") || "General"}`;
      form.classList.add("is-sent");
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
