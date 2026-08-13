# KraveEat — Production-Ready Implementation Plan

## Current State Audit Summary

**Critical Bugs:**
1. Cart is completely disconnected: homepage stores only IDs with no quantities; checkout uses hardcoded static items. Adding to cart on homepage does nothing for checkout.
2. No cart persistence (lost on refresh).
3. Menu data duplicated 3 times with inconsistent descriptions across `app/page.tsx`, `app/menu/page.tsx`, `app/admin/page.tsx`.
4. Admin password (`process.env.PASSWORD`) is baked into client-side JS bundle.
5. `/api/notify` returns static JSON; does not actually send WhatsApp or email.
6. Image `imagewithlogo2.jpeg` is reused for both Burger and Shawarma in featured menu.
7. Admin "Incoming orders" section shows fake hardcoded data (Order #001 for Ada).
8. Checkout has no form validation.

**Missing Functionality:**
- No cart persistence, no quantity controls, no remove-from-cart on homepage.
- No real order storage or history.
- No loading/error/empty states.
- No mobile-optimized navigation drawer.
- No floating WhatsApp button.
- No toast notifications.
- No product availability enforcement (add to cart works even if unavailable).
- No server-side admin auth.

**Security Issues:**
- Admin password exposed to client bundle.
- Client-side-only auth via localStorage.
- No input sanitization on API route.

**Data Issues:**
- 3 separate hardcoded menu arrays.
- 14 public asset files for 7 unique assets (duplicated in `public/` and `public/assets/`).
- Type mismatch: `@types/react` v18 with React v19, `eslint-config-next` v14 with Next.js v16.

---

## Implementation Plan

### Phase 1: Foundation — Data Architecture & Shared Utilities

**Goal:** Establish one source of truth for menu data and shared utilities before touching any UI.

#### 1.1 Fix Package Dependencies
- Update `@types/react` to `^19.2.0` (or remove and rely on Next.js内置 types)
- Update `@types/react-dom` to `^19.2.0`
- Update `eslint-config-next` to `^16.2.10`
- Run `npm install` and verify.

#### 1.2 Create `lib/products.ts`
- Single source of truth for all menu items.
- Export `products` array with shape:
  ```ts
  type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    available: boolean;
    featured?: boolean;
    popular?: boolean;
  }
  ```
- Merge and normalize data from all 3 existing arrays. Resolve inconsistencies:
  - Classic Burger: use "Beef burger with lettuce, tomato, cheese and sauce."
  - Chicken Shawarma: use "Spiced chicken wrapped in soft pita with fresh toppings."
  - Loaded Fries: use "Golden fries topped with cheese, sauce and herbs."
  - Chicken & Chips: use "Crispy chicken served with fries and dip."
- Assign correct unique images to each product.
- Mark all as `available: true` initially.

#### 1.3 Create `lib/cart.ts`
- Cart context with React Context API.
- Cart state shape:
  ```ts
  type CartItem = {
    product: Product;
    quantity: number;
  }
  ```
- Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`, `getCartCount`.
- Persist cart to `localStorage` key `kraveat-cart`.
- Hydrate from `localStorage` on mount.
- Export `CartProvider` and `useCart` hook.

#### 1.4 Create `lib/whatsapp.ts`
- Utility function `generateWhatsAppOrderMessage(cartItems, customerName, customerPhone, customerAddress)`.
- Returns formatted message string:
  ```
  Hello KraveEat 👋

  I'd like to place an order.

  Customer: [name]
  Phone: [phone]
  Delivery address: [address]

  Order:
  • [Product Name] x[quantity] — ₦[total]
  • ...

  Total: ₦[grand total]

  Please confirm my order.
  ```
- Utility `getWhatsAppUrl(message)` → returns `https://wa.me/2349030707047?text=...`
- Centralize phone number in a constant `KRAVEAT_WHATSAPP_NUMBER = '2349030707047'`.

#### 1.5 Create `lib/utils.ts`
- `formatNaira(amount: number)` → `₦4,500`
- `cn(...classes)` for class merging if needed (or use simple template literals).
- `validate Nigerian phone number` helper.

#### 1.6 Clean Up Duplicated Assets
- Move all assets to a single canonical location: `public/assets/`.
- Delete duplicate files from root `public/`:
  - `/imagewithlogo1.png`
  - `/imagewithlogo2.jpeg`
  - `/imagewithlogo3.jpeg`
  - `/imagewithlogo4.jpeg`
  - `/imagewithlogo5.jpeg`
  - `/imagewithlogo6.mp4`
  - `/imagewithlogo7.mp4`
- Update all code references from `/assets/...` to `/assets/...` (they already use this, so just delete root duplicates).
- Remove `imagewithlogo7.mp4` if truly unused, or keep it if user wants to use it later. Actually keep it but remove the duplicate.
- Remove remotePatterns for Unsplash/Pexels from `next.config.js` since no remote images are used.

---

### Phase 2: Core Flow Fixes

**Goal:** Make the customer ordering journey actually work end-to-end.

#### 2.1 Wrap App in CartProvider
- Modify `app/layout.tsx` to wrap `{children}` in `<CartProvider>`.

#### 2.2 Update Header
- Import `useCart` and show cart count badge.
- Add WhatsApp link/button in header.
- Redesign mobile navigation: replace desktop-only links with a hamburger menu that opens a slide-in drawer.
- Drawer contains: Home, Menu, Checkout, WhatsApp CTA, Admin (if authorized).
- Keep header sticky with backdrop blur.

#### 2.3 Update Footer
- Add WhatsApp button/link.
- Add location details (South End Estate, Kyami District, airport road Abuja).
- Add phone number.
- Keep it minimal and clean.

#### 2.4 Redesign Homepage (`app/page.tsx`)
- Replace hardcoded `featuredMenu` with `products` from `lib/products.ts`.
- Import `useCart` and wire up Add to Cart buttons properly.
- Add cart preview section that reads from real cart state (item count, total).
- Fix image assignment so each product has the correct image.
- Add category quick-links section.
- Keep brand story section but refine copy.
- Ensure all CTAs use proper navigation or WhatsApp URLs.
- Add empty state for cart preview.

#### 2.5 Redesign Menu Page (`app/menu/page.tsx`)
- Replace `menuItems` with `products` from `lib/products.ts`.
- Import `useCart` and wire Add to Cart.
- Improve category filter: horizontal scroll on mobile, pill buttons on desktop.
- Add availability badge: "SOLD OUT" on unavailable items, disable Add to Cart.
- Add empty state when filter returns no results.
- Add quick "Order on WhatsApp" button per product (uses `generateWhatsAppOrderMessage` for single item).

#### 2.6 Fix Checkout Page (`app/checkout/page.tsx`)
- Remove hardcoded `cartItems`.
- Import `useCart` and read real cart.
- Add quantity controls (+ / -) and remove button for each cart item.
- Add empty cart state with link back to menu.
- Add form validation:
  - Name: required, min 2 chars
  - Phone: required, Nigerian format validation (starts with 090, 091, etc., 11 digits)
  - Address: required, min 5 chars
- Show real-time totals (subtotal, item count).
- On submit:
  1. Validate inputs.
  2. Generate WhatsApp message with real cart data.
  3. Open WhatsApp in new tab.
  4. Optionally call `/api/notify` with structured JSON.
  5. Show success state.
- Add loading state during submission.
- Persist cart clear only after successful order submission? Or clear immediately. Better: clear after WhatsApp opens.

---

### Phase 3: UI/UX Overhaul

**Goal:** Transform KraveEat into a premium, mobile-first food brand experience.

#### 3.1 Design System Tokens (`tailwind.config.ts`)
- Add more semantic colors:
  - `warm-white`: `#ffffff`
  - `warm-gray`: `#f5f0eb`
  - `text-primary`: `#4b2a14` (existing brown)
  - `text-secondary`: `#8b5e3c`
  - `accent`: `#f59e0b` (existing orange)
  - `accent-hover`: `#d97706`
  - `success`: `#16a34a`
  - `danger`: `#dc2626`
- Add consistent spacing scale if not already using Tailwind defaults.
- Add border radius scale: `xs: 0.5rem`, `sm: 0.75rem`, `md: 1rem`, `lg: 1.5rem`, `xl: 2rem`, `2xl: 2.5rem`.
- Add shadows: `shadow-warm` for card shadows.

#### 3.2 Typography (`app/globals.css` & Tailwind)
- Set base font to `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif` or keep Arial if no font imports allowed. Actually, to keep it simple and avoid external font loading issues, use system fonts but define clear type scales:
  - `text-hero`: `text-4xl sm:text-5xl lg:text-6xl font-black`
  - `text-heading`: `text-2xl sm:text-3xl font-black`
  - `text-subheading`: `text-lg font-bold`
  - `text-body`: `text-base`
  - `text-caption`: `text-sm text-brown/70`
- Add `@layer utilities` for consistent uppercase tracking: `.tracking-widest { letter-spacing: 0.25em; }`.

#### 3.3 Reusable Components
Create in `components/` directory:

- `components/ui/button.tsx`: Variants (primary/orange, secondary/brown, outline, ghost). Consistent padding, radius, font.
- `components/ui/badge.tsx`: Status badges (Available = green, Sold Out = red).
- `components/ui/input.tsx`: Styled input with label.
- `components/ui/card.tsx`: Base card with optional image slot.
- `components/product-card.tsx`: Reusable product card with image, name, price, description, availability, Add to Cart, WhatsApp quick-order.
- `components/cart-drawer.tsx`: Slide-in cart panel (mobile bottom-sheet, desktop side drawer). Shows items, quantities, totals, Checkout button, WhatsApp order button.
- `components/toast.tsx`: Toast notification for "Added to cart" feedback.
- `components/cart-count.tsx`: Small badge component for header.
- `components/mobile-nav.tsx`: Mobile slide-in navigation drawer.

#### 3.4 Homepage Redesign
- **Hero:** Split layout on desktop (text left, image grid right). On mobile, stacked. Large appetizing headline: "Your cravings called." Subheadline explaining what KraveEat sells and location. Two CTAs: "Browse Menu" (primary) and "Order on WhatsApp" (secondary).
- **Trust Strip:** Horizontal bar showing location, phone, delivery area.
- **Categories:** Horizontal scrollable chips on mobile, grid on desktop.
- **Best Sellers:** 4 product cards using `ProductCard` component.
- **Brand Story:** Concise section with video background or side-by-side image.
- **CTA Section:** "Ready to satisfy the craving?" with two buttons.

#### 3.5 Floating WhatsApp Button
- Fixed position bottom-right on mobile only.
- WhatsApp icon (SVG).
- Label "Order on WhatsApp".
- `bottom-6 right-4 z-40`.
- `safe-area-inset-bottom` padding.
- Hover animation (scale).

#### 3.6 Cart Drawer
- Triggered by header cart icon.
- Shows cart items with image, name, quantity controls, price.
- Subtotal at bottom.
- "Checkout" and "Order via WhatsApp" buttons.
- Empty state with illustration/text.
- Overlay backdrop.
- Close on overlay click, Escape key, or close button.

#### 3.7 Toast Notifications
- Show when item added to cart.
- Auto-dismiss after 2 seconds.
- "Added to cart" + product name.
- Stack multiple toasts if needed.

---

### Phase 4: Admin & API Improvements

**Goal:** Make admin functional and secure. Make API route meaningful.

#### 4.1 Server-Side Admin Auth
- Create `app/api/admin/verify/route.ts`:
  - Accepts password in body.
  - Compares against `process.env.ADMIN_PASSWORD` (server-side only).
  - Returns a signed session token or simple success.
  - Never exposes whether password is correct in a way that aids brute force (return generic error).
- Create `app/admin/layout.tsx` or protect `/admin` via middleware? Since we want minimal complexity:
  - Modify `app/admin/page.tsx` to be a Server Component? No, it needs interactivity.
  - Better: Create `app/admin/login/page.tsx` as server component that calls API, then `app/admin/page.tsx` checks a secure httpOnly cookie set by the API.
  - Actually, simplest secure approach: `app/admin/page.tsx` calls `/api/admin/verify` with password, API returns `{ ok: true }` or `{ ok: false }`, and the client stores a flag. But this is still client-side verification.
  - Better approach: Use Next.js middleware to protect `/admin` by checking an httpOnly cookie. Set cookie via API route.
  - For this small project, implement:
    1. `app/api/admin/login/route.ts` — accepts password, verifies against env var, sets `httpOnly` cookie `kraveat-admin-session` with a random value stored server-side (or just a signed token).
    2. `middleware.ts` — protects `/admin` route, redirects to `/admin/login` if cookie missing.
    3. `app/admin/login/page.tsx` — simple login form.
    4. `app/admin/page.tsx` — dashboard (still client component for interactivity).
    5. `app/api/admin/logout/route.ts` — clears cookie.
- Remove all client-side password checks and localStorage auth flags.
- Remove `process.env.PASSWORD` from client code entirely.

#### 4.2 Admin Dashboard Improvements
- Read products from Supabase (if configured) or from `lib/products.ts`. Since we want one source of truth, admin should ideally write to Supabase. But to keep it simple and functional without Supabase, we can:
  - If Supabase is configured: fetch products from Supabase `menu_items` table.
  - If not: fallback to reading/writing a JSON file or keep localStorage as fallback.
- Actually, the simplest production-ready approach for a small restaurant without a full backend:
  - Admin writes to Supabase Storage (images) + Supabase database (products).
  - If Supabase is unavailable, admin changes are not persisted (show warning).
- But this requires Supabase database tables. Let's design minimal Supabase schema:
  - `menu_items`: id, name, category, price, image, description, available, created_at
  - `orders`: id, customer_name, customer_phone, customer_address, items (json), total, status, created_at
- Admin page features:
  - Product list with image, name, price, availability toggle, delete.
  - Add product form with image upload (Supabase Storage).
  - Orders list with status badges (NEW, CONFIRMED, PREPARING, READY, OUT FOR DELIVERY, COMPLETED, CANCELLED).
  - Status update dropdown per order.
- Remove fake "Incoming orders" hardcoded data.

#### 4.3 API Route Improvements
- Update `app/api/notify/route.ts`:
  - Accept structured payload: `{ customerName, customerPhone, customerAddress, items: [{ id, name, quantity, price }], total }`.
  - Validate payload.
  - Sanitize inputs (strip HTML, limit lengths).
  - Generate order ID (UUID or timestamp-based).
  - If Supabase is configured: insert order into `orders` table.
  - Return structured JSON with `{ ok: true, orderId, whatsappUrl }`.
  - If Supabase is not configured: return `{ ok: true, orderId, whatsappUrl, warning: 'Order not persisted' }`.
- Do NOT claim to send email/SMS if not actually doing so.

#### 4.4 Order Creation Flow
- Checkout page calls `/api/notify` with structured data.
- If API returns success, clear cart and open WhatsApp.
- If API fails, show error state and do NOT open WhatsApp until retry.

---

### Phase 5: Polish, SEO & QA

**Goal:** Production-ready quality.

#### 5.1 SEO & Metadata
- Update `app/layout.tsx` metadata:
  - Title: "KraveEat | Fast Food in Abuja — Burgers, Shawarma, Loaded Fries"
  - Description: "Order delicious fast food in Abuja. KraveEat serves burgers, shawarma, loaded fries, chicken & chips and more. Fast delivery to South End Estate and surrounding areas."
  - Add Open Graph: `title`, `description`, `url`, `siteName`, `images: [{ url: '/assets/imagewithlogo1.png', width: 1200, height: 630 }]`, `locale: 'en_NG'`.
  - Add `metadataBase`: `new URL('https://kraveat.com')` (or placeholder).
- Add `app/sitemap.ts`.
- Add `app/robots.ts`.
- Add JSON-LD structured data for Restaurant in `app/layout.tsx`.

#### 5.2 Accessibility
- Ensure all interactive elements have focus states (Tailwind `focus:ring-2 focus:ring-orange focus:ring-offset-2`).
- Add `aria-label` to icon-only buttons (cart, mobile menu toggle, close buttons).
- Use semantic HTML: `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`.
- Ensure form inputs have associated `<label>` elements.
- Ensure color contrast meets WCAG AA (brown on cream, white on orange/brown — verify).
- Add `prefers-reduced-motion` media query to disable animations.

#### 5.3 Performance
- Use `next/image` with proper `sizes` attribute for responsive images.
- Add `loading="lazy"` to below-the-fold images.
- Lazy-load video with `loading="lazy"` and preload="none".
- Ensure no unnecessary client-side re-renders (memoize cart calculations where needed).
- Remove unused dependencies if any.

#### 5.4 Mobile Testing Checklist
- Test at 320px, 375px, 390px, 414px, 768px, 1024px, 1280px+.
- Verify no horizontal overflow.
- Verify touch targets are min 44x44px.
- Verify inputs are readable and tappable.
- Verify mobile nav drawer works smoothly.
- Verify floating WhatsApp button doesn't overlap critical UI.

#### 5.5 Environment Variables
Update `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_PASSWORD=
```

Add `.env.local` with actual values (not committed).

---

## File Change Summary

### New Files to Create
- `lib/products.ts`
- `lib/cart.tsx` (or `lib/cart-context.tsx`)
- `lib/whatsapp.ts`
- `lib/utils.ts`
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/product-card.tsx`
- `components/cart-drawer.tsx`
- `components/toast.tsx`
- `components/cart-count.tsx`
- `components/mobile-nav.tsx`
- `app/api/admin/verify/route.ts`
- `app/api/admin/login/route.ts`
- `app/api/admin/logout/route.ts`
- `app/admin/login/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`

### Files to Modify
- `package.json` (dependencies)
- `tailwind.config.ts` (design tokens)
- `app/globals.css` (typography, utilities)
- `app/layout.tsx` (metadata, CartProvider wrapper)
- `components/header.tsx` (cart count, WhatsApp, mobile nav)
- `components/footer.tsx` (WhatsApp, location)
- `app/page.tsx` (use cart context, real products, redesigned UI)
- `app/menu/page.tsx` (use cart context, real products, filters, availability)
- `app/checkout/page.tsx` (real cart, validation, WhatsApp, states)
- `app/admin/page.tsx` (server-side auth, Supabase integration, remove fake orders)
- `app/api/notify/route.ts` (structured validation, Supabase order creation)
- `lib/supabase.ts` (keep, but ensure it's used properly)
- `next.config.js` (remove remotePatterns)
- `.env.example` (add ADMIN_PASSWORD)

### Files to Delete
- Root duplicates in `public/`: `imagewithlogo1.png`, `imagewithlogo2.jpeg`, `imagewithlogo3.jpeg`, `imagewithlogo4.jpeg`, `imagewithlogo5.jpeg`, `imagewithlogo6.mp4`, `imagewithlogo7.mp4`

---

## Validation & Testing Plan

1. **Lint:** `npm run lint` — must pass with zero errors.
2. **Build:** `npm run build` — must succeed with zero errors.
3. **Start:** `npm run start` — app must load.
4. **E2E Flow Test:**
   - Homepage loads, hero visible, CTAs work.
   - Navigate to Menu, see all products.
   - Filter by category works.
   - Click "Add to Cart" on 2 products → cart count updates in header.
   - Click cart icon → drawer opens, shows items with correct quantities.
   - Adjust quantities, remove item.
   - Click "Checkout" → checkout page shows exact cart contents.
   - Fill form with Nigerian phone number → submit → WhatsApp opens with correct message.
   - Verify message contains correct name, phone, address, products, quantities, prices, total.
   - Empty cart: checkout shows empty state.
   - Unavailable item: Add to Cart is disabled, product is muted.
   - Mobile: hamburger menu opens, cart drawer works, floating WhatsApp button visible.
   - Admin: navigate to `/admin/login`, enter password, access dashboard, add item, toggle availability, see changes reflected on menu page.
   - Image upload: upload image in admin, verify URL is saved and image displays.

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| Supabase not configured | All features gracefully degrade without Supabase. Cart works via localStorage. Admin warns if Supabase missing. |
| Type mismatches after deps update | Run `npm install` and fix any TypeScript errors immediately. |
| Asset paths break after cleanup | Search all files for `/imagewithlogo` before deleting, update any hardcoded paths. |
| Admin auth complexity | Keep it simple: password + httpOnly cookie via API + middleware. No complex JWT. |
| WhatsApp message length limits | Keep message concise; test with max cart items (e.g., 5-6 items). If too long, truncate gracefully. |
| localStorage quota | Cart is small; quota won't be exceeded. If needed, compress or limit to 50 items. |

---

## Open Questions / Assumptions

1. **Supabase database:** The plan assumes Supabase tables (`menu_items`, `orders`) may be created, but the app must work without them. If the user does not want Supabase database tables, admin changes can be localStorage-only and orders can be API-only (no DB). The plan covers both paths.
2. **Actual product images:** The plan uses existing `imagewithlogo` assets. If the user has other images, they can be dropped in `public/assets/`.
3. **Delivery fees:** No delivery fee logic is added unless specified. Total = sum of item prices.
4. **Payment integration:** Not requested. Order is via WhatsApp only.
5. **Social media:** No social links added unless real accounts exist.
6. **Admin image upload:** Works only if Supabase Storage bucket `food-images` exists and env vars are set. Otherwise falls back to console warning.

---

## Next Steps for Implementation Agent

1. Start with Phase 1 (Foundation). Create the shared utilities and data layer first.
2. Then Phase 2 (Core Flow). Fix the broken cart and checkout.
3. Then Phase 3 (UI Overhaul). Build components and redesign pages.
4. Then Phase 4 (Admin & API). Secure admin and wire up order persistence.
5. Finally Phase 5 (Polish). SEO, accessibility, testing.

Do not skip phases. Each phase depends on the previous one.
