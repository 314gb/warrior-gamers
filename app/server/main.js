import '/imports/startup/server';
import '/imports/api/base';
import '/imports/api/profile';
import '/imports/api/interest';
import { Meteor } from 'meteor/meteor'

if(Meteor.isServer){
    Meteor.methods({
        leagueSearch: function (url) {
            this.unblock();
            returnArray = Meteor.http.call("GET", url);
            console.log(returnArray.statusCode);
            if(returnArray.statusCode == 200){
                for( a in returnArray){
                    console.log(a);
                }
                console.log(returnArray.data.id);
                return returnArray.data;
            }
        }
    });
}
