import Immutable from 'immutable';

const ENV = process.env.WEBLOG_WEBPACK_ENV || {};

const initialState = Immutable.Map({
    webpageRootForAdmin: ENV.webpageRootForAdmin,
    webProtocol: ENV.webProtocol,
    webHost: ENV.webHost,
    webPort: ENV.webPort,
    adminApiRoot: ENV.adminApiRoot,
    adminDir: ENV.adminDir
});

export default (state = initialState) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
        state = initialState.merge(state);
    }

    return state;
};