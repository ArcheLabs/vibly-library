import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { TopNav } from "@/components/layout/TopNav";
import type { ReactNode } from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </NextIntlClientProvider>
  );
}
