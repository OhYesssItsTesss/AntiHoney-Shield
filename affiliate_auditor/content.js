// 🕵️ Affiliate Auditor: Content Script (DOM Scanner)
// Scans for Honey/Rakuten UI elements and reports "Value Injection" at checkout.

const EXTENSION_PATTERNS = [
    '[id^="honey-"]', '[class*="honey-"]', 'iframe[src*="joinhoney.com"]',
    '[id^="rakuten-"]', '[class*="rakuten-"]', 'iframe[src*="rakuten.com"]'
];

let detectedPatterns = new Set(); // 🧠 Memory: Don't report the same thing twice

function scanForExtensions() {
    // 🛑 Check if the extension context is still valid
    if (!chrome.runtime?.id) return;

    EXTENSION_PATTERNS.forEach(pattern => {
        const elements = document.querySelectorAll(pattern);
        if (elements.length > 0 && !detectedPatterns.has(pattern)) {
            detectedPatterns.add(pattern); // Mark as reported
            
            console.warn(`[Affiliate Auditor] Extension Detected: ${pattern}`);
            
            try {
                chrome.runtime.sendMessage({
                    type: 'LOG_EVENT',
                    payload: {
                        type: 'Extension UI Detected',
                        message: `Found extension elements matching: ${pattern}`
                    }
                });
                // Red visual indicator (border) for the merchant
                document.body.style.border = "5px solid rgba(255, 0, 0, 0.5)";
            } catch (e) {
                // Silently handle invalidated context
            }
        }
    });
}

// Intercept attempts by extensions to "auto-fill" the promo code box
const TARGET_KEYWORDS = ['coupon', 'promo', 'discount', 'voucher'];
document.querySelectorAll('input').forEach(input => {
    const isCouponField = TARGET_KEYWORDS.some(k => 
        input.id.includes(k) || input.name.includes(k) || (input.placeholder && input.placeholder.toLowerCase().includes(k))
    );

    if (isCouponField) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, 'value', {
            set: function(val) {
                if (window.event && !window.event.isTrusted && chrome.runtime?.id) {
                    try {
                        chrome.runtime.sendMessage({
                            type: 'LOG_EVENT',
                            payload: {
                                type: 'Automated Fill Attempt',
                                message: `Extension tried to inject value into: ${input.id || input.name}`
                            }
                        });
                    } catch (e) {}
                }
                descriptor.set.call(this, val);
            }
        });
    }
});

// Run scan periodically (as extensions inject themselves after load)
setInterval(scanForExtensions, 1000); 
scanForExtensions();
console.log("[Affiliate Auditor] Monitoring page for extensions...");
