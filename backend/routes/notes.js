const express  = require("express")
const router = express.Router();

router.get("/", (req, res)=>{
    obj = {
        a: "HelNoteslo ",
        number : 95350620
    }
    res.json(obj)
})
module.exports = router