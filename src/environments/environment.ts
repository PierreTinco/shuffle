// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiUrl: 'http://ec2-34-203-13-33.compute-1.amazonaws.com/api/shuffle',
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAo6XIb8NRSkOmnkTs6eWUH4kEBAe8jHT0",
    authDomain: "shuffle-de86f.firebaseapp.com",
    projectId: "shuffle-de86f",
    storageBucket: "shuffle-de86f.appspot.com",
    messagingSenderId: "327216688543",
    appId: "1:327216688543:web:c6f7580e76f5c98feba1aa",
    measurementId: "G-D5Q9MNK8YC"
  },
  mapsKey:"AIzaSyDDsKLsdyt2BQEVvM1GPizGxJup4PkrlO4"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
