const Redis = require('ioredis');

const redis = new Redis({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    host: 'redis-18663.c330.asia-south1-1.gce.redns.redis-cloud.com',
    port: 18663,
    showFriendlyErrorStack: true,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

// Test connection
redis.on('connect', () => {
    console.log('Redis Cloud connected');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis;