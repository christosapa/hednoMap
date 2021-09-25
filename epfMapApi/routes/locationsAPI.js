var express = require("express");
var router = express.Router();

router.get("/", function(req,res,next){
    res.send("Json with coords for google maps");
});

module.exports = router;