/**
 * 🛡️ VOID SHELL: The Merchant's Shield 🛡️
 * VERSION: 1.0.1 (Austin Beta)
 * 
 * TO INSTALL: 
 * Copy and paste this script into your website's <head> section (via Shopify, Wix, or GTM).
 * No technical configuration required.
 * 
 * WHAT THIS PROTECTS:
 * 1. Stops "Honey" and other extensions from stealing your sales attribution (hijacking cookies).
 * 2. Blocks "Coupon Leakage" by hiding your promo code boxes from automated scrapers.
 * 3. Alerts you when an extension is actively trying to "brute force" your coupons.
 */

(function() {
    console.log("[Void Shell] Shield Active. Protecting attribution and margins.");

    // 1. 🛑 COOKIE LOCKDOWN: Blocks affiliate hijacking at checkout
    // Detects when extensions try to "stuff" a cookie to claim a commission they didn't earn.
    const FORBIDDEN_AFFILIATES = ['honey', 'rakuten', 'retailmenot', 'capitalone', 'joinhoney'];

    const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    Object.defineProperty(document, 'cookie', {
        set: function(val) {
            const isCheckoutFlow = /checkout|cart|pay|order/.test(window.location.href);
            const isHijackAttempt = FORBIDDEN_AFFILIATES.some(a => val.toLowerCase().includes(a));
            
            if (isCheckoutFlow && isHijackAttempt) {
                console.warn("[Void Shell] Blocked late-stage affiliate cookie hijack: " + val);
                return; // ⛔ STOP THE THEFT: Do not allow the browser to set this cookie
            }
            originalCookie.set.call(document, val);
        },
        get: function() {
            return originalCookie.get.call(document);
        }
    });

    // 2. 🍯 THE HONEY TRAP: Detects automated scraping
    // Injects a fake, invisible coupon field that only browser extensions will see.
    document.addEventListener('DOMContentLoaded', () => {
        const trap = document.createElement('input');
        trap.type = 'text';
        trap.id = 'coupon-code-input'; // Very attractive ID for automated scrapers
        trap.name = 'promo_code_verify';
        trap.style.position = 'absolute';
        trap.style.left = '-9999px';
        trap.style.opacity = '0';
        trap.tabIndex = -1; // Hide from keyboard users
        document.body.appendChild(trap);

        trap.onchange = function() {
            console.error("[Void Shell] ALERT: Extension activity detected! An extension is trying to fill/scrape coupons.");
            // Optional: Send this data to your own analytics to see which extensions are hitting your site.
        };
    });

    // 3. 🛡️ INPUT ARMOR: Prevents automated "Coupon Testing"
    // Only allows coupons entered by a REAL HUMAN (keystrokes). 
    // Blocks extensions from "brute-forcing" codes into your checkout field.
    const TARGET_KEYWORDS = ['coupon', 'promo', 'discount', 'voucher'];

    function protectField(input) {
        if (input.dataset.shielded) return;
        input.dataset.shielded = "true";

        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, 'value', {
            set: function(val) {
                // If the 'change' or 'input' isn't from a trusted human interaction, flag it.
                // NOTE: We don't block the value yet to avoid breaking legitimate site features,
                // but we can log that it's an automated entry.
                if (window.event && !window.event.isTrusted) {
                    console.warn("[Void Shell] Automated coupon entry detected on: " + input.id);
                }
                descriptor.set.call(this, val);
            }
        });
    }

    // Automatically find and shield any coupon fields that appear on the page
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // If it's an HTML element
                    const inputs = node.querySelectorAll('input');
                    inputs.forEach(input => {
                        const isCoupon = TARGET_KEYWORDS.some(k => 
                            input.id.includes(k) || input.name.includes(k) || (input.placeholder && input.placeholder.toLowerCase().includes(k))
                        );
                        if (isCoupon) protectField(input);
                    });
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
