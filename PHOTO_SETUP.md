# Finish the recipe photographs

This package retains the existing photos and includes an automated Wikimedia Commons image downloader. It has **not** already downloaded the remaining photographs.

From the `craveit` folder, with an internet connection:

```bash
python -m pip install requests pillow
python scripts/fetch-commons-photos.py
npm install
npm run dev
```

Review `PHOTO_REVIEW.csv` and inspect each image visually. Commons searches are imperfect: a similarly named photo may not show the exact dish. The downloader only selects Commons images with a recognizable open license and writes photo credits to `public/image-credits.json`. Verify license details and credit obligations on the linked Commons file pages before publishing. Failed searches retain the original image rather than silently inserting a mismatched photo. You may need to source rare dishes manually.
