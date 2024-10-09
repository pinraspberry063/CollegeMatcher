const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Import SendGrid
const sgMail = require("@sendgrid/mail");

// Initialize SendGrid with API Key from environment variables
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendBanNotification = functions.firestore
    .document("Users/{userId}")
    .onUpdate(async (change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();

      console.log("Function triggered for user:", context.params.userId);
      console.log("Previous value:", previousValue);
      console.log("New value:", newValue);

      if (newValue.IsBanned === true && previousValue.IsBanned !== true) {
        console.log("User banned. Sending notification email...");
        try {
          // Retrieve the user's email from Firestore
          const userEmail = newValue.Email;
          const banReason = newValue.BanReason || "No specific reason provided.";

          // Define the email content
          const msg = {
            to: userEmail,
            from: "kam069@email.latech.edu",
            subject: "UniVerse: Your Account Has Been Banned",
            text: `Hello,\n\nYour account has been banned from UniVerse.\n\nReason: ${banReason}`,
            html: `
                        <p>Hello,</p>
                        <p>Your account has been <strong>banned</strong> from UniVerse.</p>
                        <p><strong>Reason:</strong> ${banReason}</p>
                        <p>Best regards,<br/>UniVerse Team</p>
                    `,
          };

          // Send the email
          await sgMail.send(msg);
          console.log("Ban notification email sent to user", context.params.userId);

          return null;
        } catch (error) {
          console.error("Error in sendBanNotification function:", error);
          return null;
        }
      } else {
        console.log("User not banned or already banned. No action taken.");
        return null;
      }
    });
