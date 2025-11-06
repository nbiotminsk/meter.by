/**
 * Calculator Proposal Generator
 * Generates commercial proposals using calculator-template.html
 */

class CalculatorProposalGenerator {
    constructor(services, companyInfo) {
        this.services = services;
        this.companyInfo = companyInfo;
        this.template = null;
    }

    /**
     * Load HTML template
     */
    async loadTemplate() {
        try {
            const response = await fetch('data/calculator-template.html');
            if (!response.ok) {
                throw new Error('Failed to load template');
            }
            this.template = await response.text();
            return this.template;
        } catch (error) {
            console.error('Error loading template:', error);
            throw error;
        }
    }

    /**
     * Calculate total price
     */
    calculateTotal() {
        if (!this.services || this.services.length === 0) {
            return 0;
        }
        return this.services.reduce((total, service) => {
            const price = parseFloat(service.price) || 0;
            const quantity = parseInt(service.quantity) || 1;
            return total + (price * quantity);
        }, 0);
    }

    /**
     * Convert number to Russian words
     */
    numberToWords(num) {
        const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
        const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
        const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
        const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
        const thousands = ['', 'одна тысяча', 'две тысячи', 'три тысячи', 'четыре тысячи', 'пять тысяч', 'шесть тысяч', 'семь тысяч', 'восемь тысяч', 'девять тысяч'];

        if (num === 0) return 'ноль';

        let result = '';
        const intPart = Math.floor(num);
        const decPart = Math.round((num - intPart) * 100);

        // Thousands
        const thousandsPart = Math.floor(intPart / 1000);
        if (thousandsPart > 0) {
            if (thousandsPart < 10) {
                result += thousands[thousandsPart] + ' ';
            } else {
                const th = Math.floor(thousandsPart / 10);
                const to = thousandsPart % 10;
                if (th === 1 && to > 0) {
                    result += teens[to] + ' тысяч ';
                } else {
                    result += tens[th] + ' ';
                    if (to === 1) result += 'одна тысяча ';
                    else if (to === 2) result += 'две тысячи ';
                    else if (to > 2 && to < 5) result += ones[to] + ' тысячи ';
                    else if (to >= 5) result += ones[to] + ' тысяч ';
                }
            }
        }

        // Hundreds, tens, ones
        const remainder = intPart % 1000;
        const h = Math.floor(remainder / 100);
        const t = Math.floor((remainder % 100) / 10);
        const o = remainder % 10;

        if (h > 0) result += hundreds[h] + ' ';
        
        if (t === 1) {
            result += teens[o] + ' ';
        } else {
            if (t > 0) result += tens[t] + ' ';
            if (o > 0) result += ones[o] + ' ';
        }

        // Add currency
        result += 'рублей';

        // Add kopecks if present
        if (decPart > 0) {
            result += ' ' + decPart + ' копеек';
        }

        return result.trim();
    }

