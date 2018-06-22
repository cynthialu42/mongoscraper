var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'), 
    exphbs = require('express-handlebars'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    logger = require('morgan'),
    request = require('request');

var db = require('./models');

var PORT = 3000;

var app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.engine("handlebars", exphbs({ defaultLayout: 'main'}));
// app.set("view engine", "handlebars");
// For Handlebars
app.set('views', './public/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

// var routes = require("./controllers/scraperController.js");

// app.use(routes);

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
                // .then(function(findOld){
                //     for (let i = 0; i < findOld.length; i++){
                //         console.log("FOR LOOOOOOOOOOOOOOOOOOOOOOOOOOOOP");
                //         console.log(findOld[i].title);
                //         if(findOld[i].title === result.title){
                //             console.log('repeat');
                //         }
                //         else{
                //             console.log('here');
                //             db.Article.create(result)
                //             .then(function(dbArticle){
                //                 console.log(dbArticle);
                //             })
                //             .catch(function(err){
                //                 return res.json(err);
                //             });
                //         }
                //     }
                // }).catch(function(err){
                //     res.json(err);
                // });
                // db.Article.create(result)
                // .then(function(dbArticle){
                //     console.log(dbArticle);
                // })
                // .catch(function(err){
                //     return res.json(err);
                // });
            });
            res.redirect('/');
        });
});

app.get('/save/:id', function(req, res){
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }, function(){
        console.log("ok");
    });
    // .then(function(dbArticle){
    //     console.log('success');
    //     return;
    // }).catch(function(err){
    //     res.json(err);
    // });
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
        // console.log(dbArticle);
        // for(let i =0; i < dbArticle.length; i++){
        //     console.log(dbArticle[i].title);
        // }
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
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
