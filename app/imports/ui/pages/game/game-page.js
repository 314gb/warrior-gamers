import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '/imports/api/interest/GameCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';


Template.Game_Page.onCreated(function onCreated() {
    this.subscribe(Games.getPublicationName());
    this.subscribe(GamerProfiles.getPublicationName());
    this.messageFlags = new ReactiveDict();
});



Template.Game_Page.helpers({
    games() {
        // Initialize selectedInterests to all of them if messageFlags is undefined.

        // Find all profiles with the currently selected interests.
        return Games.findAll();
    },

});