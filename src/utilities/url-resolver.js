const resolve = (base, ...args) =>
{
    base = base.replace(/\/+$/, '');

    let paths = [];

    for (const arg of args)
    {
        paths = paths.concat(arg.split('/'));
    }

    const _paths = [];

    for (const path of paths)
    {
        if (path === "")
        {
            continue;
        }

        _paths.push(path);
    }

    return base + _paths.join('/');
};

export default Object.freeze({resolve});