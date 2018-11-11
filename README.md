# Skygear JS Chat Demo

This demo shows you how to create a chat app using Skygear Server with the chat
plugin. Using the chat plugin allows you to focus on making your app great
rather than backend implementation details.

This demo is implemented in JS. In this demo, you will see how a JS
app can make use of [chat-SDK-JS][] to make a simple chat app.

## Demonstrated Features

* User sign-up and log-in using Skygear user account
* Search for other users using username
* Create a direct messaging conversation with other users
* Create a multi-user conversation
* Add and remove participants
* Send messages in a conversation
* Receive messages
* Show whether messages are received by other users
* Display a typing indicator when other users are typing

## Getting Started

Before you start, make sure you have [npm][] installed. You can get
[npm][] using your system's package manager or follow [this guide][npm install].

You also need to configure your Skygear Server with the [chat plugin][].
The easiest way to get started is to sign up an account on
[Skygear Cloud][skygear cloud]. See our [documentation][skygear doc]
for more detail.

To try out this demo:

1. Clone this repository
2. In the project directory, retrieve the submodules and npm dependencies by following
```
git submodule init
git submodule update
cd chat-SDK-JS && npm install && cd ..
npm install
```
3. Run `npm run config` to configure your skygear endpoint & API key.
4. Run `npm run build` to build the demo app.
5. Run `npm start` to open the chat app in your browser!

For quick demo, we have deployed [demo](http://reactchatdemo.skygeario.com/static/login.html).


[chat-SDK-JS]: https://github.com/SkygearIO/chat-SDK-JS
[npm]: https://www.npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-node
[chat plugin]: https://github.com/SkygearIO/chat/
[Skygear Cloud]: https://portal.skygear.io/
[skygear doc]: https://docs.skygear.io/
