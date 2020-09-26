const express=require("express");
const router=express.Router();
const https = require("https");


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
    const res = new Set(), chk = new Set();
    var Typo = require("typo-js");
    var dictionary = new Typo("en_US");
    // "en_US", false, false, { dictionaryPath: "typo/dictionaries" }
    if (wl==undefined) reject("WordList undefined")
    // For each word in wl, determine smaller-words using slice. Loop from 3 to word-length (3,4,5...word-length)
    wl.map((v)=>{
      res.add(v);
      if (dictionary.check(v)) { chk.add(v) }
      [...Array(v.length-2).keys()].slice(1).map((idx) => {
        res.add(v.slice(idx));
        if (dictionary.check(v.slice(idx))) { chk.add(v.slice(idx))}
      })
    })
    resolve({"wl":Array.from(res),"dl":Array.from(chk)})
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
