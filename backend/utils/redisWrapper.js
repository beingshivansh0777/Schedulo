class RedisWrapper {
    constructor(redis) {
        this.redis = redis;
        this.isConnected = false;
    }

    setConnection(status) {
        this.isConnected = status;
    }

    async get(key) {
        if (!this.isConnected) return null;
        try {
            return await this.redis.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    async set(key, value, ...args) {
        if (!this.isConnected) return false;
        try {
            return await this.redis.set(key, value, ...args);
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected) return false;
        try {
            return await this.redis.del(key);
        } catch (error) {
            console.error('Redis del error:', error);
            return false;
        }
    }
}

module.exports = RedisWrapper;
