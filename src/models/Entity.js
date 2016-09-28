import feebleModel from '../model'
import merge from 'lodash/fp/merge'
import omit from 'lodash/fp/omit'
import toArray from 'utils/toArray'

const model = feebleModel({
  namespace: 'entity',
  state: {},
})

model.action('insert', (name, data) => ({ name, data }))
model.action('update', (name, data) => ({ name, data }))
model.action('drop', (name, ids) => ({ name, ids }))

model.proxyActions = ['insert', 'update', 'drop']

model.reducer(on => {
  const pattern = action => action.payload && action.payload.entities
  on(pattern, (state, payload) => merge(state, payload.entities))

  on(model.insert, (state, payload) => ({
    ...state,
    [payload.name]: {
      ...state[payload.name],
      ...payload.data,
    },
  }))

  on(model.update, (state, payload) => ({
    ...state,
    [payload.name]: {
      ...state[payload.name],
      ...payload.data,
    },
  }))

  on(model.drop, (state, payload) => ({
    ...state,
    [payload.name]: omit(state[payload.name], toArray(payload.ids)),
  }))
})

export default model
