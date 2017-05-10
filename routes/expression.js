var express = require('express');
var router = express.Router();
var fs = require('fs');
var cheerio = require('cheerio')

/* GET users listing. */
router.get('/', function(req, res, next) {
  
var cont="<section class='aboutus'>asd123</section>";
var contents = fs.readFileSync('./input.txt', 'utf8');
$ = cheerio.load(contents);
 var sections=[];
var h2 = $('section.aboutus').each(function(i,elem){
 sections[i] = $(elem).html();
 //console.log($(elem).find('div').text());
});

res.send(sections);
});

module.exports = router;
