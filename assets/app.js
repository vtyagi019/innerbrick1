/* InnerBrick -site interactions (static rebuild of the original React app) */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
   * Config: one place for the studio phone number (assets/config.js)
   * ------------------------------------------------------------- */
  var CONFIG = window.INNERBRICK_CONFIG || {};
  var WHATSAPP = String(CONFIG.whatsappNumber || "919000000000").replace(/[^0-9]/g, "");
  var PHONE_TEL = CONFIG.phoneTel || "+919000000000";
  var PHONE_DISPLAY = CONFIG.phoneDisplay || "+91 90000 00000";

  function whatsappHref(text) {
    return (
      "https://wa.me/" +
      WHATSAPP +
      "?text=" +
      encodeURIComponent(text || CONFIG.defaultMessage || "Hi InnerBrick, I'd like a quote.")
    );
  }

  /* Every WhatsApp / call link on the page, including the sticky bar */
  document.querySelectorAll("[data-wa-link]").forEach(function (a) {
    a.setAttribute("href", whatsappHref(a.getAttribute("data-wa-text")));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });

  document.querySelectorAll("[data-tel-link]").forEach(function (a) {
    a.setAttribute("href", "tel:" + PHONE_TEL);
  });

  document.querySelectorAll("[data-phone-display]").forEach(function (el) {
    el.textContent = PHONE_DISPLAY;
  });

  /* ---------------------------------------------------------------
   * Header: solid background once the page is scrolled past 24px
   * ------------------------------------------------------------- */
  var header = document.querySelector("header");

  function syncHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 24;
    header.classList.toggle("border-border", scrolled);
    header.classList.toggle("bg-background/92", scrolled);
    header.classList.toggle("backdrop-blur-sm", scrolled);
    header.classList.toggle("border-transparent", !scrolled);
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ---------------------------------------------------------------
   * Mobile menu
   * ------------------------------------------------------------- */
  var menuButton = header && header.querySelector('button[aria-label="Open menu"]');
  var menuNav = null;

  var MENU_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu h-5 w-5" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
  var CLOSE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-5 w-5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });
  }

  function setOpen(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuButton.innerHTML = open ? CLOSE_ICON : MENU_ICON;
    if (open) {
      menuNav = document.createElement("nav");
      menuNav.className = "border-t border-border bg-background px-5 pb-4 sm:hidden";
      menuNav.innerHTML = navLinks("block border-b border-border/60 py-3.5 text-sm");
      header.appendChild(menuNav);
      menuNav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    } else if (menuNav) {
      menuNav.remove();
      menuNav = null;
    }
  }

  function navLinks(className) {
    return NAV_ITEMS.map(function (item) {
      return '<a href="' + item[0] + '" class="' + className + '">' + item[1] + "</a>";
    }).join("");
  }

  var NAV_ITEMS = [
    ["/products", "Products"],
    ["/custom", "Custom"],
    ["/about", "About"],
    ["/contact", "Contact"]
  ];

  /* Mark the current route in the header + mobile nav (activeProps) */
  var here = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll("header a[href]").forEach(function (a) {
    var href = a.getAttribute("href").replace(/\/+$/, "") || "/";
    if (href === here) a.classList.add("text-foreground");
  });

  /* ---------------------------------------------------------------
   * .reveal -staggered entrance on scroll
   * ------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.slice.call(
            (el.parentElement && el.parentElement.querySelectorAll(":scope > .reveal")) || []
          );
          var index = Math.max(0, siblings.indexOf(el));
          window.setTimeout(function () {
            el.classList.add("is-in");
          }, Math.min(index * 90, 450));
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
    /* Safety net: anything already inside the viewport reveals anyway */
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }, 1200);
  }

  /* ---------------------------------------------------------------
   * Hero headline: lines rise out of their clipping wrapper
   * ------------------------------------------------------------- */
  var heroLines = document.querySelectorAll("[data-hero-line]");
  heroLines.forEach(function (line, i) {
    line.style.animationDelay = (i * 0.12).toFixed(2) + "s";
    line.classList.add("hero-in");
  });

  /* ---------------------------------------------------------------
   * Product catalogue filter (All / Wood / MDF / Resin / Custom)
   * ------------------------------------------------------------- */
  var MATERIALS = {
    "/products/ganesha-keepsake-box": "Wood",
    "/products/deity-relief-panel": "MDF",
    "/products/institutional-memento": "Wood",
    "/products/custom-3d-figure": "Resin"
  };

  var filterBar = document.getElementById("product-filter");
  var productGrid = document.getElementById("product-grid");

  if (filterBar && productGrid) {
    var cards = Array.prototype.slice.call(productGrid.children);
    var emptyState = document.createElement("div");
    emptyState.className = "mt-14 hidden rounded-lg border border-dashed border-border py-16 text-center";
    emptyState.innerHTML =
      '<p class="text-sm text-muted-foreground"></p>';
    productGrid.insertAdjacentElement("afterend", emptyState);

    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var value = button.textContent.trim();
      var visible = 0;

      filterBar.querySelectorAll("button").forEach(function (chip) {
        var active = chip === button;
        chip.setAttribute("aria-pressed", String(active));
        chip.className =
          "rounded-full border px-4 py-2 text-sm transition-colors " +
          (active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:bg-secondary");
      });

      cards.forEach(function (card) {
        var material = MATERIALS[card.getAttribute("href")];
        var show = value === "All" || material === value;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });

      emptyState.classList.toggle("hidden", visible > 0);
      if (!visible) {
        emptyState.querySelector("p").textContent =
          "Nothing in " + value + " yet -but we can still make it.";
      }
    });
  }

  /* ---------------------------------------------------------------
   * Product page: engraving note travels with the enquiry email
   * ------------------------------------------------------------- */
  var engraving = document.getElementById("engraving");
  if (engraving) {
    var counter = engraving.parentElement.querySelector("p");
    var mailLink = document.querySelector('main a[href^="mailto:"]');
    var subjectMatch = null;
    try {
      subjectMatch = mailLink && decodeURIComponent(mailLink.getAttribute("href")).match(/subject=([^&]*)/);
    } catch (error) {
      subjectMatch = null;
    }
    var productName = subjectMatch ? subjectMatch[1].replace(/^Enquiry about /, "") : "this piece";

    function buildEnquiry(note) {
      var body =
        "Hi InnerBrick,\n\nI'd like to know more about the " +
        productName +
        "." +
        (note ? "\n\nWhat I want on it: " + note : "") +
        "\n\nPlease share a sketch, price and timeline.";
      return (
        "mailto:innerbrick01@gmail.com?subject=" +
        encodeURIComponent("Enquiry about " + productName) +
        "&body=" +
        encodeURIComponent(body)
      );
    }

    engraving.addEventListener("input", function () {
      var value = engraving.value;
      counter.textContent = value.length + "/400 -it travels with your enquiry.";
      if (mailLink) mailLink.setAttribute("href", buildEnquiry(value.trim()));
    });
  }

  /* ---------------------------------------------------------------
   * Instant quote form -validate, then hand off to WhatsApp with a
   * pre-filled message (no backend, no account, no mail client)
   * ------------------------------------------------------------- */
  document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
    var status = form.querySelector("[data-quote-status]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var values = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name) values[el.name] = el.value;
      });

      var errors = validate(values);
      renderErrors(form, errors);
      if (Object.keys(errors).length) {
        if (status) status.textContent = "";
        var first = form.querySelector(".ib-error");
        if (first) first.previousElementSibling.focus();
        return;
      }

      var photo = form.querySelector('input[type="file"]');
      var lines = [
        "Hi InnerBrick, I'd like a quote.",
        "",
        "Name: " + values.name.trim(),
        "WhatsApp: " + values.phone.trim(),
        values.product ? "Product / idea: " + values.product : null,
        values.notes && values.notes.trim() ? "Notes: " + values.notes.trim() : null,
        photo && photo.files && photo.files.length
          ? "(I have a reference photo to send here.)"
          : null
      ].filter(Boolean);

      window.open(whatsappHref(lines.join("\n")), "_blank", "noopener");

      if (status) {
        status.textContent =
          "WhatsApp is opening with your details filled in -press send there and we'll reply with a price and a digital preview.";
      }
    });
  });

  function validate(values) {
    var errors = {};
    var name = (values.name || "").trim();
    var phone = (values.phone || "").trim();
    var notes = (values.notes || "").trim();

    if (name.length < 2 || name.length > 80) errors.name = "Please tell us your name";
    if (!/^[0-9+\s-]{8,16}$/.test(phone)) errors.phone = "Enter a valid WhatsApp number";
    if (notes.length > 800) errors.notes = "Please keep the notes under 800 characters";

    return errors;
  }

  function renderErrors(form, errors) {
    form.querySelectorAll(".ib-error").forEach(function (el) {
      el.remove();
    });
    Object.keys(errors).forEach(function (field) {
      var input = form.querySelector('[name="' + field + '"]');
      if (!input) return;
      var p = document.createElement("p");
      p.className = "ib-error";
      p.setAttribute("role", "alert");
      p.textContent = errors[field];
      input.insertAdjacentElement("afterend", p);
    });
  }
})();
