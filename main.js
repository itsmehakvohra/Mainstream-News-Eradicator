/**
 *	A class to apply to posts that have been checked already.
 * 	This allows us to avoid re-checking posts multiple times.
 */
var checkedPostClass = '_eradicate_mainstream_checked';

/**
 *	An array of the classes that are known to contain posts. When
 *	searching the page for posts, we look in this array.
 */
var containerClasses = ['_5pcr', '_2x4v'];

/**
 *	Checks an individual post to determine if it should
 *	be removed from the page.
 *	@param postElement the element for the post
 *	@return if the post should be removed, return any
 *			string value (the reason to remove), nothing otherwise.
 */
function auditPostElement(post) {

	/*
	 *	The 'post' object has the following keys:
	 * 	 - shares
	 *	 - likes
	 *	 - videoViews
	 *	If the post doesn't have one of those fields, or it simply
	 *	couldn't be found, the value will be null. Otherwise, it
	 *	will be the integer value found in the post.
	 */

	// If the post has too many shares
	if (post.shares >= 50) return 'Too many shares!';

	// If the post has too many reactions/likes
	if (post.likes >= 200) return 'Too many likes!';

	// If there are too many video views
	if (post.videoViews >= 1000) return 'Too many video views!';

}

/**
 *	Removes a post from the feed
 *	@param post the data for the post
 *	@param reason the reason the post is being removed
 */
function removePost(post, reason) {

	// Remove the element from the page
	post.element.style.opacity = '0.0';
	// item.style.opacity = "0.0";
	// item.style.display = "none";

	// Output the message
	console.log('Post removed: ' + '"' + reason + '"');

}



/**
 *	Converts string values like '11.2k' to integers like '11200'
 */
function getNumberFromString(numberString) {

	// The parts
	var parts = numberString.replace(/,/g, '').toLowerCase().trim().split(/\s+/g);

	// The part value
	var result = null;

	// Loop through the parts
	for (var i = 0; i < parts.length; i++) {

		// Strip out any commas and make it all lower case
		numberString = parts[i];

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

		// If the value is better
		if (!isNaN(flt) && (result == null || flt > result)) result = flt;

	}

	// Return the floating point value as an integer
	return result;

}

/**
 *	The main function for the app. This function removes unwanted posts!
 */
function eradicateMainstream() {

	// Get the storage data for the app
	chrome.storage.sync.get('eradicate', function(data) {

		// If it's enabled!
		if (data.eradicate) {

			// Create a selector for posts based on container classes
			var postSelector = '.' + containerClasses.join(':not(.' + checkedPostClass + '), .') + ':not(.' + checkedPostClass + ')';

			// Get all the posts in the document
			var posts = document.querySelectorAll(postSelector);

			// Loop through each of the posts
			_.each(posts, function(postElement) {

				// Get the data for the post
				var post = getPostData(postElement);

				// Add a class to the post
				postElement.className += ' ' + checkedPostClass;

				// Audit the element
				var reason = auditPostElement(post);

				// If there is no reason (it's not a string)
				if (typeof(reason) != typeof('')) return;

				// Remove the post from the page
				removePost(post, reason);

			});
		}

	});
}

/**
 *	Gets the metadata for a post from its DOM
 *	@param postObject the DOM for the post
 *	@return the data object for the post
 */
function getPostData(postObject) {

	// Create an object for the data
	var data = {
		element: postObject,
		shares: null,
		likes: null,
		videoViews: null
	};

	// Define DOM paths to each key
	var keyDomPaths = {
		shares: ['.UFIShareLink em', '._ipo ._36_q:nth-child(2) ._4qba'],
		likes: ['._4arz span'],
		comments: ['._ipo ._36_q:nth-child(1) ._4qba'],
		videoViews: ['._50f8', '._ipo ._36_q:nth-child(3) ._4qba']
	};

	// Get the keys
	var keys = Object.keys(keyDomPaths);

	// Loop through the keys
	for (var i = 0; i < keys.length; i++) {

		// Get the key
		var key = keys[i];

		// Get the potental elements
		var elements = postObject.querySelectorAll(keyDomPaths[key].join(','));

		// Loop through the elements
		_.each(elements, function (element) {

			// Get the number for the element
			var value = getNumberFromString(element.textContent);

			// If the value is higher
			if (data[key] == null || value > data[key]) data[key] = value;

		});

	}

	// Return the data
	return data;

}

// Add a scroll listener to the page
document.addEventListener('scroll', eradicateMainstream);
