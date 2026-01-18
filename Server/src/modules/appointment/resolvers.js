import Appointment from '../../models/Appointment.model.js';
import User from '../../models/User.model.js';
import { pubsub } from '../../config/pubsub.js';
import { withFilter } from 'graphql-subscriptions';

export const resolvers = {
    Appointment: {
        student: async (parent) => await User.findById(parent.studentId),
        faculty: async (parent) => await User.findById(parent.facultyId),
    },
    Query: {
        myAppointments: async (_, __, context) => {
            if (!context.user) throw new Error('Unauthorized');
            const filter = context.user.role === 'STUDENT'
                ? { studentId: context.user.id }
                : { facultyId: context.user.id };
            return await Appointment.find(filter).sort({ date: 1, startTime: 1 });
        },
        facultyAppointments: async (_, { date }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error('Unauthorized');
            const filter = { facultyId: context.user.id };
            if (date) filter.date = date;
            return await Appointment.find(filter).sort({ startTime: 1 });
        }
    },
    Mutation: {
        bookAppointment: async (_, { facultyId, date, startTime, endTime, subject }, context) => {
            if (!context.user || context.user.role !== 'STUDENT') throw new Error('Only students can book appointments');

            // Basic conflict check could go here, but omitted for now to keep it simple/flexible
            const newAppointment = await Appointment.create({
                studentId: context.user.id,
                facultyId,
                date,
                startTime,
                endTime,
                subject,
                status: 'Pending'
            });

            const populatedApt = await Appointment.findById(newAppointment._id); // Needed to populate via resolvers effectively? 
            // Actually resolvers handle it on query. But for subscription payload we usually want raw or let resolvers handle.
            // subscription payload is event map used by graphql execution. simple object is fine if resolvers attached to type work.

            pubsub.publish('APPOINTMENT_UPDATED', { appointmentUpdated: populatedApt });
            return populatedApt;
        },
        updateAppointmentStatus: async (_, { id, status }, context) => {
            if (!context.user || context.user.role !== 'FACULTY') throw new Error('Only faculty can update status');

            const updatedAppointment = await Appointment.findOneAndUpdate(
                { _id: id, facultyId: context.user.id },
                { status },
                { new: true }
            );

            if (!updatedAppointment) throw new Error("Appointment not found");

            pubsub.publish('APPOINTMENT_UPDATED', { appointmentUpdated: updatedAppointment });
            return updatedAppointment;
        }
    },
    Subscription: {
        appointmentUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['APPOINTMENT_UPDATED']),
                (payload, variables, context) => {
                    if (!context.user) return false;
                    const apt = payload.appointmentUpdated;

                    const studentId = apt.studentId.toString();
                    const facultyId = apt.facultyId.toString();

                    if (context.user.role === 'STUDENT') {
                        return studentId === context.user.id;
                    } else if (context.user.role === 'FACULTY') {
                        return facultyId === context.user.id;
                    }
                    return false;
                }
            )
        }
    }
};
