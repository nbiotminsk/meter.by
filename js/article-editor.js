/**
 * Article Editor with AI Generation Support
 * Handles rich text editing, AI content generation, and article creation
 */

// Available images for selection
const AVAILABLE_IMAGES = [
    { path: 'images/comprehensive-services.webp', name: 'Комплексные услуги' },
    { path: 'images/distancionni schetchik.webp', name: 'Дистанционный счетчик' },
    { path: 'images/engineer-story.webp', name: 'История инженера' },
    { path: 'images/placeholders/min/remote-water-reading.webp', name: 'Дистанционный съем воды' },
    { path: 'images/placeholders/min/heat-meter-installation.webp', name: 'Монтаж теплосчетчика' },
    { path: 'images/placeholders/min/heat-meter-verification.webp', name: 'Поверка теплосчетчика' },
    { path: 'images/placeholders/min/water-meter-installation.webp', name: 'Монтаж водосчетчика' },
    { path: 'images/placeholders/min/water-meter-verification.webp', name: 'Поверка водосчетчика' },
    { path: 'images/placeholders/min/lorawan-nbiot.webp', name: 'LoRaWAN и NB-IoT' },
    { path: 'images/placeholders/min/vega-nb11.webp', name: 'Вега NB-11' }
];

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing article editor...');
        initializeEditor();
        initializeImageSelector();
        initializeTagInput();
        initializeAIButtons();
        initializeForm();
        loadSavedApiKey();
        console.log('Article editor initialized successfully');
    } catch (error) {
        console.error('Error initializing article editor:', error);
        alert('Ошибка инициализации редактора: ' + error.message);
    }
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    try {
        console.log('DOM already loaded, initializing immediately...');
        initializeEditor();
        initializeImageSelector();
        initializeTagInput();
        initializeAIButtons();
        initializeForm();
        loadSavedApiKey();
        console.log('Article editor initialized successfully');
    } catch (error) {
        console.error('Error initializing article editor:', error);
    }
}

/**
 * Load saved API key from localStorage
 */
function loadSavedApiKey() {
    const savedKey = localStorage.getItem('ai_api_key');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
    }
    
    // Save API key when changed
    document.getElementById('apiKey').addEventListener('change', (e) => {
        if (e.target.value.trim()) {
            localStorage.setItem('ai_api_key', e.target.value.trim());
        } else {
            localStorage.removeItem('ai_api_key');
        }
    });
    
    // Update hint text based on selected model
    const modelSelect = document.getElementById('aiModel');
    const hintElement = document.getElementById('apiKeyHint');
    
    function updateHint() {
        const model = modelSelect.value;
        if (model.startsWith('google:')) {
            hintElement.innerHTML = '<a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-white text-decoration-underline">Google AI Studio</a>';
        } else if (model.startsWith('glm-direct:')) {
            hintElement.innerHTML = '<a href="https://z.ai" target="_blank" class="text-white text-decoration-underline">Z.AI</a>';
        } else {
            hintElement.innerHTML = '<a href="https://openrouter.ai/keys" target="_blank" class="text-white text-decoration-underline">OpenRouter</a>';
        }
    }
    
    modelSelect.addEventListener('change', updateHint);
    updateHint(); // Initial update
}

/**
 * Initialize rich text editor toolbar
 */
function initializeEditor() {
    const toolbar = document.querySelector('.editor-toolbar');
    const editor = document.getElementById('articleContent');
    
    toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-command]');
        if (!btn) return;
        
        e.preventDefault();
        const command = btn.dataset.command;
        const value = btn.dataset.value || null;
        
        document.execCommand(command, false, value);
        editor.focus();
    });
    
    // Handle link creation
    const linkBtn = toolbar.querySelector('[data-command="createLink"]');
    if (linkBtn) {
        linkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = prompt('Введите URL ссылки:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        });
    }
}

/**
 * Initialize image selector
 */
