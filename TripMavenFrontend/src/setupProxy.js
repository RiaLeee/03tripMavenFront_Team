const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/spring',
    createProxyMiddleware({
      target: 'http://localhost:9099',
      changeOrigin: true,
      pathRewrite: {
        '^/spring': '', 
      },
    })
  );

  app.use(
    '/python',
    createProxyMiddleware({
      target: 'http://localhost:8282',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};