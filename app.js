const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const PORT = process.env.PORT || 5000;
const app = express();

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = new mongoose.model('Post', postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      console.log("Posts: " + posts);
      res.render('home', { homeStartingContent, posts, truncatePosts: true });
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  let postId = req.params.postId;
  Post.findOne({ _id: postId }, (err, foundPost) => {
    if (!err) {
      if (foundPost) {
        res.render('post', { posts: [foundPost], truncatePosts: false });
      } else {
        res.redirect('/');
      }
    }
  });
});

app.get("/about", (req, res) => {
  return res.render('about', { aboutContent });
});

app.get("/contact", (req, res) => {
  return res.render('contact', { contactContent });
});

app.get("/compose", (req, res) => {
  return res.render('compose');
});

app.post("/compose", (req, res) => {
  let postTitle = req.body.postTitle;
  let postBody = req.body.postBody;
  let newPost = new Post({ title: postTitle, body: postBody });
  newPost.save();
  return res.redirect("/");
});

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
