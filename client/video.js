/* global Template */
/* global Videos */
/* global Votes */

Template.body.helpers({
  voteCount: function() {
    return Votes.find().count(); //reactive data source so is live
  },
  videos: function() {
    return Videos.find();
  },
  videosWithVotes: function() {
    
    return Videos.find({ "_id": { $in: [ '1', '2' ] } });
  }
});

Template.video.events({
  "click .vote": function (event) {
    //this runs a simulation to handle latency compensation.
    Meteor.call("vote", this._id); 
 
    //You would of thought I'd get a value back here to update the progress bar?
    $(event.target).closest(".card").find(".progress").progress("increament");
  }
});

Template.video.rendered = function(){
  $('.progress').progress({ total: 5 });
}

Tracker.autorun(function() {
	
  
});
