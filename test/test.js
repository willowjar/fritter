var assert = require("assert");
var User = require('../models/userModel.js');
var Tweet = require('../models/tweetModel.js');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/testuse');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //we are connected
});

describe('tweetModel', function() {

  describe('createTweet', function () {

    it('create tweet with given content and user id in lowercase', function () {
      Tweet.createTweet("6170 = 005 on stereoids","willow555",function(err,tweet){

          assert.equal(tweet.content ,"6170 = 005 on stereoids");
          assert.equal(tweet.author ,"willow555");
          done();

      });
    });

    it('create tweet with given content and user id in mixedcase', function() {
      Tweet.createTweet("6170 = 005 on STereOids","WIlloW555",function(err,tweet){
          assert.equal(tweet.content ,"6170 = 005 on STereOids");
          assert.equal(tweet.author ,"WIlloW555");
          done();
      });
    });
  }); 


  describe('reTweet', function() {
  
    it('should create a new tweet that has an origonal author field', function() {
      Tweet.reTweet("tweetid0101","userID555",function(err,tweet){
          assert.notEqual(tweet.originalAuthor , null);
          assert.notEqual(tweet.originalAuthor , undefined);
          done();
      });
    });

    it('should have author as the current logged in user', function() {
      Tweet.reTweet("tweetid0101","userID555",function(err,tweet){
          assert.equal(tweet.author, "userID555");
          done();
      });
    });
  });

  describe('getAllTweets', function() {
    
    it('should add a field isCurrentAuthor which is false if passed in an authorid who is not registered', function() {
      Tweet.getAllTweets("fakeuser111",function(err,tweets){
          var trueFieldTweets = tweets.filter(function(t){
            return t.isCurrentAuthor == true;
          assert.equal(trueFieldTweets.length ,0);
          done();
        });
      });
    });

    it('should add a field author which is undefined if passed in an authorid who is not registered', function() {
      Tweet.getAllTweets("fakeuser111",function(err,tweets){

          var trueFieldTweets = tweets.filter(function(t){
            return t.author != undefined;
          });
          assert.equal(trueFieldTweets.length ,0);
          done();

      });
    });
  });

  describe('deleteTweet', function() {

    it('should delete tweet if given a id of an existing tweet', function() {
      Tweet.createTweet("6170 = 005 on stereoids","willow555",function(err,tweet){
          var tweetID = tweet.id;
          Tweet.deleteTweet(tweetID,function(err,status){
            assert.equal(err, null)
          });
          done();
      });

    });

    it('should not delete tweet if given a unique id does not match a tweet', function() {
        Tweet.deleteTweet("ssss",function(err,status){
          assert.notEqual(err, null);
          done();
        })
    });
  });  
}); 

describe('userModel', function() {
  describe('getUser', function() {
    it('should return user if user exists', function() {
      User.addUser("wjarvis","wjarvis",function(err,user){
        User.getUser("wjarvis",function(err,u){
            assert.equal(u.username, wjarvis);
            done();
        });
      })
    });
    it('should return null if user doesnt exist', function() {
        User.getUser("fake user",function(err,u){
          assert.notEqual(err,null);
          done();
        });
    });
  });
  describe('addUser', function() {
    it('should add user to databsed if user name is lowercased', function() {
      User.addUser("wjarvis","wjarvis",function(err,user){
        User.getUser("wjarvis",function(err,u){
            assert.equal(u.username, "wjarvis");
            done();
        });
      })      
    });
    it('should add user to databsed if user name is uppercased', function() {
      User.addUser("WJARVIS","wjarvis",function(err,user){
        User.getUser("WJARVIS",function(err,u){
            assert.equal(u.username, "WJARVIS");
            done();
        });
      })      
    });    
  });
  describe('getAllUsers', function() {
    it('should get all users', function() {
      User.getAllUsers(function(err,users){
        assert.isAtLeast(users.length,2);
      });
    }); 
  });
  describe('getFollowees', function() {
    it('should return a non emtpy list for a user who has followees', function() {
      User.addUser("will","sdfsd",function(err,user){
        if (err){

        }else{
          var userid = user.id;
          User.addFollowee(userid,"ff",function(err,result){
            if (err){

            }else{

            }   
          });
        } 
      });
      User.getFollowees("will",function(err,followees){
          assert.equal(followees.length,1);
          done();
      });
    });
    it('should return an emtpy list for a user who doesnt have followees', function() {
      User.getFollowees("WJARVIS",function(err,followees){
          assert.equal(followees.length,0);
          done();
      });
    });
  });
  describe('addFollowee', function() {
    it('should add the followee to the user specified', function() {
      User.addUser("cat","sdfsd",function(err,user){
        if (err){

        }else{
          var userid = user.id;
          User.addFollowee(userid,"ff",function(err,result){
            if (err){

            }else{

            }   
          });
        } 
      });
      User.getFollowees("cat",function(err,followees){

          assert.equal(followees.length,1);
          done();
      });
    });  
  });
  describe('filterTweetsBasedOnFollowing', function() {
    it('should return empty array if user is not following any users', function() {
      Tweet.getAllTweets("WJARVIS",function(err,tweets){
        User.filterTweetsBasedOnFollowing("WJARVIS",tweets,function(err,result){
          assert.equal(result.length,0);
          done();
        });
      });
    });
    it('should return empty array if users followers dont have tweets', function() {
      Tweet.getAllTweets("will",function(err,tweets){
        User.filterTweetsBasedOnFollowing("will",tweets,function(err,result){
          assert.equal(result.length,0);
          done();
        });
      });
    });    
  });

});



