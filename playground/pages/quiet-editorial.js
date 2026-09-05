export const quietEditorial = {
  key: "quiet-editorial",
  title: "Samantha Fab — Quiet Editorial Split",
  eyebrow: "Playground / Quiet editorial split",
  description:
    "Static hero, navigation, and utility-strip study for the Samantha Fab design direction.",
  sections: [
    {
      id: "quiet-editorial-navigation",
      number: "00",
      name: "Utility + Navigation",
      type: "header",
      annotation:
        "A quiet two-row frame: the rust trust strip scrolls away while the cream navigation stays present and easy to scan.",
      utility: ["COD across India", "Easy returns & exchange", "WhatsApp assistance"],
      brand: "SAMANTHA FAB",
      nav: [
        { label: "Shop", href: "#" },
        { label: "Collections", href: "#" },
        { label: "Discover", href: "#" },
        { label: "Services", href: "#" },
      ],
      actions: [
        { label: "Search", href: "#", ariaLabel: "Search" },
        { label: "Account", href: "#", ariaLabel: "Account", className: "nav-action--account" },
        { label: "Bag (0)", href: "#", ariaLabel: "Bag, 0 items" },
      ],
    },
    {
      id: "quiet-editorial-hero",
      number: "01",
      name: "Quiet Editorial Split",
      type: "hero",
      annotation:
        "One portrait-led visual world, an editorial headline, and one clear action. The layout keeps the image dominant without letting the copy touch it.",
      eyebrow: "New collection / Samantha Fab",
      title: "Sarees for the way you move.",
      copy: "Modern drapes, expressive prints, and effortless ways to wear them.",
      primaryAction: { label: "Shop the new edit", href: "#" },
      secondaryAction: { label: "Find your saree", href: "#" },
      media: {
        src: "./assets/hero-saree.jpg",
        alt: "Woman in a rose shimmer saree looking over her shoulder",
        tone: "indigo",
        position: "center top",
        note: "Concept stock photo — replace with Samantha Fab campaign photography.",
      },
    },
  ],
};
