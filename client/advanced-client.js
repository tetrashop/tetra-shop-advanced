// client/advanced-client.js
const axios = require('axios');

class AdvancedTetraClient {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.quantumServices = {
            '2d-to-3d': `${baseURL}/api/quantum/2d-to-3d`,
            'ocr': `${baseURL}/api/quantum/ocr`,
            'writer': `${baseURL}/api/quantum/writer`,
            'compute': `${baseURL}/api/quantum/compute`,
            'object-line': `${baseURL}/api/object-line/status`
        };
    }

    // تبدیل 2D به 3D
    async convert2DTo3D(imagePath) {
        try {
            const formData = new FormData();
            // در محیط واقعی فایل را اضافه می‌کنیم
            const response = await axios.post(this.quantumServices['2d-to-3d'], formData);
            return response.data;
        } catch (error) {
            console.error('خطا در تبدیل 2D به 3D:', error);
            throw error;
        }
    }

    // پردازش OCR
    async processOCR(imagePath) {
        try {
            const formData = new FormData();
            const response = await axios.post(this.quantumServices['ocr'], formData);
            return response.data;
        } catch (error) {
            console.error('خطا در پردازش OCR:', error);
            throw error;
        }
    }

    // تولید محتوای هوشمند
    async generateContent(text, style = 'علمی') {
        try {
            const response = await axios.post(this.quantumServices['writer'], {
                text,
                style,
                context: 'تولید محتوای پیشرفته'
            });
            return response.data;
        } catch (error) {
            console.error('خطا در تولید محتوا:', error);
            throw error;
        }
    }

    // محاسبات ابری
    async delegateComputation(task, clientResources = { cpu: '2 cores', ram: '4GB' }) {
        try {
            const response = await axios.post(this.quantumServices['compute'], {
                task,
                clientResources
            });
            return response.data;
        } catch (error) {
            console.error('خطا در محاسبات ابری:', error);
            throw error;
        }
    }

    // بررسی وضعیت سرور اشیاء لاین
    async checkObjectLineStatus() {
        try {
            const response = await axios.get(this.quantumServices['object-line']);
            return response.data;
        } catch (error) {
            console.error('خطا در بررسی وضعیت:', error);
            throw error;
        }
    }
}

module.exports = AdvancedTetraClient;
