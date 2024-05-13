import Popup from "../src/Popup.js"
import BodyLock from "../src/BodyLock.js"

const popup = new Popup({
   // hash: false,
})

document.querySelector('.lock-button').onclick = function () {
   BodyLock.toggle()
   this.querySelector('span').innerHTML = BodyLock.isLock ? 'UNLOCK' : 'LOCK'
   document.body.style.backgroundColor = BodyLock.isLock ? '#e1e1e1' : ''
}