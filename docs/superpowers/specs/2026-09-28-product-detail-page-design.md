# Product Detail Page — sketch-aligned rebuild

**Date:** 2026-09-28  
**Surface:** Samantha Fab playground `/design?route=product&slug=…`  
**Status:** Approved for implementation (Approach A)

## Goal

Rebuild the shared PDP purchase panel to match the hand-drawn wireframe: dense commerce IA with Regular vs Ready-to-wear variants, coupons, share/WhatsApp, trust badges, and Recommended for you — while keeping existing product routes and bag/wishlist actions.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Approach | A — rebuild purchase panel to sketch order |
| Variants | Regular / Ready-to-wear cards **replace** size selector |
| Gallery | Product-driven 2-col grid, up to 6 real images (no fake duplicates) |
| Dropped chrome | Pincode delivery check, shipping callout box, offer/assurance card |
| Related | “Recommended for you”; up to 3 cards |

## Purchase panel order

1. Occasion tags (up to 2)  
2. Title + share  
3. Short expandable description  
4. Options available (colour swatches)  
5. Regular (+₹0) / Ready-to-wear (+₹70) variant cards  
6. SKU  
7. Price + compare-at + “Inclusive of all taxes”  
8. Coupons row  
9. Add to bag + wishlist + WhatsApp  
10. Buy it now (full width)  
11. Product Description accordion  
12. Shipping & return policy accordion  
13. Four customer trust badges  
14. Recommended for you

## Visual language

Whisper cream page, Lora title, Karrik UI, plum primary CTAs — match `/design` tokens. No rounded-card / purple-glow chrome. Variant cards are selectable bordered fields, not decorative marketing cards.

## Out of scope

Size guide, pincode check, fabric & care accordion (folded into Product Description copy).
