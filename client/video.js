
Template.body.helpers({
  voteCount: function() {
    return Votes.find().count();
  },
  videos: function() {
    return Videos.find();
  }
});



Template.video.events({
  "click .vote": function (event) {
    //this runs a simulation to handle latency compensation.
    Meteor.call("vote", this._id);
  }
});


