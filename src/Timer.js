export default class Timer {
   /**
    * Начало отсчета
    * @param   {Function}  func        Вызываемая функция при каждом отсчете. Передается текущее время (процесс).
    * @param   {Number}    duration    Длительность.
    * @param   {*}         returnValue Значение, которое будет передоваться в resolve.
    * @returns {Promise}               false - если анимация запрещена в данный момент; Promise - после удачного выполнения.
    */
   static start({ func = () => { }, duration = 500, returnValue }) {
      return new Promise(resolve => {
         const start = new Date()
         const end = new Date().getTime() + duration

         const update = () => {
            const time = Math.min(Date.now(), end) - start
            func(time)

            if (time < duration) requestAnimationFrame(update)
            else resolve(returnValue)
         }

         requestAnimationFrame(update)
      })
   }
}
