/**
 * A module for tweets
 */
var TweetModel = function(){
	var that = Object.create(TweetModel.prototype);
	var persist = require("./persist.js");
	var shortid = require('shortid');
	var currentUser;
	/** array of all tweets, each tweet represented as an object of the form 
	*   {author:author,tweet:tweet,uid:uniqueID}
	*/
	var tweets = []; 
	//read what is stored in fritter.json and load the tweets in that file into tweets
	persist.load(function(err,data){
		if (err){

		}else{
			if (data){
				tweets = data;
			}else{
				tweets = [];
			}
		}
	});

  /**
   * Updates the current user
   * @param {String} userName - The new username to replace the old username by
   */
	that.updateUser = function(userName){
	    currentUser = userName;
	}

  /**
   * Gets the username of the current user
   * @returns {String} - The username of the current user
   */
	that.getCurrentUser = function(){
		return currentUser;
	} 

  /**
   * Adds a tweet to tweets, saves to file. each tweet has form of a object {author:author,tweet:tweet,uid:uniqueID}
   * a unique ID is generated and associated with each tweet
   * @param {String} author - The username of the author of the tweet
   * @param {String} tweet - The tweet the author tweeted
   */
	that.addTweet = function(author,tweet){
		var uniqueID = shortid.generate();
		tweets.push({author:author,tweet:tweet,uid:uniqueID});
		save(function(){});
	}
  /**
   * Adds a tweet to tweets. also removes it from the file its written in (fritter.json)
   * @param {String} uid - The unique id of the tweet to delete
   */
	that.deleteTweet = function(uid){
		//tweets.splice(index,1);
		tweets.forEach(function(element,index){
			if (element.uid == uid){
				var deleteIndex = index;
				tweets.splice(deleteIndex,1);
				save(function(){});
				return false;
			}
		});
	}

  /**
   * Saves tweets to a file (fritter.json)
   * @param {Function} callback - The function to execute after tweets
   *  has been written to a file(fritter.json). It is executed as callback(err), where 
   *  err is the error object and null if there is no error.
   */
	var save = function(callback){
		thisTweet = persist.persist(tweets,callback);
	}

  /**
   * Returns a modified copy of tweets - the array of all tweets , and for each tweet obj inside,
   * adds a field isCurrentAuthor:true if author of the tweet is the same as the current author,else
   * adds a field isCurrentAuthor:false
   * @returns {Array} - The modified copy of the array of all tweets
   */
	that.getTweets = function(){
		var tweetsCopy = tweets.slice();
		tweetsCopy.map(function(e){
			if (e.author == that.getCurrentUser()){
				e.isCurrentAuthor = true;
			}else{
				e.isCurrentAuthor = false;
			}
		});
		return tweetsCopy;
	}

	Object.freeze(that);
    return that;
};
module.exports = TweetModel();