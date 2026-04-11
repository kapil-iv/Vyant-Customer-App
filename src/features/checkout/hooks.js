import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCheckoutQuote, fetchPaymentMethods, placeOrder } from "./api";

export function useCheckoutQuoteQuery(items, couponCode, enabled) {
  return useQuery({
    queryKey: ["checkout-quote", items, couponCode],
    queryFn: () => fetchCheckoutQuote(items, couponCode),
    enabled
  });
}

export function usePaymentMethodsQuery(cartValue, pincode, enabled) {
  return useQuery({
    queryKey: ["payment-methods", cartValue, pincode],
    queryFn: () => fetchPaymentMethods(cartValue, pincode),
    enabled
  });
}

export function usePlaceOrderMutation() {
  return useMutation({ mutationFn: placeOrder });
}
