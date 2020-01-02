const SERVER_URL = "***REMOVED***";

export type ExternalMessage = {
	action: 'play'|'pause'|'playpause';
}|{
	action: 'volumeUp'|'volumeDown';
	amount?: number;
}|{
	action: 'setVolume';
	amount: number;
}

namespace Background {
	namespace Listen {
		export function listen() {
			const ws = new WebSocket(SERVER_URL, "listen");
			ws.onmessage = (event) => {
				Comm.sendToContentScripts(event.data);
			}
			ws.onclose = ws.onerror = () => {
				window.setTimeout(listen, 10000);
			};
			ws.onopen = () => {
				ws.send('***REMOVED***');
			}
		}
	}

	namespace Comm {
		export function sendToContentScripts(message: string) {
			chrome.tabs.query({ }, (tabs) => {
				for (const tab of tabs) {
					if (tab.id) {
						const msg = JSON.parse(message) as ExternalMessage;
						chrome.tabs.sendMessage(tab.id, {
							type: 'external',
							data: msg
						});
					}
				}
			});
		}
	}

	export function init() {
		Listen.listen();
	}
}

Background.init();