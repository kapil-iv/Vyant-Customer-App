import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      _id
      items {
        product {
          _id
          name
        }
        quantity
      }
    }
  }
`;

export const TOGGLE_WISHLIST = gql`
  mutation ToggleWishlist($productId: ID!) {
    toggleWishlist(productId: $productId) {
      _id
      userId
      ids
    }
  }
`;
