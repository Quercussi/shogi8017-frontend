import {UserModel} from "@/types/user";

type InvitationRequest =
    | RegularInvitationBody

type InvitationEvent =
    | InvitationNotificationEvent
    | InvitationInitializingEvent
    | InvalidInvitationEvent;


type InvitationNotificationEventPayload = {
    gameCertificate: string;
    invitingUser: UserModel;
}

type InvitationNotificationEvent = BaseWebSocketEvent<'InvitationNotification', InvitationNotificationEventPayload> 


type InvitationInitializingEventPayload = {
    gameCertificate: string;
}

type InvitationInitializingEvent = BaseWebSocketEvent<'InvitationResponse', InvitationInitializingEventPayload> 


type InvalidInvitationEventPayload = {
    errorMessage: string;
}

type InvalidInvitationEvent = BaseWebSocketEvent<'InvalidInvitation', InvalidInvitationEventPayload> 


type RegularInvitationBodyPayload = {
    userId: string;
}

type RegularInvitationBody = BaseWebSocketRequest<'invite', RegularInvitationBodyPayload> 

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