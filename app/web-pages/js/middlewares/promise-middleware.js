export default function promiseMiddleWare({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            if (action instanceof Promise) {
                return action
                    .then(data => dispatch(data))
                    .catch(data => dispatch(data));
            } else {
                return next(action);
            }
        }
    }
}