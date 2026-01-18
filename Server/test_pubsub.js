
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
console.log("Proto Keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(pubsub)));
console.log("Proto Symbols:", Object.getOwnPropertySymbols(Object.getPrototypeOf(pubsub)));
console.log("Proto Methods:", Object.getPrototypeOf(pubsub));
