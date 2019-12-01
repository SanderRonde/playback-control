const SERVER_URL = "***REMOVED***";

export type ExternalMessage = {
	action: 'play'|'pause'|'playpause'|'close';
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
			ws.onclose = () => {
				listen();
			};
			ws.onerror = () => {
				window.setTimeout(listen, 10000);
			}
		}
	}

	namespace Comm {
		export function sendToContentScripts(message: string) {
			chrome.tabs.query({ }, (tabs) => {
				for (const tab of tabs) {
					if (tab.id) {
						chrome.tabs.sendMessage(tab.id, {
							type: 'external',
							data: JSON.parse(message) as ExternalMessage
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