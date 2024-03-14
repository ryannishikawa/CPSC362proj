/**
 * @file initDatabase.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file creates the databases for the app since they are not pushed to the github repository (for security reasons)
 * In the root folder, type in the terminal: [npm run dbinit]
 * 
 * Two new databases are added to the ./data folder:
 * CRED_DB: the database to store user credentials, default name is 'credentials.db'
 * TASK_DB: the database to store task data information associated with each user, default name is 'taskdata.db'
 */

import fs from 'fs';
import sqlite3 from 'sqlite3';

/**
 * --------------------------------------------------------------------------------------
 *                      DATABASE INITIALIZATION PARAMETERS
 * --------------------------------------------------------------------------------------
 * If you wish to modify the database directory or filenames, do so in this segment here.
 * 
 * By default:
 * 
 * DB_DIR (the relative directory to store databases):              './data'
 * CRED_DB (the database for user credentials):                     'credentials.db'
 * TASK_DB (the database for tasks associated with users):          'taskdata.db'
 */
const DB_DIR = './data';
const CRED_DB = 'credentials.db';
const TASK_DB = 'taskdata.db';
// --------------------------------------------------------------------------------------

console.log('Initializing database, please wait...');

// Check if database directory exists.
try {
    // Create directory of it exists
    if(!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR);
        console.log(`${DB_DIR} directory added!`);
    } else {
        console.log(`Given directory (${DB_DIR}) exists, proceeding...`);
    }
} catch (err) {
    console.log(`Cannot create the folder: ${err}`);
}

// Wait until all promises resolve before exiting program.
Promise.allSettled([createCredentialDB(), createUserTaskDB()]).then(() => {
    console.log(`\n\nOne or more databases have been successfully configured. You may run the web server!\n\n`);
});



/**
 * // Check if the credential database exists. If it exists OR doesn't exist and is created successfully, resolve.
 * @returns Resolved promise or rejected promise
 */
async function createCredentialDB() {

    if (fs.existsSync(`${DB_DIR}/${CRED_DB}`)) {
        console.log(`[!] This database already exists. If you wish to reset the database, delete ${CRED_DB} then run this file again. [!]`);
        return Promise.resolve(true);
    }

    // If does not exist, create database.
    fs.open(`${DB_DIR}/${CRED_DB}`, 'w', function (err) {

        if (err) {
            console.log(`Error creating file: ${err}`);
            return Promise.reject(false);
        };

        // Open the database upon creation.
        let db = new sqlite3.Database(`${DB_DIR}/${CRED_DB}`);

        console.log('User credential database file created. Adding schema...');

        // Prepare queries to the database to create the table
        let schemaQuery = 'CREATE TABLE "user_data" ( `name` TEXT NOT NULL,`email` TEXT NOT NULL, `pass` TEXT NOT NULL, `user_key` TEXT NOT NULL, `salt` TEXT NOT NULL, `uid` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE)'

        // Create table
        db.run(schemaQuery, (tErr) => {

            if (tErr) {
                console.log(`An error occured creating the database schema: ${tErr}`);
                return Promise.reject(false);
            }

            db.close();
            return Promise.resolve(true);
        });
    });
}

/**
 * 
 * @returns Resolved promise or rejected promise.
 */
async function createUserTaskDB() {

    if (fs.existsSync(`${DB_DIR}/${TASK_DB}`)) {
        console.log(`[!] This database already exists. If you wish to reset the database, delete ${TASK_DB} then run this file again. [!]`);
        return Promise.resolve(true);
    }

    // If does not exist, create database. NOTE this database will be empty upon initialization and is populated when
    // new user accounts are made.
    fs.open(`${DB_DIR}/${TASK_DB}`, 'w', function (err) {

        if (err) {
            console.log(`Error creating file: ${err}`);
            return Promise.reject(false);
        };

        console.log('User tasks database file created!');
        return Promise.resolve(true);
    });
}