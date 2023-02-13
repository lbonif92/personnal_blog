//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;
const _ = require("lodash");

const app = express();

//connection à la base de donnée mongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');


// texte par défault des différentes pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// création d'un schéma
const postSchema = {
  title: String,
  textBody: String
}

// création d'un nouveau modèle
const Post = mongoose.model("Posts", postSchema);


// initie les packages: ejs, bodyparser, express static.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//GET route 'page d'accueil'
app.get("/", function(req, res){
  Post.find({}, function(err, postFound){
    if (err){
      console.log(err);
    } else {
      res.render("home", 
      { homeText: homeStartingContent, 
        postsContent: postFound
      });
    }
  });


})

// GET route postpage (readmore)
app.get("/posts/:postName", function(req, res){

  const parameters = _.lowerCase(req.params.postName);

  Post.find({}, function(err, postFound){
    if (err){
      console.log(err);
    } else {
      postFound.forEach(function(post){
        
        const storedTitle = _.lowerCase(post.title);

        if ( storedTitle === parameters) {
        res.render("post",{
        title: post.title,
        textBody: post.textBody
        });
        } 
      });
    }
  });
  
  
});

// GET route 'about'
app.get("/about", function(req, res){
  res.render("about", {aboutText: aboutContent});
})

// GET route 'contact'
app.get("/contact", function(req, res){
  res.render("contact", {contactText: contactContent});
})

// GET route' compose' ==> pour écrire du nouveau contenu
app.get("/compose", function(req, res){
  res.render("compose");
})

// POST route 'compose' ==> récupère le contenu écrit par l'utilisateur
app.post("/compose", function(req, res){

  const newPost = new Post ( {
    title: req.body.titleText,
    textBody: req.body.bodyText
  });

  newPost.save();
  res.redirect("/");
})

// Status du serveur
app.listen(port, function() {
  console.log("Server started on port " + port + ".");
});