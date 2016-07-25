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
import BlogModel from './models/blog-model';
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


    // Create or set a front blog if it doesn't exist.

    const frontBlogId = (yield SettingModel.getSetting()).front_blog_id;

    const frontBlog = yield BlogModel.findOne({
        _id: frontBlogId
    });

    let aBlog = yield BlogModel.findOne();

    if (!frontBlog && !aBlog)
    {
        try
        {
            aBlog = new BlogModel({
                name: config.getValue('defaultBlogName'),
                slug: config.getValue('defaultBlogSlug'),
                posts_per_page: config.getValue('defaultBlogPostPerPage')
            });

            yield aBlog.save();
        }
        catch (e)
        {
            console.error(e.message);
            console.error('WeblogJS failed to start up.');
            return;
        }
    }

    if (!frontBlog)
    {
        yield SettingModel.setSetting({
            front_blog_id: aBlog.id
        });
    }

    // Start a web server

    app.listen(
        config.getValue('webPort'),
        config.getValue('webHost')
    );

    console.log(`WeblogJS started listening ${config.getValue('webHost')}:${config.getValue('webPort')}`);

}).catch(e => console.error(e));
