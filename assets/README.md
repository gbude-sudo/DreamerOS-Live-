# Brand assets

Canonical DreamerOS brand assets for this repository.

- `mark.png` - the DreamerOS rainbow fingerprint mark (canonical, also used
  on the public site at dreameros.app).
- `logo.svg` - vector favicon glyph, for small/inline use.
- `social-preview.png` - 1280x640 card for GitHub social preview and link
  unfurls. Upload it at Settings -> General -> Social preview.
- `social-preview.gen.py` - the retained source that regenerates the card
  from `mark.png`, so the card does not drift on future edits.

To regenerate the card: `python3 social-preview.gen.py` (needs Pillow and
the Outfit font; point OUTFIT_TTF at it or it falls back to a system sans).
