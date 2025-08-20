import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
  serverLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  Login: (body: LoginBodyType) =>
    http.post<LoginResType>("api/auth/login", body, {
      baseUrl: "",
    }),
  serverLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  Logout: () =>
    http.post("api/auth/logout", null, {
      baseUrl: "",
    }),
};

export default authApiRequest;
