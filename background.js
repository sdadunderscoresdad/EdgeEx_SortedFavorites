chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    var hostname = GetHostname(details.url);
    var pathname = GetPathname(details.url);
    chrome.bookmarks.search(hostname, function (results) {
        if (results.length > 0) {
            results.forEach(function (bookmark) {
                var _a;
                // 获取书签所在的文件夹ID
                if (!bookmark.parentId || GetPathname((_a = bookmark.url) !== null && _a !== void 0 ? _a : "") !== pathname)
                    return;
                chrome.bookmarks.getSubTree(bookmark.parentId, function (dir) {
                    var _a;
                    if (dir.length > 0) {
                        var bookmarks = (_a = dir[0].children) !== null && _a !== void 0 ? _a : [];
                        // 查找书签在文件夹中的索引
                        var index = bookmarks.findIndex(function (item) { return item.id === bookmark.id; });
                        if (index !== -1 && index !== 0) { // 不在最前面
                            // 移动书签到最前面
                            chrome.bookmarks.move(bookmark.id, { index: 0 });
                        }
                    }
                });
            });
        }
    });
});
function GetHostname(url) {
    return new URL(url).hostname;
}
function GetPathname(url) {
    return new URL(url).pathname;
}
