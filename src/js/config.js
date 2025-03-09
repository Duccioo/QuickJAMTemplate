// Configuration file for Code JAM Template

const config = {
  // Theme Configuration
  theme: {
    // Color palette
    colors: {
      primary: "#8a2be2", // Vibrant purple
      secondary: "#ff6b6b", // Coral accent
      dark: "#2d2d2d",
      light: "#F5F5FA",
    },
    // Font families
    fonts: {
      heading: "'Press Start 2P', cursive",
      body: "'JetBrains Mono', monospace",
    },
  },
  // Event Information
  event: {
    name: "OpenTemplate JAM",
    subtitle: "Showcase your skills and creativity!",
    ctaText: "View Projects",
    ctaLink: "#projects",
    year: 2025,
  },

  // Submission Configuration
  submission: {
    // Notification method: 'telegram' or 'email'
    notificationMethod: "email",

    // Telegram Configuration (used if notificationMethod is 'telegram')
    telegram: {
      botToken: "YOUR_BOT_TOKEN",
      chatId: "YOUR_CHAT_ID",
      // If true, will use webhook, if false will use polling (for demo/development)
      useWebhook: false,
      webhookUrl: "https://your-server.com/webhook/YOUR_BOT_TOKEN",
    },

    // Email Configuration (used if notificationMethod is 'email')
    email: {
      // Recipient email address for project submissions
      recipientEmail: "admin@codejam.example.com",
      // Email subject prefix
      subjectPrefix: "[Code JAM Submission]",
      // SMTP configuration (for server-side implementation)
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
  },

  // Prizes Configuration
  prizes: {
    // Number of prizes to display (1-4)
    count: 4,
    // Prize details
    items: [
      {
        title: "First Prize",
        icon: "🏆",
        description:
          "€000 cash prize + Professional mentorship from industry experts",
        className: "first-prize",
      },
      {
        title: "Second Prize",
        icon: "🥈",
        description: "€500 cash prize + Premium developer tools subscription",
        className: "second-prize",
      },
      {
        title: "Third Prize",
        icon: "🥉",
        description: "€250 cash prize + Digital gift cards",
        className: "third-prize",
      },
      {
        title: "Honorable Mentions",
        icon: "🎖️",
        description:
          "Recognition on our website and social media channels + Digital certificates",
        className: "honorable-mention",
      },
    ],
    // Note displayed below prizes
    note: "All participants will receive a participation certificate",
  },
};

export default config;
