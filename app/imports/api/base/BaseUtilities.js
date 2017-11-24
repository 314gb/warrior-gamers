import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';
import { Games } from '/imports/api/interest/GameCollection';
import { Tags } from '../interest/TagsCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  GamerProfiles.removeAll();
  Games.removeAll();
  Tags.removeAll();
}

