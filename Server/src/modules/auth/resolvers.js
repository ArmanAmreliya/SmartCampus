import { loginUser, registerStudent, registerFaculty, getCurrentUser } from './service.js';

export const resolvers = {
    Query: {
        getCurrentUser: async (_, __, { user }) => {
            return await getCurrentUser(user?.id);
        }
    },
    Mutation: {
        login: async (_, { input }) => {
            return await loginUser(input.identifier, input.password);
        },
        registerStudent: async (_, { input }) => {
            return await registerStudent(input);
        },
        registerFaculty: async (_, { input }) => {
            return await registerFaculty(input);
        }
    }
};
