#!/bin/bash
watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/npm-*
rm -rf ios/Pods
npm cache clean --force
npm install
./android/gradlew clean -p ./android/
rm -rf ios/build
cd ios
pod install
cd ..
npm start -- --reset-cache
