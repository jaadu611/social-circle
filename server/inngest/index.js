import { Inngest } from "inngest";
import User from "../models/user.model.js";

export const inngest = new Inngest({ id: "social-circle" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const email = email_addresses?.[0]?.email_address;
      if (!email) throw new Error("Email address missing in event data.");

      let username = email.split("@")[0];
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        username =
          username +
          existingUser._id.toString().slice(-4) +
          Math.floor(Math.random() * 1000);
      }

      const userData = new User({
        _id: id,
        full_name: `${first_name} ${last_name}`,
        email,
        profile_picture: image_url,
        username,
      });

      await userData.save();
      await step.run("user-synced", async () => ({ success: true }));
    } catch (error) {
      await step.run("user-sync-error", async () => ({ error: error.message }));
      throw error;
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;

      const updateUserData = {
        email: email_addresses?.[0]?.email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
      };

      await User.findByIdAndUpdate(id, updateUserData);
      await step.run("user-updated", async () => ({ success: true }));
    } catch (error) {
      await step.run("user-updation-error", async () => ({
        error: error.message,
      }));
      throw error;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      await step.run("user-deleted", async () => ({ success: true }));
    } catch (error) {
      await step.run("user-deletion-error", async () => ({
        error: error.message,
      }));
      throw error;
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
