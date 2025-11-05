/**
 * PDF Proposal Generator Component
 * Generates professional PDF commercial proposals from selected services
 */

class PDFProposalGenerator {
    constructor(template, services, companyInfo) {
        this.template = template;
        this.services = services;
        this.companyInfo = companyInfo;
        this.parsedTemplate = null;
    }

    /**
     * Parse the markdown template
     * @returns {string} Parsed template content
     */
    parseTemplate() {
        if (!this.template) {
            throw new Error('Template is required');
        }

        // Store the parsed template
        this.parsedTemplate = this.template;
        
        // Remove dollar signs and spaces after them as per requirement 1.9
        this.parsedTemplate = this.parsedTemplate.replace(/\$\s+/g, '');
        
        return this.parsedTemplate;
    }

    /**
     * Replace template variables with actual values
     * @param {Object} companyInfo - Company information object
     * @returns {string} Template with replaced variables
     */
    replaceVariables(companyInfo) {
        if (!this.parsedTemplate) {
            this.parseTemplate();
        }

        let content = this.parsedTemplate;

        // Generate current date in Russian format
        const currentDate = new Date().toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format valid until date
        const validUntilDate = companyInfo.validUntil ? 
            new Date(companyInfo.validUntil).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : '';

        // Replace all template variables
        const replacements = {
            '{{DATE}}': currentDate,
            '{{COMPANY_NAME}}': companyInfo.companyName || '',
            '{{UNP}}': companyInfo.unp || '',
            '{{ADDRESS}}': companyInfo.address || '',
            '{{VALID_UNTIL}}': validUntilDate
        };

        // Perform replacements
        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
            content = content.replace(regex, replacements[key]);
        });

        return content;
    }

    /**
     * Generate PDF document with Russian font support
     * @returns {jsPDF} PDF document instance
     */
    generatePDF() {
        // Get jsPDF from window.jspdf
        const { jsPDF } = window.jspdf;
        
        // Initialize jsPDF with proper configuration
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add Russian font support
        this.addRussianFont(doc);

        // Replace template variables
        const content = this.replaceVariables(this.companyInfo);

        // Add company header
        this.addCompanyHeader(doc);

        // Add document title
        let yPosition = 50;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', 105, yPosition, { align: 'center' });

        // Add company information
        yPosition += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Для: ${this.companyInfo.companyName}`, 20, yPosition);
        yPosition += 7;
        doc.text(`УНП: ${this.companyInfo.unp}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Адрес: ${this.companyInfo.address}`, 20, yPosition);
        yPosition += 10;

        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        // Add services table
        yPosition = this.addServicesTable(doc, yPosition);

        // Add total
        yPosition = this.addTotalSection(doc, yPosition);

        // Add footer with validity date
        this.addFooter(doc, this.companyInfo.validUntil);

        return doc;
    }

    /**
     * Add Russian font to PDF document
     * @param {jsPDF} doc - PDF document instance
     */
    addRussianFont(doc) {
        // Use helvetica font which supports Cyrillic characters in jsPDF
        // This is more reliable than custom fonts
        try {
            doc.setFont('helvetica', 'normal');
        } catch (error) {
            console.warn('Error setting font:', error);
            // Fallback to default font
        }
    }

    /**
     * Add company header section with logo placeholder
     * @param {jsPDF} doc - PDF document instance
     */
    addCompanyHeader(doc) {
        // Add logo placeholder (rectangle)
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 15, 30, 20, 'F');
        
        // Add company name
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ООО "Meter.by"', 55, 22);
        
        // Add contact info
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Тел: +375 (29) 123-45-67', 55, 28);
        doc.text('Email: info@meter.by', 55, 32);
    }

    /**
     * Add services table to PDF using jsPDF-AutoTable
     * @param {jsPDF} doc - PDF document instance
     * @param {number} startY - Starting Y position
     * @returns {number} New Y position after table
     */
    addServicesTable(doc, startY) {
        if (!this.services || this.services.length === 0) {
            doc.setFontSize(11);
            doc.text('Услуги не выбраны', 20, startY);
            return startY + 10;
        }

        // Group services by category
        const groupedServices = this.groupServicesByCategory(this.services);

        let currentY = startY;

        // Add section title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Выбранные услуги', 20, currentY);
        currentY += 10;

        // Process each category
        Object.keys(groupedServices).forEach(category => {
            const categoryServices = groupedServices[category];
            
            if (categoryServices.length === 0) return;

            // Add category header
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(this.getCategoryName(category), 20, currentY);
            currentY += 7;

            // Prepare table data
            const tableData = categoryServices.map(service => [
                service.name,
                service.quantity.toString(),
                `${service.price} BYN`,
                `${(service.price * service.quantity).toFixed(2)} BYN`
            ]);

            // Add table using autoTable
            doc.autoTable({
                startY: currentY,
                head: [['Услуга', 'Кол-во', 'Цена за ед.', 'Сумма']],
                body: tableData,
                theme: 'grid',
                styles: {
                    font: 'helvetica',
                    fontSize: 10,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [66, 139, 202],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { left: 20, right: 20 }
            });

            currentY = doc.lastAutoTable.finalY + 10;
        });

        return currentY;
    }

    /**
     * Group services by category
     * @param {Array} services - Array of service objects
     * @returns {Object} Services grouped by category
     */
    groupServicesByCategory(services) {
        const grouped = {
            verification: [],
            installation: [],
            pnr: [],
            remote: [],
            equipment: [],
            other: []
        };

        services.forEach(service => {
            const category = this.detectServiceCategory(service);
            if (grouped[category]) {
                grouped[category].push(service);
            } else {
                grouped.other.push(service);
            }
        });

        return grouped;
    }

    /**
     * Detect service category from service ID or name
     * @param {Object} service - Service object
     * @returns {string} Category identifier
     */
    detectServiceCategory(service) {
        const id = service.id || service.serviceId || '';
        const name = service.name || '';
        
        if (id.includes('verification') || name.includes('Поверка')) {
            return 'verification';
        } else if (id.includes('installation') || name.includes('Монтаж')) {
            return 'installation';
        } else if (id.includes('pnr') || name.includes('Балансировка') || name.includes('Запуск')) {
            return 'pnr';
        } else if (id.includes('remote') || name.includes('Дистанционный') || name.includes('обслуживание')) {
            return 'remote';
        } else if (id.includes('equipment') || name.includes('Вега') || name.includes('оборудование')) {
            return 'equipment';
        }
        
        return 'other';
    }

    /**
     * Get category display name
     * @param {string} categoryId - Category identifier
     * @returns {string} Category display name
     */
    getCategoryName(categoryId) {
        const categoryNames = {
            verification: 'Поверка приборов учета',
            installation: 'Монтаж счетчиков',
            pnr: 'Пуско-наладочные работы',
            remote: 'Дистанционный съем показаний',
            equipment: 'Продажа оборудования',
            other: 'Прочие услуги'
        };

        return categoryNames[categoryId] || 'Прочие услуги';
    }

    /**
     * Calculate total price of all services
     * @returns {number} Total price
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
     * Add total section to PDF
     * @param {jsPDF} doc - PDF document instance
     * @param {number} startY - Starting Y position
     * @returns {number} New Y position after total section
     */
    addTotalSection(doc, startY) {
        const total = this.calculateTotal();

        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, startY, 190, startY);
        startY += 10;

        // Add total
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`ИТОГО: ${total.toFixed(2)} BYN`, 190, startY, { align: 'right' });

        return startY + 15;
    }

    /**
     * Add footer with validity date and company info
     * @param {jsPDF} doc - PDF document instance
     * @param {string} validUntil - Validity date
     */
    addFooter(doc, validUntil) {
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 30;

        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, footerY - 5, 190, footerY - 5);

        // Add validity date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        if (validUntil) {
            const validUntilDate = new Date(validUntil).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Предложение действительно до: ${validUntilDate}`, 20, footerY);
        }

        // Add disclaimer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Данное коммерческое предложение не является публичной офертой.', 105, footerY + 7, { align: 'center' });
        doc.text('С уважением, команда "Meter.by"', 105, footerY + 12, { align: 'center' });
    }

    /**
     * Show PDF preview with print/save options
     */
    async showPreview() {
        try {
            // Generate HTML preview content
            const htmlContent = this.generateHTMLPreview();

            // Show preview modal with SweetAlert2
            const result = await Swal.fire({
                title: 'Предварительный просмотр',
                html: `
                    <div id="pdf-preview-container" style="
                        max-height: 60vh;
                        overflow-y: auto;
                        padding: 20px;
                        background: #ffffff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        text-align: left;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.6;
                        color: #000000;
                    ">
                        ${htmlContent}
                    </div>
                `,
                width: '90%',
                maxWidth: '900px',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: '<i class="bi bi-printer me-2"></i>Печать',
                cancelButtonText: '<i class="bi bi-x-lg me-2"></i>Отмена',
                confirmButtonColor: '#198754',
                cancelButtonColor: '#6c757d',
                customClass: {
                    popup: 'pdf-preview-modal',
                    confirmButton: 'btn-print-pdf',
                    cancelButton: 'btn-cancel-pdf'
                }
            });

            if (result.isConfirmed) {
                // Print
                this.printPDF(htmlContent);
            }
        } catch (error) {
            console.error('Error showing preview:', error);
            Swal.fire({
                title: 'Ошибка',
                text: 'Не удалось создать предварительный просмотр',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    /**
     * Generate HTML preview of the proposal
     * @returns {string} HTML content
     */
    generateHTMLPreview() {
        const total = this.calculateTotal();
        const currentDate = new Date().toLocaleDateString('ru-RU');
        const validUntilDate = this.companyInfo.validUntil ? 
            new Date(this.companyInfo.validUntil).toLocaleDateString('ru-RU') : '';

        // Group services by category
        const groupedServices = this.groupServicesByCategory(this.services);

        let servicesHTML = '';
        Object.keys(groupedServices).forEach(category => {
            const categoryServices = groupedServices[category];
            if (categoryServices.length === 0) return;

            servicesHTML += `
                <h3 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; color: #000;">
                    ${this.getCategoryName(category)}
                </h3>
                <table style="width:100%; border-collapse:collapse; margin:10px 0; color:#000;">
                    <thead>
                        <tr>
                            <th style="border:1px solid #333; padding:8px; background:#f2f2f2; font-weight:bold; text-align:left; color:#000;">Услуга</th>
                            <th style="border:1px solid #333; padding:8px; background:#f2f2f2; font-weight:bold; text-align:center; color:#000;">Кол-во</th>
                            <th style="border:1px solid #333; padding:8px; background:#f2f2f2; font-weight:bold; text-align:right; color:#000;">Цена за ед.</th>
                            <th style="border:1px solid #333; padding:8px; background:#f2f2f2; font-weight:bold; text-align:right; color:#000;">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            categoryServices.forEach(service => {
                const serviceTotal = (service.price * service.quantity).toFixed(2);
                servicesHTML += `
                    <tr>
                        <td style="border:1px solid #333; padding:8px; text-align:left; color:#000;">${service.name}</td>
                        <td style="border:1px solid #333; padding:8px; text-align:center; color:#000;">${service.quantity}</td>
                        <td style="border:1px solid #333; padding:8px; text-align:right; color:#000;">${service.price} BYN</td>
                        <td style="border:1px solid #333; padding:8px; text-align:right; color:#000;">${serviceTotal} BYN</td>
                    </tr>
                `;
            });

            servicesHTML += `
                    </tbody>
                </table>
            `;
        });

        return `
            <h1 style="font-size:24px; font-weight:bold; margin:20px 0 10px 0; color:#000; text-align:center;">
                КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
            </h1>
            
            <p style="margin:5px 0; color:#000;"><strong>Дата:</strong> ${currentDate}</p>
            <p style="margin:5px 0; color:#000;"><strong>Для:</strong> ${this.companyInfo.companyName}</p>
            <p style="margin:5px 0; color:#000;"><strong>УНП:</strong> ${this.companyInfo.unp}</p>
            <p style="margin:5px 0; color:#000;"><strong>Адрес:</strong> ${this.companyInfo.address}</p>
            
            <hr style="border:none; border-top:1px solid #ddd; margin:15px 0;">
            
            <h2 style="font-size:18px; font-weight:bold; margin:15px 0 8px 0; color:#000;">
                Выбранные услуги
            </h2>
            
            ${servicesHTML}
            
            <hr style="border:none; border-top:2px solid #333; margin:15px 0;">
            
            <p style="margin:10px 0; color:#000; text-align:right; font-size:18px;">
                <strong>ИТОГО: ${total.toFixed(2)} BYN</strong>
            </p>
            
            ${validUntilDate ? `
                <hr style="border:none; border-top:1px solid #ddd; margin:15px 0;">
                <p style="margin:5px 0; color:#666; font-size:10px;">
                    Предложение действительно до: ${validUntilDate}
                </p>
            ` : ''}
            
            <p style="margin:5px 0; color:#666; font-size:10px; text-align:center;">
                Данное коммерческое предложение не является публичной офертой.
            </p>
            <p style="margin:5px 0; color:#666; font-size:10px; text-align:center;">
                С уважением, команда "Meter.by"
            </p>
        `;
    }

    /**
     * Print PDF content
     * @param {string} htmlContent - HTML content to print
     */
    printPDF(htmlContent) {
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Коммерческое предложение - ${this.companyInfo.companyName}</title>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.6;
                        color: #000000;
                        background: #ffffff;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 10px 0;
                    }
                    th, td {
                        border: 1px solid #333;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background: #f2f2f2;
                        font-weight: bold;
                    }
                    h1 {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0 10px 0;
                    }
                    h2 {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 15px 0 8px 0;
                    }
                    h3 {
                        font-size: 14px;
                        font-weight: bold;
                        margin: 12px 0 6px 0;
                    }
                    p {
                        margin: 5px 0;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #ddd;
                        margin: 15px 0;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };

        Swal.fire({
            title: 'Открыто окно печати',
            text: 'Документ готов к печати',
            icon: 'info',
            confirmButtonText: 'OK',
            timer: 2000
        });
    }

    /**
     * Download PDF file with meaningful filename (legacy method)
     * @param {string} customFilename - Optional custom filename
     */
    downloadPDF(customFilename = null) {
        const doc = this.generatePDF();

        // Generate filename
        const filename = customFilename || this.generateFilename();

        // Download the PDF
        doc.save(filename);
    }

    /**
     * Generate meaningful filename
     * Format: "Предложение_CompanyName_Date.pdf"
     * @returns {string} Generated filename
     */
    generateFilename() {
        // Clean company name for filename
        const companyName = this.companyInfo.companyName
            .replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30);

        // Format date as YYYY-MM-DD
        const date = new Date().toISOString().split('T')[0];

        return `Предложение_${companyName}_${date}.pdf`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFProposalGenerator;
}
