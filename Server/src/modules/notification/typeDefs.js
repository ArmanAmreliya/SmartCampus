
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  extend type Mutation {
    requestNotification(facultyId: ID!): Boolean
  }
`;
