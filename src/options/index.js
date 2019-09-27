function save_options() {
    console.log('about to save')
    const preferredName = $('#preferred-name').val()
    const investmentUrl = $('#investment-url').val()
    const donationUrl = $('#donation-url').val()

    chrome.storage.sync.set({
        preferredName,
        investmentUrl,
        donationUrl
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        preferredName: '',
        investmentUrl: '',
        donationUrl: ''
    }, function(items) {
        $('#preferred-name').val(items.preferredName)
        $('#investment-url').val(items.investmentUrl)
        $('#donation-url').val(items.donationUrl)
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
