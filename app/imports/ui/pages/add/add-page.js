import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Games } from '/imports/api/interest/GameCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Page.onCreated(function onCreated() {
  this.subscribe(Games.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Games.getSchema().namedContext('Add_Page');
});

Template.Add_Page.helpers({
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
    return Games.findAll();
  },
});


Template.Add_Page.events({
  'submit .add-game-data-form'(event, instance) {
    event.preventDefault();
    const gameName = event.target.Name.value;
    const picture = event.target.Picture.value;
    const description = event.target.Description.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);

    const gameData = { gameName, picture, tags, description };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Games.getSchema().clean(gameData);
    // Determine validity.
    instance.context.validate(cleanData);

    // Check if game is not in database

    if (instance.context.isValid()) {
      const docID = Games.findDoc(FlowRouter.getParam('username'))._id;
      const id = Games.update(docID, { $set: cleanData });

      // Add game to database
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
