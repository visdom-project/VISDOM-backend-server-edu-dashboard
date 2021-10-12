const express = require("express");
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

const http = require("http").createServer(app);

app.use(express.static('public'));
app.use('/api', createProxyMiddleware({ 
    target: 'https://visdom.tlt-cityiot.rd.tuni.fi',
    pathRewrite: {
        '^/api':'' //remove /api
    },

    changeOrigin: true }));

http.listen(8000, () => {
    console.log(`Server running on port 8000`); //eslint-disable-line
});
  