import sass from 'node-sass';
import fs from 'fs';
import co from 'co';
import path from 'path';
import mkdirp from 'mkdirp';

const build = ({
    themeSrcDirPaths,
    staticPath,
    themeDistDirName
    }) => co(function* ()
{
    const filePathObjs = [];

    for (const dirPath of themeSrcDirPaths)
    {
        const fileNames = yield new Promise((res, rej) => fs.readdir(dirPath, (err, result) =>
        {
            if (err) return rej(err);
            res(result);
        }));

        for (const fileName of fileNames)
        {
            if (fileName.match(/^_/) || !fileName.match(/^([^.]+)\.(scss|sass)$/))
            {
                continue;
            }

            filePathObjs.push({
                filePath: path.resolve(dirPath, fileName),
                baseName: RegExp.$1
            });
        }
    }

    const outputDir = path.resolve(staticPath, themeDistDirName);

    for (const filePathObj of filePathObjs)
    {
        const result = yield new Promise((res, rej) => sass.render({
            file: filePathObj.filePath
        }, (err, result) =>
        {
            if (err) return rej(err);
            res(result);
        }));

        yield new Promise((res, rej) => mkdirp(outputDir, err => {
            if (err) return rej(err);
            res(result);
        }));

        const {css} = result;
        const outputFilePath = path.resolve(outputDir, filePathObj.baseName + ".css");

        yield new Promise((res, rej) => fs.writeFile(
            outputFilePath,
            css,
            (err, result) =>
            {
                if (err) return rej(err);
                res(result);
            }));
    }

});

export default Object.freeze({build});