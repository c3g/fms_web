import Container from "../modules/containers/actions.js"
import Sample from "../modules/samples/actions.js"
import Individual from "../modules/individuals/actions.js"
import {networkAction} from "./actions";
import api from ".//api"
import wait from "./wait"

let store = undefined

/** Initialized in src/index.js */
export const setStore = value => { store = value }

function createWithItem(type, apiType) {
  let ids = new Set()
  let delayedAction

  const requestItem = (id) => {
    if (ids.has(id))
      return
    store.dispatch({ type: type.GET.REQUEST, meta: { id } })
    ids.add(id)
    if (delayedAction)
      return
    fetchList()
  }

  const fetchList = () => {
    delayedAction =
      wait(20).then(async () => {
        const params = {
          limit: 25,
          id__in: Array.from(ids).join(',')
        }
        const listAction = store.dispatch(networkAction(type.LIST,
            apiType.list(params),
            { meta: { ...params, isTable: false } }
        ))
        ids = new Set()
        await listAction
        delayedAction = undefined
        // Some items were added while we were fetching the ids
        if (ids.size > 0)
          fetchList()
      })
    console.log('fetchList', delayedAction)
  }

  /**
   * @param {string} id
   * @param {Function} fn
   * @param {any} [defaultValue = null]
   */
  const withItem = (containersByID, id, fn, defaultValue = null) => {
    if (!id)
      return defaultValue

    const container = containersByID[id]

    if (!container) {
      requestItem(id)
      return defaultValue
    }

    if (container.isFetching)
      return defaultValue

    return fn(container)
  }

  return withItem
}

export const withContainer = createWithItem(Container, api.containers)
export const withSample = createWithItem(Sample, api.samples)
export const withIndividual = createWithItem(Individual, api.individuals)
export default {
  withContainer,
  withSample,
  withIndividual
};
