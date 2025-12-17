// script.js - Funcionalidades de acessibilidade para o site GERAE

document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibilityFeatures();
    initializeFormValidation();
    initializeTextToSpeech();
    initializeKeyboardShortcuts();
    initializeModal();
    initializeSearch(); 
    simulateLoading();
    setupKeyboardNavigation();
});

// 1. Inicialização de recursos de acessibilidade
function initializeAccessibilityFeatures() {
    // Adiciona atributos ARIA para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Imagem decorativa');
        }
    });
    
    // Inicializa controle de fonte
    initializeFontControls();
    
    // Inicializa modo alto contraste
    initializeHighContrast();
    
    // Anuncia que a página carregou
    setTimeout(() => {
        announceToScreenReader('Página carregada com sucesso');
    }, 1000);
}

// 2. Controles de tamanho de fonte
function initializeFontControls() {
    const fontSizes = {
        decrease: document.getElementById('font-decrease'),
        reset: document.getElementById('font-reset'),
        increase: document.getElementById('font-increase')
    };

    if (fontSizes.decrease && fontSizes.reset && fontSizes.increase) {
        fontSizes.decrease.addEventListener('click', () => changeFontSize(-1));
        fontSizes.reset.addEventListener('click', () => changeFontSize(0));
        fontSizes.increase.addEventListener('click', () => changeFontSize(1));

        // Carregar tamanho salvo
        const savedSize = localStorage.getItem('fontSize');
        if (savedSize) {
            document.documentElement.style.fontSize = savedSize + 'px';
        }
    }
}

function changeFontSize(direction) {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    let newSize;
    
    if (direction === 0) {
        newSize = 16; // Tamanho padrão
    } else {
        newSize = currentSize + (direction * 2);
        newSize = Math.max(12, Math.min(24, newSize)); // Limites: 12px a 24px
    }
    
    html.style.fontSize = newSize + 'px';
    localStorage.setItem('fontSize', newSize);
    
    announceToScreenReader(`Tamanho da fonte ajustado para ${newSize} pixels`);
}

// 3. Modo alto contraste
function initializeHighContrast() {
    const contrastToggle = document.getElementById('high-contrast-toggle');
    
    if (contrastToggle) {
        contrastToggle.addEventListener('click', function() {
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            document.body.classList.toggle('high-contrast');
            this.setAttribute('aria-pressed', (!isPressed).toString());
            
            // Salvar preferência
            localStorage.setItem('highContrast', (!isPressed).toString());
            
            announceToScreenReader(
                isPressed ? 'Modo alto contraste desativado' : 'Modo alto contraste ativado'
            );
        });

        // Carregar preferência salva
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            contrastToggle.setAttribute('aria-pressed', 'true');
        }
    }
}

// 4. Text-to-speech
function initializeTextToSpeech() {
    const ttsToggle = document.getElementById('text-to-speech');
    const stopTts = document.getElementById('stop-tts');
    let speech = null;

    if (ttsToggle && stopTts) {
        ttsToggle.addEventListener('click', function() {
            if (!speech) {
                startTextToSpeech();
                this.setAttribute('aria-pressed', 'true');
                stopTts.hidden = false;
            } else {
                stopTextToSpeech();
            }
        });

        stopTts.addEventListener('click', stopTextToSpeech);
    }
}

function startTextToSpeech() {
    if ('speechSynthesis' in window) {
        const mainContent = document.querySelector('main').innerText;
        const speech = new SpeechSynthesisUtterance(mainContent);
        speech.lang = 'pt-BR';
        speech.rate = 0.8;
        
        speech.onstart = function() {
            announceToScreenReader('Iniciando leitura do conteúdo');
        };
        
        speech.onend = function() {
            stopTextToSpeech();
            announceToScreenReader('Leitura concluída');
        };
        
        speech.onerror = function() {
            stopTextToSpeech();
            announceToScreenReader('Erro na leitura do texto');
        };
        
        window.speechSynthesis.speak(speech);
        window.currentSpeech = speech;
    } else {
        announceToScreenReader('Leitura de texto não suportada neste navegador');
    }
}

function stopTextToSpeech() {
    const ttsToggle = document.getElementById('text-to-speech');
    const stopTts = document.getElementById('stop-tts');
    
    if (window.currentSpeech) {
        window.speechSynthesis.cancel();
        window.currentSpeech = null;
    }
    
    if (ttsToggle) ttsToggle.setAttribute('aria-pressed', 'false');
    if (stopTts) stopTts.hidden = true;
}

// 5. Atalhos de teclado
// 5. Atalhos de teclado - VERSÃO CORRIGIDA
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Só funciona se Alt estiver pressionado
        if (!e.altKey) return;
        
        // Prevenir o comportamento padrão do browser
        e.preventDefault();
        
        switch(e.key.toLowerCase()) { // Usa lowercase para funcionar com maiúsculas e minúsculas
            case '1':
                // Alt + 1 - Home
                console.log('Alt + 1 - Indo para página inicial');
                if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                    window.location.href = 'index.html';
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    announceToScreenReader('Página inicial');
                }
                break;
                
            case '2':
                // Alt + 2 - Navegação
                console.log('Alt + 2 - Indo para navegação');
                const firstNavLink = document.querySelector('nav a');
                if (firstNavLink) {
                    firstNavLink.focus();
                    firstNavLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    announceToScreenReader('Menu de navegação. Use Tab para navegar pelos links.');
                }
                break;
                
            case '3':
                // Alt + 3 - Conteúdo principal
                console.log('Alt + 3 - Indo para conteúdo principal');
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    announceToScreenReader('Conteúdo principal da página');
                }
                break;
                
            case '4':
                // Alt + 4 - Rodapé
                console.log('Alt + 4 - Indo para rodapé');
                const footer = document.querySelector('footer');
                if (footer) {
                    footer.setAttribute('tabindex', '-1');
                    footer.focus();
                    footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    announceToScreenReader('Rodapé da página');
                }
                break;
                
            case 's':
                // Alt + S - Buscar (AGORA VAI PARA O CAMPO DE BUSCA)
                console.log('Alt + S - Indo para busca');
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    announceToScreenReader('Campo de busca. Digite o que procura e pressione Enter.');
                }
                break;
                
            case 'a':
                // Alt + A - Abrir atalhos (SÓ ESTE ABRE O MODAL)
                console.log('Alt + A - Abrindo modal de atalhos');
                openShortcutsModal();
                break;
                
            default:
                // Outras teclas Alt não fazem nada
                break;
        }
    });
}

