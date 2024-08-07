// backend/index.js
const express = require('express');
const imaps = require('imap-simple');
const pdf = require('pdf-parse');
const fs = require('fs');
const { simpleParser } = require('mailparser');
const app = express();
const port = 3001;

app.get('/fetch-emails', async (req, res) => {
    const config = {
        imap: {
            user: 'your-email@gmail.com',
            password: 'your-email-password',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };

    npm install express imap-simple pdf-parse fs mailparser


    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const message of messages) {
            const parts = imaps.getParts(message.attributes.struct);
            const attachments = parts.filter(part => part.disposition && part.disposition.type === 'attachment');

            for (const attachment of attachments) {
                const attachmentData = await connection.getPartData(message, attachment);
                fs.writeFileSync(attachment.params.name, attachmentData);
                const dataBuffer = fs.readFileSync(attachment.params.name);
                const data = await pdf(dataBuffer);
                // Send extracted text to frontend or save it in the database
                res.json({ text: data.text });
            }
        }

        await connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching emails');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