function initializeImageSelector() {
    const container = document.getElementById('imageSelector');
    const imagePathInput = document.getElementById('imagePath');
    
    AVAILABLE_IMAGES.forEach(img => {
        const option = document.createElement('div');
        option.className = 'image-option';
        option.innerHTML = `
            <img src="../${img.path}" alt="${img.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo image%3C/text%3E%3C/svg%3E'">
            <small>${img.name}</small>
        `;
        
        option.addEventListener('click', () => {
            document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            imagePathInput.value = img.path;
        });
        
        container.appendChild(option);
    });
}

/**
 * Initialize tag input
 */
function initializeTagInput() {
    const container = document.getElementById('tagsContainer');
    const input = document.getElementById('tagInput');
    const tags = [];
    
    function addTag(tag) {
        if (!tag || tags.includes(tag)) return;
        
        tags.push(tag);
        const badge = document.createElement('span');
        badge.className = 'tag-badge';
        badge.innerHTML = `
            ${tag}
            <span class="remove" data-tag="${tag}">&times;</span>
        `;
        
        badge.querySelector('.remove').addEventListener('click', () => {
            const index = tags.indexOf(tag);
            if (index > -1) tags.splice(index, 1);
            badge.remove();
        });
        
        container.insertBefore(badge, input);
        input.value = '';
    }
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = input.value.trim();
            if (tag) addTag(tag);
        }
    });
    
    // Expose tags getter
    window.getTags = () => tags;
}

/**
 * Initialize AI generation buttons
 */
function initializeAIButtons() {
    const generateTitleBtn = document.getElementById('generateTitle');
    const generateExcerptBtn = document.getElementById('generateExcerpt');
    const generateTagsBtn = document.getElementById('generateTags');
    const generateContentBtn = document.getElementById('generateContent');
    
    if (!generateTitleBtn || !generateExcerptBtn || !generateTagsBtn || !generateContentBtn) {
        console.error('AI buttons not found in DOM');
        return;
    }
    
    generateTitleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Generate title clicked');
        generateWithAI('title');
    });
    
    generateExcerptBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Generate excerpt clicked');
        generateWithAI('excerpt');
    });
    
    generateTagsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Generate tags clicked');
        generateWithAI('tags');
    });
    
    generateContentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Generate content clicked');
        generateWithAI('content');
    });
    
    console.log('AI buttons initialized successfully');
}

/**
 * Generate content using AI
 */
