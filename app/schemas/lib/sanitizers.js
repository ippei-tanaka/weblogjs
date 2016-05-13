import { ObjectID } from 'mongodb';

export const objectIDfy = (value) => {
    let ID;
    try {
        ID = ObjectID(value)
    } catch (e) {
        return null;
    }
    return ID;
};