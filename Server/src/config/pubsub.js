import { PubSub } from 'graphql-subscriptions';
import { PubSubAsyncIterator } from 'graphql-subscriptions/dist/pubsub-async-iterator.js';

export const pubsub = new PubSub();

// Patch asyncIterator if missing (seems to happen in some environments)
if (typeof pubsub.asyncIterator !== 'function') {
    console.warn("⚠️ PubSub.asyncIterator is missing. Patching manual implementation.");
    pubsub.asyncIterator = function (triggers) {
        return new PubSubAsyncIterator(this, triggers);
    };
}

console.log("✅ PubSub initialized. asyncIterator is:", typeof pubsub.asyncIterator);
