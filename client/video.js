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
      return video;
    });
  },
  videosWithVotes: function() {

    return Videos.find({ "_id": { $in: [ '1', '2' ] } });
  }
});

Template.video.events({
  "click .vote": function (event) {
    //this runs a simulation to handle latency compensation.
    Meteor.call("vote", this._id);

    //TODO: Get how many votes there are

    //You would of thought I'd get a value back here to update the progress bar?
    $(event.target).closest(".card").find(".progress").progress("increment");
  }
});

Template.video.rendered = function(){
  $('.progress').progress();
}

Tracker.autorun(function() {


});
