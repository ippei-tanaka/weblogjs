import actions from '../actions';

export default (store) => {

    const _actions = {};

    for (let actionName of Object.keys(actions)) {
        _actions[actionName] = (...args) => {
            return actions[actionName](...args)(store.dispatch, store.getState);
        }
    }

    return _actions;
}