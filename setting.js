document.addEventListener('DOMContentLoaded', function() {

    var box = document.getElementById('opt');

    //check's if  box is checked or not.
    chrome.storage.sync.get("eradicate", function(data) {

        if (data.eradicate) {
            box.checked = true;
        } else {
            box.checked = false;
        }
    });

    //update's box settings if box is tampered.
    box.addEventListener("change", function() {
        chrome.storage.sync.set({eradicate: box.checked});
    });
});
