chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const b = await chrome.storage.sync.get(['featureEnabled']) as { featureEnabled: boolean };
    if (!b.featureEnabled) return;
    const hostname = GetHostname(details.url);
    const pathname = GetPathname(details.url);
    chrome.bookmarks.search(hostname, results => {
        if (results.length > 0) {
            results.forEach(bookmark => {
                // 获取书签所在的文件夹ID
                if (!bookmark.parentId || GetPathname(bookmark.url ?? "") !== pathname)
                    return;
                chrome.bookmarks.getSubTree(bookmark.parentId, dir => {
                    if (dir.length > 0) {
                        const bookmarks = dir[0].children ?? [];
                        // 查找书签在文件夹中的索引
                        let index = bookmarks.findIndex(item => item.id === bookmark.id);
                        if (index !== -1 && index !== 0) { // 不在最前面
                            // 移动书签到最前面
                            chrome.bookmarks.move(bookmark.id, { index: 0 });
                        }
                    }
                });
            })
        }
    });
});

function GetHostname(url: string): string {
    return new URL(url).hostname;
}
function GetPathname(url: string): string {
    return new URL(url).pathname;
}