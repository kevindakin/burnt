// GLOBAL VARIABLES
const durationBase = 0.8;
const durationSlow = 1.2;
const durationFast = 0.4;
const easeBase = "power4.inOut";

// GENERAL

function lenisScroll() {
  (lenis = new Lenis({
    lerp: 0.12,
  })),
    lenis.on("scroll", ScrollTrigger.update),
    gsap.ticker.add((e) => {
      lenis.raf(1e3 * e);
    }),
    gsap.ticker.lagSmoothing(0);
}

function isMenuOpen() {
  const menu = document.querySelector(".nav_menu");
  return menu && menu.getAttribute("aria-hidden") === "false";
}

function navScroll() {
  const navComponent = document.querySelector('[data-menu="nav"]');
  const heroSection = document.querySelector('[data-menu="hero"]');

  if (!navComponent || !heroSection) return;

  let navHidden = false;
  let activeTween = null;
  let pastHero = false;

  const instantBehavior =
    heroSection.getAttribute("data-menu-timing") === "instant";

  ScrollTrigger.create({
    trigger: heroSection,
    start: "bottom top",
    end: "bottom top",
    onEnter: () => {
      pastHero = true;
    },
    onEnterBack: () => {
      pastHero = false;
      navComponent.classList.remove("is-scrolled");
    },
  });

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (isMenuOpen()) {
        if (activeTween) activeTween.kill();
        gsap.set(navComponent, { y: "0%" });
        navComponent.classList.remove("is-scrolled");
        navHidden = false;
        return;
      }

      const scrollingUp = self.direction === -1;

      // Scrolling up - always show nav
      if (scrollingUp && navHidden) {
        if (activeTween) activeTween.kill();
        navHidden = false;

        activeTween = gsap.to(navComponent, {
          y: "0%",
          opacity: 1,
          duration: durationBase,
          ease: easeBase,
          onComplete: () => {
            activeTween = null;
          },
        });
      }
      // Scrolling down - hide based on behavior type
      else if (!scrollingUp && !navHidden) {
        // Instant behavior: always hide on scroll down
        // Default behavior: only hide if past hero
        if (instantBehavior || pastHero) {
          if (activeTween) activeTween.kill();
          navHidden = true;

          activeTween = gsap.to(navComponent, {
            y: "-100%",
            opacity: 1,
            duration: durationBase,
            ease: easeBase,
            onComplete: () => {
              if (pastHero) {
                navComponent.classList.add("is-scrolled");
              }
              activeTween = null;
            },
          });
        }
      }
    },
  });
}

function navDropdown() {
  const nav = document.querySelector('[data-menu="nav"]');
  if (!nav) return;

  const items = nav.querySelectorAll('[data-dropdown="wrap"]');
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  items.forEach((item) => {
    const link = item.querySelector('[data-dropdown="trigger"]');
    const menu = item.querySelector('[data-dropdown="menu"]');

    if (!link || !menu) return;

    const arrow = link.querySelector(".nav_dropdown_arrow");
    if (!arrow) return;

    const dropdownItems = menu.querySelectorAll('[data-dropdown="item"]');

    let timeout;

    const menuOpen = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.6,
        ease: easeBase,
      },
    });

    menuOpen.to(menu, {
      autoAlpha: 1,
      y: "0rem",
    });

    menuOpen.fromTo(
      dropdownItems,
      {
        opacity: 0,
        y: "2rem",
      },
      {
        opacity: 1,
        y: "0rem",
        stagger: 0.1,
        ease: "power4.out",
      },
      "<0.1"
    );

    let isOpen = false;

    const openMenu = () => {
      if (isOpen) return;
      clearTimeout(timeout);
      isOpen = true;
      menu.style.display = "block";
      arrow.classList.add("is-open");
      menuOpen.play();
    };

    const closeMenu = () => {
      isOpen = false;
      menuOpen.reverse();
      arrow.classList.remove("is-open");
      menu.style.display = "none";
    };

    if (isTouch) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        menu.style.display === "block" ? closeMenu() : openMenu();
      });
    } else {
      item.addEventListener("mouseenter", openMenu);
      menu.addEventListener("mouseenter", openMenu);

      item.addEventListener("mouseleave", () => {
        timeout = setTimeout(closeMenu, 50);
      });
    }
  });
}

