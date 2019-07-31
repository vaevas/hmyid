const USER_TOKEN = 'token'
export const getUser = () => { return JSON.parse(window.localStorage.getItem(USER_TOKEN)) }
export const setUser = (data) => { window.localStorage.setItem(USER_TOKEN, JSON.stringify(data)) }
export const removeUser = () => { return window.localStorage.removeItem(USER_TOKEN) }
