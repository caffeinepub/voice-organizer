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

  // Profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Users can view their own profile, admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Only authenticated users can save profiles
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Reminder operations
  public shared ({ caller }) func createReminder(title : Text, notes : ?Text, dueDate : ?Time.Time) : async ReminderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create reminders");
    };

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

  // Users can only read their own reminders, admins can read any
  public query ({ caller }) func getReminders(user : Principal) : async [Reminder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reminders");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access your own reminders");
    };

    switch (reminders.get(user)) {
      case (null) { [] };
      case (?userReminders) {
        userReminders.values().toArray();
      };
    };
  };

  // Users can only update their own reminders
  public shared ({ caller }) func updateReminder(reminderId : ReminderId, title : Text, notes : ?Text, dueDate : ?Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reminders");
    };

    switch (reminders.get(caller)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { Runtime.trap("Reminder not found") };
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

  // Users can only mark their own reminders completed
  public shared ({ caller }) func markReminderCompleted(reminderId : ReminderId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark reminders completed");
    };

    switch (reminders.get(caller)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { Runtime.trap("Reminder not found") };
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

  // Users can only delete their own reminders
  public shared ({ caller }) func deleteReminder(reminderId : ReminderId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete reminders");
    };

    switch (reminders.get(caller)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?userReminders) {
        if (not userReminders.containsKey(reminderId)) {
          Runtime.trap("Reminder not found");
        };
        userReminders.remove(reminderId);
      };
    };
  };

  // Message operations
  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    // Verify recipient is also a user
    if (not (AccessControl.hasPermission(accessControlState, recipient, #user))) {
      Runtime.trap("Unauthorized: Can only send messages to authenticated users");
    };

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

  // Users can send their own reminders as messages to other users
  public shared ({ caller }) func sendReminderAsMessage(recipient : Principal, reminderId : ReminderId) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send reminder messages");
    };
    // Verify recipient is also a user
    if (not (AccessControl.hasPermission(accessControlState, recipient, #user))) {
      Runtime.trap("Unauthorized: Can only send messages to authenticated users");
    };

    switch (reminders.get(caller)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?userReminders) {
        switch (userReminders.get(reminderId)) {
          case (null) { Runtime.trap("Reminder not found") };
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

  // Users can only read their own messages, admins can read any
  public query ({ caller }) func getMessages(user : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access messages");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access your own messages");
    };

    switch (messages.get(user)) {
      case (null) { [] };
      case (?userMessages) { userMessages.toArray() };
    };
  };

  // Users can only delete their own messages
  public shared ({ caller }) func deleteMessage(messageId : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete messages");
    };

    switch (messages.get(caller)) {
      case (null) { Runtime.trap("Message not found") };
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
