# Purpose

Files in this folders serves as base to generate both `../data/countries.json` and `../data/world.json` files. The transformation process is done with `npm run transform-data`.

## Files

- `countries-fallbacks.json`: mapping of name present in `world.json` and uris present in `countries.json`. This is used to bridge the gap when there is no matching found between those 2 files.
- `countries.json`: Base concept scheme that contains all countries as define by the european publications office.
- `missing-countries.json`: list of countries present in `countries.json` that didn't find a match in `world.json`. Generated for documentation/debugging purposes.
- `missing-geojson.json`: list of countries present in `world.json` that didn't find a match in `countries.json`. Generated for documentation/debugging purposes.
- `world.json`: raw file taken from https://echarts.apache.org/examples/data/asset/geo/world.json to be used with the charting library.

## Logic

For the generated files in data/, here are the expected logic:

- `data/countries.json`: same as local `countries.json`, but without countries that didn't have a match in `world.json`.
- `data/world.json`: same as local `world.json`, but without countries that didn't have a match in `countries.json`. In additions, the names are replaced by uris.
