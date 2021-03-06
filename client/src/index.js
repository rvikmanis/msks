import Promise from 'bluebird'
import _ from 'lodash'
import fp from 'lodash/fp'
// eslint-disable-next-line no-unused-vars
import Rx from 'rxjs'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'
import createSocketIoMiddleware from 'redux-socket.io'

import { initialState } from './state'
import { rootReducer } from  './reducers'
import { rootEpic } from './epics'
import {
  setBroken, setVisibility, navigated,
  socketConnected, socketDisconnected,
} from './actions'
import * as actions from './actions'
import * as selectors from './selectors'
import { colorize, bold, italic, underline } from './text'
import App from './components/App'

import history from  './history'
import socket from './socket'

import viewportUnitsBuggyfill from 'viewport-units-buggyfill'

import 'loaders.css/loaders.min.css'
import 'hamburgers/dist/hamburgers.min.css'

import './index.css'

window.Promise = Promise

viewportUnitsBuggyfill.init()

const socketMiddleware = createSocketIoMiddleware(socket, 'server/')

const loggerMiddleware = createLogger({
  duration: true,
  timestamp: false,
  collapsed: true,
})

const epicMiddleware = createEpicMiddleware(rootEpic)

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    thunkMiddleware,
    epicMiddleware,
    socketMiddleware,
    loggerMiddleware
  )
)

const { dispatch, getState } = store

window.addEventListener('error', () => {
  dispatch(setBroken())
})

dispatch(
  navigated({
    location: history.location,
    action: 'PUSH',
  })
)
history.listen((location, action) => {
  dispatch(
    navigated({
      location,
      action,
    })
  )
})

socket.on('connect', () => {
  dispatch(socketConnected())
})
socket.on('disconnect', () => {
  dispatch(socketDisconnected())
})

const onReady = () => {
  const mountNode = document.getElementById('root')
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), mountNode)
}

const onVisibilityChange = () => {
  const isVisible = !document.hidden
  dispatch(setVisibility(isVisible))
}

document.addEventListener('DOMContentLoaded', onReady)
document.addEventListener('visibilitychange', onVisibilityChange)

window._ = _
window.fp = fp
window.socket = socket
window.store = store
window.dispatch = dispatch
window.getState = getState
window.actions = actions
window.selectors = selectors
window.colorize = colorize
window.bold = bold
window.italic = italic
window.underline = underline
