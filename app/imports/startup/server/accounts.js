import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';
/* eslint-disable no-console */

/* Create a profile document for this user if none exists already. */
Accounts.validateNewUser(function validate(user) {
  if (user) {
    const username = user.services.cas.id;
    if (!Profiles.isDefined(username)) {
      Profiles.define({ username });
    }
    if (!GamerProfiles.isDefined(username)) {
      GamerProfiles.define({ username });
    }
  }
  // All UH users are valid for BowFolios.
  return true;
});
