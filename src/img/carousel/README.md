# Home-page carousel

Drop files **in this folder** to control the home-page carousel (both the
desktop carousel and the mobile slideshow). The files show up **in filename
order**, so name them so they sort the way you want.

## How to add

- **A photo** — add one image: `01.jpg`
  (`.jpg`, `.jpeg` or `.png`; it's automatically compressed to WebP on build.)

- **A video** — add the clip **and** a cover image with the **same name**:
  `02.mp4` + `02.jpg`
  The cover is what shows in the strip; the video plays when that card is
  centred. (A `.mp4` with no matching cover image is ignored.)

## Ordering

Order = filename, sorted naturally. Use zero-padded numbers so the order is
obvious and stays correct past 9:

```
01.jpg
02.jpg
03.mp4
03.jpg      ← cover for 03.mp4
04.jpg
```

## Notes

- Leave this folder empty (just this README) to fall back to the **automatic**
  order — one photo + one video per artist, alternating.
- Cards from this folder are **not tied to an artist**, so clicking one just
  centres it (it won't open an artist profile). The automatic carousel does
  open profiles.
- To reorder, just rename the files. To remove one, delete it.
