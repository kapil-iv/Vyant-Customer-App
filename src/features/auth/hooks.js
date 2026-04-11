import { useMutation } from "@tanstack/react-query";
import { loginCustomer, registerCustomer } from "./api";

export function useLoginMutation() {
  return useMutation({ mutationFn: loginCustomer });
}

export function useSignupMutation() {
  return useMutation({ mutationFn: registerCustomer });
}
