Meteor.publish("votes", function () {
  return Votes.find(); //publish a cursor of a query
});
  
Meteor.publish("videos", function () {
  return Videos.find();
  
});


Meteor.publish('userPresence', function() {
  // Setup some filter to find the users your user
  // cares about. It's unlikely that you want to publish the 
  // presences of _all_ the users in the system.

  // If for example we wanted to publish only logged in users we could apply:
  // filter = { userId: { $exists: true }};
  var filter = {}; 

  return Presences.find(filter, { fields: { state: true, userId: true }});
});