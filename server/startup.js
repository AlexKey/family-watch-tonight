


Meteor.startup(function () {
  // Insert sample data if the student collection is empty
  if (Videos.find().count() === 0) {

    JSON.parse(Assets.getText("videos.json")).videos.forEach(function (video) {
      Videos.insert(video);
    });
  }


});
