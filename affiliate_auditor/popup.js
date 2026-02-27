// 🕵️ Affiliate Auditor: UI Logic (Popup)
// Displays current status and historical evidence of affiliate hijacking.

document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('logContainer');
    const statusBox = document.getElementById('status');
    const clearLogBtn = document.getElementById('clearLog');

    function updateUI() {
        chrome.storage.local.get({ auditLog: [] }, (data) => {
            const logs = data.auditLog;
            
            if (logs.length > 0) {
                statusBox.textContent = `🚨 HIJACK ATTEMPT DETECTED (${logs.length} EVENTS)`;
                statusBox.className = "status-badge status-danger";
                
                logContainer.innerHTML = ''; // Clear current list
                logs.forEach(log => {
                    const logItem = document.createElement('div');
                    logItem.className = 'log-item';
                    logItem.innerHTML = `
                        <span class="type">${log.type.toUpperCase()}</span>
                        <span class="message">${log.message}</span>
                        <span class="timestamp">${log.timestamp}</span>
                    `;
                    logContainer.appendChild(logItem);
                });
            } else {
                statusBox.textContent = "✅ NO THREATS DETECTED";
                statusBox.className = "status-badge status-safe";
                logContainer.innerHTML = '<div class="log-item"><span class="message">Waiting for activity... Visit your store to audit.</span></div>';
            }
        });
    }

    // Periodically update the log if new events come in while popup is open
    setInterval(updateUI, 1000);
    updateUI();

    clearLogBtn.onclick = function() {
        chrome.storage.local.set({ auditLog: [] }, () => {
            chrome.action.setBadgeText({ text: '' });
            updateUI();
        });
    };
});
