let showSideBar = false
let selectedItem = -1

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case "fd-search":
            console.log(`Searched for ${request.data}`)
            break
        case "fd-show-sidebar":
            showSideBar = true
            break
        case "fd-hide-sidebar":
            showSideBar = false
            break
        case "fd-sidebar":
            sendResponse({showSideBar})
            break
        case "fd-select-item":
            selectedItem = request.selectedItem
            break
        case "fd-item":
            sendResponse({selectedItem})
            break
        case "fd-reset":
            selectedItem = -1
            showSideBar = false
            break;
        default:
            throw "Invalid request type"
    }
})