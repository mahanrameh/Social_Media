const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


const router = express.Router();
const swaggerOption = {
    customCss: '.swagger-ui .topbar { display: none };'
};

router
    .use('/', swaggerUI.serve);


router
    .get('/', swaggerUI.setup(swaggerDocument, swaggerOption));




// !!! "this swagger documents are for learning purposes so they are not fully completed "


module.exports = router;