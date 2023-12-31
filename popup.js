document.addEventListener("DOMContentLoaded", function () {
	// Export Tabs button
	document.getElementById("exportBtn").addEventListener("click", function () {
		chrome.tabs.query({}, function (tabs) {
			const tabLinks = tabs.map(tab => tab.url);
			const tabLinksText = tabLinks.join('\n');

			// Save tab links to chrome.storage.sync
			chrome.storage.sync.set({ "tabLinksText": tabLinksText }, function () {
				if (chrome.runtime.lastError) {
					console.error("Error saving tab links:", chrome.runtime.lastError);
					showNotification("Export Failed", "There was an error saving tab links.");
				} else {
					console.log("Tab links saved successfully.");
					showNotification("Export Successful", "Tab links saved successfully.");
				}
			});
		});
	});

	// Restore Tabs button
	document.getElementById("restoreBtn").addEventListener("click", function () {
		// Retrieve tab links from chrome.storage.sync
		chrome.storage.sync.get("tabLinksText", function (data) {
			const tabLinksText = data.tabLinksText;

			if (!tabLinksText) {
				console.error("No tab links found in storage.");
				return;
			}

			const urls = tabLinksText.split('\n');

			// Open tabs for each URL
			urls.forEach(url => {
				chrome.tabs.create({ url });
			});
		});
	});

	// Download Tabs button
	document.getElementById("downloadBtn").addEventListener("click", function () {
		chrome.tabs.query({}, function (tabs) {
			const filenameInput = document.getElementById("filenameInput");
			const customFilename = filenameInput.value.trim();
			const tabLinks = tabs.map(tab => tab.url);
			const tabLinksText = tabLinks.join('\n');

			if (!tabLinksText) {
				console.error("No opened tabs.");
				return;
			}

			// Create a Blob containing the text
			const blob = new Blob([tabLinksText], { type: "text/plain" });

			// Generate filename with the format "Tab_Links_yearY_monthM_dayD_hourH_minutesM_secondS.txt"
			const now = new Date();
			const filename = `${customFilename}__${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}__${padZero(now.getHours())};${padZero(now.getMinutes())};${padZero(now.getSeconds())}.txt`;
			// Create a link element and click it to trigger the download
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = filename;
			document.body.appendChild(a);
			a.click();

			// Cleanup
			document.body.removeChild(a);
		});
	});

	// Function to show notification
	function showNotification(title, message) {
		chrome.notifications.create({
			type: "basic",
			iconUrl: "icon.png", // You can replace this with the path to your extension icon
			title: title,
			message: message
		});
	}

	// Function to pad a number with leading zeros
	function padZero(num) {
		return num.toString().padStart(2, '0');
	}

	// Help button
	document.getElementById("helpBtn").addEventListener("click", function () {
		// Open the help.html in a new tab
		chrome.tabs.create({ url: chrome.runtime.getURL("help.html") });
	});
});
