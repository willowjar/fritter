var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
  	username: String,
  	password: String,
  	followees: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
});
/**
* Gets the user with the given username
* @param {String} username
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.getUser = function (username,callback){
	this.findOne({username:username},callback);
}
/**
* Adds a new user to our User collection in our database
* @param {String} username of the new user
* @param {String} upassword of the new user
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.addUser = function (username,password,callback){
	var newUser = new this({username:username,password:password,followees:[]});
    newUser.save(callback);
}
/**
* Gets all users in our User collection in our database
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.getAllUsers = function (callback){
	this.find(callback); 
}
/**
* Gets all followees of a user 
* @param {String} username of the user
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.getFollowees = function(username,callback){
	this.findOne({username: username}).populate('followees').exec(callback);
}
/**
* Adds userA as a the followee of userB
* @param {String} userID - IDof the userB
* @param {String} newFolloweeID - ID of userA
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.addFollowee = function(userID,newFolloweeID,callback){
	this.update({"_id":userID},{"$push":{"followees": newFolloweeID}},callback);
}
/**
* Filter the input tweets to contain only tweets from users other than the current user 
* and are followees of the current user. 
* @param {String} currentUserID - ID of current user
* @param {Array} tweets - array of tweets to filter, each tweet must have the following fields: 
* uid,author,authorId,content
* @param {Function} callback - the function to call when the query completes
*/
UserSchema.statics.filterTweetsBasedOnFollowing = function (currentUserID,tweets,callback){
	var that = this;
	that.find({"_id":currentUserID}).populate('followees').exec(function(err,users){
		if (err) {
			callback({error: "failure"});
		}else{
			var user = users[0];
			var followees = user.followees;
			modifiedTweets =[];
			tweets.forEach(function(tweet){
				var authorId = tweet.authorID;
				var originalAuthor = tweet.originalAuthor;
				var isCurrentAuthor;
				if (authorId == currentUserID){
					isCurrentAuthor = true;
				}else{
					isCurrentAuthor = false;
				}
				var modifiedTweet = new Object();
				modifiedTweet.uid = tweet.uid;
				modifiedTweet.author = tweet.author;
				modifiedTweet.authorID = authorId;
				if (originalAuthor != undefined){
					modifiedTweet.originalAuthor = originalAuthor;
					modifiedTweet.isRetweet = true;
				}else{
					modifiedTweet.isRetweet = false;
				}
				modifiedTweet.content = tweet.content;
				modifiedTweet.isCurrentAuthor = isCurrentAuthor;
				var followeeWithSameAuthorId = followees.filter(function(followee){
					return followee.id == authorId;
				});
				if (followeeWithSameAuthorId.length >0) {
					if (! isCurrentAuthor){
						modifiedTweets.push(modifiedTweet);
					}
				}
			});
			callback(null, modifiedTweets);
		}
	});
}

var UserModel = mongoose.model("User", UserSchema); //string used for ref 

module.exports = UserModel;