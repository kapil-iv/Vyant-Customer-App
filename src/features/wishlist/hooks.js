import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWishlist, fetchWishlist, removeWishlist } from "./api";

export function useWishlistQuery(enabled = true) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled
  });
}

export function useAddWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addWishlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });
}

export function useRemoveWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWishlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });
}
