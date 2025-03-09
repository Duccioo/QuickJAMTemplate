// Import configuration
import config from './config.js';

// Get Telegram configuration from config
const TELEGRAM_BOT_TOKEN = config.submission.telegram.botToken;
const TELEGRAM_CHAT_ID = config.submission.telegram.chatId;

// Function to send project submission notification to Telegram
async function sendTelegramNotification(projectData) {
    try {
        // Prepare the inline keyboard for accept/reject buttons
        const inlineKeyboard = {
            inline_keyboard: [
                [
                    { text: '✅ Accept', callback_data: `accept_${projectData.id}` },
                    { text: '❌ Reject', callback_data: `reject_${projectData.id}` }
                ]
            ]
        };

        // Prepare the message text
        const messageText = `🆕 New Project Submission\n\n` +
            `📝 Title: ${projectData.title}\n` +
            `📌 Subtitle: ${projectData.subtitle}\n` +
            `👤 Creator: ${projectData.creatorEmail}\n` +
            `🔗 GitHub: ${projectData.githubLink}`;

        // First, send the project image
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', projectData.image);
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        // Then send the project details with inline keyboard
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                reply_markup: inlineKeyboard,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send Telegram notification');
        }

        return true;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return false;
    }
}

// Function to handle project approval/rejection
async function handleProjectStatus(projectId, isApproved) {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        // Find and update the project's visibility
        const project = data.projects.find(p => p.id === parseInt(projectId));
        if (project) {
            project.visible = isApproved;
            
            // Save the updated projects data
            await fetch('data/projects.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Send confirmation message to Telegram
            const status = isApproved ? 'approved' : 'rejected';
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: `Project "${project.title}" has been ${status}.`,
                    parse_mode: 'Markdown'
                })
            });
        }
    } catch (error) {
        console.error('Error updating project status:', error);
    }
}

// Export functions for use in form-validation.js
export { sendTelegramNotification, handleProjectStatus };