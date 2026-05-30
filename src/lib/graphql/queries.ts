export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($first: Int, $after: String, $category: String) {
    products(
      first: $first
      after: $after
      where: { status: PUBLISH, category: $category }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        stockStatus
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_PRODUCT = /* GraphQL */ `
  query GetProduct($slug: String!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      stockStatus
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockQuantity
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockQuantity
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = /* GraphQL */ `
  query GetProductCategories {
    productCategories(first: 20, where: { hideEmpty: true }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;
