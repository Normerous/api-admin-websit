const util = require("util");
const Multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");

let processFileArray = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).array("file", 10)

let processFileMiddleware = util.promisify(processFile);
let processFileArrayMiddleware = util.promisify(processFileArray);
module.exports = {
    processFileMiddleware,
    processFileArrayMiddleware
};