/* ============================================================================
   InnerBrick -SITE CONFIG
   ----------------------------------------------------------------------------
   THIS IS THE ONE PLACE TO EDIT THE PHONE NUMBERS.
   Every WhatsApp link and "Call Now" link on the site is built from the values
   below when the page loads, so changing them here updates the whole site
   (header, product pages, quote forms, sticky CTA bar, contact page).

   Format:
     whatsappNumber : digits only, country code first, no "+", no spaces.
     phoneTel       : the number as it should be dialled, e.g. "+919876543210".
     phoneDisplay   : the number as a human should read it.
   ========================================================================== */

window.INNERBRICK_CONFIG = {
  /* TODO: replace the three placeholder values with the real studio number. */
  whatsappNumber: "919000000000", //  <-- REPLACE: e.g. "919876543210"
  phoneTel: "+919000000000", //       <-- REPLACE: e.g. "+919876543210"
  phoneDisplay: "+91 90000 00000", // <-- REPLACE: e.g. "+91 98765 43210"

  email: "innerbrick01@gmail.com",
  instagram: "https://www.instagram.com/innerbrick_/",
  defaultMessage: "Hi InnerBrick, I'd like a quote for a custom gift.",

  /* Prices shown in the catalogue / Product schema (INR). Kept here for
     reference so a price change is easy to trace. */
  prices: {
    "custom-3d-figure": 649,
    "deity-relief-panel": 1299,
    "ganesha-keepsake-box": 899,
    "institutional-memento": 749
  }
};
