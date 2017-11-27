import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Games } from '/imports/api/interest/GameCollection';
import { Events } from '/imports/api/interest/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Event_Page.onCreated(function onCreated() {
  this.subscribe(Games.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
});

Template.Add_Event_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  games() {
    return _.map(Games.findAll(),
        function makeInterestObject(game) {
          return {
            label: game.name,
            // selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});

Template.Add_Event_Page.events({
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const eventName = event.target.Event.value;
    const date = event.target.Date.value;
    const location = event.target.Location.value;
    const selectedGames = _.filter(event.target.Games.selectedOptions, (option) => option.selected);
    const games = _.map(selectedGames, (option) => option.value);
    const description = event.target.Description.value;

    const eventData = { eventName, date, location, games, description };

    const cleanData = Events.getSchema().clean(eventData);
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Events.findDoc(FlowRouter.getParam('username'))._id;
      const id = Events.insert(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
