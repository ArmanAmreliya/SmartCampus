
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type ChatResponse {
    text: String!
  }

  input PartInput {
    text: String!
  }

  input HistoryInput {
    role: String!
    parts: [PartInput]!
  }

  extend type Mutation {
    chat(message: String!, history: [HistoryInput]): ChatResponse
  }
`;
