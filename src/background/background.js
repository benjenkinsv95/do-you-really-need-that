chrome.storage.sync.get({
    preferredName: '',
    investmentUrl: '',
    donationUrl: ''
}, function(items) {
    const preferredName = items.preferredName
    let investmentUrl = items.investmentUrl
    let donationUrl = items.donationUrl

    if (!preferredName || !investmentUrl || !donationUrl) {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('src/options/index.html'));
        }
        return
    }
})
