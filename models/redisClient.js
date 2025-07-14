const redis = require('redis');

const redisClient = redis.createClient({
  url: "redis://localhost:6379" // change if using Redis Cloud
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect(); // Note: returns a promise, connects once at app start

module.exports = redisClient;
