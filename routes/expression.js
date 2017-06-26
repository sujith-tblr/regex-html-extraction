var express = require('express');
var router = express.Router();
var fs = require('fs');
var cheerio = require('cheerio')

/* GET users listing. */
router.get('/', function(req, res, next) {
var file='./input.html';
var file2='./output.html';
var nav='<div class="ge_editor"></div>';
var contents = fs.readFileSync(file, 'utf8');
$ = cheerio.load(contents);
//  var sections=[];
// var h2 = $('section.aboutus').each(function(i,elem){
//  sections[i] = $(elem).html();
//  //console.log($(elem).find('div').text());
// });
$('div.gep').removeClass('gep').addClass('geh');
$('div.geh').children().wrap(nav);
sections = $.html();
//res.send(sections);
fs.writeFile(file2, sections, function(){
    res.send("ok");

});
});

module.exports = router;
