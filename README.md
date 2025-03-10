# Quick JAM TEMPLATE

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A customizable template for organizing and hosting Code JAM competitions. This template provides everything you need to set up a coding competition website with project submissions, rules display, and prize information.

[Check the preview HERE !!!](https://duccioo.github.io/QuickJAMTemplate/)

![JAM Preview](assets/example.gif)

## 📋 Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Project Showcase**: Display submitted projects in a visually appealing grid
- **Submission Form**: Built-in form for project submissions
- **Rules Display**: Markdown-based rules that are easy to update
- **Prize Showcase**: Configurable prize display section
- **Customizable Theme**: Easily change colors, fonts, and content
- **Notification System**: Support for email or Telegram notifications

## 🚀 Getting Started

### Prerequisites

- A web server or hosting service to deploy the website
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/OpenTemplateJAM.git
   ```

2. Upload the files to your web server or hosting service

3. Customize the configuration in `js/config.js` to match your event details

4. Update the rules in `rules.md` to reflect your competition guidelines

5. Modify the project data in `data/projects.json` to showcase submitted projects

## ⚙️ Configuration

The template is highly configurable through the `js/config.js` file. Here are the main configuration options:

### Theme Configuration

```javascript
theme: {
  // Color palette
  colors: {
    primary: "#8a2be2", // Vibrant purple
    secondary: "#ff6b6b", // Coral accent
    dark: "#2d2d2d",
    light: "#F0F0F5",
  },
  // Font families
  fonts: {
    heading: "'Press Start 2P', cursive",
    body: "'Helvetica Neue', sans-serif",
  },
}
```

### Event Information

```javascript
event: {
  name: "OpenTemplate JAM",
  subtitle: "Showcase your skills and creativity!",
  ctaText: "View Projects",
  ctaLink: "#projects",
  year: 2025,
}
```

### Notification Configuration

The template supports two notification methods for project submissions:

#### Email Notifications

```javascript
submission: {
  notificationMethod: "email",
  email: {
    recipientEmail: "admin@codejam.example.com",
    subjectPrefix: "[Code JAM Submission]",
    smtp: {
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "notifications@example.com",
        pass: "your-password",
      },
    },
  },
}
```

#### Telegram Notifications

```javascript
submission: {
  notificationMethod: "telegram",
  telegram: {
    botToken: "YOUR_BOT_TOKEN",
    chatId: "YOUR_CHAT_ID",
    useWebhook: false,
    webhookUrl: "https://your-server.com/webhook/YOUR_BOT_TOKEN",
  },
}
```

### Prize Configuration

```javascript
prizes: {
  count: 4, // Number of prizes to display (1-4)
  items: [
    {
      title: "First Prize",
      icon: "🏆",
      description: "€1000 cash prize + Professional mentorship from industry experts",
      className: "first-prize",
    },
    // Additional prizes...
  ],
  note: "All participants will receive a participation certificate",
}
```

## 📝 Updating Competition Rules

The competition rules are stored in the `rules.md` file in Markdown format. Edit this file to update your competition rules. The changes will be automatically reflected on the rules page.

## 📊 Managing Project Submissions

Project submissions are stored in the `data/projects.json` file. You can manually update this file or implement server-side logic to automatically update it when users submit projects through the submission form.

## 🔧 Customization

### Styling

The main stylesheet is located at `css/style.css`. You can modify this file to customize the appearance of the website beyond what's available in the configuration file.

### Adding Pages

To add new pages to the website:

1. Create a new HTML file based on the existing pages
2. Add links to the new page in the navigation menu in each HTML file
3. Update the JavaScript files as needed to support the new page

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the template.

## 📞 Feedback

If you have any feedback, please reach out to me at meconcelliduccio@gmail.com or visit my website
[duccio.me](https://duccio.me)

## Authors

- [@duccioo](https://github.com/Duccioo)

---

Made with ❤️ for the coding community
