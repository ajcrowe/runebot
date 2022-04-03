import { gql } from '@apollo/client/core';

/**
 * LooksRare Event Fragment
 */
export const LR_FRAGMENTS = gql`
  fragment EventFragment on Event {
    id
    type
    hash
    createdAt
    to {
      ...UserEventFragment
    }
    from {
      ...UserEventFragment
    }
    token {
      tokenId
      image {
        src
        contentType
      }
      name
    }
    collection {
      address
      name
      description
      totalSupply
      logo {
        src
        contentType
      }
      floorOrder {
        price
      }
    }
    order {
      isOrderAsk
      price
      endTime
      currency
      strategy
      status
      params
    }
  }
  fragment UserEventFragment on User {
    address
    name
    isVerified
    avatar {
      image {
        src
        contentType
      }
    }
  }
`;

/**
 * LooksRare Get Event Query
 */
export const LR_GET_SALES = gql`
  query GetEventsQuery(
    $pagination: PaginationInput
    $filter: EventFilterInput
  ) {
    events(pagination: $pagination, filter: $filter) {
      ...EventFragment
    }
  }
  ${LR_FRAGMENTS}
`;
