# ProjectW - A Dog Surveillence System

This project was created to allow my family to see and interact with my dog (who's name is Winston) over the internet. The goal was to create a server which would have security and practicality as the main priorities.

### Built With

* [Express](https://expressjs.com/) - The web framework used
* [Express-session](https://github.com/expressjs/session) - Cookie system used
* [OpenSSL](https://www.openssl.org/) - Used to aquire key and certificate for encryption using https
* [Socket.io](https://socket.io/) - Used to send stream of photos to client from server
* [OpenCV4NodeJS](https://www.npmjs.com/package/opencv4nodejs/v/4.1.0) - Used to have server take pictures from default webcam
* [play-sound](https://www.npmjs.com/package/play-sound) - To play sounds from server computer


### Prerequisites

* [node.js](https://nodejs.org/en/) - To run the server
* [NPM](https://www.npmjs.com/) - Dependency and Package Management


### Installing

After downloading the files, the dependencies must be installed using npm. In the cmd type

```
npm install
```

Once finished, you can run the server on your local machine by typing

```
node server.js
```

Once the server is running you can visit the site on your local machine at https://localhost:8080/

## Features

* Logging system to see when someone starts watching
* Camera is only on if someone is watching
* Username and Password are given to server using cookies which are encrypted using https
* Easy to set up with your ip address so you can portforward requests from clients through your router to the computer you are using as a server
* Entire server is designed with REST in mind

## Screenshots

### Login Screen
![LogIn](https://imgur.com/lQuIR99.png)

### Live Stream Page
![Stream](https://imgur.com/8g6h8Mb.png)
