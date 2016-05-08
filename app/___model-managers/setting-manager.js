import ModelManager from "./model-manager";
import Setting from "./models/setting";
import co from 'co';


var settingManager = new ModelManager(Setting);


var getSetting = () => co(function* () {
    var docs = yield settingManager.find({});
    return docs.length >= 1 ? docs[0] : new Setting();
});


var setFront = blogId => co(function* () {
    var setting = yield getSetting();

    setting.front = blogId;

    yield setting.save();

    return yield getSetting();
});


export default {
    getSetting,
    setFront
};