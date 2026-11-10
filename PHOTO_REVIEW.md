# Recipe photography status

This site contains 80 locally curated recipes. Nine have bundled local food photographs.
The other 71 have an automatic Wikimedia Commons lookup, with the original illustrations
as an offline fallback. The Commons search checks file titles and permissive licenses,
but **cannot guarantee that a returned image depicts the precise dish**. Please visually
review the results before publishing. Images retrieved at runtime require internet access.

To save images permanently on your computer, run:

    python -m pip install requests pillow
    python scripts/fetch-commons-photos.py

Then inspect PHOTO_REVIEW.csv and public/image-credits.json. The downloader only
accepts sufficiently matched search results; some recipes may remain illustrations.
Individual Wikimedia Commons image licenses and attribution requirements apply.

The public DummyJSON REST API is still used to fetch additional recipes.
