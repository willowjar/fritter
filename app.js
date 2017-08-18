
var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require('body-parser');
var handleBar = require('handlebars');
var mongoose = require('mongoose');
var User = require('./models/userModel.js');
var Tweet = require('./models/tweetModel.js');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mymongodb');
//mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //we are connected
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
//set up a secret to encrypt cookies
app.use(session({ secret : '6170', resave : true, saveUninitialized : true })); 


/**
 * Renders index.html file from the public folder
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/",function(req,res){
	res.render('index');
});
/**
 * Gets the username of the logged in user
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/sessionUser",function(req,res){
  var username = req.session.name;
  res.send(username);
});
/**
 * Gets the username of the current user who is logged in 
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/username", function(req, res) {
  var username = req.session.name;
  res.send(username);
});

/**
 * Gets all tweets stored 
 * @param {Object} req - The request
 * @param {Object} res - The array of all tweets
 */
app.get("/tweets",function(req,res){
  var currentUserID = req.session.userid;
  Tweet.getAllTweets(currentUserID,function(error, result){
    res.send(result);
  });
});

/**
 * Gets all tweets that are from the folowees of the current logged in user
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/filteredTweets",function(req,res){
  var currentUserID = req.session.userid;
  Tweet.getAllTweets(currentUserID,function(error, tweets){
    if (error) {
      res.send("failure");
    }else{
      User.filterTweetsBasedOnFollowing(currentUserID,tweets,function(error,result){
        if (error){
          res.send("failure");
        }else{
          res.send(result);
        } 
      });
    }
  });
});
/**
 * Adds a new tweet
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.post("/tweet", function(req, res) {
  var tweetContent = req.body.tweet;
  var username = req.session.name;
  var thisUserID  = req.session.userid;
  Tweet.createTweet(tweetContent,thisUserID,function(err,tweet){
    if (err){
      res.send("failure");
    }else{
      res.send("success");
    }
  });
});
/**
 * Gets the current logged in user object
 */
app.get("/user",function(req, res) {
  var username = req.session.name;
  User.getUser(username,function (err, user) {
    if (err) {
      res.send("failure");
    }else{
      res.send(user);
    }
  });
});
/**
 * Gets all user objects
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/allusers",function(req, res) {
  User.getAllUsers(function (err, users) {
    if (err) {
      res.send("failure");
    }else{
      res.send(users);
    }    
  });
});
/**
 * Gets all folowees of the current logged in user
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.get("/followees", function(req, res) {
  var username = req.session.name;
  User.getFollowees(username,function(err,user){
    if (err) {
      res.send("failure");
    } else {
      var followees = user.followees;
      //console.log("followees",followees);   
      res.send(followees);
    }
  });
});

/**
 * Adds a new followee to the currently logged in user
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.post("/followees",function(req,res){
  var userID = req.body.currentUserID;
  var newFolloweeID = req.body.newFolloweeID;
  User.addFollowee(userID,newFolloweeID,function(err){
    if (err){
      res.send("failure");
    }else{
      res.send("success");
    }
  });
});

/**
 * Handling login checking : checks if user exists, and if username and passwords are entered correctly.
 * if so, log user in by chaning the session. Else, send "failure" back
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.post("/login", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.getUser(username,function(err,result){
    if (err) {
      res.send("error");
    }else{
      if (result== null) { // didn't find
        res.send("failure");
      }else{ //found
        var thisUser = result;
        var correctPass = thisUser.password;//should only return 1 obj
        if (password == correctPass){ 
          //password success
          req.session.name = username;
          req.session.userid = thisUser.id;
          res.send("success");
        }else{
          res.send("failure");
        }
      }
    }
  });
});
/**
 * Handling sign up checking : checks if user exists,if so send "failure" back. Else, create this
 * new user, and change the session to this new user
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
app.post("/signup",function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  User.getUser(username,function(err,result){
    if (err) {
      res.send("error");
    }else{
      if (result== null) { // didn't find
        User.addUser(username,password,function (err,user) {
          if (err) {
            res.send("error");
          }else{
            req.session.name = username;
            req.session.userid = user.id;
            res.send("success");
          } 
        });
      }else{ //found
        res.send("userNameExist")
      }
    }
  });
});

/**
 * Deletes a tweet of a specific id 
 * @param {Object} req - The tweet's unique id should be in req.body.uid
 * @param {Object} res - The response
 */
app.delete("/tweet",function(req,res){
  var tweetID = req.body.tweetID;
  Tweet.deleteTweet(tweetID,function(error, tweet){
    if (error){
      res.send("failure");
    }else{
      res.send("success");
    }
  });
});
/**
 * Retweets a tweet of a specific ID by adding a new tweet with author the current logged in user
 * and origional author as the author of the tweet being retweeted
 * @param {Object} req - The request
 * @param {Object} res - The response
 */

app.post("/retweet",function(req,res){
  var tweetID = req.body.tweetID;
  var currentUserID = req.session.userid;
  Tweet.reTweet(tweetID,currentUserID,  function (err, thisTweet) {
    if (err){
      res.send("failure");
    }else{
      res.send("success");
    }
  });
});

/**
* If none of the above match, user is requesting an invalid page, thus send a 404 error.
*/
app.use(function(req, res, next) {
  res.status(404).send('404 error:Sorry cant find this page!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port 3000");
});
