var express = require('express');
var router = express.Router();
const Axios = require('axios');


var Covid = require('../models/Covid');

var currentState = "";


/* GET home page. */
router.get('/', (req, res) => {
  res.locals.isLoaded = false;
  res.render("index");
});

router.post('/fetchData', async (req, res) => {
  let {state} = req.body;
  currentState = state;
  let response = await Axios.get('https://data.cdc.gov/resource/9mfq-cb36.json?state='+state);
  let cdata = response.data;
  //console.log(JSON.stringify(cdata))

  //.then((response) => response.json())
  //.then((cdata) => {
    //console.log(Covid.find({}));
    await Covid.deleteMany({});
    let i = 0;
    for (let i = 0; i < cdata.length; i++) {
      let {submission_date,tot_cases,new_case,tot_death,new_death} = cdata[i];
      let date = new Date(submission_date.slice(0,10));
      let covid = new Covid({submission_date:date, tot_case:tot_cases, new_case:new_case, tot_death:tot_death, new_death:new_death});
      await covid.save((error, document) => {
        if(error){
            console.log("Error saving a new ship",error);
            res.sendStatus(500);
        }
      });

    }
    console.log("I'm finished");
    res.locals.isLoaded = true;
    res.render("index");
  //}).finally(()=>{console.log("I'm finished")})
});

router.post('/filter/byDate',
  async (req,res,next) => {
    let {date1, date2} = req.body;
    let cdata = await Covid.find({
      submission_date:{
        $gte:date1,
        $lte:date2
      }
    }).sort({submission_date:1});
    res.locals.cdata = cdata;
    res.locals.date1 = date1;
    res.locals.date2 = date2;

    res.locals.currentState = currentState;
    //res.locals.times2str = times2str
    //res.json(courses)
    res.render('byDate')
  }
)

router.post('/filter/byCase',
  async (req,res,next) => {
    let {numCase} = req.body;
    let cdata = await Covid.find({new_case:{$gte:numCase}}).sort({new_case:-1});
    
    res.locals.cdata = cdata;
    res.locals.numCase = numCase;
    res.locals.currentState = currentState;
    //res.locals.times2str = times2str
    //res.json(courses)
    res.render('byCase')
  }
)

router.post('/filter/byDeath',
  async (req,res,next) => {
    let {numDeath} = req.body;
    let cdata = await Covid.find({new_death:{$gte:numDeath}}).sort({new_death:-1});
    
    res.locals.cdata = cdata;
    res.locals.numDeath = numDeath;
    res.locals.currentState = currentState;

    //res.locals.times2str = times2str
    //res.json(courses)
    res.render('byDeath')
  }
)

module.exports = router;
