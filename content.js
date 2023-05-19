chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	// Check if the message contains the action to send the data back
	if (message.action === "sendData") {
		// Gather the data from the content script
		const rowModules = document.querySelectorAll(".Row-module_row__pwpBq");
		let result = [];
		rowModules.forEach((row) => {
			const rowLetters = row.childNodes;
			let rowTiles = "";
			rowLetters.forEach((letter) => {
				const state = letter.firstChild.getAttribute("data-state");
				switch (state) {
					case "correct":
						rowTiles += "🟩";
						break;
					case "present":
						rowTiles += "🟨";
						break;
					case "absent":
						rowTiles += "⬜";
						break;
					default:
						break;
				}
			});
			result.push(rowTiles);
		});
		console.table(result);
		result = result.filter((row) => row.length > 0);
		// Send the data back to the popup script
		console.table(result);
		chrome.runtime.sendMessage({ data: result });
	}
});