function stickyFooter() {
  const footer = document.querySelector(".footer_wrap");
  const footerHeight = footer.scrollHeight;
  const viewportHeight = window.innerHeight;

  if (footerHeight > viewportHeight) {
    footer.style.position = "relative";
  } else {
    footer.style.position = "sticky";
  }
}

function copyright() {
  const copyrightDate = document.querySelector(
    '[data-element="copyright-date"]'
  );

  if (copyrightDate) {
    const currentYear = new Date().getFullYear();
    copyrightDate.textContent = currentYear;
  }
}

// LOAD ANIMATION

function createSplitText(target, type = "lines", options = {}) {
  const element = target.querySelector("h1, h2, h3, h4, h5, h6, p") || target;

  const split = new SplitText(element, {
    type,
    mask: "lines",
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    autoSplit: true,
    deepSplit: true,
    reduceWhiteSpace: false,
    preserveWhitespace: false,
    ...options,
  });

  return {
    split,
    lines: split.lines,
    words: split.words,
    chars: split.chars,
  };
}

function loader() {
  const hero = document.querySelector('[data-menu="hero"]');
  const eyebrow = hero.querySelector(".eyebrow_wrap");
  const heading = hero.querySelector(".g_heading");
  const ups = hero.querySelectorAll('[data-load="fade-up"]');
  const sections = document.querySelectorAll(
    '.u-section:not([data-menu="hero"])'
  );

  let tl = gsap.timeline({
    defaults: {
      duration: durationSlow,
      ease: "power4.out",
    },
  });

  if (eyebrow) {
    tl.to(
      eyebrow,
      {
        x: "0rem",
        opacity: 1,
      },
      0
    );
  }

  if (heading) {
    const { words } = createSplitText(heading, "lines, words");
    if (words?.length) {
      gsap.set(words, { yPercent: 110 });
      gsap.set(heading, { visibility: "visible" });

      tl.to(
        words,
        {
          yPercent: 0,
          stagger: 0.08,
        },
        0.15
      );
    }
  }

  if (ups.length) {
    tl.to(
      ups,
      {
        opacity: 1,
        y: "0rem",
        stagger: 0.1,
      },
      0.35
    );
  }

  tl.to(
    sections,
    {
      opacity: 1,
      stagger: 0.2,
    },
    0.1
  );
}

// SCROLL ANIMATIONS

function wordsScroll() {
  const headings = document.querySelectorAll(
    '[data-scroll="words"], .heading_wrap .g_heading, .content_wrap[data-scroll="content-split"] .g_heading, .carousel_main_heading .g_heading'
  );
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { words } = createSplitText(heading, "lines, words");
    if (!words?.length) return;

    gsap.set(words, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 1,
          ease: "power4.out",
        },
      })
      .to(words, {
        yPercent: 0,
        stagger: 0.08,
        delay: 0.2,
      });
  });
}

function linesScroll() {
  const headings = document.querySelectorAll(
    '[data-scroll="lines"], .heading_wrap .heading_description .u-text-style-main, .content_wrap[data-scroll="content-split"] .content_description .u-text-style-main'
  );
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { lines } = createSplitText(heading, "lines");
    if (!lines?.length) return;

    gsap.set(lines, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 1,
          ease: "power4.out",
        },
      })
      .to(lines, {
        yPercent: 0,
        stagger: 0.08,
        delay: 0.3,
      });
  });
}

function charsScroll() {
  const headings = document.querySelectorAll('[data-scroll="chars"]');
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { chars } = createSplitText(heading, "lines, chars");
    if (!chars?.length) return;

    gsap.set(chars, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 1,
          ease: "power4.out",
        },
      })
      .to(chars, {
        yPercent: 0,
        stagger: 0.05,
        delay: 0.2,
      });
  });
}

