$.fn.outerHTML = function() {
	return jQuery('<div />').append(this.eq(0).clone()).html();
}

const initPrompt = () => {
	const url = window.location.href
	const smileUrl = url.replace('www.amazon', 'smile.amazon')
	const onAmazonSmile = url === smileUrl
	const smileHtml = onAmazonSmile
		? ''
		: `<a href="${smileUrl}"><button class="waves-effect waves-light btn-small orange darken-1">Go to Amazon Smile</button></a>`


	const investmentUrl = 'https://www.betterment.com/'
	const donationUrl = 'https://water.org/donate/'

	const modal = `
<div id="add-to-cart-prompt" class="modal fullscreen">
	<div class="modal-content">
        <h1 id="prompt-title">Do you really <em class="em-inline">need</em> this, Ben?</h1>
        <h4 id="prompt-subheading">This item costs <span class="green-text">$10</span>, but could be worth over <span class="green-text">$32</span> in 30 years if invested!</h4>
        
        <h2 class="action-heading">No, I don't need this item. Instead, I'd like to...</h2>
        <div class="btn-group">
          <a href="${investmentUrl}"><button class="waves-effect waves-light light-blue lighten-1  btn-large">Make an investment!</button></a>
          <a href="${donationUrl}"><button class="waves-effect waves-light cyan accent btn-large">Make a donation!</button></a>
          <button id="go-back-button" class="waves-effect waves-teal pink lighten-3 btn-large">Go back</button>
        </div>
        
        <h2 class="action-heading">Yes, I need this item. I'd like to...</h2>
        <div class="btn-group">
          ${smileHtml}
          <button id="confirm-add-to-cart" class="waves-effect btn-small grey lighten-2 black-text text-darken-2">Add to cart Cart</button>
        </div>
	</div>
</div>
		`
	$('body').append(modal)
	$('#add-to-cart-prompt').modal();
}

const prompt = (successCallback) => {
	console.log('modal is being opened')
	$('#add-to-cart-prompt').modal('open');

	// setup add to cart button
	$('#confirm-add-to-cart').off('click')
	$('#confirm-add-to-cart').on('click', () => {
		$('#add-to-cart-prompt').modal('close');
		successCallback()
	})

	// setup back button
	$('#go-back-button').off('click')
	$('#go-back-button').on('click', () => {
		$('#add-to-cart-prompt').modal('close');
	})
}

const wrapButtonWithPrompt = (addToCartButton) => {
	// Storing before replacing button contents, otherwise, weird behavior
	const buttonHeight =  addToCartButton.css('height')
	const buttonWidth =  addToCartButton.css('width')
	const buttonId =  addToCartButton.attr('id')

	addToCartButton.replaceWith(`
    <div id='add-to-cart-wrapper'>
      ${addToCartButton.outerHTML()}
      <div id='add-to-cart-prompt-trigger'></div>
    </div>
  `)
	const newAddToCartButton = $(`#${buttonId}`)
	console.log(addToCartButton)

	// style so prompt is over button and invisible.
	$('#add-to-cart-wrapper').css('position', 'relative')

	$('#add-to-cart-prompt-trigger').css('position', 'absolute')
	$('#add-to-cart-prompt-trigger').css('top', '0px')
	$('#add-to-cart-prompt-trigger').css('left', '0px')
	$('#add-to-cart-prompt-trigger').css('z-index', '1000')

	// make prompt overlay the same size as the button
	$('#add-to-cart-prompt-trigger').css('height', buttonHeight)
	$('#add-to-cart-prompt-trigger').css('width', buttonWidth)

	// when prompt overlay is clicked, ask if they really need
	$('#add-to-cart-prompt-trigger').on('click', event => {
		prompt(() => newAddToCartButton.click())
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

		wrapButtonWithPrompt(addToCartButton)
		// ----------------------------------------------------------

	}
	}, 0.5);
});

initPrompt()
