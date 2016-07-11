import actions from './index';

const build = ({apiRoot}) => {
    const _actions = {};

    for (const key of Object.keys(actions))
    {
        _actions[key] = (arg = {}) => {
            arg.apiRoot = apiRoot;
            return actions[key](arg);
        }
    }

    return _actions;
};

export default Object.freeze({build});