//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikidb');

const articleSchema={
    title: String,
    content: String
};

const Article= mongoose.model("Article", articleSchema );

////////////////////////////////////Requests targetting all articles ////////////////////////////
app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundarticles){
    //   console.log(foundarticles);
        if(!err){
            res.send(foundarticles);
        }else{
            res.send(err);
        }
       
    });
})
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
})

.delete(function (req, res){
    Article.deleteMany()
      .then((result) => {
        res.send("All articles deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  });

////////////////////////////////////Requests targetting a specific articles ////////////////////////////
//in url space is represented as %20, for more refer ASCII Encoding Refrences
app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("no articles matching that title was found.");
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title : req.params.articleTitle},
        {title : req.body.title, content: req.body.content },

        function(err){
            if(!err){
                res.send("Succesfully updated article.");
            }else {
                res.send(err)
            }
        }
    )
})
.patch(function(req, res){Article.updateOne(        
     {title: req.params.articleTitle},         
     req.body,         
     function(err){
                     if (!err) {
                     res.send("Successfully updated article with updateOne.");             
                    } else {
                        res.send(err);             
                    } 
                            }); 
            })
.delete(function(req, res){Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
        if(!err){
            res.send("Successfully deleted the corresponding article.")
        }else{
            res.send(err);
        }
    }
);

});
 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});