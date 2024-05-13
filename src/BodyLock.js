export default class BodyLock {

   static on() {
      if (this.isLock) return

      const paddingRight = `${window.innerWidth - document.body.offsetWidth}px`

      const fixElements = document.querySelectorAll('[data-lp]')
      if (fixElements.length)
         fixElements.forEach(el => el.style.paddingRight = paddingRight)

      document.body.style.paddingRight = paddingRight
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'

      document.documentElement.classList.add('lock')
   }

   static off() {
      if (!this.isLock) return

      const fixElements = document.querySelectorAll('[data-lp]')
      if (fixElements.length)
         fixElements.forEach(el => el.style.paddingRight = '')

      document.body.style.paddingRight = '';
      document.body.style.overflow = ''
      document.body.style.touchAction = ''

      document.documentElement.classList.remove("lock");
   }

   static toggle() {
      if (this.isLock) this.off()
      else this.on()
   }

   static get isLock() {
      return document.documentElement.classList.contains('lock')
   }
}