// ===== INICIALIZACIÓN GLOBAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modo oscuro global (PRIMERO)
    initDarkModeGlobal();
    
    // Navegación entre páginas
    initNavigation();
    
    // Búsqueda y filtros
    initSearch();
    
    // Interacciones de cards
    initCardInteractions();
    
    // Animaciones
    initAnimations();
    
    // Búsqueda en mapas (si está en la página de mapas)
    if (document.getElementById('searchInput')) {
        initMapSearch();
        initMapInteractions();
    }
    
    // Configuración (si está en la página de perfil)
    if (document.getElementById('darkMode')) {
        initSettings();
    }
});

// ===== MODO OSCURO GLOBAL =====
function initDarkModeGlobal() {
    // Cargar preferencia de modo oscuro
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar modo oscuro a todo el documento (html)
    document.documentElement.classList.toggle('dark-mode', savedDarkMode);
    
    // Sincronizar todos los toggles de modo oscuro en la página
    document.querySelectorAll('#darkMode').forEach(toggle => {
        toggle.checked = savedDarkMode;
    });
    
    // Sincronizar ícono global si existe
    const darkModeIcon = document.getElementById('darkModeToggle');
    if (darkModeIcon) {
        darkModeIcon.classList.toggle('fa-moon', !savedDarkMode);
        darkModeIcon.classList.toggle('fa-sun', savedDarkMode);
    }
}

function toggleDarkModeGlobal() {
    const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
    const newDarkMode = !isCurrentlyDark;
    
    // Aplicar globalmente al documento html
    document.documentElement.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    // Actualizar todos los toggles
    document.querySelectorAll('#darkMode').forEach(toggle => {
        toggle.checked = newDarkMode;
    });
    
    // Actualizar ícono global
    const darkModeIcon = document.getElementById('darkModeToggle');
    if (darkModeIcon) {
        darkModeIcon.classList.toggle('fa-moon', !newDarkMode);
        darkModeIcon.classList.toggle('fa-sun', newDarkMode);
    }
    
    showToast(`Modo ${newDarkMode ? 'oscuro' : 'claro'} activado`);
}

// ===== FUNCIONES EXISTENTES ACTUALIZADAS =====
function initNavigation() {
    // Smooth scroll para elementos internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navegación activa
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const filterBtn = document.querySelector('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterExperiences(searchTerm);
        });
    }
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showFilterModal();
        });
    }
}

function filterExperiences(searchTerm) {
    const experiences = document.querySelectorAll('.featured-card');
    
    experiences.forEach(exp => {
        const title = exp.querySelector('h3').textContent.toLowerCase();
        const description = exp.querySelector('p').textContent.toLowerCase();
        const location = exp.querySelector('.meta-item span')?.textContent.toLowerCase() || '';
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       location.includes(searchTerm);
        
        exp.style.display = matches ? 'block' : 'none';
    });
}

