import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reminder, Message, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';
import { useCurrentUser } from './useCurrentUser';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      return actor.getUserProfile(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
    retry: false,
  });
}

export function useGetReminders() {
  const { actor, isFetching } = useActor();
  const { principal } = useCurrentUser();

  return useQuery<Reminder[]>({
    queryKey: ['reminders', principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getReminders(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ title, notes, dueDate }: { title: string; notes?: string; dueDate?: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReminder(title, notes || null, dueDate || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', principal] });
    },
  });
}

export function useUpdateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ id, title, notes, dueDate }: { id: bigint; title: string; notes?: string; dueDate?: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminder(id, title, notes || null, dueDate || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', principal] });
    },
  });
}

export function useMarkReminderCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markReminderCompleted(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', principal] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReminder(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', principal] });
    },
  });
}

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  const { principal } = useCurrentUser();

  return useQuery<Message[]>({
    queryKey: ['messages', principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getMessages(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ recipient, content }: { recipient: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(Principal.fromText(recipient), content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', principal] });
    },
  });
}

export function useSendReminderAsMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ recipient, reminderId }: { recipient: string; reminderId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendReminderAsMessage(Principal.fromText(recipient), reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', principal] });
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { principal } = useCurrentUser();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', principal] });
    },
  });
}
