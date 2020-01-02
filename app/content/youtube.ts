declare const REPLACE: {
	getPlayer(): YoutubeVideoPlayer;
	amount: number;
};

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

function createTag(fn: Function): string {
	const str = fn.toString();
	return (() => {
		const tag = document.createElement('script');
		tag.innerHTML = `(${str})();`;
		document.documentElement.appendChild(tag);
		document.documentElement.removeChild(tag);
	}).toString().replace('str', str);
}

function replaceParameters(code: string, parameters: {
	[key: string]: number|string|boolean|((...args: any[]) => void);
}): string {
	Object.getOwnPropertyNames(parameters).forEach((key) => {
		const arg = parameters[key];
		if (typeof arg === 'string' && arg.split('\n').length > 1) {
			code = code.replace(new RegExp(`REPLACE\.${key}`, 'g'), 
				`' + ${JSON.stringify(arg.split('\n'))}.join('\\n') + '`);
		} else if (typeof arg === 'function') {
			code = code.replace(new RegExp(`REPLACE\.${key}`, 'g'),
				`(${arg.toString()})`);
		} else {
			code = code.replace(new RegExp(`REPLACE\.${key}`, 'g'), 
				arg !== undefined && arg !== null && typeof arg === 'string' ?
					arg.replace(/\\\"/g, `\\\\\"`) : arg.toString());
		}
	});
	return code;
}

function hacksecute(fn: Function, params: {
	[key: string]: number|string|boolean|((...args: any[]) => void);
} = {}) {
	new Function(replaceParameters(`(${createTag(fn)})()`, params))();	
}

function getPlayer() {
	return document.querySelector('.html5-video-player') as YoutubeVideoPlayer;
}

function externalMessage(data: ExternalMessage) {
	console.log('action', data.action);
	switch (data.action) {
		case 'play':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
				player.playVideo();
			}, { getPlayer });
			break;
		case 'pause':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
				player.pauseVideo();
			}, { getPlayer });
			break;
		case 'playpause':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
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
			}, { getPlayer });
			break;
		case 'volumeUp':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
				const currentVolume = player.getVolume();
				player.setVolume(currentVolume + (REPLACE.amount));
			}, { getPlayer, amount: data.amount ?? 10 });
			break;
		case 'volumeDown':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
				const currentVolume = player.getVolume();
				player.setVolume(currentVolume - (REPLACE.amount));
			}, { getPlayer, amount: data.amount ?? 10 });
			break;
		case 'setVolume':
			hacksecute(() => {
				const player = REPLACE.getPlayer();
				player.setVolume((REPLACE.amount));
			}, { getPlayer, amount: data.amount});
			break;
	}
}

chrome.runtime.onMessage.addListener((message: {
	type: 'external';
	data: ExternalMessage;
}) => {
	console.log('got', message);
	switch (message.type) {
		case 'external':
			console.log('external', message.data);
			externalMessage(message.data);
			break;
	}
});