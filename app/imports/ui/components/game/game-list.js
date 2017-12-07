import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '/imports/api/interest/GameCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';
import { Tags } from '/imports/api/interest/TagsCollection';


Template.Game_List.onCreated(function onCreated() {
    this.subscribe(Games.getPublicationName());
    this.subscribe(GamerProfiles.getPublicationName());
    this.subscribe(Tags.getPublicationName());
    this.messageFlags = new ReactiveDict();
});




Template.Game_List.helpers({
  tagged( gamename ) {
      let onlygames = _.pluck( GamerProfiles.findAll(), 'games');

      function tagged1(list,name){
          return _.filter(list, function(item){ return item == name });
      }

      let tagged2 = _.filter( onlygames,
          function(game){
              return tagged1(game,gamename) != '';
          }
      )  ;

      return tagged2.length ;
  },
});
