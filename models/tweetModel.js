var mongoose = require("mongoose");

var TweetSchema = mongoose.Schema({
	author: {type:mongoose.Schema.Types.ObjectId,ref: 'User'},
	originalAuthor: {type:mongoose.Schema.Types.ObjectId,ref: 'User'},
	content: String
});

/**
* creates a new Tweet and add it to our Tweet collection in our database
* @param {String} tweetContent - the content of the tweet
* @param {String} createrID - ID of the user who created the tweet
* @param {Function} callback - the function to call when the query completes
*/
TweetSchema.statics.createTweet = function(tweetContent,createrID,callback){
	var newTweet = new this({content:tweetContent,author:createrID});
	newTweet.save(callback);
}
/**
* Creates a new tweet that is the retweet of the given tweet
* @param {String} tweetID - IDof the tweet being retweeted
* @param {String} currentUserID - ID of the user who is retweeting
* @param {Function} callback - the function to call when the query completes
*/
TweetSchema.statics.reTweet = function(tweetID,currentUserID,callback) {
	var that= this;
    that.findOne({"_id":tweetID}).exec(function(err,tweet){
	    if (err) {
	      callback({error: "failure"});
	    }else{
	      var tweetContent = tweet.content;
	      var authorID = currentUserID;
	      var originalAuthorID = tweet.author;
	      var thisTweet = new that({content:tweetContent,author:authorID,originalAuthor:originalAuthorID});
	      thisTweet.save(callback);
	    }
  	});
 }
/**
* Gets all tweets from the Tweet collection in our database, modify each to contain additional fields: 
* isCurrentAuthor (boolean, indicates whether this tweet was produced by the current logged in user) and author (author's username)
* @param {String} currentUserID - ID of the current User 
* @param {Function} callback - the function to call when the query completes
*/
TweetSchema.statics.getAllTweets = function (currentUserID,callback){
	var that = this;
	that.find().populate('author').populate('originalAuthor').exec(function(err,tweets){
		if (err) {
			callback({error: "failure"});
		}else{
			//console.log("alltweets",tweets);
			modifiedTweets =[];
			tweets.forEach(function(tweet){
				var author = tweet.author; 
				var originalAuthor = tweet.originalAuthor ; 
				var authorId = author.id;
				var isCurrentAuthor;
				if (authorId == currentUserID){
					isCurrentAuthor = true;
				}else{
					isCurrentAuthor = false;
				}
				var modifiedTweet = new Object();
				modifiedTweet.uid = tweet.id;
				modifiedTweet.author = author.username;
				modifiedTweet.authorID = authorId;
				if (originalAuthor != undefined){
					modifiedTweet.originalAuthor = originalAuthor.username;
					modifiedTweet.isRetweet = true;
				}else{
					modifiedTweet.isRetweet = false;
				}
				modifiedTweet.content = tweet.content;
				modifiedTweet.isCurrentAuthor = isCurrentAuthor;
				modifiedTweets.push(modifiedTweet);
			});
			//console.log("modifiedtweets",modifiedTweets);
			callback(null, modifiedTweets);
		}
	});
}
/**
* Delete a tweet from our collection
* @param {String} tweetID - ID of the tweet to delete
* @param {Function} callback - the function to call when the query completes
*/
TweetSchema.statics.deleteTweet = function (tweetID,callback){
	var that = this;
	that.findOne({"_id":tweetID}).remove().exec(function(err,tweet){
		if (err) {
			callback({error: "failure"});
		}else{
			callback(null, "success");
		}
	});
}

var TweetModel = mongoose.model("Tweet", TweetSchema);
module.exports = TweetModel;