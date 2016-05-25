import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import PathModel from './lib/path-model';
import CollectionCrudOperator from '../db/collection-crud-operator';
import co from 'co';

const operator = new CollectionCrudOperator({collectionName: 'settings'});
const schema = Schemas.getSchema('setting');

export default class SettingModel extends SchemaModel {

    static get name () {
        return "setting";
    }

    static get _schema () {
        return schema;
    }

    static get _operator () {
        return operator;
    }

    static getSetting () {
        return co(function* () {
            const model = yield this.findOne({});
            return model ? model : {};
        }.bind(this));
    }

    static setSetting (values) {
        return co(function* () {
            const model = yield this.findOne({});
            if (model) {
                yield this.updateOne({_id: model.values._id}, values);
            } else {
                yield this.insertOne(values);
            }
        }.bind(this));
    }

}