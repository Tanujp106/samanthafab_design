# Storefront scenario review

This repository is a static Samantha Fab storefront prototype. Checkout, payment, account creation, live inventory and order fulfilment have no backend here; their real end-to-end outcomes require the production commerce integration.

| Scenario | Current handling | Verification |
| --- | --- | --- |
| Empty / filled wishlist | Empty guidance and product grid with saved count | Existing commerce tests |
| Empty / filled bag | Empty bestsellers rail and populated lines with subtotal | Existing commerce tests; store scenario test |
| Search with results / no results | Filtered cards; result title reflects an empty match | Search tests; source check |
| Collection with results / no filter matches / no products | Product grid; clear-filters recovery; bestsellers recovery | Filter tests; store scenario test |
| In-stock / low-stock / sold-out PDP | Purchase actions available, low-stock note, or disabled sold-out actions | Store scenario test; source check |
| Quantity exceeds stock | Add is refused; bag plus is disabled and quantity is clamped | Store scenario test |
| Different blouse choices in bag | Separate lines share the product's stock limit | Store scenario test |
| Invalid saved bag data | Returns an empty bag instead of throwing | Store scenario test |
| Unknown product link | Unavailable message with a route back to sarees | Source check |
| Offline after page loads | Visible connection notice; saved local items remain accessible | Source check only; browser QA blocked |
| Policy navigation | Footer, account terms and PDP shipping/return links resolve to content pages | Route/content test |

## Reference decisions

- [H&M stock notification](https://mobbin.com/screens/c1bddaee-5953-4e7b-8aa6-a782fd647e3a) and [Selfridges sold-out PDP](https://mobbin.com/screens/1c2a1e94-b4a3-4bd8-b77b-8bdc7aa1a6c8): make unavailability explicit at the purchase control.
- [Apple empty bag](https://mobbin.com/screens/a60263a6-b6ad-4e62-848c-120788968357) and [Etsy empty bag](https://mobbin.com/screens/da6b79ed-14a9-426d-95a9-770a72a52c76): provide a clear next shopping action and product discovery.
- [Nykaa Fashion return policy](https://www.nykaafashion.com/lp/shipping-and-return-policy): present eligibility, process, exceptions and refund timing as separate scannable sections.
- [Samantha refund](https://www.samanthafab.com/policies/refund-policy), [privacy](https://www.samanthafab.com/policies/privacy-policy) and [contact information](https://www.samanthafab.com/policies/contact-information) supplied the specific policy details. Samantha's FAQ says 7 days for returns, while its dedicated refund policy says 3 days; the new page follows the dedicated policy. The terms and shipping pages could not be retrieved through the available read-only source tool, so their copy avoids unverified delivery fees, timing and legal claims and should be checked against the live store before production use.

Inventory is mock catalog data. The two-unit example is a test fixture, not live stock. The fallback cap of 99 prevents unchecked quantities for mock products without a stock field. Offline notice applies after the app has loaded; a fresh offline visit is subject to browser caching.
