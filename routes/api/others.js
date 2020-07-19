const express=require("express");
const router=express.Router();
const https = require("https");

/**
 * @route  GET sitekey
 * desc    Send the client-side site key for google-recaptcha
 * access  RESTRICTED
 */

 router.get('/getenv', (req, res) => {
   res.status(200).json({"success":true,"sitekey":process.env.RECAPTCHA_SITE_KEY})
 });


/**
 * @route  Google ReCaptcha
 * desc    Validate client-side token for google recaptcha v3
 * access  RESTRICTED
 */

router.post('/grecap', (req, res1) => {
  let gurl="https://www.google.com/recaptcha/api/siteverify?secret="+process.env.RECAPTCHA_SECRET_KEY+"&response="+req.body.captchaToken;
  const outdata = {body:"", code:200};
  https.get(gurl, res => {
    res.setEncoding("utf8");
      res.on("data", data => {
        outdata.body += data;
      });
      res.on("end", () => {
        outdata.body = JSON.parse(outdata.body);
        console.log("api/others.js: google recaptcha result: "+outdata.body);
        if (outdata.body.success) res1.status(200).json(outdata.body);
        else res1.status(401).json({success: false, message: outdata.body["error-codes"]});
      })
  });
});

module.exports = router;
