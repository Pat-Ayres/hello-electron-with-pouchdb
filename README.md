# Hello Electron with Pouchdb

This is a demo app that integrates PouchDB with Couchbase in Electron.

It was originally forked from Nola Lawson's repo https://github.com/nolanlawson/hello-electron-with-pouchdb

Starting with that base, I am implementing a simple todo app that can store data offline using PouchDB and sync to Couchbase server using Couchbase Sync Gateway when a connection is available.

## Install and run

Check out the code:

    git clone https://github.com/Pat-Ayres/hello-electron-with-pouchdb
    cd hello-electron-with-pouchdb

Then npm install:

    npm install

And run:

    npm start

If it doesn't work, you might not have the latest version of Node/npm. Try installing the latest using [nvm](https://github.com/creationix/nvm).

## Browser vs Node

In order to get LevelDB to work properly, this app uses a `postinstall` script that rebuilds the LevelDB C++ dependencies for Electron.

Currently this is set for Windows environment, if you are on mac or linux update the `postinstall` script in the `package.json` to `bash postinstall.sh`.

If this step doesn't work for you (e.g. because you are using an older version of Node etc.), you can remove the `postinstall` script from `package.json` and just use the browser adapters (IndexedDB/WebSQL) rather than the Node.js adapter (LevelDB).

See [pouchdb-electron](https://github.com/nolanlawson/pouchdb-electron) for more installation instructions.