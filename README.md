# 🛡️ AntiHoney-Shield: The Merchant's Defense

Protect your business from **Affiliate Hijacking** and **Coupon Leakage** caused by browser extensions like Honey, Rakuten, and Capital One Shopping.

### 💰 The Problem
Browser extensions intervene at the last second of a checkout, "stuffing" affiliate cookies to claim commissions they didn't earn and "scraping" your private coupons to share them with the world. This drains your margins and destroys your marketing attribution.

### 🛡️ The Solution
**AntiHoney-Shield** provides two layers of defense:

1.  **The Void Shell (Protection):** A lightweight JavaScript snippet for your website that makes your checkout "invisible" to automated scrapers and blocks late-stage cookie hijacking.
2.  **The Affiliate Auditor (Proof):** A browser extension for merchants to audit their own site and prove exactly when and how extensions are intervening.

---

## 🚀 Getting Started

### 1. Protect Your Store (Void Shell)
Copy the code in `void_shell.js` and paste it into your website's `<head>` section.
*   **Reporting:** You can enter a Webhook URL (Discord, Slack, or n8n) in the `MERCHANT_WEBHOOK` variable at the top of the script to receive real-time alerts when a hijack is blocked.

### 2. Audit Your Store (Affiliate Auditor)
1.  Open Chrome/Edge and go to `chrome://extensions/`.
2.  Enable **Developer Mode**.
3.  Click **Load Unpacked** and select the `affiliate_auditor` folder.
4.  Visit your store. If an extension attempts to intervene, the Auditor will log the proof.

### 🧪 Testing Locally
Open `test_store.html` in your browser. This mock checkout page is already linked to the `void_shell.js`. You can use a "Honey Simulator" script in the console to verify the defense is active.

---

## 📜 Technical Philosophy
*   **Minimal Impact:** No heavy dependencies. Just pure, efficient JavaScript.
*   **Privacy First:** We don't track your customers; we only block the trackers.
*   **Sovereignty:** Reclaim your margins and your data.

*Built for the Architect's Ecosystem.* 🌿✨
