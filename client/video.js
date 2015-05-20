/* global ; */
/* global Videos */
/* global Votes */

Template.body.helpers({
  voteCount: function() {
    return Votes.find().count(); //reactive data source so is live
  },
  videos: function() {
    var videos = Videos.find().fetch();

    //cheating, joins are weird - instead using the "over subscribe technique"
    var votes = Votes.find().fetch();

    return _.map(videos, function(video, index) {
      video.votes =  _.where(votes, { videoId: video._id }).length;
      video.totalUsers = Presences.find().count();
      return video;
    });
  },
  videosWithVotes: function() {

    return Videos.find({ "_id": { $in: [ '1', '2' ] } });
  },
  totalUsers: function() {
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

Template.video.rendered = function(){
   var self = this;
   
  $('.progress').progress();
 
  
  //make itself relient on it's dom changes
  self.autorun(function () {
    var data = Template.currentData();
    
    //suprisingly tricky to get the correct syntax!!
    Template.instance().$(".progress").progress({value: data.votes, total: data.totalUsers});
  });
}

