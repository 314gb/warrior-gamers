import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { GamerProfiles } from '../profile/GamerProfileCollection';
import { Games } from '../interest/GameCollection';


export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  GamerProfiles.removeAll();
  Games.removeAll();
}
