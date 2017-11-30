import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Events } from '/imports/api/interest/EventCollection';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
});


Template.Event_Page.helpers({
  events() {
    return Events.findAll();
  },
});
