# Using the i2 Connect server

This project was bootstrapped using the `create-i2connect-server` package. It contains the i2 Connect server and a skeleton connector. This documentation contains some information about using the project to develop and distribute your own connectors.

## Running the server during development

After bootstrapping, the server and its connector are ready to run with no modifications. To run the server in development mode:

1. Install the packages that the server requires:

   ```
   npm install
   ```

2. Start the server, and build and start its connector:

   ```
   npm start
   ```

In this mode, the server monitors the project source files for changes and rebuilds the connector if necessary.

### Debugging the connector

During development, you can debug your connector with Visual Studio Code's built-in debugger. There are two commands to choose from:

- **Start i2 Connect development server and debug**

  This command starts the i2 Connect server and its connector, and launches the debugger at the same time. You don't need to run "`npm start`" before you start debugging.

- **Attach to i2 Connect development server**

  This option requires you to run "`npm start`" first, and then attach the debugger afterward.

#### Changing the debug port

By default, debugging take place on port 9229. To override this setting:

1. Add a command-line option to the `start` script in `package.json`. For example:

   ```json
   "scripts": {
     "start": "i2connect-scripts start --inspect=5858"
   }
   ```

   (For more details, see [https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options](https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options).)

2. In `.vscode/launch.json`, update the `"port"` field to match the number you specified in the script.

### Adding a connector

The `create-i2connect-server` package generates a single connector alongside the i2 Connect server. You can add another connector to the same project by running the following command:

```
npm run i2connect generate connector <name>
```

In a project that contains more than one connector, any build, start, or debug operation applies to all connectors simultaneously.

### Running `lint` on connector code

The i2 Connect server includes the facility to run `lint` over your project source files with the following command:

```
npm run i2connect lint
```

## Building and running the server manually

As well as the automated development mode described above, the i2 Connect server enables you to:

- Build the connectors without starting the server (to prepare for distribution, for example)
- Start the server and use the connectors as they were past built or deployed

To build the connectors and do nothing else:

```
npm run build
```

To serve connectors that have already been built:

```
npm run serve
```
