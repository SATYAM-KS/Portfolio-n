# EmailJS Setup Guide for Satyam Singh's Portfolio

To activate real email sending with automatic welcoming auto-replies, follow these 4 quick steps:

## Step 1: Create a Free EmailJS Account
1. Visit **[EmailJS.com](https://www.emailjs.com/)** and sign up for a free account (includes 200 free emails/month).
2. Go to **Account** -> **API Keys** and copy your **Public Key** (e.g. `user_xxxxxxxxxxxx`).

## Step 2: Add an Email Service
1. In EmailJS Dashboard, click **Email Services** -> **Add New Service**.
2. Select **Gmail** (or your preferred email provider).
3. Connect your email (`contact.ksatyam@gmail.com`).
4. Note your **Service ID** (e.g. `service_xxxxxxx`).

## Step 3: Create the 2 Email Templates
### Template 1: Admin Notification (Sends inquiry to You)
1. Go to **Email Templates** -> **Create New Template**.
2. Set Subject: `New Project Inquiry from {{from_name}} ({{from_email}})`
3. Click the HTML editor button and paste the contents of `email-templates/notification-email.html`.
4. In Settings, ensure **To Email** is `contact.ksatyam@gmail.com` and **Reply-To** is `{{from_email}}`.
5. Save and copy the **Template ID** (e.g. `template_notification`).

### Template 2: Auto-Reply Welcome (Sends confirmation to the User)
1. Click **Create New Template**.
2. Set Subject: `Thank you for reaching out, {{to_name}}! — Satyam Singh`
3. Click the HTML editor button and paste the contents of `email-templates/welcome-email.html`.
4. In Settings, set **To Email** to `{{to_email}}`.
5. Save and copy the **Template ID** (e.g. `template_welcome`).

## Step 4: Add Your Keys to `assets/contact.js`
Open `assets/contact.js` and update the configuration object at the top:

```javascript
const EMAILJS_CONFIG = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",       // Replace with your Public Key
  serviceId: "YOUR_EMAILJS_SERVICE_ID",       // Replace with your Service ID
  notificationTemplateId: "YOUR_NOTIFICATION_TEMPLATE_ID", // Template 1
  autoReplyTemplateId: "YOUR_AUTOREPLY_TEMPLATE_ID",       // Template 2
  receiverEmail: "contact.ksatyam@gmail.com",
  receiverName: "Satyam Singh"
};
```
