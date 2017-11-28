import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Interest */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Event collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      name: { type: String },
      date: { type: String },
      location: { type: String },
      games: { type: Array, optional: true },
      'games.$': { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Event.
   * @example
   * Games.define({ name: 'League of Legends Tournament',
   *                    description: 'A League of Legends tournament' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, date, location, games, description }) {
    check(name, String);
    check(date, String);
    check(location, String);
    check(games, Array);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Event`);
    }
    return this._collection.insert({ name, date, location, games, description });
  }

  /**
   * Returns the Game name corresponding to the passed game docID.
   * @param eventID An interest docID.
   * @returns { String } An game name.
   * @throws { Meteor.Error} If the game docID cannot be found.
   */
  findName(eventID) {
    this.assertDefined(eventID);
    return this.findDoc(eventID).name;
  }

  /**
   * Returns a list of Game names corresponding to the passed list of Game docIDs.
   * @param interestIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(eventIDs) {
    return eventIDs.map(eventID => this.findName(eventID));
  }

  /**
   * Throws an error if the passed name is not a defined Game name.
   * @param name The name of an interest.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Game names.
   * @param names An array of (hopefully) Game names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Game name, or throws an error if it cannot be found.
   * @param { String } name An interest name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Interest.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Game names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of game names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Game name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Game docID in a format acceptable to define().
   * @param docID The docID of an Game.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const date = doc.date;
    const location = doc.location;
    const games = doc.games;
    const description = doc.description;
    return { name, date, location, games, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
