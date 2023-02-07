console.log("PLUGIN LOADED")

// Create sidebar element
// Check if it should be visible

let searchResults = document.createElement("div")
searchResults.className = "search-results"
searchResults.classList.add("hide")
document.body.appendChild(searchResults)

const createCardElement = (id) => {
    let card = document.createElement("div")
    card.onclick = async () => {
        await chrome.runtime.sendMessage({type: "fd-select-item", selectedItem: id})
        window.location = "https://time.ir"
        highlight()
    }
    card.id = id

    return card
}
let cards = [createCardElement(0), createCardElement(1), createCardElement(2)]
searchResults.appendChild(cards[0])
searchResults.appendChild(cards[1])
searchResults.appendChild(cards[2])

let closeButton = document.createElement("button")
closeButton.innerHTML = "Close"
closeButton.onclick = async () => {
    await chrome.runtime.sendMessage({type: "fd-reset"})
    setShowSidebar()
}
searchResults.appendChild(closeButton)

const setShowSidebar = async () => {
    await chrome.runtime.sendMessage({ type: "fd-sidebar" }).then(res => {
        console.log({ res })
        if (res.showSideBar == true) {
            searchResults.classList.remove("hide")
            searchResults.classList.add("show")
        }
        else{
            searchResults.classList.remove("show")
            searchResults.classList.add("hide")
        }
    })
}
setShowSidebar()

// Highlight the selected item
const highlight = async() =>{
    const {selectedItem} = await chrome.runtime.sendMessage({type: "fd-item"})

    cards.forEach(card => {
        card.classList.remove("selected")
        if(card.id == selectedItem)
            card.classList.add("selected")
    })
}
highlight()

// Create searchbar element
// Set listener for showing sidebar on cmd+k

const search = async (evt) => {
    evt.preventDefault()
    await chrome.runtime.sendMessage({ type: "fd-search", data: input.value })
    await chrome.runtime.sendMessage({type: "fd-hide-sidebar"})
    await setShowSidebar()
    await chrome.runtime.sendMessage({type: "fd-show-sidebar"})
    setShowSidebar()
}

const elID = "fd-search-bar"
let searchBar = document.createElement("div")
searchBar.id = elID
searchBar.className = "hide"

let form = document.createElement("form")
form.onsubmit = search

let hiddenButton = document.createElement("button")
hiddenButton.type = "submit"
hiddenButton.hidden = true

let input = document.createElement("input")
input.type = "text"

form.appendChild(input)
form.appendChild(hiddenButton)
searchBar.appendChild(form)
document.body.appendChild(searchBar)

const showHideSearchBar = () => {
    
    const isHidden = searchBar.classList.contains("hide")
    
    if (isHidden) {
        searchBar.classList.remove("hide")
        searchBar.classList.add("show")
        
        input.focus()
    }
    else {
        searchBar.classList.remove("show")
        searchBar.classList.add("hide")
    }
    
}

let cmd = false
window.addEventListener("keydown", (key) => {
    if (key.code === "MetaLeft" || key.code === "MetaRight")
        cmd = true

    if (key.code === "KeyK" && cmd)
        showHideSearchBar()
})

window.addEventListener("keyup", (key) => {
    if (cmd == true && key.code === "MetaLeft" || key.code === "MetaRight")
        cmd = false
})

// Listen for a reset message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log({request})
    if(request.type == "fd-reset"){
        console.log("GOT IT")
        setShowSidebar()
    }
})


