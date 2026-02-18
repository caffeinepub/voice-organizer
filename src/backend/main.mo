import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ReminderId = Nat;
  type MessageId = Nat;

  type Reminder = {
    id : ReminderId;
    title : Text;
    notes : ?Text;
    dueDate : ?Time.Time;
    completed : Bool;
    createdBy : Principal;
  };

  type Message = {
    id : MessageId;
    sender : Principal;
    recipient : Principal;
    content : Text;
    timestamp : Time.Time;
    isReminder : Bool;
    reminder : ?Reminder;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextReminderId : ReminderId = 0;
  var nextMessageId : MessageId = 0;

  let reminders = Map.empty<Principal, Map.Map<ReminderId, Reminder>>();
  let messages = Map.empty<Principal, List.List<Message>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Profile management - no authorization required per implementation plan
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  // Anyone can view any profile (guests allowed)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // Anyone can save their profile (guests allowed)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Reminder operations - no authorization required per implementation plan
  // Anonymous/guest users can create reminders
  public shared ({ caller }) func createReminder(title : Text, notes : ?Text, dueDate : ?Time.Time) : async ReminderId {
    let id = nextReminderId;
    let reminder : Reminder = {
      id;
      title;
      notes;
      dueDate;
      completed = false;
      createdBy = caller;
    };

    switch (reminders.get(caller)) {
      case (null) {
        let newMap = Map.empty<ReminderId, Reminder>();
        newMap.add(id, reminder);
        reminders.add(caller, newMap);
      };
      case (?userReminders) {
        userReminders.add(id, reminder);
      };
    };

    nextReminderId += 1;
    id;
  };

  // Anyone can read reminders (guests allowed)
  public query ({ caller }) func getReminders(user : Principal) : async [Reminder] {
    switch (reminders.get(user)) {
      case (null) { [] };
      case (?userReminders) {
        userReminders.values().toArray();
      };
    };
  };

  // Anyone can update their reminders (guests allowed)
  public shared ({ caller }) func updateReminder(reminderId : ReminderId, title : Text, notes : ?Text, dueDate : ?Time.Time) : async () {
    switch (reminders.get(caller)) {
      case (null) { () };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { () };
          case (?reminder) {
            let updatedReminder : Reminder = {
              reminder with
              title;
              notes;
              dueDate;
            };
            userReminders.add(reminderId, updatedReminder);
          };
        };
      };
    };
  };

  // Anyone can mark reminders completed (guests allowed)
  public shared ({ caller }) func markReminderCompleted(reminderId : ReminderId) : async () {
    switch (reminders.get(caller)) {
      case (null) { () };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { () };
          case (?reminder) {
            let updatedReminder = {
              reminder with
              completed = true;
            };
            userReminders.add(reminderId, updatedReminder);
          };
        };
      };
    };
  };

  // Anyone can delete their reminders (guests allowed)
  public shared ({ caller }) func deleteReminder(reminderId : ReminderId) : async () {
    switch (reminders.get(caller)) {
      case (null) { () };
      case (?userReminders) {
        if (not userReminders.containsKey(reminderId)) {
          ();
        };
        userReminders.remove(reminderId);
      };
    };
  };

  // Message operations - no authorization required per implementation plan
  // Anyone can send messages (guests allowed)
  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async MessageId {
    let message : Message = {
      id = nextMessageId;
      sender = caller;
      recipient;
      content;
      timestamp = Time.now();
      isReminder = false;
      reminder = null;
    };

    switch (messages.get(recipient)) {
      case (null) {
        let newInbox = List.empty<Message>();
        newInbox.add(message);
        messages.add(recipient, newInbox);
      };
      case (?userMessages) {
        userMessages.add(message);
      };
    };

    nextMessageId += 1;
    message.id;
  };

  // Anyone can send reminders as messages (guests allowed)
  public shared ({ caller }) func sendReminderAsMessage(recipient : Principal, reminderId : ReminderId) : async MessageId {
    switch (reminders.get(caller)) {
      case (null) { 0 };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { 0 };
          case (?reminder) {
            let message : Message = {
              id = nextMessageId;
              sender = caller;
              recipient;
              content = "Reminder: " # reminder.title;
              timestamp = Time.now();
              isReminder = true;
              reminder = ?reminder;
            };

            switch (messages.get(recipient)) {
              case (null) {
                let newInbox = List.empty<Message>();
                newInbox.add(message);
                messages.add(recipient, newInbox);
              };
              case (?userMessages) {
                userMessages.add(message);
              };
            };

            nextMessageId += 1;
            message.id;
          };
        };
      };
    };
  };

  // Anyone can read messages (guests allowed)
  public query ({ caller }) func getMessages(user : Principal) : async [Message] {
    switch (messages.get(user)) {
      case (null) { [] };
      case (?userMessages) { userMessages.toArray() };
    };
  };

  // Anyone can delete their messages (guests allowed)
  public shared ({ caller }) func deleteMessage(messageId : MessageId) : async () {
    switch (messages.get(caller)) {
      case (null) { () };
      case (?userMessages) {
        let filtered = userMessages.filter(func(m) { m.id != messageId });
        messages.add(caller, filtered);
      };
    };
  };

  // Public query - no authorization needed
  public query ({ caller }) func getAppVersion() : async Text {
    "1.0.0";
  };
};
