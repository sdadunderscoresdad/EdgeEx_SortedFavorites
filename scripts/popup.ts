document.addEventListener('DOMContentLoaded', async () => {
    const switchElement = document.getElementById('switch') as HTMLInputElement;
    const switchLabel = switchElement.parentElement as HTMLLabelElement;

    switchElement.checked = (await chrome.storage.sync.get(['featureEnabled']) as { featureEnabled: boolean } ?? false).featureEnabled;
    // 打开开关动画
    // 大概是因为在这里设置会抢在绘制任务之前把类移除吧，所以这里设置了一个小延时，等绘制任务完成后再移除
    // 应该有更优雅的做法，但是现在就先这样，又不是不能用，说到底本来咱就不是专业的前端
    setTimeout(() => switchLabel.classList.remove('no-transition'), 10);

    switchElement.addEventListener('change', () => {
        const isEnabled = switchElement.checked;
        chrome.storage.sync.set({ featureEnabled: isEnabled });
    });
});