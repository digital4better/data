# Cloud map background

The simplified background in `world-map.json` is derived from Natural Earth, 1:110m countries (public domain):
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Downloaded 2026-09-08. Polygon coordinates are projected to an 800 × 400 equirectangular map, rounded to two decimals; Antarctica is omitted. Projection: x = (longitude + 180) / 360 × 800, y = (90 - latitude) / 180 × 400. Cloud locations use exactly the same projection. This is a display asset, not a published geography collection. No remote map service or tracking is used at runtime.
