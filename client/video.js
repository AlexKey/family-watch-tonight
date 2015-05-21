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
      video.votes =  _.where(votes, { videoId: video._id }).length;
      return video;
    });
}

//custom reactive data source
var votesNeeded = new ReactiveVar(100);

//setup a reactive computation
Tracker.autorun(function () {
  votesNeeded.set(Math.floor(Presences.find().count() / 2) + 1);
});


Template.body.helpers({
  voteCount: function() {
    return Votes.find().count(); //reactive data source so is live
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
  "click .vote": function (event, instance) {
    //this runs a simulation to handle latency compensation.
    Meteor.call("vote", this._id);
    
    //You would of thought I'd get a value back here to update the progress bar?
  }
});


var votingIsDone = function() {
    var data = Template.currentData();
    
    return data.votes >= votesNeeded.get();
}

Template.video.helpers({
  votesNeeded: function() {
    return votesNeeded.get(); //note the tempalte does not have access to outer variables 
  },
  votingIsDone: function() {
    return votingIsDone();
  }  
});

Template.video.rendered = function(){
   var self = this;
   
  $('.progress').progress();
 
  //make itself relient on it's dom changes
  self.autorun(function () {
    var data = Template.currentData(); //knows about the current instance
    
    //suprisingly tricky to get the correct syntax!!
    Template.instance().$(".progress").progress({value: data.votes, total: data.votesNeeded });
  });
}

