[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-middleware-lrep-flex

Custom UI5 middleware extension for handling requests to [SAPUI5 Flexibility Services](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.11/en-US/a8e55aa2f8bc4127923b20685a6d1621.html) / [Layered Repository](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.11/en-US/9e6305746b8742f69faa55fae27ee220.html).

## Prerequisites

Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/).

## Getting started

### Install

#### Add custom middleware

Add the custom middleware as a _devDependency_ to your project.

With `yarn`:

```shell
yarn add -D ui5-middleware-lrep-flex
```

Or `npm`:

```shell
npm i -D ui5-middleware-lrep-flex
```

Additionally the custom middleware needs to be manually defined as a _ui5 dependency_ in your project's `package.json`:

```json
{
  "ui5": {
    "dependencies": [
      "ui5-middleware-lrep-flex"
    ]
  }
}
```

### Register

Register the custom middleware in your project's `ui5.yaml`:

```yaml
server:
  customMiddleware:
  # layered respository / flexibility
  - name: ui5-middleware-lrep-flex
    afterMiddleware: compression
    configuration:
      # enable middleware
      enable: true
      # show debug logs
      debug: true
      # handle e.g. GET /sap/bc/lrep/flex/data/bookshop.ui.Component?appVersion=1.0.0&sap-language=en
      component:
        # path for .change files
        changesPath: webapp/changes
        # data to be merged to each .change file
        changeData:
          support:
            user: "SAP"
          validAppVersions:
            creation: "1.0.0"
            from: "1.0.0"
            to: "1.0.0"
        # data to be merged and sent for each response
        data:
          settings:
            isKeyUser: true
            isAtoAvailable: false
            isProductiveSystem: false
```

## Supported Requests

As of now the following requests are being handled by the custom middleware.

More handlers might be added in the future.

### Get component data

Example request: `GET /sap/bc/lrep/flex/data/bookshop.ui.Component?appVersion=1.0.0&sap-language=en`

E.g. [Fiori Elements](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/202009.000/en-US/03265b0408e2432c9571d6b3feb6b1fd.html) applications will trigger this request amongst other things to fetch any [UI Adaption changes](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/202009.000/en-US/0d2f1a9ebd2d4a4c906216ded1d33783.html) done for the application.

Normally these `.change` files will be stored under `webapp/changes`.

The custom middleware will collect and read all `.change` files and will send the appropriate response:

```javascript
{
  "changes": [
    {
      // content of first .change file
    },
    {
      // content of second .change file
    },
    // ...
  ]
}
```

**Additional remarks:**

Handling this request _server-side_ in the custom middleware eliminates the need for any _client-side_ handling and workarounds e.g. `changes_preview.js`.

To make sure your changes are being applied correctly simply include library `sap.ui.fl` in `data-sap-ui-libs` when [bootstraping your app](https://sapui5.hana.ondemand.com/#/topic/a04b0d10fb494d1cb722b9e341b584ba):

```html
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- i18n title -->
	<title>{{appTitle}}</title>
  <!-- load ushell config -->
  <script id="sap-ushell-config" src="./sap-ushell-config.js"></script>
  <!-- bootstrap ushell sandbox -->
	<script id="sap-ushell-bootstrap" src="/test-resources/sap/ushell/bootstrap/sandbox.js"></script>
  <!-- bootstrap the UI5 core library -->
	<script
    id="sap-ui-bootstrap"
    src="/resources/sap-ui-core.js"
    data-sap-ui-libs="sap.ui.core, sap.m, sap.suite.ui.generic.template, sap.ushell, sap.ui.fl"
    data-sap-ui-resourceroots='{
      "bookshop.ui": "../"
    }'
    data-sap-ui-onInit="module:bookshop/ui/test/flpSandboxMockServer"
    data-sap-ui-theme="sap_fiori_3_dark"
    data-sap-ui-compatVersion="edge"
    data-sap-ui-async="false"
    data-sap-ui-language="en-US"
    data-sap-ui-frameOptions="allow">
	</script>
</head>
<body id="content" class="sapUiBody">
  <!-- content will rendered here -->
</body>
</html>
```

You should also include the `sap.ui.fl` library for development in your `ui5.yaml` when [consuming SAPUI5 libraries](https://sap.github.io/ui5-tooling/pages/SAPUI5/):

```yaml
specVersion: "2.2"
metadata:
  name: bookshop.ui
type: application
framework:
  name: SAPUI5
  version: "1.82.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.suite.ui.generic.template
    - name: sap.ushell
      development: true
    - name: sap.ui.fl
      development: true
    - name: themelib_sap_fiori_3
      development: true
```

### Additional configuration

The custom middleware accepts the following `configuration` options:

| name                     | type    | description                                  | mandatory | default          |
|:------------------------:|:-------:|:--------------------------------------------:|:---------:|:----------------:|
| `enable`                 | boolean | enable/disable middleware                    | no        | `true`           |
| `debug`                  | boolean | enable/disable debug logs                    | no        | `false`          |
| `component`              | object  | configuration for component request handler  | no        | `{}`             |
| `component.changesPath`  | string  | path of `.change` files                      | no        | `webapp/changes` |
| `component.changeData`   | object  | data to be merged to each `.change` file     | no        | `{}`             |
| `component.data`         | object  | data to be merged and sent for each response | no        | `{}`             |

## Example app

Please have look at [bookshop-ui](https://github.com/pwasem/bookshop-ui).
