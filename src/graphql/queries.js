import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($search: String, $category: String, $minPrice: Float, $maxPrice: Float, $sort: String, $page: Int, $limit: Int) {
    getProducts(search: $search, category: $category, minPrice: $minPrice, maxPrice: $maxPrice, sort: $sort, page: $page, limit: $limit) {
      items {
        _id
        name
        category
        price
        discountPrice
        images
        stock
        badge
        shop_status
        shop {
          _id
          shopName
          isOpen
        }
      }
      pagination {
        page
        totalPages
        totalItems
      }
    }
  }
`;
