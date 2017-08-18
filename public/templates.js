(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['all_tweets'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  	<li class='list-group-item'>\n  		<div class='tweet-delete'>\n  			<h4>Posted by: "
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + " </h4>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isRetweet : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<p>"
    + alias4(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper)))
    + "</p>\n  		</div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isCurrentAuthor : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "  	</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return " <h4> Retweeted From: "
    + container.escapeExpression(((helper = (helper = helpers.originalAuthor || (depth0 != null ? depth0.originalAuthor : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"originalAuthor","hash":{},"data":data}) : helper)))
    + "</h4>";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "  			<button class='tweet-delete delete-button' tweet-id='"
    + container.escapeExpression(((helper = (helper = helpers.uid || (depth0 != null ? depth0.uid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"uid","hash":{},"data":data}) : helper)))
    + "'>Delete</button>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <button class='tweet-delete retweet-button' tweet-id='"
    + container.escapeExpression(((helper = (helper = helpers.uid || (depth0 != null ? depth0.uid : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"uid","hash":{},"data":data}) : helper)))
    + "'>Retweet</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class='list-group'>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.item : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
templates['other_users'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "	  	<li class=\"list-group-item\"><p class=\"user-follow\">"
    + container.escapeExpression(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"username","hash":{},"data":data}) : helper)))
    + "</p> \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isFollowing : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "	  	</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	  		<button type=\"button\" class=\"btn btn-default user-follow unfollow\" user-id='"
    + container.escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"_id","hash":{},"data":data}) : helper)))
    + "'>Unfollow</button>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	  		<button type=\"button\" class=\"btn btn-default user-follow follow\" user-id='"
    + container.escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"_id","hash":{},"data":data}) : helper)))
    + "'>Follow</button>	\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"list-group\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.otheruser : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
})();