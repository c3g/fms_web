import {createNetworkActionTypes, networkAction} from "../../utils/actions";
import api from "../../utils/api";
import serializeFilterParams from "../../utils/serializeFilterParams";
import {SAMPLE_FILTERS} from "../../components/filters/descriptions";
import {DEFAULT_PAGINATION_LIMIT} from "../../config";

export const GET                   = createNetworkActionTypes("SAMPLES.GET");
export const ADD                   = createNetworkActionTypes("SAMPLES.ADD");
export const UPDATE                = createNetworkActionTypes("SAMPLES.UPDATE");
export const LIST                  = createNetworkActionTypes("SAMPLES.LIST");
export const SET_SORT_BY           = "SAMPLES.SET_SORT_BY";
export const SET_FILTER            = "SAMPLES.SET_FILTER";
export const CLEAR_FILTERS         = "SAMPLES.CLEAR_FILTERS";
export const LIST_VERSIONS         = createNetworkActionTypes("SAMPLES.LIST_VERSIONS");
export const LIST_TEMPLATE_ACTIONS = createNetworkActionTypes("SAMPLES.LIST_TEMPLATE_ACTIONS");
export const SUMMARY               = createNetworkActionTypes("SAMPLES.SUMMARY");

export const get = id => async (dispatch, getState) => {
    const sample = getState().samples.itemsByID[id];
    if (sample && sample.isFetching)
        return;

    return await dispatch(networkAction(GET, api.samples.get(id), { meta: { id } }));
};

export const add = sample => async (dispatch, getState) => {
    if (getState().samples.isFetching)
        return;

    return await dispatch(networkAction(ADD, api.samples.add(sample)));
};

export const update = (id, sample) => async (dispatch, getState) => {
    if (getState().samples.itemsByID[id].isFetching)
        return;

    return await dispatch(networkAction(UPDATE, api.samples.update(sample), { meta: { id } }));
};

export const setSortBy = (key, order) => {
    return {
        type: SET_SORT_BY,
        data: { key, order }
    }
};

export const setFilter = (name, value) => {
    return {
        type: SET_FILTER,
        data: { name, value }
    }
};

export const clearFilters = () => {
    return {
        type: CLEAR_FILTERS,
    }
};

export const list = ({ offset = 0, limit = DEFAULT_PAGINATION_LIMIT } = {}) => async (dispatch, getState) => {
    if (getState().samples.isFetching) return;

    const sampleFilters = getState().samples.filters
    const filters = serializeFilterParams(sampleFilters, SAMPLE_FILTERS)
    const options = { limit, offset, ...filters}

    return await dispatch(networkAction(LIST,
        api.samples.list(options),
        { meta: options }
    ));
};

export const listTemplateActions = () => (dispatch, getState) => {
    if (getState().sampleTemplateActions.isFetching) return;
    return dispatch(networkAction(LIST_TEMPLATE_ACTIONS, api.samples.template.actions()));
};

export const listVersions = (id) => async (dispatch, getState) => {
    const sample = getState().samples.itemsByID[id];
    if (!sample || sample.isFetching) return;

    return await dispatch(networkAction(
        LIST_VERSIONS,
        api.samples.listVersions(id),
        { meta: { id } }
    ));
}

export const summary = () => dispatch => dispatch(networkAction(SUMMARY, api.samples.summary()));

export default {
    GET,
    ADD,
    UPDATE,
    SET_SORT_BY,
    SET_FILTER,
    CLEAR_FILTERS,
    LIST,
    SUMMARY,
    LIST_VERSIONS,
    LIST_TEMPLATE_ACTIONS,
    get,
    add,
    update,
    setSortBy,
    setFilter,
    clearFilters,
    list,
    listVersions,
    listTemplateActions,
    summary,
};

