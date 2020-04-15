import {fetchContainerKinds, fetchContainers} from "../containers/actions";
import {fetchIndividuals} from "../individuals/actions";
import {fetchSamples} from "../samples/actions";

export const fetchAuthorizedData = () => async (dispatch, getState) => {
    if (!getState().auth.tokens.access) return;
    // TODO: Check auth token validity
    await Promise.all([
        fetchContainerKinds,  // Most of the time this will have already been done
        fetchContainers,
        fetchIndividuals,
        fetchSamples,
        // TODO: Versions
    ].map(a => dispatch(a())))
};
