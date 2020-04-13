# ipm-hpc-v2-webviewer

Interactive Visualization of MPI Performance Data (Bachelor Thesis)

This is the standalone webviewer, as a complement to the standalone desktop app which can be found [here](https://github.com/raptox/ipm-hpc-v2).

To deploy this on your webserver, for easy sharing, first you have to add the parsed JSON files into the **src** folder (there are already some JSON files to serve as an example). After that you have to import your JSON files into the app. For this you have to edit `App.js`, found in the **src** folder (or click [here](https://github.com/raptox/ipm-hpc-v2-webviewer/blob/master/src/App.js) to edit it directly). After you have imported your JSON, you also have to link to it, just add a line at line **189** with the new link. `App.js` already contains examples, so it should be straight forward.

You can run `npm start` to start a development test webserver and see if it worked out. If it works, then just run `npm build` and copy the content of the **build** folder to your own webserver.

## Available Scripts

In the project directory, you can run:

### `npm install`

Run this command only once after you cloned the project, to install necessary all dependencies.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
