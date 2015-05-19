Videos = new Mongo.Collection("videos");
Votes = new Mongo.Collection("votes");


//shared methods so the client can run simulations on it.
Meteor.methods({
  vote: function (videoId) {
    
//    if (Meteor.isServer) {
//      Meteor._sleepForMs(5000); // wait for 5 seconds
//    }
    
    Votes.insert({
      videoId: videoId,
      createdAt: new Date(), // current time
      owner: Meteor.userId()
    });
   
  }
});
