import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';

import { Profiles } from '/imports/api/profile/ProfileCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';

import { Interests } from '/imports/api/interest/InterestCollection';
import { Games } from '/imports/api/interest/GameCollection';
import { Tags } from '/imports/api/interest/TagsCollection';
import { Events } from '/imports/api/interest/EventCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Game_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Games.getPublicationName());
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(GamerProfiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Game_Page.helpers({
  games() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      //Template.instance().messageFlags.set(selectedInterestsKey, _.map(Tags.findAll(), tag => tag.name));
      return Games.findAll();
    }
    // Find all profiles with the currently selected interests.
    const allGames = Games.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allGames, game => _.intersection(game.tags, selectedInterests).length > 0);
  },
  tagList() {
    return _.map(Tags.findAll(),
        function makeInterestObject(tag) {
          return {
            label: tag.name,
            // selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});

Template.Game_Page.events({
  'submit .filter-tag-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
  },
});

