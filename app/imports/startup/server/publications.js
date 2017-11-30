import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { GamerProfiles } from '/imports/api/profile/GamerProfileCollection';
import { Games } from '/imports/api/interest/GameCollection';
import { Tags } from '/imports/api/interest/TagsCollection';
import { Events } from '/imports/api/interest/EventCollection';


Interests.publish();
Profiles.publish();
Events.publish();
Games.publish();
GamerProfiles.publish();
Tags.publish();
