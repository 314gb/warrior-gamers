import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import { Games } from '../interest/GameCollection';

/** @module GamerProfiles */

/**
 * GamerProfiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class GamerProfileCollection extends BaseCollection {

  /**
   * Creates the GamerProfile collection.
   */
  constructor() {
    super('GamerProfile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      bio: { type: String, optional: true },
      games: { type: Array, optional: true },
      'games.$': { type: String },
      title: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      steam: { type: String, optional: true },
      blizzard: { type: String, optional: true },
      league: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new GamerProfile.
   * @example
   * GamerProfiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   games: ['League', 'Counter Strike', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   steam: 'steamname',
   *                   blizzard: 'blizzard',
   *                   league: 'summoner' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if steam, blizzard, and league are not URLs.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', username, bio = '', games = [], picture = '', title = '', steam = '',
      blizzard = '', league = '' }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, bio: String, picture: String,
      title: String };
    check({ firstName, lastName, username, bio, picture, title }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Games names are not defined.
    Games.assertNames(games);

    // Throw an error if there are duplicates in the passed games names.
    if (games.length !== _.uniq(games).length) {
      throw new Meteor.Error(`${games} contains duplicates`);
    }

    return this._collection.insert({ firstName, lastName, username, bio, games, picture, title, steam,
      blizzard, league });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const bio = doc.bio;
    const games = doc.games;
    const picture = doc.picture;
    const title = doc.title;
    const steam = doc.steam;
    const blizzard = doc.blizzard;
    const league = doc.league;
    return { firstName, lastName, username, bio, games, picture, title, steam, blizzard, league };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */

export const GamerProfiles = new GamerProfileCollection();
