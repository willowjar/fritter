$(function() {
  
  $.get("/sessionUser",{},function(username){
    if (typeof username == "undefined" | username==""){
      $("#myModal").modal('show');
    }else{
      reloadEverything();
    }
  });
  
  $("#logout").click(function(){
    $("#myModal").modal('show');
  });
  
  var userNameTemp= "Current&nbsp;User:&nbsp; {{username}}";
  var userNameTempCompiled = Handlebars.compile(userNameTemp);
  
//click listeners 
	$("#tweet-button").click(function(){
		var thisTweet = $("#current-user-tweet").val();
		if (!thisTweet){
      alert("please enter a tweet");
		}else{
      $.post("/tweet", {"tweet": thisTweet}, function(result) {
        if (result == "failure") {
          alert("couldn't add tweet. Please try again later");
        } else{
          reloadTweets();
        }     
      });
		}
	});

  $(".btn.btn-default.user-follow.follow").click(followButtonClickAction);

  $(".btn.btn-default.user-follow.unfollow").click(function(){alert("hey, sorry unfollow is not implemented. It is not part of the pset requirment :)")});

  //user sign up
  $("#signup-submit").click(function(){
    var username = $("#usr").val();
    var password = $("#pwd").val();
    if (username=="" | password==""){
      alert("you must enter both username and password")
    }else{
      $.post("/signup", {"username": username, "password":password}, function(result){
        if (result == "error"){
          $("#error-message").text("Something went wrong. Please try again later.");
        }else{
          if (result =="userNameExist"){
            $("#error-message").text("Username already exists, please choose another one.");
          }else{ //result == success
            $('#myModal').modal('hide');
            reloadEverything();
          }
        }
      });
    }
  });

  //user log in
  $("#login-submit").click(function(){
    console.log("login clicked");
    var username = $("#usr").val();
    var password = $("#pwd").val();
    if (username=="" | password==""){
      alert("you must enter both username and password")
    }else{
      //checks to see if user exist, if so, check to see if password valid 
      //if so, create user's session
      $.post("/login",{"username": username, "password":password},function(result){
        if (result == "error"){
          $("#error-message").text("Something went wrong. Please try again later.");
        }else{
          if (result =="failure"){
            $("#error-message").text("Username and/or password is not correct.");
          }else{ //result == success
            $('#myModal').modal('hide');
            reloadEverything();
          }
        }
      });  
    }
  });

}); //end of on page load

/**
* reloads all tweets stored 
*/
var reloadTweets = function(){
  $.get("/tweets", function(tweets) {
    if (tweets == "failure"){
      alert("couldn't read tweets. Please try again later");
    }else{
      tweets.reverse();
      var tweetsHTML = Handlebars.templates.all_tweets({item: tweets});
      $("#all-tweets").html(tweetsHTML);
      $(".tweet-delete.delete-button").off('click').on('click',deleteButtonClickAction);
      $(".tweet-delete.retweet-button").off('click').on('click',retweetButtonClickAction);    
    }
  });
}
/**
* reloads all tweets stored 
*/
var reloadFilteredTweets = function(){
  $.get("/filteredTweets", function(tweets) {
    if (tweets == "failure"){
      alert("couldn't read tweets. Please try again later");
    }else{
      console.log("filtered Tweets",tweets);
      tweets.reverse();
      var tweetsHTML = Handlebars.templates.all_tweets({item: tweets});
      $("#followed-tweets").html(tweetsHTML);
      $(".tweet-delete.retweet-button").off('click').on('click',retweetButtonClickAction);      
    }
  });
}


var reloadUserName = function(){
  $.get("/username",{},function(result){
    var userNameHtml = "Welcome, " + result;
    $("#current-user-display").html(userNameHtml);
  });
}
var reloadOtherUsers = function(){
  $.get("/allusers",{},function(allUsers){
    if (allUsers == "failure"){
      $("#all-users").html("Sorry, we couldn't get users. Please try again later.");
    }else{ //got all users
      $.get("/username",{},function(currentUserName){
        var otherUsers = allUsers.filter(function(thisUser){
          return thisUser.username != currentUserName;
        });
        $.get("/followees",{},function(followees){
          if (followees== "failure"){
          }else{
            otherUsers.forEach(function(otheruser){
              //var jsonUser = JSON.stringify(user);
              isFollowedByCurrentUser = false;
              var otherUserName = otheruser.username;
              followees.forEach(function(followee){
                if (followee.username == otherUserName){
                  isFollowedByCurrentUser = true;
                }
              });
            otheruser.isFollowing = isFollowedByCurrentUser;
            });
            var usersHTML = Handlebars.templates.other_users({otheruser: otherUsers});
            $("#all-users").html(usersHTML);
            $(".btn.btn-default.user-follow.follow").click(followButtonClickAction);
            $(".btn.btn-default.user-follow.unfollow").click(function(){alert("hey, sorry unfollow is not implemented. It is NOT part of the pset requirment :)")});
          }
        });
      });
    }
  });
}
/**
* reloads everything on the page: username,list of user, all tweets, filtered tweets.
*/
var reloadEverything = function(){
  reloadUserName();
  reloadOtherUsers();
  reloadTweets();
  reloadFilteredTweets();
}
var followButtonClickAction = function(){
  var newFolloweeID = $(this).attr('user-id');
  $.get("/user",{},function(user){
    if (user == "failure"){
      alert("couldn't get current user, please try again later");
    }else{
      var currentUserID = user._id ;
      $.post("/followees",{newFolloweeID:newFolloweeID,currentUserID:currentUserID},function(result){
        if (result == "failure"){
          alert("something went wrong; please try again later");
        }else{
          reloadOtherUsers();
          reloadFilteredTweets();

        }
      })
    }
  });
}

var deleteButtonClickAction = function(){
  console.log("delete clicked");
  var tweetID = $(this).attr('tweet-id');
  $.ajax({
    url: '/tweet',
    type: 'DELETE',
    data: {tweetID:tweetID}
    }).done(function(result){
      reloadTweets();
  });
} 

var retweetButtonClickAction = function(){
  var tweetID = $(this).attr('tweet-id');
  console.log("retweet clicked");
  $.post("/retweet",{tweetID:tweetID},function(result){
    if (result =="failure"){
      alert("couldn't retweet. Please try again later");
    }else{
      console.log("retweet suceded");
      reloadTweets();
    }
  });
}




