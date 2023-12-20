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

	// Function to show notification
	function showNotification(title, message) {
		chrome.notifications.create({
			type: "basic",
			iconUrl: "icon.png", // You can replace this with the path to your extension icon
			title: title,
			message: message
		});
	}
});
