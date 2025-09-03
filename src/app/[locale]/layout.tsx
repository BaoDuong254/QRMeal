import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import AppProvider from "@/components/AppProvider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/config";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("title"),
    description: "The best restaurant in the world.",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("bg-background min-h-screen font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider>
          <AppProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