function highlightScroll() {
  const headings = document.querySelectorAll('[data-scroll="text-highlight"]');
  if (!headings.length) return;

  headings.forEach((heading) => {
    const inner = heading.querySelector(".g_heading");
    const h2s = inner.querySelectorAll("h2");

    if (!h2s.length) return;

    let allChars = [];

    h2s.forEach((h2) => {
      const { chars } = createSplitText(h2, "words, chars");
      if (chars?.length) {
        allChars = allChars.concat(chars);
      }
    });

    if (!allChars.length) return;

    gsap.set(allChars, { opacity: 0.3 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 95%",
          end: "top 30%",
          scrub: 1,
          onEnter: () =>
            gsap.to(inner, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }),
        },
        defaults: {
          duration: 0,
          ease: "none",
        },
      })
      .to(allChars, {
        opacity: 1,
        stagger: 1,
      });
  });
}

function ctaScroll() {
  const ctas = document.querySelectorAll('[data-scroll="cta-wrap"]');

  if (!ctas.length) {
    return;
  }

  ctas.forEach((cta) => {
    const items = cta.querySelectorAll('[data-scroll="cta-inner"]');

    gsap.set(items, { y: "4rem", opacity: 0 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: cta,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: durationSlow,
          ease: "power4.out",
        },
      })
      .to(
        items,
        {
          y: "0rem",
          opacity: 1,
          stagger: 0.2,
        },
        0.3
      );
  });
}

function fadeUpScroll() {
  const fades = document.querySelectorAll('[data-scroll="fade-up"]');

  if (!fades.length) return;

  fades.forEach((fade) => {
    const tl = gsap.timeline({
      defaults: {
        duration: durationSlow,
        ease: "power4.out",
      },
      scrollTrigger: {
        trigger: fade,
        start: "top bottom",
        toggleActions: "play none none reset",
      },
      paused: true,
    });

    tl.to(
      fade,
      {
        opacity: 1,
        y: "0rem",
      },
      0.3
    );
  });
}

function parallax() {
  const wraps = document.querySelectorAll('[data-scroll="parallax"]');
  if (!wraps.length) {
    return;
  }

  wraps.forEach((wrap) => {
    const parallax = wrap.querySelectorAll(".u-cover-absolute");
    if (!parallax.length) {
      return;
    }

    gsap.set(parallax, { y: "-10%" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: parallax,
          start: "top bottom",
          scrub: true,
        },
      })
      .to(parallax, {
        y: "10%,",
      });
  });
}

function scroller() {
  const wraps = document.querySelectorAll('[data-scroller="section"]');
  if (!wraps.length) {
    return;
  }

  wraps.forEach((wrap) => {
    const track = wrap.querySelector('[data-scroller="track"]');
    const list = wrap.querySelector(".scroller_main_list");

    if (!track || !list) {
      return;
    }

    const items = list.querySelectorAll(".scroller_main_item");
    if (!items.length) {
      return;
    }

    const minItemsForFullScroll = 5;
    let scrollDistance;

    if (items.length >= minItemsForFullScroll) {
      scrollDistance = "-100%";
    } else {
      const lastItem = items[items.length - 1];
      const lastItemRect = lastItem.getBoundingClientRect();
      const containerRect = track.getBoundingClientRect();
      scrollDistance = -(lastItemRect.right - containerRect.right);

      if (scrollDistance >= 0) {
        return;
      }
    }

    gsap
      .timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .to(track, {
        x: scrollDistance,
        ease: "none",
      });
  });
}

function textScroller() {
  const wraps = document.querySelectorAll('[data-text-scroller="section"]');
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const inner = wrap.querySelector(".g_heading");
    const h2s = inner.querySelectorAll("h2");

    if (!h2s.length) return;

    let allChars = [];

    h2s.forEach((h2) => {
      const { chars } = createSplitText(h2, "words, chars");
      if (chars?.length) {
        allChars = allChars.concat(chars);
      }
    });

    if (!allChars.length) return;

    gsap.set(allChars, { opacity: 0.3 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        defaults: {
          duration: 0,
          ease: "none",
        },
      })
      .to(allChars, {
        opacity: 1,
        stagger: 1,
      });
  });
}

function cardScroller() {
  const wraps = document.querySelectorAll('[data-card-scroller="section"]');
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const cards = wrap.querySelectorAll('[data-card-scroller="card"]');

    if (!cards.length) return;

    gsap.set(cards, { y: "8rem", opacity: 0 });

    cards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: "0rem",
        scrollTrigger: {
          trigger: card,
          start: `top bottom-=${index * 200}`, // Each card starts earlier based on index
          end: "top center", // Each card ends earlier too
          scrub: 1,
        },
      });
    });
  });
}

