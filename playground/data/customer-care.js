// Summaries of Samantha's published FAQ, with no invented delivery or fit promises.
const faqSource = "https://www.samanthafab.com/pages/faq";

export const customerCarePages = {
  faq: {
    title: "Frequently asked questions",
    eyebrow: "Good to know",
    intro: "Quick answers about shopping, delivery and caring for your Samantha saree.",
    source: faqSource,
    sections: [
      { title: "How can I pay?", paragraphs: ["Available options at checkout may include cards, UPI, net banking, wallets and cash on delivery in eligible locations. The final options and total are shown before you place the order."] },
      { title: "Where is my order?", paragraphs: ["Samantha sends a tracking link by SMS or email when your order ships. If you need help, share your order number with customer support."] },
      { title: "Can I return a saree?", paragraphs: ["Return eligibility depends on the item and the current Returns & refunds policy. Check the dedicated policy before ordering; customized or stitched blouses are excluded from standard returns."] },
      { title: "How do I choose a blouse?", paragraphs: ["Measure your bust and under-bust and compare them with the details for the blouse you want. Contact Samantha if you are unsure about a size or customization."] },
    ],
  },
  cod: {
    title: "Cash on delivery",
    eyebrow: "Pay your way",
    intro: "Cash on delivery is available for eligible orders and serviceable pin codes.",
    source: faqSource,
    sections: [
      { title: "Check availability", paragraphs: ["Enter your delivery address at checkout to see whether cash on delivery is available for your order. The final amount, including any delivery charge, is shown before you place the order."] },
      { title: "Need help?", paragraphs: ["If cash on delivery is not offered for your pin code, choose another payment method shown at checkout or contact the Samantha team before ordering."] },
    ],
  },
  "track-order": {
    title: "Track your order",
    eyebrow: "After dispatch",
    intro: "Once your order ships, Samantha sends a tracking link by SMS or email.",
    source: faqSource,
    sections: [
      { title: "Find your tracking link", paragraphs: ["Check the phone number and email address you used at checkout. The tracking link is sent after dispatch, so it may not be available immediately after you place an order."] },
      { title: "If you need an update", paragraphs: ["Contact sales1.samanthafab@gmail.com with your order number if your tracking link has not arrived or the parcel appears delayed."] },
    ],
  },
  "size-guide": {
    title: "Size guide",
    eyebrow: "Find your fit",
    intro: "Check the measurements and blouse details on each product page before choosing an option.",
    source: faqSource,
    sections: [
      { title: "Blouse sizing", paragraphs: ["Measure your bust and under-bust, then compare those measurements with the chart or details for the blouse you want. Samantha lists sizes from XS to XXL for applicable styles, but availability varies by product."] },
      { title: "Ready-to-wear sarees", paragraphs: ["Some ready-to-wear styles use an adjustable belt-style hook waist. Check the individual product description for its fit and adjustment range rather than assuming every style fits the same way."] },
      { title: "Before you order", paragraphs: ["If you are unsure about a measurement or customization choice, contact Samantha for help. Customized or stitched blouses are excluded from standard returns under the current refund policy."] },
    ],
  },
  "care-guide": {
    title: "Fabric care",
    eyebrow: "Keep it beautiful",
    intro: "Always follow the care label on your own garment first. These are Samantha's general fabric tips.",
    source: faqSource,
    sections: [
      { title: "Silk & organza", paragraphs: ["Dry clean these delicate fabrics. Store silk in breathable muslin and keep organza protected from sharp folds."] },
      { title: "Cotton & linen", paragraphs: ["Use a gentle wash. Hand washing is a careful choice; check the garment label before using a machine. Dry in the shade and iron linen while slightly damp if its label permits."] },
      { title: "Georgette, chiffon & crepe", paragraphs: ["Use mild detergent and wash by hand where the care label allows. Avoid wringing delicate drapes; let them dry gently."] },
    ],
  },
};
