type BaseWebSocketEvent<T extends string, P> = {
    type: T;
    event: P;
}

type BaseWebSocketRequest<T extends string, P> = {
    action: T;
    payload: P;
}
