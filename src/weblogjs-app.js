import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import config from './config';
import adminApiApp from './admin-api-app/app';
import adminSiteApp from './admin-app/app';
import publicSiteApp from './public-app/app';
import passportManager from './passport-manager';
import UserModel from './models/user-model';
import SettingModel from './models/setting-model';
import co from 'co';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
    secret: config.getValue('sessionSecret'),
    resave: false,
    saveUninitialized: false
}));

app.use(passportManager.passport.initialize());
app.use(passportManager.passport.session());
app.use(config.getValue('adminApiRoot'), adminApiApp);
app.use(config.getValue('adminSiteRoot'), adminSiteApp);
app.use(config.getValue('publicSiteRoot'), publicSiteApp);

co(function* ()
{

    // Create an admin user if it doesn't exist.

    const admin = yield UserModel.findOne({
        email: config.getValue('adminEmail')
    });

    try
    {
        if (!admin)
        {
            yield new UserModel({
                email: config.getValue('adminEmail'),
                password: config.getValue('adminPassword'),
                display_name: config.getValue('adminDisplayName'),
                slug: config.getValue('adminSlug')
            }).save();
        }
    }
    catch (e)
    {
        console.error(e.message);
        console.error('WeblogJS failed to start up.');
        return;
    }

    // Start a web server

    app.listen(
        config.getValue('webPort'),
        config.getValue('webHost')
    );

    console.log(`WeblogJS started listening ${config.getValue('webHost')}:${config.getValue('webPort')}`);

}).catch(e => console.error(e));
