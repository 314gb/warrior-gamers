import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Games } from '../../../api/interest/GameCollection';
import { Tags } from '../../../api/interest/TagsCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Page.onCreated(function onCreated() {
  this.subscribe(Games.getPublicationName());
  this.subscribe(Tags.getPublicationName());
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
  tags() {
    return _.map(Tags.findAll(),
        function makeTagsObject(tag) {
          return { label: tag.name };
        });
  },
  games() {
    return _.map(Games.findAll(),
        function makeGameObject(game) {
          return { label: game.name };
        });
  },
});

Template.Add_Page.events({
  'submit .game-data-form'(event, instance) {
    event.preventDefault();
    const name = event.target.Name.value;
    const picture = event.target.Picture.value;
    const description = event.target.Description.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);

    const gameData = { name, picture, description, tags };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that gameData reflects what will be inserted.
    const cleanData = Games.getSchema().clean(gameData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      // Insert Game to Database
      Games.define(gameData);
      instance.messageFlags.set(displaySuccessMessage, true);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

