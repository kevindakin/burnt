function accordion() {
  const accordionLists = document.querySelectorAll(".accordion_list_wrap");

  if (!accordionLists) {
    return;
  }

  accordionLists.forEach((list) => {
    const accordionItems = gsap.utils.toArray(".accordion_wrap");

    accordionItems.forEach((item) => {
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      gsap.set(content, { height: 0, display: "none" });
      item.classList.remove("is-open");
      gsap.set(icon, { rotate: 0 });
    });

    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector(".accordion_content");
    const firstIcon = firstItem.querySelector(".accordion_icon");

    gsap.set(firstContent, { height: "auto", display: "block" });
    firstItem.classList.add("is-open");
    gsap.set(firstIcon, { rotation: 135 });

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion_title");
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      header.addEventListener("click", () => {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector(".accordion_content");
            const otherIcon = otherItem.querySelector(".accordion_icon");

            if (otherItem.classList.contains("is-open")) {
              gsap.to(otherContent, {
                height: 0,
                duration: 0.6,
                ease: easeBase,
                onComplete: () => {
                  otherItem.classList.remove("is-open");
                  gsap.set(otherContent, { display: "none" });
                },
              });

              gsap.to(otherIcon, {
                rotate: 0,
                duration: 0.6,
                ease: easeBase,
              });
            }
          }
        });

        if (!item.classList.contains("is-open")) {
          gsap.set(content, { display: "block" });
          gsap.to(content, {
            height: "auto",
            duration: 0.6,
            ease: easeBase,
            onComplete: () => item.classList.add("is-open"),
          });

          gsap.to(icon, {
            rotate: 135,
            duration: 0.6,
            ease: easeBase,
          });
        } else {
          gsap.to(content, {
            height: 0,
            duration: 0.6,
            ease: easeBase,
            onComplete: () => {
              item.classList.remove("is-open");
              gsap.set(content, { display: "none" });
            },
          });

          gsap.to(icon, {
            rotate: 0,
            duration: 0.6,
            ease: easeBase,
          });
        }
      });
    });
  });
}

function forms() {
  const forms = document.querySelectorAll(".form_main_wrap");
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const formWrap = form.querySelector(".form_main_layout");
    const success = form.querySelector(".form_main_success");
    const formHeight = formWrap.offsetHeight;

    success.style.height = `${formHeight}px`;
  });

  forms.forEach((form) => {
    const hiddenField = form.querySelector("#page-identifier");

    if (hiddenField) {
      const pathname = window.location.pathname;

      const slug = pathname.split("/").filter(Boolean).pop();

      const formattedSlug = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      hiddenField.value = formattedSlug;
    }
  });
}

function transcript() {
  const accordionWrap = document.querySelector(".ozai_accordion_wrap");

  if (!accordionWrap) {
    return;
  }

  const header = accordionWrap.querySelector(".ozai_accordion_title");
  const content = accordionWrap.querySelector(".ozai_accordion_content");
  const icon = accordionWrap.querySelector(".ozai_accordion_icon_svg");
  const heading = accordionWrap.querySelector(".ozai_accordion_heading");
  const border = accordionWrap.querySelectorAll(".ozai_accordion_border");

  // Set initial closed state
  gsap.set(content, { height: 0, display: "none" });
  gsap.set(border, { opacity: 0 });
  accordionWrap.classList.remove("is-open");
  gsap.set(icon, { rotate: 0 });

  header.addEventListener("click", () => {
    if (!accordionWrap.classList.contains("is-open")) {
      // Open accordion

      gsap.set(content, { display: "block" });
      gsap.to(content, {
        height: "auto",
        duration: durationBase,
        ease: easeBase,
        onComplete: () => accordionWrap.classList.add("is-open"),
      });

      gsap.to(icon, {
        rotate: -180,
        duration: durationBase,
        ease: easeBase,
      });

      gsap.to(border, {
        opacity: 1,
        duration: durationBase,
        ease: easeBase,
      });

      heading.textContent = "Close transcript";
    } else {
      // Close accordion

      gsap.to(content, {
        height: 0,
        duration: durationBase,
        ease: easeBase,
        onComplete: () => {
          accordionWrap.classList.remove("is-open");
          gsap.set(content, { display: "none" });
        },
      });

      gsap.to(icon, {
        rotate: 0,
        duration: durationBase,
        ease: easeBase,
      });

      gsap.to(border, {
        opacity: 0,
        duration: durationBase,
        ease: easeBase,
      });

      heading.textContent = "View transcript";
    }
  });
}

function carousel() {
  const wrappers = document.querySelectorAll(".carousel_main_wrap");

  if (!wrappers.length) {
    return;
  }

  wrappers.forEach((wrap) => {
    const slider = wrap.querySelector(".carousel_main_slider.swiper");
    const prev = wrap.querySelector(".carousel_main_arrow.swiper-prev");
    const next = wrap.querySelector(".carousel_main_arrow.swiper-next");

    let swiper = new Swiper(slider, {
      slidesPerView: "auto",
      spaceBetween: 0,
      speed: 400,
      watchOverflow: true,
      grabCursor: true,
      navigation: {
        nextEl: next,
        prevEl: prev,
      },
    });
  });
}

function socialShare() {
  const linkShareButtons = document.querySelectorAll('[data-share="link"]');

  if (!linkShareButtons.length) {
    return;
  }

  const handleLinkCopy = async (button) => {
    const currentUrl = window.location.href;
    const copyIcon = button.querySelector('[data-share="copy"]');
    const copiedIcon = button.querySelector('[data-share="copied"]');
    const tooltip = button.querySelector('[data-share="tooltip"]');

    try {
      await navigator.clipboard.writeText(currentUrl);

      if (copyIcon && copiedIcon) {
        copiedIcon.style.display = "block";
        setTimeout(() => {
          copiedIcon.classList.add("is-open");
        }, 10);
      }

      if (tooltip) {
        tooltip.style.display = "block";
        setTimeout(() => {
          tooltip.classList.add("is-open");
        }, 10);
      }

      setTimeout(() => {
        if (copyIcon && copiedIcon) {
          copiedIcon.classList.remove("is-open");
          tooltip.classList.remove("is-open");

          setTimeout(() => {
            copiedIcon.style.display = "none";
            tooltip.style.display = "none";
          }, 300);
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  linkShareButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      handleLinkCopy(button);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  accordion();
  forms();
  transcript();
  carousel();
  socialShare();
});