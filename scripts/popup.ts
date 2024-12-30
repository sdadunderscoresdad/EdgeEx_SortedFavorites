document.addEventListener('DOMContentLoaded', async () => {
    const switchElement = document.getElementById('switch') as HTMLInputElement;

    switchElement.checked = (await chrome.storage.sync.get(['featureEnabled']) as { featureEnabled: boolean } ?? false).featureEnabled;

    switchElement.addEventListener('change', () => {
        const isEnabled = switchElement.checked;
        chrome.storage.sync.set({ featureEnabled: isEnabled });
    });
});