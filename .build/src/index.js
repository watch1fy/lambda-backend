var serverless = require("serverless-http");
var express = require("express");
var app = express();
app.get("/", function (req, res, next) {
    return res.status(200).json({
        message: "Hello from root!",
    });
});
app.get("/path", function (req, res, next) {
    return res.status(200).json({
        message: "Hello from path!",
    });
});
app.use(function (req, res, next) {
    return res.status(404).json({
        error: "Not Found",
    });
});
module.exports.handler = serverless(app);
//# sourceMappingURL=index.js.map