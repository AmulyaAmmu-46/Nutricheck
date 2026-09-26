const dotenv = require('dotenv');
dotenv.config();

const { sendProteinNotification } = require('./utils/emailService');
const { generateMealReportPDF } = require('./utils/pdfService');

async function test() {
    try {
        console.log("Generating PDF...");
        const pdfBuffer = await generateMealReportPDF({
            food: { breakfast: "Eggs", lunch: "Chicken", dinner: "Steak", snacks: "Nuts" },
            proteinTracking: { requiredProtein: 150, consumedProtein: 100, remainingProtein: 50 }
        });
        console.log("PDF generated. Buffer length:", pdfBuffer.length);

        console.log("Sending email...");
        await sendProteinNotification(process.env.EMAIL_USER, {
            requiredProtein: 150, consumedProtein: 100, remainingProtein: 50
        }, pdfBuffer);
        console.log("Email sent successfully!");
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
