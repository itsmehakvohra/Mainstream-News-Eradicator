var storiesRem = [];
var containerClasses = ["_5jmm", "_5pcr", "_4arz"];
var domainsBan = ["cnn.com", "fox.com", "msnbc.com"];
var minBanShares = 200;
var falsify = false;

/**
 *	Converts string values like '11.2k' to integers like '11200'
 */
function getNumberFromString(numberString) {

	// Strip out any commas and make it all lower case
	numberString = numberString.replace(/,/g, '').trim().toLowerCase();

	// Parse the value to a float
	var flt = parseFloat(numberString);

	// Define the suffix multipliers
	var suffixValues = {
		'k': 1000,
		'm': 1000000
	};
	
	// Get the suffixes
	var suffixes = Object.keys(suffixValues);

	// Loop through the suffixes
	for (var suffix in suffixValues) {
	
		// If the suffix is present in the number
		if (numberString.endsWith(suffix)) flt *= suffixValues[suffix];
	
	}

	// Return the floating point value as an integer
	return flt;

}

function eradicateMainstream() {

	chrome.storage.sync.get("eradicate", function(data) {
		if (data["eradicate"]) {
			_.each(containerClasses, function(containerClass) {
				posts = document.getElementsByClassName(containerClass);
				_.each(posts, function(post) {
					removeDomain(post);
					removeShares(post);
				})
			})
		}
	});
}

function removeDomain(item) {
	var domain = item.getElementsByTagName("a");
	_.each(domain, function(link){
		var url = link.href.toLowerCase();
		_.each(domainsBan, function(domain) {
			if (url.indexOf(domain) !== -1) {
				removeItem(item, "link", url);
			}
		});
	});
}

function removeShares(item) {

	// Find the element for the number of shares
	var sharesB = item.getElementsByClassName("_4arz");
	
	// Loop through those elements
	_.each(sharesB, function(num) {
		
		// Get the string for the shares
		var shareNum = num.textContent.toLowerCase();
		
		// Convert the string value to an integer value
		var sharesCount = getNumberFromString(shareNum);
		
		// If the shares count is too great
		if (sharesCount >= minBanShares) {

			// Remove this post from the page
			removeItem(item, "number", shareNum);
			
		}
		
	}); 
}

function removeItem(item, reasonNam, data){

    // set the story to be invisible
    if (falsify){
        item.style.opacity = "0.5";
    } else {
        item.style.opacity = "0.0";
        item.style.display = "none";
    }

    // add this story to the list of killed stories
    if (storiesRem.indexOf(item) == -1){
        if (falsify){
            console.log("killed item b/c:" + reasonNam + " and this data:" + data);
        }
        storiesRem.push(item);
   }

}

eradicateMainstream();

var kill = _.debounce(eradicateMainstream, 300);
document.addEventListener("scroll", kill);