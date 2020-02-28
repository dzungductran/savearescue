# Things that need to be changed
* Update the `android/app/src/main/AndroidManifest.xml` with the Google GEO API Key. 
```
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="Google_GEO_API_KEY_goes_here"/>
```
* Update the following files with your database file in the place of `my_company.db`:
```
    app/api/breedFetch.js
    app/api/serviceFetch.js
    app/api/settings.js
```
* To create the database file, please see `scripts/README.md`
* Obtain a Petfinder API client id and secret from Petfinder.com and update the file `app/api/fetch.js` as:
```
    const CLIENT_ID = "PetFinder_Client_Id_goes_here";
    const CLIENT_SECRET = "PetFinder_Secret_goes_here";
```
* Update the file `app/api/geolocation.js` with your company name in the place of `your_company_name`
* Update the file `app/api/yelpFetch.js` with the API key from Yelp as in:
````
const API_KEY = 'YELP_API_KEY_goes_here';
````
* Update the file `app/components/GooglePlacesAutocomplete/GooglePlacesInput.js` with the Google Place API key as:
````
    key: 'Google_Places_API_KEY_goes_here',
````
* Update the file `app/controllers/app.styles.js` with your company phone number as:
````
    export const PHONE_NUMBER = '+1,555-222-1234';
````
* Update the file `app/views/HomeView/index.js` with locations of your database and version files as:
````
    const dbURL = "https://www.yoursite.com/database_file_for_petservices.db";
    const dbInfoURL = "https://www.yoursite.com/database_file_for_petservice_info.csv";
    const dbFILE_SIZE = 39149568;
````
* Update the file `app/views/MoreView/company.js` with your company email and address information.
* Update the file `app/views/MoreView/licenses.js` with your company name and website address.
* Update the file `app/views/MoreView/privacy.js` with the URL to your privacy file as:
````
const URL = "https://www.yourcompany.com/privacy_policy.pdf";
````
* Update the file `app/views/MoreView/terms.js` with the URL to your terms of service file as:
````
const URL = "https://www.yourcompany.com/terms_conditions.pdf";
````
* Update the file `app/views/MoreView/volunteer.js` with your company email and description.

# To upgrade react-native:
> react-native upgrade

# To see security issues with your packages:
> npm audit

# To fix your packages
> npm audit fix

# To install a certain version:
> npm install package_name@version_number

# To see which packages are outdated:
> npm outdated

Becareful not to update package because there might be breaking API

# Run app for Android/iOS, make sure you have the simulator running first:
> react-native run-ios
> react-native run-android

Debugging by following this isntruction: http://facebook.github.io/react-native/docs/debugging

Make sure to install NDK (side by side)

# Release the app for Android:
https://facebook.github.io/react-native/docs/0.60/signed-apk-android

Handle 64bits release: https://shift.infinite.red/handling-64-bit-android-builds-for-react-native-2fcd7a2e5c14

# Release the app for Apple:
To build for Release: Product -> Scheme -> Edit Scheme, then set to build for Release. Do the same for Debug

To get distribution package: Product-> Destination -> Generic iOS Device, then Archive menu will appear.

https://wiki.genexus.com/commwiki/servlet/wiki?34616,HowTo%3A+Create+an+.ipa+file+from+XCode

To update the app: https://help.apple.com/app-store-connect/#/dev480217e79
