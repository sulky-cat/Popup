import Popup from "../src/Popup.js"
import BodyLock from "../src/BodyLock.js"

const popup = new Popup({
   // addCustomEvent: false,
})

// Пример 4
document.querySelector('.lock-button').onclick = function () {
   BodyLock.toggle()
   this.querySelector('span').innerHTML = BodyLock.isLock ? 'UNLOCK' : 'LOCK'
   document.body.style.backgroundColor = BodyLock.isLock ? '#e1e1e1' : ''
}

// Пример 6
const pop = document.querySelector('#popup_ex_6')
pop.addEventListener('onBeforeOpen', (e) => {
   console.log('onBeforeOpen', e.detail);
})
pop.addEventListener('onAfterOpen', (e) => {
   console.log('onAfterOpen', e.detail);
})
pop.addEventListener('onBeforeClose', (e) => {
   console.log('onBeforeClose', e.detail);
})
pop.addEventListener('onAfterClose', (e) => {
   console.log('onAfterClose', e.detail);
})

// Пример 8
document.querySelector('.init').onclick = () => {
   popup.init()
   popupEvent.init()
}
document.querySelector('.destroy').onclick = () => {
   popup.destroy()
   popupEvent.destroy()
}