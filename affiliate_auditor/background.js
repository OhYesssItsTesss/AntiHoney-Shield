// 🕵️ Affiliate Auditor: Background Monitor (Service Worker)
// Listens for affiliate cookie writes from extensions like Honey, Rakuten, etc.

const FORBIDDEN_DOMAINS = ['joinhoney.com', 'honey.io', 'rakuten.com', 'retailmenot.com', 'capitaloneshopping.com'];
const FORBIDDEN_PARAMS = ['utm_source=honey', 'utm_medium=affiliate'];

chrome.cookies.onChanged.addListener((changeInfo) => {
    // We only care about NEW cookies or UPDATED cookies
    if (changeInfo.removed) return;

    const cookie = changeInfo.cookie;
    const isAffiliate = FORBIDDEN_DOMAINS.some(domain => cookie.domain.includes(domain)) || 
                        FORBIDDEN_PARAMS.some(param => cookie.name.includes(param) || cookie.value.includes(param));

    if (isAffiliate) {
        logEvent('Affiliate Hijack Attempt', `Extension tried to set cookie: ${cookie.name} from ${cookie.domain}`);
        
        // Notify the user if they're on their own site
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    }
});

// Helper function to log events to extension storage for the merchant to review
function logEvent(type, message) {
    const timestamp = new Date().toLocaleString();
    chrome.storage.local.get({ auditLog: [] }, (data) => {
        const newLog = [{ timestamp, type, message }, ...data.auditLog].slice(0, 100); // Keep last 100 events
        chrome.storage.local.set({ auditLog: newLog });
    });
}

// 🌉 THE BRIDGE: Listen for alerts from the website (content.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'LOG_EVENT') {
        logEvent(request.payload.type, request.payload.message);
        
        // Show the Red "!" Badge
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    }
});
