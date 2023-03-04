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
const contactContent = "Donec sed mi vel mauris tincidunt bibendum nec auctor mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec ut placerat mi. Nulla facilisi. ";
const pepinieresContent = "Etiam vel turpis eu tortor mollis porttitor tincidunt imperdiet odio. Phasellus tempus sapien vel erat blandit pretium. Vestibulum vulputate metus nibh, eget porttitor leo egestas in. Curabitur laoreet sollicitudin lobortis. Nulla nisi metus, tincidunt quis imperdiet ac, porttitor a ex. Nulla elit nunc, porta in massa id, ullamcorper feugiat urna. Etiam vestibulum pellentesque tortor, id congue elit semper a. Integer nulla nisl, sodales a porttitor ut, commodo sed ipsum. Sed a dapibus tortor. In quis sem nec erat pellentesque maximus eu non urna. Pellentesque eget congue tortor. Nam quis enim vel purus bibendum euismod a vestibulum eros.";
const arbresContent = "Description ..."

// création d'un schéma pour les 'posts' de l'accueil
const postSchema = {
  title: String,
  textBody: String
}

// création d'un nouveau modèle pour les 'posts' de l'accueil
const Post = mongoose.model("Posts", postSchema);

// création d'un schéma pour le formulaire contact
const contactMessageSchema = {
  contactPrenom: String,
  contactNom: String,
  contactEmail: String,
  contactObjetMessage: String,
  contactMessage: String
}

// création d'un nouveau modèle pour le formulaire contact
const ContactMessage = mongoose.model("Contacts", contactMessageSchema);

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

// GET route arbres 
app.get("/arbres/:arbreName", function(req, res){

  const parameters = _.capitalize(req.params.arbreName);
  res.render("arbres",{arbreName: parameters});
});

// GET route 'about'
app.get("/about", function(req, res){
  res.render("about", {aboutText: aboutContent});
})

// GET route 'contact'
app.get("/contact", function(req, res){
  res.render("contact", {contactText: contactContent});
})

// GET route 'Pepinieres'
app.get("/pepinieres", function(req, res){
  res.render("pepinieres", {introPep: pepinieresContent});
})

// GET route 'Arbres'
app.get("/arbres", function(req, res){
  res.render("arbres", {ArbresText: arbresContent});
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

//POST route 'contact' ==> Récupère le message dans la page contact
app.post("/contact", function(req,res){

  const newMessage = new ContactMessage ({
    contactPrenom: req.body.prenomInput,
    contactNom: req.body.nomInput,
    contactEmail: req.body.emailInput,
    contactObjetMessage: req.body.objetDuMessage,
    contactMessage: req.body.messageInput
  });
  
  newMessage.save();
  res.redirect("/contact")
})

// Status du serveur
app.listen(port, function() {
  console.log("Server started on port " + port + ".");
});
