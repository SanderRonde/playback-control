import { ExternalMessage } from "../background/background";

export interface YoutubeVideoPlayer extends HTMLElement {
	getVolume(): number;
	isMuted(): boolean;
	setVolume(volume: number): void;
	unMute(): void;
	getPlayerState(): number;
	playVideo(): void;
	pauseVideo(): void;
	getAdState(): number;
	setPlaybackQuality(quality: string): void;
	getPlaybackQuality(): string;
	setSizeStyle(showExpansionIcon: boolean, expanded: boolean): void;
	setSize(): void;
	getCurrentTime(): number;
	seekTo(seconds: number): void;
}

function externalMessage(data: ExternalMessage) {
	const player = document.querySelector('.html5-video-player') as YoutubeVideoPlayer;

	const currentVolume = player.getVolume();
	switch (data.action) {
		case 'play':
			player.playVideo();
			break;
		case 'pause':
			player.pauseVideo();
			break;
		case 'playpause':
			const state = player.getPlayerState();
			if (state === 2) {
				//Paused
				player.playVideo();
			} else if (state === 1) {
				//Playing
				player.pauseVideo();
			} else {
				//???
			}
			break;
		case 'volumeUp':
			player.setVolume(currentVolume + (data.amount ?? 10));
			break;
		case 'volumeDown':
			player.setVolume(currentVolume - (data.amount ?? 10));
			break;
		case 'setVolume':
			player.setVolume(data.amount);
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