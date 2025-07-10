const rateLimit = require('express-rate-limit');
exports.page_limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 30, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
exports.add_product_limiter = rateLimit({
    windowMs: 1 * 60 *1000,
    max: 30,
    message: 'wait for a minute'
})