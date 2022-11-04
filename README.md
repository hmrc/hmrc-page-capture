# hmrc-page-capture

Chrome extension to capture and save HTML pages and their associated .css files.

## Usage

To use this extension:

1. [Download](https://github.com/hmrc/hmrc-page-capture/archive/refs/heads/main.zip) the extension files (or clone it to
   make it easier to update)
2. If you downloaded the zip, unzip the files.
3. Open [chrome://extensions](chrome://extensions) in your __Chrome__ browser
4. Using the slider at the top right of the page enable ‘Developer mode’ (if it isn’t already)
5. Click ‘Load unpacked’ at the top left of the page, browse to where you downloaded the files and hit ‘Select’
6. The browser extension should now be enabled.
7. Visit a page within your service
8. Click the extension icon and to view any URLs captured or excluded.

## Development of extension

### Running Tests - on a local development machine

#### Initial Setup

Ensure [Jest](https://jestjs.io/) and [puppeteer](https://pptr.dev/) node packages are installed:

```bash
npm install
```

Run the following commands to start services locally:

```bash
docker run --rm -d --name mongo -d -p 27017:27017 mongo:4.0
sm2 --start PLATFORM_EXAMPLE_UI_TESTS
```

To run the tests execute:

```bash
npm test
```

To automatically re-run these tests when files change execute:

```bash
npm run test -- --watch
```

To exist `-watch`, press `q` to quit.

## License

This code is open source software licensed under
the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
