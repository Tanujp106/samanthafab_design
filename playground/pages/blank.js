export const blank = {
  key: "blank",
  title: "Samantha Fab — Campaign Hero",
  eyebrow: "Playground / Campaign hero",
  description:
    "A full-bleed campaign hero with replaceable slides, centered messaging, and a direct route into the collection.",
  sections: [
    {
      id: "design-usp-strip",
      number: "00",
      name: "USP Strip",
      type: "usp-strip",
      hideReviewNotes: true,
      annotation: "One promise at a time — icon + label, cycling every three seconds.",
      items: [
        { icon: "truck", label: "COD across India" },
        { icon: "refresh", label: "Easy returns & exchange" },
        { icon: "chat", label: "WhatsApp assistance" },
      ],
    },
    {
      id: "design-utility-navigation",
      number: "00b",
      name: "Navigation",
      type: "header",
      hideReviewNotes: true,
      annotation:
        "Keep the navigation separate from the campaign canvas so the hero can stay completely image-led.",
      brand: "SAMANTHA FAB",
      nav: [
        { label: "Shop", href: "/?route=shop" },
        { label: "Collections", href: "/?route=collections" },
        { label: "Discover", href: "/?route=discover" },
        { label: "Services", href: "/?route=services" },
      ],
      actions: [
        { label: "Search", href: "/?route=search", ariaLabel: "Search" },
        { label: "Account", href: "/?route=account", ariaLabel: "Account", className: "nav-action--account" },
        { label: "Bag (0)", href: "/?route=bag", ariaLabel: "Bag, 0 items" },
      ],
    },
    {
      id: "design-campaign-hero",
      number: "01",
      name: "Campaign Hero",
      type: "campaign-hero",
      interval: 7000,
      annotation:
        "One dominant image, one centered message, and one clear action. Campaign imagery and copy can be replaced in this data object without changing the layout.",
      slides: [
        {
          eyebrow: "New collection / 2026",
          title: "The art of becoming.",
          copy: "Statement sarees for evenings that deserve to be remembered.",
          primaryAction: { label: "Shop Now", href: "/?route=new-edit" },
          media: {
            src: "/assets/design-hero-terracotta.png",
            alt: "Indian woman in a rose and wine saree standing in a terracotta interior",
            tone: "indigo",
            position: "center center",
            note: "Generated campaign image — replace with final Samantha Fab campaign photography.",
          },
        },
        {
          eyebrow: "The festive edit",
          title: "Made for your moment.",
          copy: "Drapes with colour, ease, and a little more occasion.",
          primaryAction: { label: "Shop Now", href: "/?route=festive" },
          media: {
            src: "/assets/design-hero-ivory-arch.png",
            alt: "Indian woman in an ivory and gold saree beneath a deep blue-green stone arch",
            tone: "ochre",
            position: "center center",
            note: "Generated campaign image — replace with final Samantha Fab campaign photography.",
          },
        },
        {
          eyebrow: "Everyday, reimagined",
          title: "Wear the feeling.",
          copy: "Soft movement and expressive prints for all your in-between hours.",
          primaryAction: { label: "Shop Now", href: "/?route=everyday" },
          media: {
            src: "/assets/design-hero-magenta-garden.png",
            alt: "Indian woman in a magenta and green saree seated in a shadowed botanical courtyard",
            tone: "moss",
            position: "center center",
            note: "Generated campaign image — replace with final Samantha Fab campaign photography.",
          },
        },
      ],
    },
  ],
};
