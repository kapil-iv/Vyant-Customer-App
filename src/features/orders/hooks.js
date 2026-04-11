import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById, fetchOrderTimeline, fetchOrders, requestOrderReturn } from "./api";

export function useOrdersQuery(enabled = true) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled
  });
}

export function useOrderTimelineQuery(orderId, enabled = true) {
  return useQuery({
    queryKey: ["order-timeline", orderId],
    queryFn: () => fetchOrderTimeline(orderId),
    enabled: enabled && Boolean(orderId)
  });
}

export function useOrderDetailQuery(orderId, enabled = true) {
  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: enabled && Boolean(orderId)
  });
}

export function useRequestReturnMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }) => requestOrderReturn(orderId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
}
