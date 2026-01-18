import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Appointment {
    id: ID!
    student: User
    faculty: User
    date: String!
    startTime: String!
    endTime: String!
    subject: String
    status: String
    createdAt: String
  }

  extend type Query {
    myAppointments: [Appointment]
    facultyAppointments(date: String): [Appointment] # Faculty sees their own, optional filter by date
  }

  extend type Mutation {
    bookAppointment(facultyId: ID!, date: String!, startTime: String!, endTime: String!, subject: String!): Appointment
    updateAppointmentStatus(id: ID!, status: String!): Appointment
  }

  extend type Subscription {
    appointmentUpdated: Appointment
  }
`;
