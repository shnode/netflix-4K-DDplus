let getElementByXPath = function (xpath) {
	return document.evaluate(
		xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
	).singleNodeValue;
};

let fn = function () {
	const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate']");
	const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
	const BUTTON = getElementByXPath("//button[text()='Override']");

	if (!BUTTON){
		window.dispatchEvent(new KeyboardEvent('keydown', {
			keyCode: 83,
			ctrlKey: true,
			altKey: true,
			shiftKey: true,
		}));
	}

	if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
		return false;
	}

	[VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
		let parent = el.parentElement;

		let options = parent.querySelectorAll('select > option');

		for (var i = 0; i < options.length - 1; i++) {
			options[i].removeAttribute('selected');
		}

		options[options.length - 1].setAttribute('selected', 'selected');
	});
	BUTTON.click();

	return true;
};

let crash = function (count) {
    const BUTTON = getElementByXPath("//button[text()='Override']");
	if (count > 0) {
		BUTTON ? fn() : setTimeout(() => crash(count - 1), 200)
	}
};

let run = function () {
	fn() ? crash(10) : setTimeout(run, 100)
};

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;
if(setMaxBitrate ) {
	console.log("netflix_max_bitrate.js enabled");
	setInterval(function () {
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && run();
		}
  }, 500);
}