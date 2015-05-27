Template.body.helpers({
  "pets" : function() {
    var pets = Meteor.call("getPets", {petId:1}); //return either the response as a trackable item or perhaps the function call.

    console.log(pets);

    return pets;

  }
});
