#!/bin/sh
ROOT_DIR=$(pwd)

cd $ROOT_DIR/client

# ionic cordova build browser --prod --release
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore litebox.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk litebox
zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ../litebox.apk

cd $ROOT_DIR