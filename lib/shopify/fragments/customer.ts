const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    firstName
    lastName
    displayName
    email
    phone
    acceptsMarketing
    createdAt
    updatedAt
    defaultAddress {
      id
      firstName
      lastName
      company
      address1
      address2
      city
      province
      country
      zip
      phone
    }
  }
`;

export default customerFragment;
