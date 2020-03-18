export const database = {
    url: process.env.MONGODB_URI || process.env.CITA_MEDIA_MONGODB_URI
};

export const server = {
    domain: process.env.DOMAIN || 'http://localhost:3200',
    port: parseInt(process.env.PORT, 10) || 3200
};

export const mailer = {
    apiKey: process.env.MAILING_API_KEY,
    from: process.env.MAILING_FROM || 'hola@citamedicaencasa.com',
    templates: {
        newDoctor: process.env.MAILING_TEMPLATES_NEW_DOCTOR || 'd-895ae05960fa4ea5a4083b335ca2d80c'
    }
};

export const crypto = {
    secretKey: process.env.CRYPTO_SECRET_KEY || 'gatitos'
};
