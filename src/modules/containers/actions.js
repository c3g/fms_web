import {createNetworkActionTypes, networkAction} from "../../utils/actions";
import {constVal} from "../../utils/functions";

export const FETCH_CONTAINER_KINDS = createNetworkActionTypes("FETCH_CONTAINER_KINDS");
export const FETCH_CONTAINERS = createNetworkActionTypes("FETCH_CONTAINERS");  // TODO: Pagination
export const FETCH_CONTAINER = createNetworkActionTypes("FETCH_CONTAINERS");  // TODO: Pagination

const _fetchContainerKinds = networkAction(FETCH_CONTAINER_KINDS, constVal("/container-kinds/"));
export const fetchContainerKinds = () => async (dispatch, getState) => {
    // Check if we're already fetching or have fetched container kinds first (they won't change dynamically.)
    if (getState().containerKinds.isFetching || getState().containerKinds.items.length > 0) return;
    await dispatch(_fetchContainerKinds());
}

const _fetchContainers = networkAction(FETCH_CONTAINERS, constVal("/containers/"));
export const fetchContainers = () => async (dispatch, getState) => {
    if (getState().containers.isFetching) return;
    // TODO: Account for pagination
    if (!getState().containers.didInvalidate && getState().containers.items.length > 0) return;
    await dispatch(_fetchContainers());
};

// TODO: Track errored responses to avoid spam
const _fetchContainer = networkAction(FETCH_CONTAINER, ({barcode}) => `/containers/${barcode}/`);
export const fetchContainer = barcode => async (dispatch, getState) => {
    if (!barcode
            || getState().containers.isFetching
            || barcode in getState().containers.itemsByBarcode
            || getState().containers.isFetchingBarcodes.includes(barcode)) {
        return;
    }
    await dispatch(_fetchContainer(undefined, {barcode}));
};
