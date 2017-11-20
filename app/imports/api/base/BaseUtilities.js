import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
<<<<<<< HEAD
import { Games } from '/imports/api/interest/GameCollection';
=======
import { GamerProfiles } from '../profile/GamerProfileCollection';
import { Games } from '../interest/GameCollection';

>>>>>>> master

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
<<<<<<< HEAD
=======
  GamerProfiles.removeAll();
>>>>>>> master
  Games.removeAll();
}
