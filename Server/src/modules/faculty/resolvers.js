import User from '../../models/User.model.js';
import FacultyStatus from '../../models/FacultyStatus.model.js';
import WeeklySchedule from '../../models/WeeklySchedule.model.js';
import DateOverride from '../../models/DateOverride.model.js';
import FacultyNote from '../../models/FacultyNote.model.js';
import { pubsub } from '../../config/pubsub.js';

export const resolvers = {
    Query: {
        faculties: async () => {
            // Return all faculty users
            return await User.find({ role: 'FACULTY' });
        },
        faculty: async (_, { id }) => {
            return await User.findById(id);
        },
        myWeeklySchedule: async (_, __, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");
            return await WeeklySchedule.findOne({ facultyId: context.user.id });
        },
        myDateOverrides: async (_, { startDate, endDate }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");
            const query = { facultyId: context.user.id };
            if (startDate && endDate) {
                query.date = { $gte: startDate, $lte: endDate };
            }
            return await DateOverride.find(query);
        },
        myNotes: async (_, { date }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");
            const query = { facultyId: context.user.id };
            if (date) query.date = date;
            return await FacultyNote.find(query).sort({ createdAt: -1 });
        }
    },
    WeeklySchedule: {
        days: (parent) => parent.schedule || []
    },
    Faculty: {
        // Ensure id is always resolved properly (MongoDB uses _id)
        id: (parent) => parent._id || parent.id,
        // Ensure required fields have defaults to prevent cache warnings
        name: (parent) => parent.name || '',
        email: (parent) => parent.email || '',
        image: (parent) => parent.image || null,
        department: (parent) => parent.department || null,
        designation: (parent) => parent.designation || null,
        role: (parent) => parent.role || 'FACULTY',

        availability: async (parent) => {
            const facultyId = parent._id || parent.id;
            const status = await FacultyStatus.findOne({ facultyId });
            return status || { status: 'AVAILABLE', nextAvailableAt: null, lastUpdated: null };
        },
        currentStatus: async (parent) => {
            const facultyId = parent._id || parent.id;
            const status = await FacultyStatus.findOne({ facultyId });
            return status ? status.status : 'AVAILABLE';
        },
        nextAvailableAt: async (parent) => {
            const facultyId = parent._id || parent.id;
            const status = await FacultyStatus.findOne({ facultyId });
            return status ? status.nextAvailableAt : null;
        },
        lastUpdated: async (parent) => {
            const facultyId = parent._id || parent.id;
            const status = await FacultyStatus.findOne({ facultyId });
            return status ? status.lastUpdated : null;
        },
        weeklySchedule: async (parent) => {
            const facultyId = parent._id || parent.id;
            return await WeeklySchedule.findOne({ facultyId });
        },
        dateOverrides: async (parent) => {
            const facultyId = parent._id || parent.id;
            const today = new Date().toISOString().split('T')[0];
            return await DateOverride.find({ facultyId, date: { $gte: today } });
        }
    },
    Mutation: {
        updateFacultyStatus: async (_, { status, nextAvailableAt }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");

            const updatedStatus = await FacultyStatus.findOneAndUpdate(
                { facultyId: context.user.id },
                {
                    status,
                    nextAvailableAt,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );

            // Also update the User model status field for compatibility
            await User.findByIdAndUpdate(context.user.id, { status });

            // We need to publish the FULL faculty object to the subscription
            // because the client subscription expects 'Faculty' type
            const faculty = await User.findById(context.user.id);

            pubsub.publish('FACULTY_STATUS_UPDATED', {
                facultyStatusUpdated: faculty
            });

            return updatedStatus;
        },
        updateWeeklySchedule: async (_, { days }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");

            const updatedSchedule = await WeeklySchedule.findOneAndUpdate(
                { facultyId: context.user.id },
                { schedule: days }, // Map 'days' input to 'schedule' DB field
                { upsert: true, new: true }
            );
            return updatedSchedule;
        },
        upsertDateOverride: async (_, { date, slots, isDayOff, note }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");

            return await DateOverride.findOneAndUpdate(
                { facultyId: context.user.id, date },
                { slots, isDayOff, note },
                { upsert: true, new: true }
            );
        },
        deleteDateOverride: async (_, { date }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");
            await DateOverride.findOneAndDelete({ facultyId: context.user.id, date });
            return true;
        },
        saveFacultyNote: async (_, { date, content }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");

            return await FacultyNote.create({
                facultyId: context.user.id,
                date,
                content
            });
        },
        deleteFacultyNote: async (_, { id }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error("Unauthorized");
            await FacultyNote.findOneAndDelete({ _id: id, facultyId: context.user.id });
            return true;
        }
    },
    Subscription: {
        facultyStatusUpdated: {
            subscribe: () => pubsub.asyncIterator(['FACULTY_STATUS_UPDATED'])
        }
    }
};
