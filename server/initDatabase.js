/**
 * @file initDatabase.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file creates the database for the app since the database is not pushed to the github repository (for security reasons)
 * In the root folder, type in the terminal: [npm run dbinit]
 */
import fs from 'fs';
import sqlite3 from 'sqlite3';

const newDir = './data';
console.log('Initializing database, please wait...');

try {
    
    // Create directory of it exists
    if(!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
        console.log('data directory added!')
    } else {
        console.log('Directory exists, proceeding...');
    }

    // Check if database exists
    if(fs.existsSync(`${newDir}/credentials.db`)) {
        console.log('\n\n[!] The database already exists. If you wish to reset the database, delete the file then run this file again. [!]\n\n');
    } else {
         // If does not exist, create database.
        fs.open(`${newDir}/credentials.db`, 'w', function(err) {

            if(err) {
                console.log(`Error creating file: ${err}`);
                throw err;
            };

            // Open the database upon creation.
            let db = new sqlite3.Database(`${newDir}/credentials.db`);

            console.log('Database file created. Adding schema...');

            // Prepare queries to the database to create the table
            let schemaQuery = 'CREATE TABLE "user_data" ( `name` TEXT NOT NULL,`email` TEXT NOT NULL, `pass` TEXT NOT NULL, `user_key` TEXT NOT NULL, `salt` TEXT NOT NULL, `uid` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE)'

            // Create table
            db.run(schemaQuery, (tErr) => {

                if(tErr) {
                    console.log(`An error occured creating the database schema: ${tErr}`);
                    throw err;
                }

                db.close();
                console.log('\n\nThe database has been successfully configured. You may now run the web server.\n\n');

                return;
            });
            
        });
    }

} catch (err) {
    console.log(`Cannot create the folder: ${err}`);
}