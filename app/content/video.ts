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
		case 'volumeUp':
			video.volume = Math.min(1, video.volume + ((data.amount ?? 10) / 100));
			break;
		case 'volumeDown':
			video.volume = Math.max(0, video.volume - ((data.amount ?? 10) / 100));
			break;
		case 'setVolume':
			video.volume = data.amount;
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