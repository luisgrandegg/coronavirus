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
        doctorValidation: process.env.MAILING_TEMPLATES_DOCTOR_VALIDATION || 'd-4dda00767eb94de482469e2cb180815b',
        psychologistValidation: process.env.MAILING_TEMPLATES_PSYCHOLOGIST_VALIDATION || 'd-c539c325e9ba40e48e94c962b75d06ee'
    }
};

export const crypto = {
    secretKey: process.env.CRYPTO_SECRET_KEY || 'gatitos'
};

export const ipInfo = {
    token: process.env.IP_INFO_TOKEN || process.env.CITA_MEDIA_IP_INFO_TOKEN
}
