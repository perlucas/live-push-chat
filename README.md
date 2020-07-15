# Live Pull Chat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

Live Chat using "Push" mechanism. User messages broadcasted using Sockets.io.

Different users and messages repositories have been created for increasing the backend storage performance by optimizing memory usage. This is done by using file storage instead of memory as well as chunks based mechanisms.

## Angular development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## NodeJS backend server

Run `npm run server` for the backend server (which holds the API). It uses `nodemon` for reloading the server after a change has been made.

