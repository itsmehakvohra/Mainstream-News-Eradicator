/**
 *	A class to apply to posts that have been checked already.
 * 	This allows us to avoid re-checking posts multiple times.
 */
var checkedPostClass = '_eradicate_mainstream_checked';

/**
 *	An array of the classes that are known to contain posts. When
 *	searching the page for posts, we look in this array.
 */
// var containerClasses = ['_5jmm', '_5pcr', '_2x4v'];
var containerClasses = ['_5pcr'];

/**
 *	Checks an individual post to determine if it should
 *	be removed from the page.
 *	@param postElement the element for the post
 *	@return if the post should be removed, return any
 *			string value (the reason to remove), nothing otherwise.
 */
function auditPostElement(post) {

	// If the post has too many shares
	if (post.shares >= 50) return 'Too many shares!';

	// If the post has too many reactions/likes
	if (post.likes >= 200) return 'Too many likes!';

}

/**
 *	Removes a post from the feed
 *	@param post the data for the post
 *	@param reason the reason the post is being removed
 */
function removePost(post, reason) {

	// Remove the element from the page
	post.element.style.opacity = '0.2';
	// item.style.opacity = "0.0";
	// item.style.display = "none";

	// Output the message
	console.log('Post removed: ' + '"' + reason + '"');

}



/**
 *	Converts string values like '11.2k' to integers like '11200'
 */
function getNumberFromString(numberString) {

	// Strip out any commas and make it all lower case
	numberString = numberString.trim().split(/\s+/g)[0].replace(/,/g, '').toLowerCase();

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
		likes: null
	};

	// Get the number of shares
	var sharesElement = postObject.querySelector('.UFIShareLink em');
	if (sharesElement != null) data.shares = getNumberFromString(sharesElement.textContent);

	// Get the number of likes
	var likesElement = postObject.querySelector('.UFILikeSentence ._4arz span');
	if (likesElement != null) data.likes = getNumberFromString(likesElement.textContent);

	// Return the data
	return data;

}

// Add a scroll listener to the page
document.addEventListener('scroll', eradicateMainstream);