function showFilterModal() {
    // Crear modal de filtros
    const modalHTML = `
        <div class="modal-overlay active" id="filterModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Filtrar Experiencias</h3>
                    <button class="close-modal" onclick="closeFilterModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="filter-options">
                    <div class="filter-group">
                        <label>Categoría</label>
                        <select id="categoryFilter">
                            <option value="">Todas</option>
                            <option value="gastronomia">Gastronomía</option>
                            <option value="ecoturismo">Ecoturismo</option>
                            <option value="cultura">Cultura</option>
                            <option value="aventura">Aventura</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Municipio</label>
                        <select id="municipioFilter">
                            <option value="">Todos</option>
                            <option value="chia">Chía</option>
                            <option value="tabio">Tabio</option>
                            <option value="cajica">Cajicá</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Precio</label>
                        <select id="priceFilter">
                            <option value="">Todos</option>
                            <option value="$">Económico ($)</option>
                            <option value="$$">Moderado ($$)</option>
                            <option value="$$$">Premium ($$$)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeFilterModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="applyFilters()">Aplicar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('filterModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeFilterModal();
        }
    });
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.remove();
    }
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const municipio = document.getElementById('municipioFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    // Aquí iría la lógica para aplicar los filtros
    console.log('Aplicando filtros:', { category, municipio, price });
    
    closeFilterModal();
    showToast('Filtros aplicados correctamente');
}

function initCardInteractions() {
    // Efecto hover en tarjetas
    const cards = document.querySelectorAll('.featured-card, .category-card, .municipio-card, .ruta-card');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        // Click en rutas
        if (card.classList.contains('ruta-card')) {
            card.addEventListener('click', function() {
                const rutaType = this.dataset.ruta;
                showRutaDetails(rutaType);
            });
        }
    });
}

function initAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.featured-card, .category-card, .municipio-card, .ruta-card, .nearby-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== FUNCIONALIDADES PARA MAPAS =====
function initMapSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;

    // Datos de búsqueda para mapas
    const searchData = [
        { type: 'municipio', name: 'Chía', id: 'chia', description: 'Municipio de sabores tradicionales' },
        { type: 'municipio', name: 'Tabio', id: 'tabio', description: 'Tierra de aguas termales' },
        { type: 'municipio', name: 'Cajicá', id: 'cajica', description: 'Cultura y naturaleza' },
        { type: 'ruta', name: 'Ruta Gastronómica', id: 'gastronomica', description: 'Sabores auténticos' },
        { type: 'ruta', name: 'Ruta Ecológica', id: 'ecologica', description: 'Naturaleza y aventura' },
        { type: 'ruta', name: 'Ruta Cultural', id: 'cultural', description: 'Historia y tradición' }
    ];

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Mostrar/ocultar botón clear
        if (searchTerm.length > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
            searchResults.style.display = 'none';
            clearHighlights();
            return;
        }

        // Filtrar resultados
        const filteredResults = searchData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(filteredResults, searchResults);
        filterMapElements(searchTerm);
    });

    // Botón clear
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.focus();
        clearBtn.classList.remove('show');
        searchResults.style.display = 'none';
        clearHighlights();
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
        container.style.display = 'block';
        return;
    }

    container.innerHTML = results.map(result => `
        <div class="search-result-item" data-type="${result.type}" data-id="${result.id}">
            <h4>${result.name}</h4>
            <p>${result.description}</p>
        </div>
    `).join('');

    container.style.display = 'block';

    // Manejar click en resultados
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const type = this.dataset.type;
            const id = this.dataset.id;
            handleSearchResultClick(type, id);
            container.style.display = 'none';
        });
    });
}

function filterMapElements(searchTerm) {
    // Municipios en el mapa
    document.querySelectorAll('.map-point').forEach(point => {
        const pointInfo = point.querySelector('.point-info').textContent.toLowerCase();
        
        if (pointInfo.includes(searchTerm)) {
            point.classList.remove('hidden');
            point.classList.add('highlighted');
        } else {
            point.classList.add('hidden');
            point.classList.remove('highlighted');
        }
    });

    // Rutas temáticas
    document.querySelectorAll('.ruta-card').forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.classList.add('highlighted');
        } else {
            card.classList.add('hidden');
            card.classList.remove('highlighted');
        }
    });

    // Experiencias cercanas
    document.querySelectorAll('.nearby-item').forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function handleSearchResultClick(type, id) {
    clearHighlights();

    switch(type) {
        case 'municipio':
            const municipioPoint = document.querySelector(`.map-point[data-municipio="${id}"]`);
            if (municipioPoint) {
                municipioPoint.classList.add('highlighted');
                municipioPoint.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast(`Mostrando ${municipioPoint.querySelector('.point-info').textContent}`);
            }
            break;
            
        case 'ruta':
            const rutaCard = document.querySelector(`.ruta-card[data-ruta="${id}"]`);
            if (rutaCard) {
                rutaCard.classList.add('highlighted');
                rutaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast(`Seleccionada ${rutaCard.querySelector('h4').textContent}`);
            }
            break;
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    document.querySelectorAll('.hidden').forEach(el => {
        el.classList.remove('hidden');
    });
}

function initMapInteractions() {
    // Click en puntos del mapa
    document.querySelectorAll('.map-point').forEach(point => {
        point.addEventListener('click', function() {
            const municipio = this.dataset.municipio;
            showMunicipioDetails(municipio);
        });
    });
    
    // Botón de ubicación
    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) {
        locationBtn.addEventListener('click', function() {
            getUserLocation();
        });
    }
}

function showMunicipioDetails(municipio) {
    const municipioNames = {
        'chia': 'Chía',
        'tabio': 'Tabio', 
        'cajica': 'Cajicá'
    };
    
    showToast(`Abriendo detalles de ${municipioNames[municipio]}`);
    // Aquí puedes redirigir a una página de detalles del municipio
    console.log('Mostrando detalles del municipio:', municipio);
}

function showRutaDetails(rutaType) {
    const rutaNames = {
        'gastronomica': 'Ruta Gastronómica',
        'ecologica': 'Ruta Ecológica',
        'cultural': 'Ruta Cultural'
    };
    
    showToast(`Explorando ${rutaNames[rutaType]}`);
    // Aquí puedes redirigir a una página de detalles de la ruta
    console.log('Mostrando detalles de la ruta:', rutaType);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                showToast('Ubicación detectada correctamente');
                console.log('Ubicación:', position.coords);
            },
            function(error) {
                showToast('No se pudo obtener la ubicación', 'error');
                console.error('Error de geolocalización:', error);
            }
        );
    } else {
        showToast('Geolocalización no soportada', 'error');
    }
}

// ===== CONFIGURACIÓN Y PRIVACIDAD =====
function initSettings() {
    // Modo oscuro (actualizado para usar la función global)
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            toggleDarkModeGlobal();
        });
    }
    
    // Privacidad
    const privacyBtn = document.getElementById('privacyBtn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', showPrivacyModal);
    }
    
    // Ayuda
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelpModal);
    }
    
    // Otros toggles de configuración
    document.querySelectorAll('.toggle-switch input:not(#darkMode)').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.id;
            const isEnabled = this.checked;
            
            // Guardar configuración
            const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
            settings[setting] = isEnabled;
            localStorage.setItem('userSettings', JSON.stringify(settings));
            
            showToast(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${isEnabled ? 'activado' : 'desactivado'}`);
        });
    });
}