// MOBILE MENU

function mobileMenu() {
  const nav = document.querySelector('[data-menu="nav"]');
  const menu = nav.querySelector(".nav_content");
  const button = nav.querySelector(".nav_hamburger");
  const links = menu.querySelectorAll('[data-menu="item"]');

  const lineTop = button.children[0];
  const lineBottom = button.children[1];

  gsap.set(links, { y: "2rem", opacity: 0 });

  let isAnimating = false;
  let isMenuOpen = false;

  let menuOpen = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.7,
      ease: "power4.out",
    },
    onStart: () => {
      isAnimating = true;
      gsap.set(menu, { display: "flex" });
      nav.classList.add("is-open");
    },
    onComplete: () => {
      isAnimating = false;
    },
  });

  let menuClose = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.7,
      ease: "power4.out",
    },
    onStart: () => {
      isAnimating = true;
      nav.classList.remove("is-open"); 
    },
    onComplete: () => {
      gsap.set(menu, { display: "none" });
      isAnimating = false;
    },
  });

  menuOpen
    .to(
      lineTop,
      {
        y: 5.5,
        rotate: -45,
        duration: 0.4,
      },
      0
    )
    .to(
      lineBottom,
      {
        y: -5.5,
        rotate: 45,
        duration: 0.4,
      },
      0
    )
    .to(menu, { opacity: 1 }, 0)
    .to(links, { y: "0rem", opacity: 1, stagger: 0.06 }, 0.05);

  menuClose
    .to(links, { y: "0rem", opacity: 0 }, 0)
    .to(menu, { opacity: 0 }, 0)
    .to(
      lineTop,
      {
        y: 0,
        rotate: 0,
        duration: 0.4,
      },
      0
    )
    .to(
      lineBottom,
      {
        y: 0,
        rotate: 0,
        duration: 0.4,
      },
      0
    );

  button.addEventListener("click", () => {
    if (isAnimating) return;

    if (!isMenuOpen) {
      menuOpen.restart();
      isMenuOpen = true;
    } else {
      menuClose.restart();
      isMenuOpen = false;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen && !isAnimating) {
      menuClose.restart();
      isMenuOpen = false;
    }
  });
}

// HOVER ANIMATIONS

function buttonHover() {
  const links = document.querySelectorAll(
    ".btn_main_wrap:not(.w-variant-f5b20957-1214-b921-0c52-59266dcc3b18):not(.w-variant-c91e6358-f55c-6c46-04c1-3168b57ae790)"
  );
  if (!links.length) return;

  links.forEach((link) => {
    const text = link.querySelectorAll(".btn_main_text");
    const icon = link.querySelector(".btn_main_icon.is-default");
    const iconHover = link.querySelector(".btn_main_icon.is-hover");
    if (!text.length) return;

    link.addEventListener("mouseenter", () => {
      if (!link._tl) {
        link._tl = gsap
          .timeline({
            defaults: { duration: 0.6, ease: "power4.inOut" },
            paused: true,
          })
          .to(icon, { scale: 0, opacity: 0, overwrite: "auto" })
          .to(iconHover, { scale: 1, opacity: 1, overwrite: "auto" }, "<")
          .to(text, { x: "2rem" }, "<0.05");
      }
      link._tl.play();
    });

    link.addEventListener("mouseleave", () => {
      link._tl?.reverse();
    });
  });
}

function runWhenReady(fn) {
  window.Webflow = window.Webflow || [];
  Webflow.push(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    requestAnimationFrame(() => requestAnimationFrame(fn));
  });
}

runWhenReady(() => {
  lenisScroll();
  loader();
  navScroll();
  stickyFooter();
  copyright();
  wordsScroll();
  linesScroll();
  charsScroll();
  highlightScroll();
  ctaScroll();
  fadeUpScroll();
  textScroller();

  window.addEventListener("resize", stickyFooter);

  gsap.matchMedia().add("(min-width: 768px)", () => scroller());
  gsap.matchMedia().add("(min-width: 992px)", () => {
    navDropdown();
    parallax();
    buttonHover();
    cardScroller();
  });
  gsap.matchMedia().add("(max-width: 991px)", () => mobileMenu());

  ScrollTrigger.refresh();
});
