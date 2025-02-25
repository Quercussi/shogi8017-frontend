import {UserModel} from "@/types/user";

type InvitationRequest =
    | RegularInvitationBody

type InvitationEvent =
    | InvitationNotificationEvent
    | InvitationInitializingEvent
    | InvalidInvitationEvent;


interface BaseWebSocketEvent<T extends string, P> {
    type: T;
    event: P;
}

interface BaseWebSocketRequest<T extends string, P> {
    action: T;
    payload: P;
}


interface InvitationNotificationEventPayload {
    gameCertificate: string;
    invitingUser: UserModel;
}

interface InvitationNotificationEvent extends BaseWebSocketEvent<'InvitationNotification', InvitationNotificationEventPayload> {}


interface InvitationInitializingEventPayload {
    gameCertificate: string;
}

interface InvitationInitializingEvent extends BaseWebSocketEvent<'InvitationResponse', InvitationInitializingEventPayload> {}


interface InvalidInvitationEventPayload {
    errorMessage: string;
}

interface InvalidInvitationEvent extends BaseWebSocketEvent<'InvalidInvitation', InvalidInvitationEventPayload> {}


interface RegularInvitationBodyPayload {
    userId: string;
}

interface RegularInvitationBody extends BaseWebSocketRequest<'invite', RegularInvitationBodyPayload> {}

export type {
    InvitationRequest,
    RegularInvitationBody,

    RegularInvitationBodyPayload,

    InvitationEvent,
    InvitationNotificationEvent,
    InvitationInitializingEvent,
    InvalidInvitationEvent,

    InvitationNotificationEventPayload,
    InvitationInitializingEventPayload,
    InvalidInvitationEventPayload,
};