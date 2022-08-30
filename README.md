# Image Lazer Back-End

This is the Back-end for our last semester's OOP project, an image sharing social networking site called "Image Lazer".

### Image Lazer Front-End

If you want to check out our Front-end codebase, click [here](https://github.com/NguyenAnhVuong/Image-Lazer-Frontend)

## Image Lazer Demo

<img width="1437" src="https://user-images.githubusercontent.com/92626813/187164106-73c95a43-a3ef-480f-88f9-b81d7de6c6d0.png">

### Build With

- [![Typescript][typescriptlang.org]][typescript-url]
- [![NestJS][nestjs.com]][nestjs-url]
- [![MongoDB][mongodb.com]][mongodb-url]
- [![SocketIO][socket.io]][socket-url]
- [![Eslint][eslint.org]][eslint-url]
- [![Git][gitscm.com]][git-url]
- [![Github][github.com]][github-url]

### Installation

1. Clone the repo

```sh
    git clone https://github.com/ngocban284/Image-Lazer-Backend.git
```

2. Install NPM packages

```sh
    npm install
```

3. Enter your Environment variables

```sh
    MONGO_USER = ""
    MONGO_PASSWORD = ""
    MONGO_HOST = ""
    MONGO_DATABASE = ""
    JWT_SECRET = ""
    JWT_REFRESHTOKEN = ""
    UPLOAD_LOCATION = ""
```

4. Run

```sh
    npm run start
```

## The Project

As this is a photo sharing social networking site, registration is needed for users to experience all of Image Lazer's features:

- Create your own albums of interests or hobbies
- Save people's posts to your albums for later inspirations
- Look into the details of a post
- Commenting on different posts, be it praises or criticisms.
- Follow people whose style you jam with
- Chat with your followers or people you followed
- And of course you can also change your personal information (avatar, interests, etc...)

...

### Project Architecture

<img width="1084" alt="Ảnh chụp Màn hình 2022-08-29 lúc 13 46 00" src="https://user-images.githubusercontent.com/92626813/187147352-332e50c1-392a-441d-8550-e7f2d1965edb.png">

- LIKE MODULE : Deals with the liking mechanisms.
- COMMENT MODULE : Provides commenting feature.
- POST MODULE : Handles user interactions with posts.
- ALBUM MODULE : Gives users the ability to create their own albums.
- FOLLOW MODULE : Provides users with following capability.
- SAVEPOST MODULE : Provides the function to save other people's posts to your album.
- USER MODULE: Provides login, logout, post posting, save post, comment, like, chat feature for users.
- CHAT MODULE : All things messaging related.

=>All modules will be included in APP MODULE to ensure the encapsulation of the application.

[typescriptlang.org]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[nestjs.com]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[nestjs-url]: https://nestjs.com/
[mongodb.com]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://www.mongodb.com/
[socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[socket-url]: https://socket.io/
[eslint.org]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[eslint-url]: https://eslint.org/
[gitscm.com]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[git-url]: https://git-scm.com/
[github.com]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/
