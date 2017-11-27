import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import { Games } from '../interest/GameCollection';

/** @module Interest */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Interest collection.
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
   * Interests.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name = '', date = '', location, games = [], description = '' }) {
    // make sure required fields are OK.
    const checkPattern = { name: String, date: String, location: String, description: String };
    check({ name, date, location, description }, checkPattern);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Profile`);
    }
    Games.assertNames(games);
    if (games.length !== _.uniq(games).length) {
      throw new Meteor.Error(`${games} contains duplicates`);
    }

    return this._collection.insert({ name, date, location, games, description });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
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