function showPrivacyModal() {
    const modalHTML = `
        <div class="modal-overlay active" id="privacyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Privacidad y Datos</h3>
                    <button class="close-modal" onclick="closeModal('privacyModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="privacy-options">
                    <div class="privacy-option" onclick="manageData()">
                        <div class="option-info">
                            <i class="fas fa-database"></i>
                            <div>
                                <h4>Gestionar Datos</h4>
                                <p>Controla tu información personal</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="privacy-option" onclick="exportData()">
                        <div class="option-info">
                            <i class="fas fa-download"></i>
                            <div>
                                <h4>Exportar Datos</h4>
                                <p>Descarga tu información</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="privacy-option" onclick="deleteAccount()">
                        <div class="option-info">
                            <i class="fas fa-trash"></i>
                            <div>
                                <h4>Eliminar Cuenta</h4>
                                <p>Borrar permanentemente tu cuenta</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('privacyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal('privacyModal');
        }
    });
}

function showHelpModal() {
    const modalHTML = `
        <div class="modal-overlay active" id="helpModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Ayuda y Soporte</h3>
                    <button class="close-modal" onclick="closeModal('helpModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-options">
                    <div class="help-option" onclick="openHelpCenter()">
                        <div class="option-info">
                            <i class="fas fa-question-circle"></i>
                            <div>
                                <h4>Centro de Ayuda</h4>
                                <p>Encuentra respuestas a tus preguntas</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="help-option" onclick="contactSupport()">
                        <div class="option-info">
                            <i class="fas fa-headset"></i>
                            <div>
                                <h4>Contactar Soporte</h4>
                                <p>Habla con nuestro equipo</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <div class="help-option" onclick="sendFeedback()">
                        <div class="option-info">
                            <i class="fas fa-comment-dots"></i>
                            <div>
                                <h4>Enviar Feedback</h4>
                                <p>Comparte tus sugerencias</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('helpModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal('helpModal');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Funciones de los botones de privacidad
function manageData() {
    showToast('Abriendo gestión de datos...');
    // Aquí iría la lógica para gestionar datos
}

function exportData() {
    showToast('Preparando exportación de datos...');
    // Aquí iría la lógica para exportar datos
}

function deleteAccount() {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        showToast('Solicitud de eliminación enviada');
        // Aquí iría la lógica para eliminar cuenta
    }
}

// Funciones de los botones de ayuda
function openHelpCenter() {
    showToast('Abriendo centro de ayuda...');
    // Aquí iría la lógica para abrir el centro de ayuda
}

function contactSupport() {
    showToast('Conectando con soporte...');
    // Aquí iría la lógica para contactar soporte
}

function sendFeedback() {
    showToast('Abriendo formulario de feedback...');
    // Aquí iría la lógica para enviar feedback
}

// ===== FUNCIONES GLOBALES =====
window.closeFilterModal = closeFilterModal;
window.applyFilters = applyFilters;
window.toggleDarkModeGlobal = toggleDarkModeGlobal;