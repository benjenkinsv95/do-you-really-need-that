$.fn.outerHTML = function() {
	return jQuery('<div />').append(this.eq(0).clone()).html();
}

const wrapWithPrompt = (addToCartButton) => {
	// Storing before replacing button contents, otherwise, weird behavior
	const buttonHeight =  addToCartButton.css('height')
	const buttonWidth =  addToCartButton.css('width')
	const buttonId =  addToCartButton.attr('id')

	addToCartButton.replaceWith(`
    <div id='add-to-cart-wrapper'>
      ${addToCartButton.outerHTML()}
      <div id='add-to-cart-prompt'></div>
    </div>
  `)
	const newAddToCartButton = $(`#${buttonId}`)
	console.log(addToCartButton)

	// style so prompt is over button and invisible.
	$('#add-to-cart-wrapper').css('position', 'relative')

	$('#add-to-cart-prompt').css('position', 'absolute')
	$('#add-to-cart-prompt').css('top', '0px')
	$('#add-to-cart-prompt').css('left', '0px')
	$('#add-to-cart-prompt').css('z-index', '1000')

	// make prompt overlay the same size as the button
	$('#add-to-cart-prompt').css('height', buttonHeight)
	$('#add-to-cart-prompt').css('width', buttonWidth)

	// when prompt overlay is clicked, ask if they really need
	$('#add-to-cart-prompt').on('click', event => {
		console.log('prompt clicked')
		if (window.confirm("Do you really need this, Ben?")) {
			// then click add to cart button if it is what they really want
			console.log('prompt confirmed')

			newAddToCartButton.click()
		}
	})
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		const addToCartButton = $('#add-to-cart-button')
		if (!addToCartButton) {
			console.error('No add to cart button found!')
			return
		}
		console.log('addToCartButton is', addToCartButton)
		wrapWithPrompt(addToCartButton)

		// ----------------------------------------------------------

	}
	}, 0.5);
});
