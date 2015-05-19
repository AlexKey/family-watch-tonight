
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
  }
});

Template.video.rendered = function(){
  $('.progress').progress({ total: 5 });
}
