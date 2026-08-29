# NOVA — Premium Capstone / Work 5

A polished production-style e-commerce catalog built with vanilla HTML, CSS and JavaScript.

## Included
- Premium 3D hero product
- Responsive storefront
- Home / Collection / Studio routes
- Product search and category filters
- Product quick-view modal
- Add to bag
- Quantity controls
- Remove items
- Persistent cart with localStorage
- Cart drawer with subtotal
- Checkout interaction feedback
- Dark/light theme persistence
- Lazy-loaded product images
- Deferred JavaScript
- CSS-only visual effects
- Mobile/tablet/desktop architecture
- Accessibility-friendly controls
- Reduced-motion support

## Routes
- `#/home`
- `#/shop`
- `#/about`

## Deploy
### Vercel
Import the GitHub repository into Vercel. Framework: Other. Build command: empty. Output: `.`.

### Netlify
Import the repository or use Netlify Drop. Build command: empty. Publish directory: `.`.

### Render
Create a Static Site. Build command: empty. Publish directory: `.`.

## Production note
The checkout is intentionally a front-end demo. A real commerce application would connect a backend/database and a payment provider.

Product imagery uses optimized Unsplash URLs. For a fully self-contained production deployment, replace them with owned/approved WebP or AVIF files inside `assets/`.
