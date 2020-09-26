const express=require("express");
const router=express.Router();
const https = require("https");
const spell = require('spell-checker-js')

/**
 * @route  GET inputword
 * desc    Send words list for given input
 * access  RESTRICTED
 */

 router.post('/wordsget', (req, res) => {
   const wl=recGen(req.body.inputword.split(""))
   dictCheck(wl).then(obj=>
     res.status(200).json({"success":true,"wordsList":obj.wl,"dictList":obj.dl})
   ).catch((err) => {
     res.status(404).json({"success":false,"error":err})
   })

 });

function dictCheck(wl) {
  return new Promise((resolve, reject) => {
    const res = new Set();
    spell.load('en')
    if (wl==undefined) reject("WordList undefined")
    wl.map((v)=>{ if (!res.has(v)) res.add(v); })
    spell.check(wl.join(" ")).map((v) => {res.delete(v);})
    resolve({"wl":wl,"dl":Array.from(res)})
  })
}

function recGen(w) {
  if (w.length===2) {
    return [w[0]+w[1],w[1]+w[0]];
  } else {
    let res=[];
    for (let i=0; i<w.length; i++) {
      let ar=[];
      w.map((v)=>ar.push(v));
      const f=ar.splice(i,1);
      let recres=recGen(ar);
      recres.map((v)=>res.push(f+v));
    }
    return res;
  }
}

module.exports = router;
