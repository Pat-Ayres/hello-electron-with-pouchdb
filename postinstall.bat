@echo off

for /f "delims=" %%i in ('node --eval "console.log(require('./node_modules/electron-prebuilt/package.json').version);"') do set VERSION=%%i

cd node_modules/leveldown

node-gyp rebuild --target=%VERSION% --arch=x64 --dist-url=https://atom.io/download/atom-shell