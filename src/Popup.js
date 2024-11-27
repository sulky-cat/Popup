import BodyLock from './BodyLock.js'
import Timer from './Timer.js'

export default class Popup {
   #focusEl = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
   ]
   // HTML options
   waitClosing = false
   bodyLocking = true
   lastFocusEl = false
   youtube = false

   #defaultOpt = {
      hash: true,
      addCustomEvent: true,

      transitionClass: 'popup-transition',
      htmlClass: 'popup-show',
      activePopup: 'popup-open',

      youtubePlaceSelector: '[data-yt-place]',

      attributeWait: 'data-wait',
      attributeNoLock: 'data-save-body-state',

      openAttribute: 'data-popup',
      closeAttribute: 'data-close',
   }
   /**
    * Конструктор класса
    * @param {Object} opt Объект настроек класса.
    */
   constructor(opt) {
      this.opt = { ...this.#defaultOpt, ...opt }

      this.onclick = this.onclick.bind(this)
      this.onKeyDown = this.onKeyDown.bind(this)
      if (this.opt.hash) this.onHashOpen = this.onHashOpen.bind(this)

      this.init()
   }
   /**
    * Установка событий.
    */
   init() {
      document.addEventListener('click', this.onclick)
      document.addEventListener('keydown', this.onKeyDown)
      if (this.opt.hash) {
         window.addEventListener('hashchange', this.onHashOpen)
         window.addEventListener('load', this.onHashOpen)
      }
   }
   /**
    * Удаление событий.
    */
   destroy() {
      document.removeEventListener('click', this.onclick)
      document.removeEventListener('keydown', this.onKeyDown)
      if (this.opt.hash) {
         window.removeEventListener('hashchange', this.onHashOpen)
         window.removeEventListener('load', this.onHashOpen)
      }
   }
   /**
    * Открытие модального окна.
    *
    * @param {String} selector селектор, по которому откроется модальное окно.
    * @returns                 Promise.
    */
   async open(selector) {
      // Проверка на существование необходимого модального окна
      if (!document.querySelector(selector))
         throw new Error(
            `Не существует модального окна с селектолром "${selector}"`
         )
      // Проверка на то, чтобы не шло открытие/закрытие
      if (this.transition) return

      // Закрытие при повторном открытии (попап из попапа)
      if (BodyLock.isLock || this.isOpen) {
         this.checkPrevBodyLock = true

         if (this.waitClosing) {
            await this.close()
            this.checkPrevBodyLock = false
         } else this.close()
      }

      this.window = document.querySelector(selector)
      this.selector = selector

      if (this.opt.hash) this.#setHash(this.selector)

      // CusomEvent
      if (this.opt.addCustomEvent) this.#generateEvent('BeforeOpen')

      document.body.classList.add(this.opt.transitionClass)
      document.documentElement.classList.add(this.opt.htmlClass)
      this.window.classList.add(this.opt.activePopup)
      this.window.setAttribute('aria-hidden', 'false')

      if (this.bodyLocking) BodyLock.on()

      // Past YouTube video
      if (this.youtube) {
         try {
            this.placeVideo = this.window.querySelector(
               this.opt.youtubePlaceSelector
            )
            this.placeVideo.appendChild(this.#iframe)
         } catch {
            console.error('Не указано место для вставки видео.')
         }
      }

      // Открытие
      const duration =
         parseFloat(window.getComputedStyle(this.window).transitionDuration) *
         1000
      await Timer.start({ duration })

      document.body.classList.remove(this.opt.transitionClass)

      this.isOpen = true
      this.#focusTrap()

      if (this.opt.addCustomEvent) this.#generateEvent('AfterOpen')
   }
   /**
    * Закрытие модального окна.
    *
    * @returns Promise
    */
   async close() {
      if (this.transition || !this.window) return

      // CusomEvent
      if (this.opt.addCustomEvent) this.#generateEvent('BeforeClose')

      document.body.classList.add(this.opt.transitionClass)
      this.window.classList.remove(this.opt.activePopup)

      const duration =
         parseFloat(window.getComputedStyle(this.window).transitionDuration) *
         1000
      await Timer.start({ duration })

      if (!this.checkPrevBodyLock) {
         this.#removeHash()
         document.documentElement.classList.remove(this.opt.htmlClass)
         document.body.classList.remove(this.opt.transitionClass)

         if (this.bodyLocking) BodyLock.off()
      }

      if (!this.waitClosing) this.checkPrevBodyLock = false

      // YouTube
      if (this.youtube) this.placeVideo.innerHTML = ''

      // Возврат фокуса
      if (this.lastFocusEl) this.lastFocusEl.focus()

      this.window.setAttribute('aria-hidden', 'true')

      this.isOpen = false

      if (this.opt.addCustomEvent) this.#generateEvent('AfterClose')
   }
   get transition() {
      return document.body.classList.contains(this.opt.transitionClass)
   }
   // События для работы
   onclick(e) {
      if (this.transition) return

      const openBtn = e.target.closest(`[${this.opt.openAttribute}]`)
      const closeBtn = e.target.closest(`[${this.opt.closeAttribute}]`)

      if (
         closeBtn ||
         (this.isOpen && !e.target.closest(`${this.selector} .popup__content`))
      ) {
         this.close()
         return
      }

      if (openBtn) {
         this.openBtn = openBtn
         this.waitClosing = this.openBtn.hasAttribute(this.opt.attributeWait)
         this.bodyLocking = !this.openBtn.hasAttribute(this.opt.attributeNoLock)
         this.youtube = this.openBtn.dataset.yt

         if (!this.openBtn.closest(this.selector))
            this.lastFocusEl = this.openBtn

         this.selector = this.openBtn.getAttribute(this.opt.openAttribute)
         this.open(this.selector)

         return
      }
   }
   onKeyDown(e) {
      // Прекращение табуляции при открытии попапа
      if (document.body.classList.contains(this.opt.transitionClass)) {
         e.preventDefault()
         e.stopPropagation()
      }
      if (this.transition) return
      if (!this.isOpen) return

      // Tab
      if (e.which === 9 && e.code === 'Tab') {
         this.#focusCatch(e)
         return
      }
      // Escape
      if (e.which === 27 && e.code === 'Escape') {
         e.preventDefault()
         this.close()
         return
      }
   }
   onHashOpen(e) {
      let hash = window.location.hash
      if (!hash) {
         this.close()
         return
      }

      if (hash[1] === '.') hash = hash.substring(1)

      const attr = `[data-popup="${hash}"]`
      try {
         this.openBtn = document.querySelector(attr)
         this.#setSettings()
      } catch {
         console.error(`Нет элемента с атрибутом ${attr}`)
      }
      this.open(hash)
   }
   get #iframe() {
      const urlVideo = `https://www.youtube.com/embed/${this.youtube}`
      const iframe = document.createElement('iframe')
      iframe.setAttribute('allowfullscreen', '')
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
      iframe.setAttribute('title', 'YouTube video player')
      iframe.setAttribute(
         'allow',
         `accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share`
      )
      iframe.setAttribute('src', urlVideo)

      return iframe
   }
   #generateEvent(when) {
      const customEvent = new CustomEvent(`on${when}`, {
         detail: this,
         bubbles: true,
      })
      this.window.dispatchEvent(customEvent)
   }
   #focusTrap() {
      const focusable = this.window.querySelectorAll(this.#focusEl)
      focusable[0].focus()
   }
   #setHash(hash) {
      if (hash[0] !== '#') hash = `#${hash}`

      history.pushState('', '', hash)
   }
   #removeHash() {
      const href = window.location.href.replace(window.location.hash, '')
      history.pushState('', '', href)
   }
   #focusCatch(e) {
      const focusArray = Array.from(this.window.querySelectorAll(this.#focusEl))
      const focusedIndex = focusArray.indexOf(document.activeElement)

      if (e.shiftKey && focusedIndex === 0) {
         focusArray[focusArray.length - 1].focus()
         e.preventDefault()
      } else if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
         focusArray[0].focus()
         e.preventDefault()
      }
   }
   #setSettings() {
      this.waitClosing = this.openBtn.hasAttribute('data-wait')
      this.bodyLocking = !this.openBtn.hasAttribute('data-no-body-lock')
      this.youtube = this.openBtn.dataset.yt
   }
}
