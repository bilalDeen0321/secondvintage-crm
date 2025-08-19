# 📌 Task Breakdown for Other Developers

---

## 1. Dashboard Module

- Connect layout to database (replace sample data).
- Show high-level stats (e.g., Watches, Batches, Sales).
- Ensure performance with 10k+ records.

---

## 2. Sales History & Statistics

- Implement CSV/XLSX import (Catawiki Sales Report).
- Map imported fields → internal Watch fields (SKU → Buyer, Price, etc.).
- Display sales statistics (filters by country, agent, platform).
- Stress test with 10k+ records.

---

## 3. Agent Balance Module

- Create **Deposits** CRUD (Admin only).
- Create **Payments** CRUD with multiple types (Watches, Shipping, Fee, Bonus, Other).
- Implement Watch-payment linking (for Watches type only).
- Add **dynamic total amount** calculation.
- Enforce unique IDs for payments/deposits.
- Apply status rules (Unpaid, Paid, Refunded).
- Ensure balances update correctly.
- Stress test with 10k+ deposits & payments.

---

## 4. Agent Watches Module

- CRUD for Watches linked to Agents.
- Restrict dropdowns (Agent select → Admin only).
- Prevent editing Seller field for Agent-created Watches.
- Support up to 40 images with upload counter.
- Add List/Grid toggle view.
- Stress test with 10k+ watches.

---

## 5. Seller Watches Module

- CRUD for Watches linked to Sellers.
- Restrict Agent dropdown to assigned Agents.
- Restrict Seller dropdown (Admin only).
- Apply Seller default currency automatically (no dropdown).
- Support up to 40 images with upload counter.
- Stress test with 10k+ watches.

---

## 6. Users Module

- Admin-only access.
- CRUD for Users with role assignment.
- Enforce role-based permissions (Admin, Manager, Finance, Agent, Seller).
- Stress test with 10k+ users.

---

## 7. Full Data View Module

- Read-only grid of all Watches.
- Implement filters (Status, Brand, Location, Agent, Seller).
- Enable sorting by column headers.
- Add CSV Export (filtered data only).
- Stress test with large datasets.

---

## 8. Settings Module

- General Settings → Company Name → rename as “Name”.
- Appearance settings → fix dark mode issues.
- Integrations → placeholder layout for APIs & Webhooks.
- Notifications → basic logging trigger (optional).
- Only Admins see Integrations tab.
- Connect with DB.

---

## 9. Log Module

- Record all activity logs (CRUD actions, payments, AI results).
- Display in table with filters (by Watch, by Agent, by Date).
- Include AI error messages.
- Stress test with large dataset.

---

## 10. Currency Handling

- Store **original purchase price** in bought currency.
- Store **sales price** in selling currency.
- Ensure both are linked to Watch & Transaction records.
- Prepare DB structure for exchange rates (future-proof).

---

## 11. CSV Export

- Generate Catawiki export file with required fields.
- Ensure AI-generated Description is included.
- Format Public Photo URLs correctly (`;` separated).
- Validate against Catawiki template.

---

## 12. CSV/XLSX Import

- Import Catawiki Sales Report.
- Match `Reference label → SKU`.
- Map Buyer data (Name, Country, Email, Address).
- Update Sales Price & SoldDate into Watch.
- Add error handling for invalid records.

---

## 13. Watch Image File Structure

- Save images under `/WatchImages/<SKU>/<001.jpg>`.
- Auto-generate thumbnails (`_s.jpg`, 256x256px).
- Ensure public URLs for all images (no auth restriction).
- Apply consistent naming (`<SKU>_001.jpg`, `<SKU>_002.jpg`).

## Multi-platform Sales (Tradera Integration)

- Connect Tradera API:
    - `https://api.tradera.com/v3/DocAddItem.aspx`
- Implement authentication with API keys (provided).
- Build request payload with Watch data:
    - SKU, Brand, Reference, Case Size, etc.
    - Images (public URLs, semicolon-separated).
- Send JSON/XML request to Tradera for item listing.
- Handle API response → update Watch status (e.g., “Ready for listing”).
- Log success/failure results into Log Module.
- Ensure retry handling for failed uploads.
- Stress test with 1000+ item submissions.

## Multi-platform Sales (Catawiki CSV Export)

- Generate CSV in Catawiki format.
- Ensure correct mapping of Watch fields to template fields.
- Include AI-generated description and image URLs.
- Validate CSV against Catawiki requirements.
- Provide download button in UI.
