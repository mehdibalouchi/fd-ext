function reset(){
    chrome.runtime.sendMessage({type: "fd-reset"}).then(console.log)
    console.log("sent")
  }

  document.getElementById("reset").onclick = reset