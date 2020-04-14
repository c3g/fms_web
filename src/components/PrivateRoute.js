import React from "react";
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = ({isAuthenticated, children, ...rest}) => (
    <Route {...rest} render={({location}) => isAuthenticated
        ? children
        : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>
    } />
);

const mapStateToProps = state => ({
    isAuthenticated: !!(state.auth.token && !state.auth.didInvalidate)
});

export default connect(mapStateToProps)(PrivateRoute);
