import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client/react";
import { store } from "./store";
import { ToastProvider } from "../shared/components/ToastProvider";
import { apolloClient } from "../lib/apolloClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export function AppProviders({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Provider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
