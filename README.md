# Noads
## powered by puppeteer + chromium
This is a demo repo that can crawl all headlines of SPON (spiegel.de - a German news site). It uses some basics in abstraction and uses models, some modules and a basic SQL implementation. This will run locally or in a ***production environment***.

Check the package.json scripts node for some basic usage. Also read the code and stick to existing convetions and naming schemes and you'll be just fine! ES Lint runs too and will help you!

## Database stuff
I am using [knex.js](https://knexjs.org/), which can help out with migrations, utilize multiple drivers (sqlite for development!) and has a nice query builder that is well documented. With some common-sense you will be able to utilize it just like Eloquent by Laravel! Config can be found in `knexfile.js`

## Puppeteer
Puppeteer is a JS lib/framework that enables you to orchestrate and control an actual browser. For this project we are using a bunch of plugins and Chromium specifically as this yields the easiest results for us and helps getting around a lot of bot-detection tools. Puppeteer is well [documented](https://pptr.dev).

## Carousel.js
This is a wild and mystical tool, that can run in the background and just rotate proxies providedby BrightData (formerly known as luminati). Should you have a long list of proxies yourself or a different provider just read the script and adapt it. It is basically just:
- giev Proxy pls
- request (a bunch of times)
- request failed! :(
- change to next Proxy
- repeat failed request
- ???
- Profit