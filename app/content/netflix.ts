import { ExternalMessage } from "../background/background";

interface ClickableElement extends Element {
	click: () => void;
}

function externalMessage(data: ExternalMessage) {
	const video = document.querySelector('video')!;

	switch (data.action) {
		case 'play':
			video.play();
			break;
		case 'pause':
			video.pause();
			break;
		case 'playpause':
			const playButton = (document.querySelector('.player-control-button') as ClickableElement);
			playButton.click();
			break;
		case 'close':
			window.close();
			break;
	}
}

chrome.runtime.onMessage.addListener((message: {
	type: 'external';
	data: ExternalMessage;
}) => {
	switch (message.type) {
		case 'external':
			externalMessage(message.data);
			break;
	}
});