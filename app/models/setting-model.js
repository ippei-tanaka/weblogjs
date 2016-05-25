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

    static findMany () {
        return undefined;
    }

    static findOne () {
        return undefined;
    }

    static getSetting () {
        const findOne = super.findOne.bind(this);

        return co(function* () {
            const model = yield findOne({});
            return model ? model : {};
        }.bind(this));
    }

    static setSetting (values) {
        const findOne = super.findOne.bind(this);

        return co(function* () {
            let model = yield findOne({});

            if (model) {
                model.setValues(values);
                yield model.save();
            } else {
                model = new this(values);
                yield model.save();
            }
        }.bind(this));
    }

}