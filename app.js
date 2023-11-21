const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const MONGODB_API = process.env.MONGODB_API

mongoose.connect(MONGODB_API);

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////// Requests Targeting All Articles ////////////////////////////////

app.route("/articles")
.get(function(req, res){
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    }).catch(function(err){
        console.log(err);
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(function(){
        res.send("Succesfully added new article!")
    }).catch(function(err){
        res.send(err);
    });
})
.delete(function(req, res){
    Article.deleteMany({}).then(function(){
        res.send("Articles were deleted successfully!");
    }).catch(function(err){
        res.send(err);
    });
});

//////////////////////////////// Requests Targeting Specific Articles ////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found!");
        }
    })
    .catch(function(err){
        console.log(err);
    })    
})

.put(function(req, res){
    Article.findOneAndReplace(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    ).then(function(){
        res.send("The article was successfully replaced!");
    }).catch(function(err){
        res.send(err);
    });
})

.patch(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    ).then(function(){
        res.send("The article was successfully updated!");
    }).catch(function(err){
        res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}
    ).then(function(){
        res.send("The article was successfully deleted!");
    }).catch(function(err){
        res.send(err);
    }); 
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});