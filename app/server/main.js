import '/imports/startup/server';
import '/imports/api/base';
import '/imports/api/profile';
import '/imports/api/interest';
import { Meteor } from 'meteor/meteor'

if(Meteor.isServer){
    Meteor.methods({
        leagueSearch: function () {
            this.unblock();
            return Meteor.http.call("GET", "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/kaisuke23?api_key=RGAPI-8dc6f01d-8551-48a2-85d1-7d70ceea51f5");
        }
    });
}