async function generateWithAI(type) {
    console.log('generateWithAI called with type:', type);
    
    const apiKeyEl = document.getElementById('apiKey');
    const modelEl = document.getElementById('aiModel');
    const promptEl = document.getElementById('aiPrompt');
    
    if (!apiKeyEl || !modelEl || !promptEl) {
        alert('Ошибка: не найдены необходимые элементы формы');
        console.error('Missing elements:', { apiKeyEl, modelEl, promptEl });
        return;
    }
    
    const apiKey = apiKeyEl.value.trim();
    const model = modelEl.value;
    const prompt = promptEl.value.trim();
    
    if (!apiKey) {
        alert('Пожалуйста, введите API ключ');
        return;
    }
    
    if (!prompt && type !== 'tags') {
        alert('Пожалуйста, введите промпт для генерации');
        return;
    }
    
    const title = document.getElementById('articleTitle').value;
    const excerpt = document.getElementById('articleExcerpt').value;
    
    // Build context-aware prompt
    let systemPrompt = '';
    let userPrompt = '';
    
    switch (type) {
        case 'title':
            systemPrompt = `Ты помощник для создания SEO-заголовков статей о счетчиках воды и тепла, дистанционном съеме показаний и услугах в Беларуси.

СТРОГИЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО на русском языке. Никакого английского.
2. Верни ТОЛЬКО один заголовок. Никаких объяснений, анализа, мета-комментариев.
3. Заголовок должен быть SEO-оптимизированным (50-70 символов).
4. Заголовок должен быть информативным и привлекательным.
5. НЕ пиши "Заголовок:", "Название:" или подобные префиксы.
6. НЕ анализируй запрос, НЕ объясняй процесс - просто дай результат.

ФОРМАТ ОТВЕТА: Только заголовок, одна строка.`;
            userPrompt = prompt || 'Придумай SEO-заголовок статьи о дистанционном съеме показаний счетчиков';
            break;
        case 'excerpt':
            systemPrompt = `Ты помощник для создания кратких описаний статей для карточек новостей.

СТРОГИЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО на русском языке. Никакого английского.
2. Верни ТОЛЬКО описание (150-200 символов). Никаких объяснений.
3. Описание должно быть информативным и привлекательным.
4. НЕ пиши "Описание:", "Краткое содержание:" или подобные префиксы.
5. НЕ анализируй, НЕ объясняй - просто дай результат.

ФОРМАТ ОТВЕТА: Только описание, один абзац.`;
            userPrompt = prompt || (title ? `Создай краткое описание для статьи "${title}"` : 'Создай краткое описание статьи');
            break;
        case 'tags':
            systemPrompt = `Ты помощник для создания релевантных тегов для статей.

СТРОГИЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО на русском языке. Никакого английского.
2. Верни ТОЛЬКО теги через запятую. Никаких объяснений.
3. Создай 5-7 релевантных тегов.
4. НЕ пиши "Теги:", "Метки:" или подобные префиксы.
5. НЕ анализируй, НЕ объясняй - просто дай результат.

ФОРМАТ ОТВЕТА: тег1, тег2, тег3, тег4, тег5`;
            userPrompt = `Создай 5-7 релевантных тегов для статьи "${title || 'о счетчиках воды и тепла'}"${excerpt ? `. Описание: ${excerpt}` : ''}`;
            break;
        case 'content':
            systemPrompt = `Ты помощник для написания статей о счетчиках воды и тепла, дистанционном съеме показаний, поверке и монтаже в Беларуси.

СТРОГИЕ ПРАВИЛА:
1. Пиши ТОЛЬКО на русском языке. Никакого английского.
2. Статья должна состоять РОВНО из 5 абзацев.
3. Используй HTML разметку: <h2> для заголовков разделов, <h3> для подзаголовков, <p> для абзацев, <ul><li> для списков, <strong> для выделения.
4. Каждый абзац должен быть информативным и содержать 3-5 предложений.
5. НЕ пиши вводные фразы типа "Вот статья:", "Ниже представлена статья:".
6. НЕ анализируй процесс написания, НЕ объясняй структуру - просто напиши статью.
7. Начни сразу с контента, без предисловий.

СТРУКТУРА СТАТЬИ:
- Первый абзац: введение в тему
- Второй абзац: основная информация
- Третий абзац: детали и особенности
- Четвертый абзац: практические аспекты
- Пятый абзац: заключение или призыв к действию

ФОРМАТ ОТВЕТА: Готовая статья с HTML разметкой, 5 абзацев.`;
            userPrompt = prompt || (title ? `Напиши статью на тему "${title}"` : 'Напиши статью');
            break;
    }
    
    try {
        showLoading(type, true);
        
        let response;
        let data;
        
        // Check if using Google Gemini direct endpoint
        if (model.startsWith('google:')) {
            const actualModel = model.replace('google:', '');
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey}`;
            
            // Build request body for Gemini API
            const requestBody = {
                contents: [{
                    parts: [{
                        text: userPrompt
                    }]
                }]
            };
            
            // Add system instruction if provided
            if (systemPrompt) {
                requestBody.systemInstruction = {
                    parts: [{
                        text: systemPrompt
                    }]
                };
            }
            
            // Add generation config with stricter settings for better compliance
            requestBody.generationConfig = {
                temperature: 0.3, // Lower temperature for more deterministic behavior
                maxOutputTokens: type === 'content' ? 4000 : 1000, // Increase tokens to allow reasoning
                topP: 0.9,
                topK: 40
            };
            
            response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let error;
                try {
                    error = JSON.parse(errorText);
                } catch {
                    error = { error: { message: errorText || `HTTP ${response.status}` } };
                }
                throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
            }
            
            data = await response.json();
        } else if (model.startsWith('glm-direct:')) {
            // Check if using GLM direct endpoint
            const actualModel = model.replace('glm-direct:', '');
            // Enhance system prompt for GLM with strict rules
            const enhancedSystemPrompt = `${systemPrompt}\n\nКРИТИЧЕСКИ ВАЖНО - СТРОГО СОБЛЮДАЙ ПРАВИЛА:\n- Отвечай ТОЛЬКО на русском языке. Абсолютно никакого английского.\n- Верни ТОЛЬКО готовый результат. Никаких объяснений, анализа, рассуждений, мета-комментариев.\n- НЕ пиши "Analyze", "Identify", "Consider", "Let me", "I will" или подобные фразы.\n- НЕ объясняй процесс, НЕ описывай структуру - просто дай результат.\n- НЕ добавляй префиксы типа "Заголовок:", "Статья:", "Описание:" - только сам контент.\n- Если генерируешь заголовок - верни ТОЛЬКО заголовок, одну строку.\n- Если генерируешь статью - верни РОВНО 5 абзацев с HTML разметкой.`;
            
            response = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: actualModel,
                    messages: [
                        { role: 'system', content: enhancedSystemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3, // Lower temperature
                    max_tokens: type === 'content' ? 4000 : 1000, // Increase tokens significantly to accommodate GLM's reasoning
                    // do_sample: false, // Try deterministic generation
                    top_p: 0.9,
                    top_k: 40
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let error;
                try {
                    error = JSON.parse(errorText);
                } catch {
                    error = { error: { message: errorText || `HTTP ${response.status}` } };
                }
                throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
            }
            
            data = await response.json();
        } else {
            // Use OpenRouter endpoint
            response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Meter.by Article Editor'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: type === 'content' ? 2000 : 200
                })
            });
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }
            
            data = await response.json();
        }
        
        // Extract generated text (different endpoints have different response formats)
        let generatedText = '';
        
        if (model.startsWith('google:')) {
            // Google Gemini API format
            generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        } else if (model.startsWith('glm-direct:')) {
            // GLM Direct API format
            generatedText = data.choices?.[0]?.message?.content?.trim() || '';
            
            // If content is empty but reasoning_content exists, try to use it as a fallback
            // But we need to be careful as it might contain English analysis
            if (!generatedText && data.choices?.[0]?.message?.reasoning_content) {
                console.warn('GLM returned reasoning_content instead of content. Using reasoning as fallback.');
                const reasoning = data.choices[0].message.reasoning_content;
                
                // If the reasoning looks like a direct answer (mostly Russian), use it
                // Or try to extract the last part if it looks like a conclusion
                generatedText = reasoning;
            }
            
            // Fallback to other possible fields only if content is truly empty
            if (!generatedText) {
                generatedText = data.choices?.[0]?.delta?.content?.trim() ||
                              data.choices?.[0]?.text?.trim() || 
                              data.content?.trim() ||
                              data.message?.content?.trim() ||
                              data.text?.trim() || '';
            }
        } else {
            // OpenRouter API format
            generatedText = data.choices?.[0]?.message?.content?.trim() || '';
        }
        
        if (!generatedText) {
            throw new Error('Пустой ответ от AI');
        }
        
        // Apply generated content
        switch (type) {
            case 'title':
                document.getElementById('articleTitle').value = generatedText;
                break;
            case 'excerpt':
                document.getElementById('articleExcerpt').value = generatedText;
                break;
            case 'tags':
                const tags = generatedText.split(',').map(t => t.trim()).filter(Boolean);
                tags.forEach(tag => {
                    const input = document.getElementById('tagInput');
                    input.value = tag;
                    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                });
                break;
            case 'content':
                const editor = document.getElementById('articleContent');
                editor.innerHTML = generatedText;
                break;
        }
        
    } catch (error) {
        console.error('AI Generation Error:', error);
        alert(`Ошибка генерации: ${error.message}\n\nПроверьте:\n- Правильность API ключа\n- Наличие средств на балансе\n- Доступность модели`);
    } finally {
        showLoading(type, false);
    }
}

/**
 * Show/hide loading indicator
 */
function showLoading(type, show) {
    const btn = document.getElementById(`generate${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!btn) return;
    
    const icon = btn.querySelector('i');
    if (show) {
        icon.className = 'spinner-border spinner-border-sm me-2';
        btn.disabled = true;
    } else {
        icon.className = `bi bi-${getIconForType(type)} me-2`;
        btn.disabled = false;
    }
}

function getIconForType(type) {
    const icons = {
        title: 'type-h1',
        excerpt: 'text-paragraph',
        tags: 'tags',
        content: 'file-text'
    };
    return icons[type] || 'file-text';
}

/**
 * Initialize form submission
 */
function initializeForm() {
    const form = document.getElementById('articleForm');
    const previewBtn = document.getElementById('previewBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createArticle();
    });
    
    previewBtn.addEventListener('click', showPreview);
    resetBtn.addEventListener('click', resetForm);
}

