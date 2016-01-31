export default function functionMiddleWare({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            return typeof action === 'function' ?
                action(dispatch, getState) :
                next(action);
        }
    }
}