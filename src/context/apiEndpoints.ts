const root = '/api'

const apiEndpoints = {
    auth: {
        login: `${root}/login`,
        refresh: `${root}/refresh`,
    },
    user: {
        signUp: `${root}/signUp`,
    }
}

export default apiEndpoints