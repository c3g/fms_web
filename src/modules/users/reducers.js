import { merge, set } from "object-path-immutable";

import preprocessVersions from "../../utils/preprocessVersions";
import {objectsByProperty} from "../../utils/objects";
import USERS from "./actions";

export const users = (
    state = {
        itemsByID: {},
        serverCount: 0,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: null,
    },
    action
) => {
    switch (action.type) {
        case USERS.LIST.REQUEST:
            return { ...state, isFetching: true };
        case USERS.LIST.RECEIVE:
            return {
                ...state,
                itemsByID: preprocessUsers(action.data, state.itemsByID),
                serverCount: action.data.length,
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt
            };
        case USERS.LIST.ERROR:
            return { ...state, isFetching: false, error: action.error, };

        case USERS.LIST_VERSIONS.REQUEST:
            return set(state, ['itemsByID', action.params.id, 'isFetching'], true);
        case USERS.LIST_VERSIONS.RECEIVE:
            return merge(state, ['itemsByID', action.params.id], {
                isFetching: false,
                versions: preprocessVersions(action.data),
            });
        case USERS.LIST_VERSIONS.ERROR:
            return merge(state, ['itemsByID', action.params.id], {
                isFetching: false,
                versions: [],
                error: action.error,
            });

        default:
            return state;
    }
};

function preprocessUsers(users, previousUsersByID) {
    const usersByID = objectsByProperty(users, "id");

    Object.keys(previousUsersByID).forEach(id => {
        if (previousUsersByID[id].versions)
            usersByID[id].versions = previousUsersByID[id].versions;
    })

    return usersByID;
}
