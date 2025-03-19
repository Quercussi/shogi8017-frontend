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
        getById: (userId: string) => `${root}/user/${userId}`,
    },
    game: {
        paginatedGet: `${root}/game`,
        paginatedGetHistory: (gameCertificate:string) =>  `${root}/game/${gameCertificate}/history`,
        getDefaultConfiguration: `${root}/game/defaultConfiguration`,
    }
}

export default apiEndpoints