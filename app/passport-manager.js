import passport from 'passport';
//import { BasicStrategy } from 'passport-http';
import { Strategy as LocalStrategy } from 'passport-local';
import co from 'co';
import CollectionCrudOperator from './db/collection-crud-operator';

//var basicAuth;

/*
const authHandler = (email, password, done) => {
    co(function* () {
        var isValid = yield api.userManager.isValid({email: email, password: password});

        if (isValid) {
            let user = yield api.userManager.findByEmail(email);
            return done(null, user);
        } else {
            return done();
        }

    });
};
*/


//passport.use(new BasicStrategy(authHandler));


//basicAuth = passport.authenticate('basic', {session: false});





let localAuth = passport.authenticate('local');

let instance = null;

class PassportManager {

    constructor () {
        if (instance) {
            return;
        }
        instance = this;

        this._userOperator = new CollectionCrudOperator({
            collectionName: 'users'
        });

        passport.use(new LocalStrategy({usernameField: 'email'}, this._authHandler.bind(this)));

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser(this._deserializeUser);
    }

    get passport () {
        return passport;
    }

    get localAuth () {
        return localAuth;
    }

    _authHandler (email, password, done) {
        return co(function* () {
            const doc = yield this._userOperator.findOne({email});

            console.log("_authHandler");
            console.log(doc);

            //var isValid = yield api.userManager.isValid({email: email, password: password});

            /*
            if (isValid) {
                let user = yield api.userManager.findByEmail(email);
                return done(null, user);
            } else {
                return done();
            }
            */

            done();
        }.bind(this)).catch(e => console.log);
    }

    _deserializeUser (_id, done) {
        return co(function* () {
            // TODO make findOneById
            const doc = yield this._userOperator.findOne({_id});
            done(null, doc);
            done();
        }.bind(this)).catch((error) => {
            done(error);
        });
    }
}

export default new PassportManager();