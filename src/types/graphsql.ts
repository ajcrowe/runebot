import {gql } from '@apollo/client/core';

/**
 * LooksRare Event Fragment
 */
export const LR_FRAGMENTS = gql`
fragment EventFragment on Event {
  id
  from
  to
  hash
  createdAt
  token {
    tokenId
    image
    name
  }
  collection {
    address
    name
    description
    totalSupply
    logo
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
