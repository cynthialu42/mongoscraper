var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'), 
    exphbs = require('express-handlebars'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    logger = require('morgan'),
    request = require('request');

var db = require('./models');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Handlebars
app.set('views', './public/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(express.static('public'));

mongoose.connect("mongodb://localhost/mongoscraper");

// Routes

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/saved", function(req, res){
    res.render("saved");
});

app.get("/scrape", function(req, res){
    axios.get("https://www.boredpanda.com/")
        .then(function(response){
            var $ = cheerio.load(response.data);
            // console.log(response.data);
            $("article").each(function(i, element){
                var result = {};

                result.title = $(this).children("h2").children("a").text();
                result.link = $(this).children("h2").children("a").attr("href");
                result.info = $(this).children("div.intro").children("p.visible-downto-xs").text();
                result.img = $(this).children("header").children("div").children("a").children("img").attr("src");
                console.log(result.title);
                db.Article.find({}, function(err, dbArticle){
                    
                    if(dbArticle.length === 0){
                        db.Article.create(result);
                    }
                    else{
                        var flag = false;
                        // db.Article.findOne({title: result.title}, function(err, found))
                        for(var i = 0; i < dbArticle.length; i++){
                            if(dbArticle[i].title == result.title){
                                flag = false;
                                console.log('false');
                                break;
                            }
                            else{
                                console.log('new article');
                                flag = true;
                            }
                        }
                        if(flag){
                            console.log("Actually a new article");
                            db.Article.create(result);
                        }
                    }
                    
                });
                
            });
            res.redirect('/');
        });
});

app.get('/save/:id', function(req, res){
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }, function(){
        console.log("ok");
    });
});

app.get('/api/saved', function(req, res){
    db.Article.find({
        saved: true
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.get('api/saved/:id', function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .then(function(dbArticle){
        console.log('success');
        return;
    }).catch(function(err){
        res.json(err);
    });
})

app.get('/delete/:id', function(req, res){
    db.Article.remove({_id: req.params.id})
    .then(function(dbArticle){
        res.render('saved');
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){

        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {

      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

app.listen(PORT, function() {
    console.log("App running on port "+ PORT);
});
