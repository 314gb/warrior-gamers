import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Games } from '/imports/api/interest/GameCollection';


Template.Game_Page.onCreated(function onCreated() {
    this.subscribe(Games.getPublicationName());
});

Template.Filter_Page.helpers({
    games() {
        // Initialize selectedInterests to all of them if messageFlags is undefined.
        // Find all profiles with the currently selected interests.
        return GamerProfiles.findAll();
    },

});