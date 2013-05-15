# Monty Hall Demo UI

This is a simple UI for the Monty Hall Problem demo shown in the SpringOne
2GX Technical Keynote by
[Adrian Colyer](http://www.springone2gx.com/conference/washington/2012/10/speakers/adrian_colyer),
as well as the [IOC + Javascript session](http://www.springone2gx.com/conference/washington/2012/10/session?id=27713).

To run:

* `npm install`
* `npm start`

Open your browser to http://127.0.0.1:8000

The Monty Hall Demo UI relies on a connection to a RESTful service at
https://monty-hall.cloudfoundry.com.  If you would like to run the app without
connecting to a remote server, you may use a mock service by opening
client/app/main.js and changing the gamApi component from:

```js
gameApi: { wire: 'app/game/rest' }
```

to the following:

```js
gameApi: { wire: 'app/game/fake' }
```

## License
Copyright (c) 2012 VMware
