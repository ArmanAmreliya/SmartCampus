
import { raiseNotificationRequest } from './service.js';

export const resolvers = {
    Mutation: {
        requestNotification: async (_, { facultyId }, context) => {
            if (!context.user || context.user.role !== 'student') throw new Error('Unauthorized');
            await raiseNotificationRequest(context.user.id, facultyId);
            return true;
        }
    }
};
