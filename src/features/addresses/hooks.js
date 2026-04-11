import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddress, fetchAddresses, updateAddress } from "./api";

export function useAddressesQuery(enabled = true) {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    enabled
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    }
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, payload }) => updateAddress(addressId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    }
  });
}
