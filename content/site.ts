// Static site navigation (route structure — not admin-editable).
// Company info, contact details, and social links are managed from
// /admin/settings and stored in data/settings.json.
// Product categories are managed from /admin/categories and stored
// in data/categories.json.

export const nav = [
  { label: "Нүүр", href: "/" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Цуглуулга", href: "/collections" },
  { label: "Галерей", href: "/gallery" },
  // Scrolls to the contact block in the footer (present on every page).
  { label: "Холбоо барих", href: "#contact" },
] as const;
