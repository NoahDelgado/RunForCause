import React from 'react';

const UserContext = React.createContext({
    user: {
        username: '',
        isLoggedIn: false
    },
    setIsLogguedIn: {}
});

export default UserContext; 