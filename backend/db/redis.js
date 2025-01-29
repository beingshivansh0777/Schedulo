const Redis = require('ioredis');
const RedisWrapper = require('../utils/redisWrapper');

let redisWrapper;

try {
    if (process.env.REDIS_PASSWORD) {
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

        redis.on('connect', () => {
            console.log('Redis Cloud connected');
            redisWrapper.setConnection(true);
        });

        redis.on('error', (err) => {
            console.error('Redis connection error:', err);
            redisWrapper.setConnection(false);
        });

        redisWrapper = new RedisWrapper(redis);
    } else {
        console.log('Redis credentials not found, running without Redis');
        redisWrapper = new RedisWrapper(null);
    }
} catch (error) {
    console.error('Redis initialization error:', error);
    redisWrapper = new RedisWrapper(null);
}

module.exports = redisWrapper;