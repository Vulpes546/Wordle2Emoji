const btn = document.querySelector("button.get");
const btnCopy = document.querySelector("button.copy");
const body = document.querySelector("body");
const resultP = document.querySelector(".result");

let resultString = "";

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	// Get the active tab
	if (tabs[0].url.includes("https://www.nytimes.com/games/wordle/index.html")) {
		btn.disabled = false;
	}
});

btn.addEventListener("click", () => {
	// Popup script
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// Get the active tab
		const activeTab = tabs[0];

		// Send a message to the content script of the active tab to initiate the data transfer
		chrome.tabs.sendMessage(activeTab.id, { action: "sendData" });
	});
});

// Popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	// Check if the message contains the data sent from the content script
	if (message.data) {
		// Access the data and do something with it
		message.data.forEach((row) => {
			const rowP = document.createElement("p");
			rowP.classList.add("row");
			rowP.textContent = row;
			resultP.appendChild(rowP);
			resultString += row + "\n";
			resultString.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "");
		});
		btnCopy.style.display = "inline-block";
	}
});

btnCopy.addEventListener("click", () => {
	if (resultString.length > 0) {
		// Create a temporary textarea element
		const textarea = document.createElement("textarea");
		textarea.textContent = resultString;

		// Make the textarea non-editable to avoid focus and unwanted interactions
		textarea.setAttribute("readonly", "");

		// Set the CSS styles to position, hide, and add overflow hidden to the textarea
		textarea.style.width = "0";
		textarea.style.height = "0";
		textarea.style.position = "fixed";
		textarea.style.top = "0";
		textarea.style.left = "0";
		textarea.style.overflow = "hidden";

		document.body.appendChild(textarea);

		// Copy the value to the clipboard
		textarea.select();
		document.execCommand("copy");

		// Clean up - remove the textarea from the DOM
		document.body.removeChild(textarea);
		btnCopy.textContent = "Copied!";
		setTimeout(() => {
			btnCopy.textContent = "Copy";
		}, 2000);
	}
});
