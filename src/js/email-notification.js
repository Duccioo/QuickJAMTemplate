// Email notification module for Code JAM submissions
import config from './config.js';

/**
 * Sends an email notification about a new project submission
 * Note: This is a client-side implementation for demonstration purposes.
 * In a production environment, you would typically handle email sending on the server side.
 * 
 * @param {Object} projectData - The project submission data
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendEmailNotification(projectData) {
    try {
        // In a real implementation, this would send an API request to your server
        // which would then use a library like nodemailer to send the actual email
        console.log('Email notification would be sent in production environment');
        
        // Get email configuration
        const emailConfig = config.submission.email;
        
        // Log what would happen in a real implementation
        console.log(`Would send email to: ${emailConfig.recipientEmail}`);
        console.log(`Subject: ${emailConfig.subjectPrefix} ${projectData.title}`);
        console.log(`Body would include project details and image attachment`);
        
        // Simulate a successful email send for demo purposes
        // In a real implementation, you would return true only if the email was actually sent
        return true;
    } catch (error) {
        console.error('Error sending email notification:', error);
        return false;
    }
}

/**
 * Updates the project status (approved/rejected) and notifies the creator
 * 
 * @param {string} projectId - The ID of the project to update
 * @param {boolean} isApproved - Whether the project was approved
 * @returns {Promise<void>}
 */
async function handleEmailProjectStatus(projectId, isApproved) {
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
            
            // In a real implementation, this would send an email to the project creator
            console.log(`Would send email to: ${project.creatorEmail}`);
            console.log(`Subject: Your Code JAM Project ${isApproved ? 'Approved' : 'Rejected'}`);
            console.log(`Body would include project details and status information`);
        }
    } catch (error) {
        console.error('Error updating project status:', error);
    }
}

export { sendEmailNotification, handleEmailProjectStatus };