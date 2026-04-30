# Exporting SVGs to PNG

All brand assets are in SVG format for perfect scaling. To export to PNG for platforms that require raster images, use one of these methods:

## Using rsvg-convert (recommended)
```bash
# Install: brew install librsvg
rsvg-convert -w 400 -h 400 social/profile-picture.svg > social/profile-picture-400.png
rsvg-convert -w 1500 -h 500 social/twitter-banner.svg > social/twitter-banner.png
rsvg-convert -w 1584 -h 396 social/linkedin-banner.svg > social/linkedin-banner.png
rsvg-convert -w 820 -h 312 social/facebook-cover.svg > social/facebook-cover.png
rsvg-convert -w 1200 -h 630 web/og-image.svg > web/og-image.png
rsvg-convert -w 16 -h 16 favicon/favicon-16.svg > favicon/favicon-16.png
rsvg-convert -w 32 -h 32 favicon/favicon-32.svg > favicon/favicon-32.png
rsvg-convert -w 180 -h 180 favicon/apple-touch-icon.svg > favicon/apple-touch-icon.png
rsvg-convert -w 192 -h 192 logo/icon-primary.svg > logo/icon-192.png
rsvg-convert -w 512 -h 512 logo/icon-primary.svg > logo/icon-512.png
```

## Using Inkscape
```bash
inkscape -w 400 -h 400 social/profile-picture.svg -o social/profile-picture-400.png
```

## Using browser
Open any SVG in Chrome, right-click > Inspect > screenshot node, or use online tools like svgtopng.com

## Asset Index

### Logo Variations
| File | Purpose |
|------|---------|
| `logo/icon-primary.svg` | Primary icon (dark background, rounded square) |
| `logo/icon-light-bg.svg` | Icon for light/white backgrounds |
| `logo/icon-monochrome-white.svg` | White-only version (for overlays, watermarks) |
| `logo/lockup-horizontal-dark.svg` | Icon + "Shieldra" text, horizontal, dark bg |
| `logo/lockup-horizontal-light.svg` | Icon + "Shieldra" text, horizontal, light bg |
| `logo/lockup-stacked-dark.svg` | Icon above text, vertical layout, dark bg |

### Favicons
| File | Size | Purpose |
|------|------|---------|
| `favicon/favicon-16.svg` | 16x16 | Browser tab (tiny) |
| `favicon/favicon-32.svg` | 32x32 | Browser tab (standard) |
| `favicon/apple-touch-icon.svg` | 180x180 | iOS home screen |

### Social Media
| File | Dimensions | Platform |
|------|-----------|----------|
| `social/profile-picture.svg` | 400x400 | All platforms (profile pic) |
| `social/twitter-banner.svg` | 1500x500 | Twitter/X header |
| `social/linkedin-banner.svg` | 1584x396 | LinkedIn cover |
| `social/facebook-cover.svg` | 820x312 | Facebook cover photo |

### Web
| File | Dimensions | Purpose |
|------|-----------|---------|
| `web/og-image.svg` | 1200x630 | Open Graph / link previews |

### Email
| File | Dimensions | Purpose |
|------|-----------|---------|
| `email/email-header.svg` | 600x120 | Email header banner |

## Brand Colors
- **Primary Background**: `#0C1222` to `#162032` (gradient)
- **Accent Cyan**: `#22D3EE` to `#0EA5E9` (gradient)
- **Shield Stroke**: `#06B6D4` to `#3B82F6` (gradient)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#94A3B8`
