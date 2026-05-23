import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ViblyMenu } from "./ViblyMenu";

export function TopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();

  const navItems = [
    { href: `/${locale}`, label: t("documents") },
    { href: `/${locale}/orgs`, label: t("organizations") },
    { href: `/${locale}/projects`, label: t("projects") },
    { href: `/${locale}/agents`, label: t("agents") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/95">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-6">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold text-[var(--text)] shrink-0">
            <BookOpen size={18} className="text-[var(--brand-accent)]" />
            <span>Vibly Library</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-sm rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <ViblyMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
