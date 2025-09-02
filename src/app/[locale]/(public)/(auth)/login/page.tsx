import LoginForm from "@/app/[locale]/(public)/(auth)/login/LoginForm";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Login({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <LoginForm />
    </div>
  );
}
