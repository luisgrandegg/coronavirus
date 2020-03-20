export const database = {
    url: process.env.MONGODB_URI || process.env.CITA_MEDIA_MONGODB_URI
};

export const server = {
    domain: process.env.DOMAIN || 'http://localhost:3200',
    port: parseInt(process.env.PORT, 10) || 3200
};

export const mailer = {
    apiKey: process.env.MAILING_API_KEY,
    from: process.env.MAILING_FROM || 'pati@citamedicaencasa.com',
    templates: {
        newDoctor: process.env.MAILING_TEMPLATES_NEW_DOCTOR || 'd-9f7405f0fd8b472c9c14eeb30d0a8d8c',
        doctorValidation: process.env.MAILING_TEMPLATES_DOCTOR_VALIDATION || 'd-4dda00767eb94de482469e2cb180815b',
        inquiryReported: process.env.MAILING_TEMPLATES_INQUIRY_REPORTED || 'd-7cae476b55484743990d41e2363317ac'
    }
};

export const crypto = {
    secretKey: process.env.CRYPTO_SECRET_KEY || 'gatitos'
};
