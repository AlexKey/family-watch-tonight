Meteor.startup(function () {
  // Insert sample data if the student collection is empty
  if (Videos.find().count() === 0) {
    
    JSON.parse(Assets.getText("videos.json")).videos.forEach(function (video) {
      Videos.insert(video);
    });
  }
});

Meteor.publish("votes", function () {
  return Votes.find(); //publish a cursor of a query
});
  
Meteor.publish("videos", function () {
  return Videos.find();
});