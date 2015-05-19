Meteor.publish("votes", function () {
  return Votes.find(); //publish a cursor of a query
});
  
Meteor.publish("videos", function () {
  return Videos.find();
});