    /**
     * Generate services table HTML
     */
    generateServicesTable() {
        if (!this.services || this.services.length === 0) {
            return '<p>Услуги не выбраны</p>';
        }

        let html = `
            <table class="price-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">№</th>
                        <th style="width: 50%;">Наименование работ</th>
                        <th style="width: 10%;">Ед. изм.</th>
                        <th style="width: 10%;">Кол-во</th>
                        <th style="width: 12%;">Цена, BYN</th>
                        <th style="width: 13%;">Сумма, BYN</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.services.forEach((service, index) => {
            const quantity = parseInt(service.quantity) || 1;
            const price = parseFloat(service.price) || 0;
            const total = (price * quantity).toFixed(2);

            html += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${service.name}</td>
                    <td style="text-align: center;">шт</td>
                    <td style="text-align: center;">${quantity}</td>
                    <td style="text-align: right;">${price.toFixed(2)}</td>
                    <td style="text-align: right;">${total}</td>
                </tr>
            `;
        });

        const grandTotal = this.calculateTotal();
        html += `
                <tr style="font-weight: bold; background-color: #f0f0f0;">
                    <td colspan="5" style="text-align: right; padding-right: 10px;">ИТОГО:</td>
                    <td style="text-align: right;">${grandTotal.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        `;

        return html;
    }

    /**
     * Replace template variables
     */
    replaceVariables(template) {
        const currentDate = new Date();
        const validUntilDate = new Date(currentDate);
        validUntilDate.setDate(validUntilDate.getDate() + 30);

        const formatDate = (date) => {
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        };

        const total = this.calculateTotal();
        const totalInWords = this.numberToWords(total);

        // Generate services table
        const servicesTable = this.generateServicesTable();

        // Replace all variables
        let result = template;
        
        result = result.replace(/{{DATE}}/g, formatDate(currentDate));
        result = result.replace(/{{VALID_UNTIL}}/g, formatDate(validUntilDate));
        result = result.replace(/{{COMPANY_NAME}}/g, this.companyInfo.companyName || '');
        result = result.replace(/{{UNP}}/g, this.companyInfo.unp || '');
        result = result.replace(/{{ADDRESS}}/g, this.companyInfo.address || '');

        // Insert services table before the footer section
        const footerMarker = '<div class="footer-info">';
        if (result.includes(footerMarker)) {
            result = result.replace(footerMarker, servicesTable + '\n\n' + footerMarker);
        } else {
            // Fallback: insert before closing body tag
            result = result.replace('</body>', servicesTable + '\n</body>');
        }

        // Replace total amount placeholder
        result = result.replace(
            /<strong>Итого:<\/strong> __________/g,
            `<strong>Итого:</strong> ${total.toFixed(2)} BYN (${totalInWords})`
        );

        return result;
    }

    /**
     * Generate and show preview
     */
    async generatePreview() {
        try {
            // Load template
            await this.loadTemplate();

            // Replace variables
            const html = this.replaceVariables(this.template);

            // Show preview in modal
            await this.showPreviewModal(html);

        } catch (error) {
            console.error('Error generating preview:', error);
            Swal.fire({
                title: 'Ошибка',
                text: 'Не удалось создать предварительный просмотр',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    /**
     * Show preview modal
     */
    async showPreviewModal(html) {
        const result = await Swal.fire({
            title: 'Коммерческое предложение',
            html: `
                <div style="max-height: 70vh; overflow-y: auto; text-align: left;">
                    <iframe id="proposal-preview-frame" style="width: 100%; height: 70vh; border: 1px solid #ddd; border-radius: 4px;"></iframe>
                </div>
            `,
            width: '90%',
            maxWidth: '1000px',
            showCloseButton: true,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: '<i class="bi bi-printer me-2"></i>Печать',
            denyButtonText: '<i class="bi bi-download me-2"></i>Скачать HTML',
            cancelButtonText: '<i class="bi bi-x-lg me-2"></i>Закрыть',
            confirmButtonColor: '#198754',
            denyButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            didOpen: () => {
                // Load HTML into iframe
                const iframe = document.getElementById('proposal-preview-frame');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(html);
                iframeDoc.close();
            }
        });

        if (result.isConfirmed) {
            // Print
            this.printProposal(html);
        } else if (result.isDenied) {
            // Download HTML
            this.downloadHTML(html);
        }
    }

    /**
     * Print proposal
     */
    printProposal(html) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };

        Swal.fire({
            title: 'Открыто окно печати',
            text: 'Документ готов к печати',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true
        });
    }

    /**
     * Download HTML file
     */
    downloadHTML(html) {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const filename = this.generateFilename();
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Swal.fire({
            title: 'Файл загружен',
            text: `Файл "${filename}" сохранен`,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true
        });
    }

    /**
     * Generate filename
     */
    generateFilename() {
        const companyName = this.companyInfo.companyName
            .replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30);

        const date = new Date().toISOString().split('T')[0];

        return `Предложение_${companyName}_${date}.html`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorProposalGenerator;
}
