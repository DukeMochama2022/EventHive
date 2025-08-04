const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const emailTemplates = {
  // Welcome email for new users
  welcome: (username) => ({
    subject: "Welcome to EventHive! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to EventHive!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your journey to amazing events starts here</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}! 👋</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining EventHive! We're excited to have you as part of our community.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>🎯 Browse and book amazing event packages</li>
              <li>📅 Manage your bookings and schedules</li>
              <li>⭐ Leave reviews and ratings</li>
              <li>💬 Connect with event planners</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Exploring Events
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, feel free to contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Booking confirmation email
  bookingConfirmation: (bookingData) => ({
    subject: `Booking Confirmed - ${
      bookingData.packageName || "Event Package"
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Confirmed! ✅</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your event is all set</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.clientName || "there"
          }! 🎉</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your booking has been confirmed. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
              <p><strong>Time:</strong> ${
                bookingData.time || "To be confirmed with planner"
              }</p>
              <p><strong>Location:</strong> ${
                bookingData.location || "To be confirmed"
              }</p>
              <p><strong>Total Amount:</strong> KSH ${
                bookingData.amount || 0
              }</p>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-weight: bold;">📞 Contact your planner: ${
              bookingData.plannerEmail || "Contact details to be provided"
            }</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/dashboard/bookings" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View My Bookings
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Password reset email
  passwordReset: (resetToken) => ({
    subject: "Reset Your EventHive Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure your account</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello! 🔐</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/reset-password?token=${resetToken}" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Questions? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // New booking notification for planners
  newBookingNotification: (bookingData) => ({
    subject: `New Booking - ${bookingData.packageName || "Event Package"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Booking! 🎉</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You have a new client</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.plannerName || "Planner"
          }! 📈</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! You have received a new booking. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Client:</strong> ${
                bookingData.clientName || "Client"
              }</p>
              <p><strong>Client Email:</strong> ${
                bookingData.clientEmail || "Email not provided"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
              <p><strong>Time:</strong> ${
                bookingData.time || "To be confirmed"
              }</p>
              <p><strong>Location:</strong> ${
                bookingData.location || "To be confirmed"
              }</p>
              <p><strong>Amount:</strong> KSH ${bookingData.amount || 0}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/dashboard/bookings" 
               style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Contact the client at ${
              bookingData.clientEmail || "the provided email"
            } to discuss details.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Booking accepted notification for clients
  bookingAccepted: (bookingData) => ({
    subject: `Booking Accepted - ${bookingData.packageName || "Event Package"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Accepted! ✅</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your event is confirmed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.clientName || "there"
          }! 🎉</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your booking has been accepted by the planner. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Planner:</strong> ${
                bookingData.plannerName || "Event Planner"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
              <p><strong>Amount:</strong> KSH ${bookingData.amount || 0}</p>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-weight: bold;">📞 Contact your planner: ${
              bookingData.plannerEmail || "Contact details to be provided"
            }</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/dashboard/bookings" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View My Bookings
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Booking rejected notification for clients
  bookingRejected: (bookingData) => ({
    subject: `Booking Update - ${bookingData.packageName || "Event Package"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Update</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Important information about your booking</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.clientName || "there"
          }!</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            We regret to inform you that your booking request has been declined by the planner. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Planner:</strong> ${
                bookingData.plannerName || "Event Planner"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
              <p><strong>Amount:</strong> KSH ${bookingData.amount || 0}</p>
            </div>
          </div>
          
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #721c24; margin: 0; font-weight: bold;">💡 Don't worry! You can explore other planners and packages on our platform.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/packages" 
               style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Explore Other Packages
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Booking completed notification for clients
  bookingCompleted: (bookingData) => ({
    subject: `Event Completed - ${bookingData.packageName || "Event Package"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Event Completed! 🎊</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your event was a success</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.clientName || "there"
          }! 🎉</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! Your event has been marked as completed. We hope you had a wonderful experience!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <h3 style="color: #333; margin-top: 0;">Event Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Planner:</strong> ${
                bookingData.plannerName || "Event Planner"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
            </div>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0c5460; margin: 0; font-weight: bold;">⭐ Don't forget to leave a review for your planner!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/dashboard/bookings" 
               style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View My Bookings
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Booking cancelled notification for planners
  bookingCancelled: (bookingData) => ({
    subject: `Booking Cancelled - ${
      bookingData.packageName || "Event Package"
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A booking has been cancelled</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            bookingData.plannerName || "Planner"
          }!</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            A client has cancelled their booking. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <div style="color: #555; line-height: 1.8;">
              <p><strong>Package:</strong> ${
                bookingData.packageName || "Event Package"
              }</p>
              <p><strong>Client:</strong> ${
                bookingData.clientName || "Client"
              }</p>
              <p><strong>Client Email:</strong> ${
                bookingData.clientEmail || "Email not provided"
              }</p>
              <p><strong>Date:</strong> ${
                bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString()
                  : "To be confirmed"
              }</p>
              <p><strong>Amount:</strong> KSH ${bookingData.amount || 0}</p>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #495057; margin: 0; font-weight: bold;">📊 This cancellation has been reflected in your dashboard.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "https://event-hive-red.vercel.app"
            }/dashboard/bookings" 
               style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View My Bookings
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@eventhive.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 EventHive. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

// Email service functions
const emailService = {
  // Send welcome email to new users
  async sendWelcomeEmail(userEmail, username) {
    try {
      const template = emailTemplates.welcome(username);
      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || "EventHive <onboarding@resend.dev>",
        to: userEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Welcome email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't fail registration if email fails
      return { success: false, error: error.message };
    }
  },

  // Send booking confirmation email
  async sendBookingConfirmation(userEmail, bookingData) {
    try {
      const template = emailTemplates.bookingConfirmation(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: userEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Booking confirmation email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending booking confirmation email:", error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  async sendPasswordReset(userEmail, resetToken) {
    try {
      const template = emailTemplates.passwordReset(resetToken);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: userEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Password reset email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error: error.message };
    }
  },

  // Send new booking notification to planner
  async sendNewBookingNotification(plannerEmail, bookingData) {
    try {
      const template = emailTemplates.newBookingNotification(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: plannerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("New booking notification sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending new booking notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send booking accepted notification to client
  async sendBookingAcceptedNotification(clientEmail, bookingData) {
    try {
      const template = emailTemplates.bookingAccepted(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: clientEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Booking accepted notification sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending booking accepted notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send booking rejected notification to client
  async sendBookingRejectedNotification(clientEmail, bookingData) {
    try {
      const template = emailTemplates.bookingRejected(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: clientEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Booking rejected notification sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending booking rejected notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send booking completed notification to client
  async sendBookingCompletedNotification(clientEmail, bookingData) {
    try {
      const template = emailTemplates.bookingCompleted(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: clientEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Booking completed notification sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending booking completed notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send booking cancelled notification to planner
  async sendBookingCancelledNotification(plannerEmail, bookingData) {
    try {
      const template = emailTemplates.bookingCancelled(bookingData);
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to: plannerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log("Booking cancelled notification sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending booking cancelled notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Generic email sender
  async sendEmail(to, subject, html) {
    try {
      const result = await resend.emails.send({
        from: "EventHive <onboarding@resend.dev>",
        to,
        subject,
        html,
      });

      console.log("Email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  },
};

module.exports = emailService;
