var express = require('express');
var router = express.Router();
var fs = require('fs');
var cheerio = require('cheerio')


router.get('/', function(req, res, next) {

    var sections = ["aboutus", "test", "ggg"];
    var classes = ["wbt", "wbi", "www"];
    var contents = fs.readFileSync('./input.txt', 'utf8');
    var new_contents = contents;
    var extract = [];
    for (var i = 0; i < sections.length; i++) {

        $ = cheerio.load(new_contents);
        $('section.' + sections[i]).each(function(j, elem) {
            var sec_extract = $(elem).html();

            $ = cheerio.load(sec_extract);

            for (var l = 0; l < classes.length; l++) {
                $("." + classes[l]).each(function(k, el) {
                    var cls_extract = $(el).html();

                    var obj = {
                        "section": sections[i],
                        "class": classes[l]
                    };
                    extract.push(obj);
                });
            }
        });
        $ = cheerio.load(new_contents);
        $('section.' + sections[i]).replaceWith('');
        new_contents = $.html();
    }
    $ = cheerio.load(new_contents);
    for (var l = 0; l < classes.length; l++) {
        $("." + classes[l]).each(function(k, el) {
            var cls_extract = $(el).html();

            var obj = {
                "section": "",
                "class": classes[l]
            };
            extract.push(obj);
        });
    }

    res.send(extract);
});

module.exports = router;