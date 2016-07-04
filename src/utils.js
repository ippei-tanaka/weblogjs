import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export const generateHash = (str) => new Promise((resolve, reject) =>
{
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) =>
    {
        if (error) return reject(error);

        bcrypt.hash(str, salt, (error, hash) =>
        {
            if (error) return reject(error);
            resolve(hash);
        });
    });
});

export const compareHashedStrings = (plainString, hashedString) => new Promise((resolve, reject) =>
{
    bcrypt.compare(plainString, hashedString, (error, isMatch) =>
    {
        if (error) return reject(error);
        resolve(isMatch);
    });
});