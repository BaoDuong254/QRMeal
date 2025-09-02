import LoginForm from "@/app/[locale]/(public)/(auth)/login/LoginForm";
import { Suspense } from "react";

export default function Login() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
