const root = '/api/v1'

const apiEndpoints = {
    auth: {
        login: `${root}/public/login`,
        refresh: `${root}/token/refreshToken`,
        websocket: `${root}/token/websocketToken`,
    },
    user: {
        signUp: `${root}/public/signUp`,
        paginatedSearch: `${root}/user/search`,
        getById: `${root}/user`,
    },
    game: {
        paginatedGet: `${root}/game`
    }
}

export default apiEndpoints