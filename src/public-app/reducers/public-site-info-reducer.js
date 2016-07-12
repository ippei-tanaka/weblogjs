import Immutable from 'immutable';

const ENV = process.env.WEBLOG_WEBPACK_ENV || {};

const initialState = Immutable.Map({
    webpageRootForPublic: ENV.webpageRootForPublic,
    webProtocol: ENV.webProtocol,
    webHost: ENV.webHost,
    webPort: ENV.webPort,
    publicApiRoot: ENV.publicApiRoot,
    publicDir: ENV.publicDir
});

export default (state = initialState) => {

    if (!(state instanceof Immutable.Map)) {
        state = Immutable.Map(state);
        state = initialState.merge(state);
    }

    return state;
};