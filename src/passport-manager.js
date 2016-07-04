import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import co from 'co';
import { ObjectID } from 'mongodb';
import UserModel from './models/user-model';

const localAuth = passport.authenticate('local');

const authHandler = (email, password, done) => co(function* ()
{
    const model = yield UserModel.findOne({email});

    if (!model)
    {
        return done();
    }

    if (!(yield model.checkPassword(password)))
    {
        return done();
    }

    return done(null, model.values);

}).catch(e => console.log);

const deserializeUser = (_id, done) => co(function* ()
{
    const model = yield UserModel.findOne({_id: new ObjectID(_id)});

    if (!model)
    {
        return done();
    }

    return done(null, model.values);

}).catch(e => console.log);

passport.use(new LocalStrategy({usernameField: 'email'}, authHandler));

passport.serializeUser((user, done) =>
{
    done(null, user._id);
});

passport.deserializeUser(deserializeUser);

export default {

    get passport ()
    {
        return passport;
    },

    get localAuth ()
    {
        return localAuth;
    }

}