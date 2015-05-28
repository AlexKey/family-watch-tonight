
var SwaggerClient = Meteor.npmRequire("swagger-client");

Meteor.methods({
  "getPets" : function() {

    var PetClient = new SwaggerClient({
      url: 'http://petstore.swagger.io/v2/swagger.json',

      sucess: function() {

        var getPetByIdFibre = Meteor.wrapAsync(PetClient.apis.pet.getPetById);

        return PetClient.apis.pet.getPetById({petId: 1}); //getPetByIdFibre({petId: 1});

      }
    });

  }
});


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
  var filter = { userId: { $exists: true }};

  return Presences.find(filter, { fields: { state: true, userId: true }});
});


Meteor.users.find({ "status.online": true }).observe({
  added: function(user) {
    console.log("add: " + user._id);
  },
  removed: function(user) {
    console.log("remove: " + user._id);
    Votes.remove({ owner : user._id });
  }
});