// 6. Modal de atalhos
// 6. Modal de atalhos - VERSÃO CORRIGIDA
function initializeModal() {
    const modal = document.getElementById('shortcuts-modal');
    const openBtn = document.querySelector('.accessibility-shortcuts');
    const closeBtn = document.querySelector('.modal-close');

    if (openBtn) {
        openBtn.addEventListener('click', openShortcutsModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeShortcutsModal);
    }

    // Fechar modal com ESC - listener global
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.hidden) {
            closeShortcutsModal();
        }
    });

    // Fechar modal clicando fora - CORREÇÃO
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Fecha apenas se clicou diretamente no backdrop (área escura)
            if (e.target === modal) {
                closeShortcutsModal();
            }
        });
    }
}

function openShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    const openBtn = document.querySelector('.accessibility-shortcuts');
    
    if (modal && openBtn) {
        modal.hidden = false;
        modal.style.display = 'flex'; // Garante que está visível
        openBtn.setAttribute('aria-expanded', 'true');
        
        // Foca no botão de fechar
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
        
        announceToScreenReader('Modal de atalhos de teclado aberto. Pressione ESC para fechar.');
    }
}

function closeShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    const openBtn = document.querySelector('.accessibility-shortcuts');
    
    if (modal && openBtn) {
        modal.hidden = true;
        modal.style.display = 'none'; // Garante que está escondido
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
        announceToScreenReader('Modal de atalhos de teclado fechado');
    }
}

// 7. Validação de formulários
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                simulateFormSubmission();
            }
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    let isValid = true;
    
    if (!form) return false;

    const fields = [
        { id: 'name', type: 'text' },
        { id: 'email', type: 'email' },
        { id: 'message', type: 'text' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !validateField(element)) {
            isValid = false;
        }
    });

    if (!isValid) {
        announceToScreenReader('Por favor, corrija os erros no formulário');
    } else {
        announceToScreenReader('Formulário validado com sucesso');
    }

    return isValid;
}

function validateField(field) {
    const errorElement = document.getElementById(field.id + '-error');
    let isValid = true;
    let message = '';

    if (!field.value.trim()) {
        message = `Por favor, preencha o campo ${field.previousElementSibling.textContent}`;
        isValid = false;
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            message = 'Por favor, informe um e-mail válido';
            isValid = false;
        }
    }

    if (errorElement) {
        errorElement.textContent = message;
        field.setAttribute('aria-invalid', (!isValid).toString());
        
        if (isValid) {
            field.removeAttribute('aria-invalid');
        }
    }

    return isValid;
}

function simulateFormSubmission() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const progressFill = document.querySelector('.progress-fill');
    
    if (loadingIndicator && progressFill) {
        loadingIndicator.hidden = false;
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            progressFill.setAttribute('aria-valuenow', progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingIndicator.hidden = true;
                    announceToScreenReader('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    document.getElementById('contact-form').reset();
                }, 500);
            }
        }, 200);
    }
}

// 8. Simulação de carregamento
function simulateLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const progressFill = document.querySelector('.progress-fill');
    
    if (loadingIndicator && progressFill) {
        loadingIndicator.hidden = false;
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 5;
            progressFill.style.width = progress + '%';
            progressFill.setAttribute('aria-valuenow', progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingIndicator.hidden = true;
                }, 500);
            }
        }, 50);
    }
}

// 9. Função auxiliar para anunciar mudanças
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        // Limpar conteúdo anterior
        liveRegion.textContent = '';
        
        // Timeout para garantir que o conteúdo seja anunciado
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
        
        // Limpar após um tempo
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 5000);
    }
}
// Função para inicializar a busca
function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        // Fechar busca com ESC
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.blur();
                announceToScreenReader('Busca cancelada');
            }
        });
    }
}

function performSearch(query) {
    if (!query.trim()) {
        announceToScreenReader('Por favor, digite algo para buscar');
        return;
    }
    
    // Simulação de busca - você pode implementar a busca real aqui
    console.log('Buscando por:', query);
    announceToScreenReader(`Buscando por: ${query}. Implemente a função de busca real aqui.`);
    
    // Exemplo: destacar termos no conteúdo
    highlightSearchTerms(query);
}

function highlightSearchTerms(query) {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    const text = mainContent.innerHTML;
    const highlighted = text.replace(
        new RegExp(query, 'gi'),
        match => `<mark style="background: yellow;">${match}</mark>`
    );
    
    mainContent.innerHTML = highlighted;
    announceToScreenReader(`Termo "${query}" destacado no conteúdo`);
}

// 10. Melhorar navegação por teclado
document.addEventListener('keydown', function(e) {
    // Tab - navegação por teclado
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 11. Prevenir que outlines sejam removidos para usuários de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.documentElement.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.documentElement.classList.remove('keyboard-navigation');
});