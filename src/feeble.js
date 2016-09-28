import React from 'react'
import { Provider } from 'react-redux'
import model from './model'
import createApiMiddleware from './middlewares/api'
import createSagaMiddleware from './middlewares/saga'
import Entity from './models/Entity'
import createStore from './createStore'

function feeble(options = {}) {
  const _stated = false
  const _app = {}
  const _models = []
  const _store = {}
  const _middlewares = []
  let _tree = null
  let _sagaMiddleware = null

  function middleware(...middlewares) {
    _middlewares.push(...middlewares)
  }

  function model(...models) {
    _models.push(...models)
  }

  function addDefaultMiddlewares() {
    if (options.callApi) {
      middleware(createApiMiddleware(options.callApi))
    }
    _sagaMiddleware = createSagaMiddleware(_models)
    middleware(_sagaMiddleware)
  }

  function addDefaultModels() {
    model(Entity)
  }

  function start() {
    Object.assign(_store, createStore(_models, _middlewares))

    _sagaMiddleware.run()
  }

  function mount(component) {
    if (!_stated) {
      start()
    }
    _tree = (
      <Provider store={_store}>
        {component}
      </Provider>
    )

    return _tree
  }

  function tree() {
    return _tree
  }

  function use(ext) {
    return ext(_app)
  }

  addDefaultModels()
  addDefaultMiddlewares()

  Object.assign(_app, {
    middleware,
    model,
    mount,
    store: _store,
    tree,
    use,
    start,
  })

  return _app
}

feeble.model = model

export default feeble
