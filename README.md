# ds-landuse
Decision Support Tool for Land Use related to the `Ike Wai project.  Using the IKE platform APIs.

## Build & development
npm install

bower install

Run `grunt` for building and `grunt serve` for preview.

You will probably want to run `bower install` if there is no bower_components folder generated for the dependencies by grunt
`yarn install` may also work.

You will need to change the line:

```
$localStorageProvider.set('token', 'mytoken');
```
 
in the app/scripts/app.js and replace with your API token

## Testing

Running `grunt test` will run the unit tests with karma.
