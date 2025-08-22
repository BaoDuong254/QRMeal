import accountApiRequest from "@/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["accountMe"],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};
