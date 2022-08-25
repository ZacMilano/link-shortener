# <strong>This is <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>.</strong>

<img src="https://thecozycook.com/wp-content/uploads/2021/06/Salsa-Recipe-f-500x375.jpg" width="100px" alt="Salsa (not ZALSA, but close!)" />

<br />

## To install <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>:

```
cd server && yarn && cd ../web-ui && yarn && cd ..
```

<br />

## To run <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>:

1. [Install](#to-install-zalsa) <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>.
2. Open two terminals, both of which have their working directory set to the repo's root directory.
3. In the first terminal, run the following command:

```
cd server && yarn serve
```

4. In the second terminal, run the following command:

```
cd web-ui && yarn start
```

Then, go to your favorite web browser, or Google Chrome if it's not your favorite web browser, and go to [http://localhost:3000](http://localhost:3000). This should happen automatically with the second command, but if not, go ahead and do it now.

<br />

## To test <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>:

The back-end server is the main component with tests. The UI has its testing framework set up, but the tests are incomplete. Granted, the UI is quite simple.

### To test the back-end server:

1. [Install](#to-install-zalsa) <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>.
2. Run the following command from the `server/` directory:

```bash
yarn test
```

3. Examine coverage. To view a coverage report post-testing in greater detail, run the following command from the `server/` directory (where you already should be):

```bash
open coverage/lcov-report/index.html
```

### To test the UI:

1. [Install](#to-install-zalsa) <abbr title="Zac's Amazing Link Shortener App">ZALSA</abbr>.
2. Accept that there is only one measly test.
3. Run the following command from the `web-ui/` directory:

```bash
yarn test
```
