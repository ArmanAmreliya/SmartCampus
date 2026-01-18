
import { gql } from 'graphql-tag';
import { typeDefs as authTypeDefs } from '../modules/auth/typeDefs.js';
import { resolvers as authResolvers } from '../modules/auth/resolvers.js';
import { typeDefs as facultyTypeDefs } from '../modules/faculty/typeDefs.js';
import { resolvers as facultyResolvers } from '../modules/faculty/resolvers.js';
import { typeDefs as appointmentTypeDefs } from '../modules/appointment/typeDefs.js';
import { resolvers as appointmentResolvers } from '../modules/appointment/resolvers.js';
import { typeDefs as broadcastTypeDefs } from '../modules/broadcast/typeDefs.js';
import { resolvers as broadcastResolvers } from '../modules/broadcast/resolvers.js';
import { typeDefs as chatbotTypeDefs } from '../modules/chatbot/typeDefs.js';
import { resolvers as chatbotResolvers } from '../modules/chatbot/resolvers.js';
import { typeDefs as notificationTypeDefs } from '../modules/notification/typeDefs.js';
import { resolvers as notificationResolvers } from '../modules/notification/resolvers.js';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  facultyTypeDefs,
  appointmentTypeDefs,
  broadcastTypeDefs,
  chatbotTypeDefs,
  notificationTypeDefs
];

export const resolvers = [
  authResolvers,
  facultyResolvers,
  appointmentResolvers,
  broadcastResolvers,
  chatbotResolvers,
  notificationResolvers
];
