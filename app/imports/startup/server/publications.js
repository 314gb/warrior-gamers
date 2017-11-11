import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';
import { Games } from '/imports/api/interest/GameCollection';


Interests.publish();
Profiles.publish();

Games.publish();
GamerProfiles.publish();

