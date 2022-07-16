const router = require("express").Router();
const AuthRequest = require("../../controller/Payment/AuthenticationRequest");
const callBackCont = require("../../controller/Payment/CallBack");

router.post("/", AuthRequest.getToken);

router.get("/callback", callBackCont.callBack);

module.exports = router;
