const redis = require("../cache/redis");

module.exports = function rateLimit(limit = 20, windowSec = 60) {
  return async function (req, res, next) {
    try {
      console.log("Rate limiting middleware invoked" , req.body);
      const userId = req.body.to_user_id || "global";

      const key = `ratelimit:${userId}`;

      const current = await redis.incr(key);

      if (current === 1) {
        // Set expiry for first request
        await redis.expire(key, windowSec);
      }

      if (current > limit) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Rate limiter error" });
    }
  };
};
