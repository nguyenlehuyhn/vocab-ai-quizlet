import Link from "next/link";

const links = [
  { href: "/app", label: "Vocabulary" },
  { href: "/app/quick-add", label: "Quick Add" },
  { href: "/app/export", label: "Export" },
  { href: "/app/settings", label: "Settings" }
];

export function AppNav({ active }: { active: "vocabulary" | "quick-add" | "export" | "settings" }) {
  return (
    <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {links.map((link) => {
        const isActive =
          (active === "vocabulary" && link.href === "/app") ||
          (active === "quick-add" && link.href === "/app/quick-add") ||
          (active === "export" && link.href === "/app/export") ||
          (active === "settings" && link.href === "/app/settings");

        return (
          <Link
            key={link.href}
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold ${
              isActive ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
