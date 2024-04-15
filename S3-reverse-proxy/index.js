const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const PORT = 8000;

const BUCKET_PATH = process.env.BUCKET_PATH;

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subDomain = hostname.split(".")[0];

    const resolveTo = `${BUCKET_PATH}/${subDomain}`;

    return proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    const url = req.url;
    if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
