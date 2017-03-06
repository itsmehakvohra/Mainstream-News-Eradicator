var storiesRem = [];
var containerClass = ["_5jmm", "_5pcr", "_4arz"];

var domainsBan = ["cnn.com", "fox.com", "msnbc.com"];
var sharesBan = ["200"];

function eradicateMainstream() {

	chrome.storage.sync.get("eradicate", function(data) {
		if (data["eradicate"]) {
			_.each(containerClass, function(containerClass) {
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
	var domainB = item.getElementsByTagName("a");
	_.each(domainB, function(link){
		var url = link.url.toLowerCase();
		_.each(domainsBan, function(domain) {
			if (url.indexOf(domain) !== -1) {
				removeItem(item, "link", url);
			}
		});
	});
}

function removeShares(item) {
	var sharesB = item.getElementsByClassName("_4arz");
	_.each(sharesB, function(num) {
		var shareNum = num.share.toLowerCase();
		._each(shares, function(share) {
			if (shareNum.indexOf(share) != -1) {
				removeItem(item, "num", shareNum)
			}
		});
	}); 
}


eradicateMainstream();

var kill = _.debounce(eradicateMainstream, 300);
document.addEventListener("scroll", kill);