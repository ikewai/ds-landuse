# ds-landuse

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

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
