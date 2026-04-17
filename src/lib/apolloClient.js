import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("vyant_auth_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    if (networkError.statusCode === 401 || networkError.message.includes("401") || networkError.message.includes("Unauthorized")) {
      sessionStorage.removeItem("vyant_auth_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            // Future configuration for paginated fields if required.
          }
        }
      }
    }
  }),
});
