import {UserModel} from "@/types/user";

type InvitationEvent =
    | InvitationNotificationEvent
    | InvitationInitializingEvent
    | InvalidInvitationEvent;

interface InvitationNotificationEvent {
    type: 'InvitationNotification';
    gameCertificate: string;
    invitingUser: UserModel;
}

interface InvitationInitializingEvent {
    type: 'InvitationResponse';
    gameCertificate: string;
}

interface InvalidInvitationEvent {
    type: 'InvalidInvitation';
    errorMessage: string;
}

export type {
    InvitationEvent,
    InvitationNotificationEvent,
    InvitationInitializingEvent,
    InvalidInvitationEvent,
};