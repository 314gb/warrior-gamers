import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Tags */

/**
 * Represents a specific game, such as "League of Legends".
 * @extends module:Base~BaseCollection
 */
class TagsCollection extends BaseCollection {

  /**
   * Creates the Tags collection.
   */
  constructor() {
    super('Tags', new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Tag.
   * @example
   * Games.define({ name: 'MMORPG',
   *                    description: 'Massively Multiplayer Online Role Playing Game' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, description }) {
    check(name, String);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Tag`);
    }
    return this._collection.insert({ name, description });
  }

  /**
   * Returns the Tag name corresponding to the passed game docID.
   * @param tagID An interest docID.
   * @returns { String } A tags name.
   * @throws { Meteor.Error} If the tag docID cannot be found.
   */
  findName(tagID) {
    this.assertDefined(tagID);
    return this.findDoc(tagID).name;
  }

  /**
   * Returns a list of Tag names corresponding to the passed list of Tag docIDs.
   * @param tagIDs A list of Tag docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(tagIDs) {
    return tagIDs.map(tagID => this.findName(tagID));
  }

  /**
   * Throws an error if the passed name is not a defined Game name.
   * @param name The name of an interest.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Tag names.
   * @param names An array of (hopefully) Game names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Tag name, or throws an error if it cannot be found.
   * @param { String } name An tag name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with a Tag.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Tag names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of tag names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not a Tag name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Tag docID in a format acceptable to define().
   * @param docID The docID of a Tag.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    return { name, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Tags = new TagsCollection();
