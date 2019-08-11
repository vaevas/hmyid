// 防抖函数
export const debounce = function (func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
