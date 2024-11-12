import { randomUUID } from "crypto";
export const notifications = [
  {
    id: randomUUID(),
    message: `<p>Hi [name],<br><p>Welcome aboard! Your account has been created and now you can start engaging with others through chats, and update your  profile from time to time!</p><p>Here's what you can do:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, you are most welcome, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
    link: "signup",
    usage: "signup",
  },
  {
    id: randomUUID(),
    message: `<p>Hi [name],<br><p>We noticed that you have not updated your profile in a long time, so we are reaching out to remind you to update your information.</p><p>Some of the information you might need to update include:</p><ul><li>Your address,</li><li>Your profile picture,</li><li>Your biography,</li></ul><p>Kindly update this information as soon as you can to keep your information up to date!</p><div><a href='/dashboard/update-profile'>Update</a><a href='/dashboard/profile'>Not Updating</a></div><p>We hope you keep having a great time. Move around and chat with friends!</p><p>Best Regards,<br>The Admin</p>`,
    link: "updateReminder",
    usage: "update",
  },
  {
    id: randomUUID(),
    message: `<p>Hi [name],<br><p>Your profile has been updated successfully! It's important to keep your information up to date to help us help you!</p><p>Here's what you can do now:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, thank you for updating your profile, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
    link: "updated",
    usage: "updated",
  },
];
