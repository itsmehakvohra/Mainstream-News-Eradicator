var storiesRem = [];
var containerClass = ["_5jmm", "_5pcr", "_4arz"];

var domainsBan = ["cnn.com", "fox.com", "msnbc.com"];
var sharesBan = ["200"];

var falsify = false;

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
	var domain = item.getElementsByTagName("a");
	_.each(domain, function(link){
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

function removeItem(item, reasonNam, data){

    // set the story to be invisible
    if (falsify){
        item.style.opacity = "0.5";
    } else {
        item.style.opacity = "0.0";
        item.style.display = "None";
    }

    // add this story to the list of killed stories
    if (removedStories.indexOf(item) == -1){
        if (falsify){
            console.log("killed item b/c:" + reasonNam + " and this data:" + data);
        }
        removedStories.push(item);
    }

}

eradicateMainstream();

var kill = _.debounce(eradicateMainstream, 300);
document.addEventListener("scroll", kill);