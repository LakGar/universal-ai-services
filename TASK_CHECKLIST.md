# Task Checklist

## ✅ Tasks to Complete

### 1. Hero Robots - Add Both Buy and Rent Options

**Status:** ⏳ Pending

- [ ] Modify `components/landing/hero.tsx` to include both buy and rent products
- [ ] Update `transformRobots()` function to combine buy and rent data
- [ ] Add logic to show both buy and rent buttons/links on robot cards
- [ ] User will select which specific products to show
- **Files to modify:**
  - `components/landing/hero.tsx`
  - `components/ui/robot-cards.tsx` (if needed)
  - `components/ui/robot-cards-mobile.tsx` (if needed)

### 2. Fix Image Carousel for Mobile View

**Status:** ✅ Completed

- [x] Fix landscape video display on mobile in `components/ui/framer-carousel.tsx`
- [x] Adjust video container height for mobile (now uses `aspect-video` with `max-h-[700px]`)
- [x] Ensure videos maintain aspect ratio on mobile (uses `object-contain` on mobile, `object-cover` on desktop)
- [x] Test on various mobile screen sizes
- **Files modified:**
  - `components/ui/framer-carousel.tsx`

### 3. Create About Page with LinkedIn Text

**Status:** ✅ Completed

- [x] Create `app/about/page.tsx`
- [x] Add LinkedIn profile information (all leadership team members have LinkedIn links)
- [x] Include company/about information (Overview, Leadership, Lab sections)
- [x] Link from navbar/footer (added to navbar navigation)
- **Files created:**
  - `app/about/page.tsx`

### 4. Remove Company-Based Filtering

**Status:** ⏳ Pending

- [ ] Remove manufacturer filters from `app/services/buy/page.tsx`
- [ ] Remove manufacturer filters from `app/services/rent/page.tsx`
- [ ] Keep model filters on buy page (G02, G1, R1, H1)
- [ ] Update UI to remove filter buttons
- **Files to modify:**
  - `app/services/buy/page.tsx`
  - `app/services/rent/page.tsx`

### 5. Change Images for Nova Tech Products

**Status:** ⏳ Pending

- [ ] Identify Nova Tech products in data files
- [ ] Update image URLs for Nova Tech products
- [ ] Verify images load correctly
- **Files to modify:**
  - `app/data.json` (for rentals)
  - `app/services/buy/data/buy_data.json` (for buy products)

### 6. Fix Mobile Errors for Consultation Pages

**Status:** ⏳ Pending

- [ ] Check mobile-specific errors in consultation modals
- [ ] Fix layout issues on mobile
- [ ] Ensure Calendly widget displays correctly on mobile
- [ ] Test all consultation modals on mobile:
  - `components/consultation-modal.tsx`
  - `components/addon-consultation-modal.tsx`
  - `components/contact-modal.tsx`
  - `components/landing/hero.tsx` (consultation modal)
- **Files to modify:**
  - `components/consultation-modal.tsx`
  - `components/addon-consultation-modal.tsx`
  - `components/contact-modal.tsx`
  - `components/landing/hero.tsx`

---

## 📝 Notes

- Hero robots: User will specify which products to show after implementation
- Mobile carousel: Videos are landscape, need responsive height adjustments
- About page: Should include LinkedIn profile link and company information
- Filtering: Remove manufacturer/company filters, keep model filters on buy page
- Nova Tech: Need to identify which products are Nova Tech and update their images
- Mobile consultation: Check for overflow, z-index, and layout issues
