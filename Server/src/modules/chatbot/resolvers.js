
import { chatWithGemini } from './service.js';

export const resolvers = {
    Mutation: {
        chat: async (_, { message, history }, context) => {
            // Auth check
            if (!context.user) {
                throw new Error('Unauthorized - Please log in to use the AI assistant');
            }

            try {
                const text = await chatWithGemini(message, history);
                // Always return a valid response object
                return { text: text || "I couldn't generate a response. Please try again." };
            } catch (error) {
                console.error('Chat resolver error:', error.message);
                // Return error as response text instead of throwing
                // This prevents undefined.chat errors on frontend
                return { text: error.message || "An error occurred. Please try again." };
            }
        }
    }
};
