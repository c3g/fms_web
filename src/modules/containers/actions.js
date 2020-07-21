import {createNetworkActionTypes, networkAction} from "../../utils/actions";
import api from "../../utils/api"
import {DEFAULT_PAGINATION_LIMIT} from "../../config";

export const GET = createNetworkActionTypes("CONTAINERS.GET");
export const LIST = createNetworkActionTypes("CONTAINERS.LIST");
export const LIST_PARENTS = createNetworkActionTypes("CONTAINERS.LIST_PARENTS");
export const LIST_CHILDREN = createNetworkActionTypes("CONTAINERS.LIST_CHILDREN");
export const LIST_SAMPLES = createNetworkActionTypes("CONTAINERS.LIST_SAMPLES");
export const LIST_KINDS = createNetworkActionTypes("CONTAINERS.LIST_KINDS");
export const LIST_TEMPLATE_ACTIONS = createNetworkActionTypes("CONTAINERS.LIST_TEMPLATE_ACTIONS");
export const SUMMARY = createNetworkActionTypes("CONTAINERS.SUMMARY");

export const get = id => async (dispatch, getState) => {
    const container = getState().containers.itemsByID[id];
    if (container && container.isFetching)
        return;

    await dispatch(networkAction(GET, api.containers.get(id), { meta: { id } }));
};

export const list = ({ offset = 0, limit = DEFAULT_PAGINATION_LIMIT } = {}) => async (dispatch, getState) => {
    if (getState().containers.isFetching)
        return;

    const pageOptions = { limit, offset }

    await dispatch(networkAction(LIST,
        api.containers.list(pageOptions),
        { meta: pageOptions }
    ));
};

export const listParents = (id) => async (dispatch, getState) => {
    const container = getState().containers.itemsByID[id];
    if (!container || container.isFetching) return;

    await dispatch(networkAction(
        LIST_PARENTS,
        api.containers.listParents(id),
        { meta: { id } }
    ));
};

/**
 * @param {String} id
 * @param {String[]} excludes - list of containers already loaded; avoid showing them as loading
 */
export const listChildren = (id, excludes = []) => async (dispatch, getState) => {
    const container = getState().containers.itemsByID[id];
    if (!container || container.isFetching) return;

    await dispatch(networkAction(
        LIST_CHILDREN,
        api.containers.listChildren(id),
        { meta: { id, excludes } }
    ));
};

export const listSamples = (id) => async (dispatch, getState) => {
    const container = getState().containers.itemsByID[id];
    if (!container || container.isFetching) return;

    await dispatch(networkAction(
        LIST_SAMPLES,
        api.containers.listSamples(id),
        { meta: { id, samples: container.samples } }
    ));
};

export const listKinds = () => async (dispatch, getState) => {
    // Check if we're already fetching or have fetched container kinds first (they won't change dynamically.)
    if (getState().containerKinds.isFetching || getState().containerKinds.items.length > 0)
        return;

    await dispatch(networkAction(LIST_KINDS, api.containerKinds.list()));
};

export const listTemplateActions = () => (dispatch, getState) => {
    if (getState().containerTemplateActions.isFetching) return;
    return dispatch(networkAction(LIST_TEMPLATE_ACTIONS, api.containers.template.actions()));
};

export const summary = () => dispatch => dispatch(networkAction(SUMMARY, api.containers.summary()));

export default {
    GET,
    LIST,
    LIST_PARENTS,
    LIST_CHILDREN,
    LIST_SAMPLES,
    LIST_KINDS,
    LIST_TEMPLATE_ACTIONS,
    SUMMARY,
    get,
    list,
    listParents,
    listChildren,
    listSamples,
    listKinds,
    listTemplateActions,
    summary,
};
