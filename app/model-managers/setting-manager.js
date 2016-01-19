import ModelManager from "./model-manager";
import Setting from "../models/setting";
import co from 'co';


var settingManager = new ModelManager(Setting);


export default {

    getSetting: () => co(function* () {
        var docs = yield settingManager.find();
        return docs.length >= 1 ? docs[0] : new Setting();
    }),

    setFront: (blogId) => co(function* () {
        var setting = yield this.getSetting();

        setting.front = blogId;

        yield setting.save();

        return yield this.getSetting();
    }.bind(exports))
};