/**
 * Create article using the Node.js script
 */
async function createArticle() {
    const title = document.getElementById('articleTitle').value.trim();
    const excerpt = document.getElementById('articleExcerpt').value.trim();
    const slug = document.getElementById('articleSlug').value.trim();
    const date = document.getElementById('articleDate').value || new Date().toISOString().split('T')[0];
    const image = document.getElementById('imagePath').value.trim() || 'images/placeholders/min/remote-water-reading.webp';
    const tags = window.getTags() || [];
    const content = document.getElementById('articleContent').innerHTML;
    
    if (!title || !excerpt || !slug) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Save content to temporary file
    const contentBlob = new Blob([content], { type: 'text/html' });
    const contentFile = new File([contentBlob], 'content.html', { type: 'text/html' });
    
    // Build command arguments
    const args = [
        '--title', title,
        '--excerpt', excerpt,
        '--slug', slug,
        '--date', date,
        '--image', image,
        '--tags', tags.join(', ')
    ];
    
    try {
        // Call backend endpoint to create article
        const response = await fetch('/api/create-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                excerpt,
                slug,
                date,
                image,
                tags: tags.join(', '),
                content
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Ошибка создания статьи');
        }
        
        const result = await response.json();
        
        alert(`Статья успешно создана!\n\nФайл: ${result.file}\n\nТеперь вы можете отредактировать контент в созданном файле.`);
        
        // Optionally open the created file
        if (confirm('Открыть созданный файл в редакторе?')) {
            window.open(`../${result.file}`, '_blank');
        }
        
    } catch (error) {
        console.error('Article creation error:', error);
        alert(`Ошибка создания статьи: ${error.message}`);
    }
}

/**
 * Show preview modal
 */
function showPreview() {
    const title = document.getElementById('articleTitle').value || 'Без названия';
    const excerpt = document.getElementById('articleExcerpt').value || '';
    const content = document.getElementById('articleContent').innerHTML;
    const tags = window.getTags() || [];
    const image = document.getElementById('imagePath').value;
    
    const preview = document.getElementById('previewContent');
    preview.innerHTML = `
        <h2>${title}</h2>
        ${excerpt ? `<p class="lead">${excerpt}</p>` : ''}
        ${image ? `<img src="../${image}" class="img-fluid rounded mb-3" alt="${title}">` : ''}
        ${tags.length ? `<div class="mb-3">${tags.map(t => `<span class="badge bg-primary me-1">${t}</span>`).join('')}</div>` : ''}
        <hr>
        <div class="article-content">${content}</div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
}

/**
 * Reset form
 */
function resetForm() {
    if (confirm('Вы уверены, что хотите очистить все поля?')) {
        document.getElementById('articleForm').reset();
        document.getElementById('articleContent').innerHTML = '<p>Начните писать статью здесь...</p>';
        document.querySelectorAll('.tag-badge').forEach(badge => badge.remove());
        document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
        document.getElementById('imagePath').value = '';
    }
}

