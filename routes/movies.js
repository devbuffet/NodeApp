var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');
var request = require('request');
var uniqueBy = require('unique-by');

var objMsg;

// get listings
router.get('/api/list/:type', function (req, res) {
  // start fresh
  objData = [];
  // get the html
  request('http://www.zmovie.tw/movies/' + req.params.type, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      // load the html    
      var $ = cheerio.load(html);
      // get 'a' tags
      $('a').each(function (i, element) {
        // find the appropriate 'a' tag
        if ($(this).attr('href') != undefined && $(this).attr('href').indexOf("http://www.zmovie.tw/movies/view") > -1) {
          if ($(this).text().replace(/\s/g, "")) {
            
            // get the key to pass into record page
            var key = $(this).attr('href').split('/');
           
            if($(this).text() != undefined && $(this).text().indexOf('...') == -1)
            {
              // add data to array
              objData.push({ key: key[key.length - 1], href: $(this).attr('href'), title: $(this).text(), image_url: "http://www.zmovie.tw/files/movies/" + $(this).attr('href').split('/')[5] + ".jpg", data: {rating:null} });            }
           }
        }
      });
    }
    // return unique listing
    res.json(uniqueBy(objData, 'key'));
  });
});

// get the record
router.get('/api/show/:movie/:rating', function (req, res) {
  // start fresh
  arr = [];
  request('http://www.zmovie.tw/movies/view/' + req.params.movie, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
             
      // get list of ids....  
      var pattern = /mgid_[0-9]+/gm;
      var id_match = $.html().match(pattern);

      for (var i = 0; i < id_match.length; i++) {
        var content = $('#' + id_match[i]).html();

        var rating_match = content.match(/([0-9]+% said good)/g);
        
        // we are interested in ratings >= req.params.movie
        if (rating_match.length > 0 && parseInt(rating_match[0]) >= req.params.rating) {
         
          // init array
          var arr_link = { href: '', title: '', rating: 0 };
         
          // get the links...
          $('#' + id_match[i]).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find('a').each(function (x, y) {

            var movie_link = $(y).attr('href');

            if (movie_link != undefined && movie_link.indexOf('zmovie') == -1 && movie_link.indexOf('javascript') == -1 && movie_link.indexOf('#') == -1) {
         
              // set the attributes
              arr_link.href = $(y).attr('href');
              arr_link.title = $("title").text();
              arr_link.rating = parseInt(rating_match[0]);
            }
          });
         
          // push data to array
          arr.push({ data: arr_link });
        }
      }
      
      // sort the array in descending order based on rating
      arr.sort(function (a, b) {
        return parseInt(a.data.rating) < parseInt(b.data.rating);
      });
      
    }
    res.json(arr);
  });
});

module.exports = router;
