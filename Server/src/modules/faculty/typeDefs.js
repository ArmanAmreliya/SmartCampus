import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum FacultyStatusEnum {
    AVAILABLE
    BUSY
    NOT_AVAILABLE
  }

  type TimeSlot {
    startTime: String!
    endTime: String!
    label: String
  }

  type DaySchedule {
    day: String!
    slots: [TimeSlot]
    isDayOff: Boolean
  }

  type WeeklySchedule {
    id: ID
    days: [DaySchedule]
  }

  type DateOverride {
    id: ID
    date: String!
    slots: [TimeSlot]
    isDayOff: Boolean
    note: String
  }

  type FacultyNote {
    id: ID!
    date: String!
    content: String!
    createdAt: String
  }

  type FacultyAvailability {
    status: FacultyStatusEnum
    nextAvailableAt: String
    lastUpdated: String
  }

  type Faculty {
    id: ID!
    name: String!
    email: String!
    department: String
    designation: String
    role: String
    image: String
    
    # Real-time Status (Nested)
    availability: FacultyAvailability

    # Real-time Status (Flat - for easier access)
    currentStatus: FacultyStatusEnum
    nextAvailableAt: String
    lastUpdated: String

    # Schedules
    weeklySchedule: WeeklySchedule
    dateOverrides: [DateOverride]
  }

  input TimeSlotInput {
    startTime: String!
    endTime: String!
    label: String
  }

  input DayScheduleInput {
    day: String!
    slots: [TimeSlotInput]
    isDayOff: Boolean
  }

  extend type Query {
    faculties: [Faculty]
    faculty(id: ID!): Faculty
    
    # Authenticated Faculty Queries
    myWeeklySchedule: WeeklySchedule
    myDateOverrides(startDate: String, endDate: String): [DateOverride]
    myNotes(date: String): [FacultyNote]
  }

  extend type Mutation {
    # Status
    updateFacultyStatus(status: FacultyStatusEnum!, nextAvailableAt: String): FacultyAvailability

    # Schedule
    updateWeeklySchedule(days: [DayScheduleInput]!): WeeklySchedule
    upsertDateOverride(date: String!, slots: [TimeSlotInput], isDayOff: Boolean, note: String): DateOverride
    deleteDateOverride(date: String!): Boolean

    # Notes
    saveFacultyNote(date: String!, content: String!): FacultyNote
    deleteFacultyNote(id: ID!): Boolean
  }

  extend type Subscription {
    facultyStatusUpdated: Faculty # Returns full faculty object with updated status
  }
`;
