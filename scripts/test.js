import Mocha from 'mocha';
import fs from 'fs';
import path from 'path';

try
{
    const mocha = new Mocha({
        ui: 'bdd'
    });

    const testDir = path.resolve(__dirname, '../test');

    fs.readdirSync(testDir).filter((file) =>
    {
        return file.substr(-8) === '.test.js';
    }).forEach((file) =>
    {
        mocha.addFile(path.join(testDir, file));
    });

    mocha.run((failures) =>
    {
        if (!failures)
        {
            resolve();
            process.exit();
        }
        else
        {
            reject();
            process.exit(failures);
        }

        process.on('exit', () =>
        {
            process.exit(failures);
        });
    });

}
catch (e)
{
    console.error(e.stack);
}

