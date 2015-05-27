/* global _ */
/* global Videos */
/* global Votes */
/* global Template */
/* global Presences */
/* global Meteor */
/* global $ */


//Reactive data sources can be passed through composition automatically!
//note, has to be var as function() would be global
var videosMergedWithVotes = function() {
    var videos = Videos.find().fetch();

    //cheating, joins are weird - instead using the "over subscribe technique"
    var votes = Votes.find().fetch();

    return _.map(videos, function(video, index) {
      video.votes =  _.where(votes, { videoId: video._id });
      video.voteCount = video.votes.length;
      return video;
    });
};

//custom reactive data source
var votesNeeded = new ReactiveVar(1);

//setup a reactive computation
Tracker.autorun(function () {
  var peopleOnline = Presences.find().count();
  
  var _votesNeeded = 1;
  
  if(peopleOnline === 2) {
    _votesNeeded = 2;
  } else if (peopleOnline > 2) {
    //the majority rules
    _votesNeeded = Math.floor(peopleOnline) + 1;
  }
  
  votesNeeded.set(_votesNeeded);
});


Template.body.helpers({
  voteCount: function() {
    return Votes.find().count(); //reactive data source so is live
  },
  votesNeeded: function() {
    return votesNeeded.get();
  },
  videos: function() {
    return videosMergedWithVotes();
  },
  videosWithVotes: function() {
    return _.filter(videosMergedWithVotes(), function(video) {
      return video.votes > votesNeeded.get();
    });
  },
  peopleOnline: function() {
    return Presences.find().count();
  }
});


Template.video.events({
  "click .vote": function (event, template) {
    //this runs a simulation to handle latency compensation.
    Meteor.call("vote", this._id);

  }
});



Template.video.helpers({
  votesNeeded: function() {
    return votesNeeded.get(); //note the tempalte does not have access to outer variables 
  },
  hasVote: function() {
    var videoVotes = Template.currentData().votes;
    
    //console.log("boom"); //if you did this, you'd see it's pretty chatty here
    
    return videoVotes.length && _.where(videoVotes, { owner : Meteor.userId() }) ? true : false;
  },
  attributes: function() {
    return {
      disabled: function() { Meteor.userId() },
      class: function() {  Meteor.userId()  ? "disabled" : "" }
    }
  }
});

Template.video.onRendered(function(){
   var self = this;
   
  $('.progress').progress();
 
  //make itself relient on it's dom changes
  self.autorun(function () {
    var data = Template.currentData(); //knows about the current instance

    //suprisingly tricky to get the correct syntax!!
    Template.instance().$(".progress").progress({value: data.voteCount, total: votesNeeded.get() });
  });
});

