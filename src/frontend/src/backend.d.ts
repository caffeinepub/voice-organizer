import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type ReminderId = bigint;
export interface Reminder {
    id: ReminderId;
    title: string;
    createdBy: Principal;
    completed: boolean;
    dueDate?: Time;
    notes?: string;
}
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    reminder?: Reminder;
    recipient: Principal;
    sender: Principal;
    timestamp: Time;
    isReminder: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReminder(title: string, notes: string | null, dueDate: Time | null): Promise<ReminderId>;
    deleteMessage(messageId: MessageId): Promise<void>;
    deleteReminder(reminderId: ReminderId): Promise<void>;
    getAppVersion(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(user: Principal): Promise<Array<Message>>;
    getReminders(user: Principal): Promise<Array<Reminder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markReminderCompleted(reminderId: ReminderId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(recipient: Principal, content: string): Promise<MessageId>;
    sendReminderAsMessage(recipient: Principal, reminderId: ReminderId): Promise<MessageId>;
    updateReminder(reminderId: ReminderId, title: string, notes: string | null, dueDate: Time | null): Promise<void>;
}
