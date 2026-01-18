import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum UserRole {
    STUDENT
    FACULTY
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    department: String
    enrollmentNo: String
    facultyId: String
    designation: String
    semester: Int
    image: String
    status: String
  }

  extend type Query {
    getCurrentUser: User!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input LoginInput {
    identifier: String!
    password: String!
  }

  input StudentRegisterInput {
    name: String!
    email: String!
    enrollmentNo: String!
    department: String!
    semester: Int!
    password: String!
  }

  input FacultyRegisterInput {
    name: String!
    email: String!
    facultyId: String!
    department: String!
    designation: String!
    password: String!
  }

  extend type Mutation {
    login(input: LoginInput!): AuthResponse!
    registerStudent(input: StudentRegisterInput!): AuthResponse!
    registerFaculty(input: FacultyRegisterInput!): AuthResponse!
  }
`;
