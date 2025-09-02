/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "sonner";
import { generateSocketInstance, handleErrorApi } from "@/lib/utils";
import { useEffect } from "react";
import { useAppStore } from "@/components/AppProvider";
import envConfig from "@/config";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import SearchParamsLoader, { useSearchParamsLoader } from "@/components/SearchParamsLoader";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
      " "
    ),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleOauthUrl = getOauthGoogleUrl();

export default function LoginForm() {
  const t = useTranslations("Login");
  const errorMessageT = useTranslations("ErrorMessage");
  const { searchParams, setSearchParams } = useSearchParamsLoader();
  const loginMutation = useLoginMutation();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const clearTokens = searchParams?.get("clearTokens");
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      toast.success(result.payload.message || "Đăng nhập thành công");
      setRole(result.payload.data.account.role);
      setSocket(generateSocketInstance(result.payload.data.accessToken));
      router.push("/manage/dashboard");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  useEffect(() => {
    if (clearTokens) {
      setRole();
    }
  }, [clearTokens, setRole]);

  return (
    <Card className='mx-auto max-w-sm'>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <CardHeader>
        <CardTitle className='text-2xl'>{t("title")}</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='w-full max-w-[600px] flex-shrink-0 space-y-2'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.warn("Form submission error:", err);
            })}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage>
                        {Boolean(errors.password?.message) && errorMessageT(errors.password?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage>
                        {Boolean(errors.password?.message) && errorMessageT(errors.password?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Link href={googleOauthUrl}>
                <Button variant='outline' className='w-full' type='button'>
                  Đăng nhập bằng Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
