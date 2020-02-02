<h1 align="center">Welcome to LiteBox 👋</h1>

> A lighter and faster cloud storage service, built for millenials

## Configuration

Edit the `database.js` file in the `core/API/config` folder according to your needs

```js
module.exports = {
    secret: process.env.JWT_SECRET || "Supinf0!",
    storageDir: process.env.STORAGE_DIR || "C:/Content/",
    serverName: process.env.SERVER_NAME || "http://localhost:3000",
    mongoHost: process.env.MONGO_HOST || "localhost",
    mongoPort: process.env.MONGO_PORT || "27017",
    mongoDb: process.env.MONGO_DB || "SupFileDB",
    maxUploadSize: process.env.MAX_UPLOAD_SIZE || "50mb",
    port: process.env.PORT || 3000
}
```

Edit the `firebaseConfig` value in the `client/src/app/app.module.ts` file according to your needs

```ts
export const firebaseConfig = {
  fireNew: {
    apiKey: "XXX",
    authDomain: "XXX",
    databaseURL: "XXX",
    projectId: "XXX",
    storageBucket: "XXX",
    messagingSenderId: "XXX"
  }
};
```

Replace the `ROOT_URL` value in the `client/src/providers/http-service/http-service.ts` file according to your needs

```ts
public ROOT_URL : string = "http://localhost:3000";
```

## Usage

**Build server and docker**

```sh
./build.sh
```

**Build web and mobile apps**

```sh
./build-apps.sh
```

**Run**

```sh
docker-compose up -d
```

## Build and the run apps manually

**Core**

```sh
cd core
npm install
```

**Client**

```sh
cd client
ionic cordova build <platform> --prod --release
```

Possible values of platform : `android`, `ios`, `browser`
Please refer to this documentation : https://ionicframework.com/docs/cli/commands/cordova-build.

## Author

👤 **bacarybruno**

* Github: [@bacarybruno](https://github.com/bacarybruno)
* LinkedIn: [@bacarybruno](https://linkedin.com/in/bacarybruno)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2018 [bacarybruno](https://github.com/bacarybruno).<br />

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
