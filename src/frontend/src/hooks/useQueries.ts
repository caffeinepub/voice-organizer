import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reminder, Message, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

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

export function useGetReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: async () => {
      if (!actor) return [];
      // Use anonymous principal to fetch reminders in public mode
      return actor.getReminders(Principal.anonymous());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, notes, dueDate }: { title: string; notes?: string; dueDate?: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReminder(title, notes || null, dueDate || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useUpdateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, notes, dueDate }: { id: bigint; title: string; notes?: string; dueDate?: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminder(id, title, notes || null, dueDate || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useMarkReminderCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markReminderCompleted(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReminder(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useGetMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      // Use anonymous principal to fetch messages in public mode
      return actor.getMessages(Principal.anonymous());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Send to anonymous principal in public mode (shared message board)
      return actor.sendMessage(Principal.anonymous(), content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useSendReminderAsMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reminderId }: { reminderId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      // Send to anonymous principal in public mode (shared message board)
      return actor.sendReminderAsMessage(Principal.anonymous(), reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
