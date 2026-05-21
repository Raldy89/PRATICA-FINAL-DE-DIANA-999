// Configuración inicial
let totalPrice = 0;
let selectedComponents = {
    processor: null,
    ram: null,
    gpu: 'Integrada',
    storage: '1TB SSD',
    screen: '15.6" FHD IPS'
};

// Historial de cambios
let changeHistory = [];
let lastInvoice = null;

// Control de audio
const backgroundMusic = document.getElementById('background-music');
const toggleAudioBtn = document.getElementById('toggle-audio');
const volumeControl = document.getElementById('volume-control');
const volumeUpBtn = document.getElementById('volume-up');
const volumeDownBtn = document.getElementById('volume-down');
let isAudioPlaying = false;

// Inicializar audio
backgroundMusic.volume = 0.2;
toggleAudioBtn.textContent = 'Activar musica';

// Toggle audio
toggleAudioBtn.addEventListener('click', function() {
    if (isAudioPlaying) {
        backgroundMusic.pause();
        toggleAudioBtn.textContent = 'Activar musica';
    } else {
        backgroundMusic.play();
        toggleAudioBtn.textContent = 'Pausar musica';
    }
    isAudioPlaying = !isAudioPlaying;
});

// Control de volumen con slider
volumeControl.addEventListener('input', function() {
    backgroundMusic.volume = this.value / 100;
});

// Subir volumen con flecha arriba
volumeUpBtn.addEventListener('click', function() {
    let currentVolume = parseInt(volumeControl.value);
    if (currentVolume < 100) {
        currentVolume = Math.min(currentVolume + 10, 100);
        volumeControl.value = currentVolume;
        backgroundMusic.volume = currentVolume / 100;
    }
});

// Bajar volumen con flecha abajo
volumeDownBtn.addEventListener('click', function() {
    let currentVolume = parseInt(volumeControl.value);
    if (currentVolume > 0) {
        currentVolume = Math.max(currentVolume - 10, 0);
        volumeControl.value = currentVolume;
        backgroundMusic.volume = currentVolume / 100;
    }
});

// Precios base
const basePrices = {
    processor: 0,
    ram: 0,
    gpu: 0,
    storage: 140,
    screen: 150
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeOptions();
    updateSummary();
});

function initializeOptions() {
    // Procesador
    document.querySelectorAll('input[name="processor"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.option-card');
            document.querySelectorAll('#processor-options .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Animación de selección
            animateSelection(card);
            
            selectedComponents.processor = card.dataset.name;
            basePrices.processor = parseInt(card.dataset.price);
            addToHistory('Procesador', card.dataset.name);
            updateSummary();
            showNotification(`Procesador seleccionado: ${card.dataset.name}`);
        });
    });

    // RAM
    document.querySelectorAll('input[name="ram"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.option-card');
            document.querySelectorAll('#ram-options .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Animación de selección
            animateSelection(card);
            
            selectedComponents.ram = card.dataset.name;
            basePrices.ram = parseInt(card.dataset.price);
            addToHistory('RAM', card.dataset.name);
            updateSummary();
            showNotification(`RAM seleccionada: ${card.dataset.name}`);
        });
    });

    // GPU
    document.querySelectorAll('input[name="gpu"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.option-card');
            document.querySelectorAll('#gpu-options .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Animación de selección
            animateSelection(card);
            
            selectedComponents.gpu = card.dataset.name;
            basePrices.gpu = parseInt(card.dataset.price);
            addToHistory('Tarjeta Gráfica', card.dataset.name);
            updateSummary();
            showNotification(`Tarjeta Gráfica seleccionada: ${card.dataset.name}`);
        });
    });

    // Almacenamiento
    document.querySelectorAll('input[name="storage"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.option-card');
            document.querySelectorAll('#storage-options .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Animación de selección
            animateSelection(card);
            
            selectedComponents.storage = card.dataset.name;
            basePrices.storage = parseInt(card.dataset.price);
            addToHistory('Almacenamiento', card.dataset.name);
            updateSummary();
            showNotification(`Almacenamiento seleccionado: ${card.dataset.name}`);
        });
    });

    // Pantalla
    document.querySelectorAll('input[name="screen"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.option-card');
            document.querySelectorAll('#screen-options .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Animación de selección
            animateSelection(card);
            
            selectedComponents.screen = card.dataset.name;
            basePrices.screen = parseInt(card.dataset.price);
            addToHistory('Pantalla', card.dataset.name);
            updateSummary();
            showNotification(`Pantalla seleccionada: ${card.dataset.name}`);
        });
    });


    // Marcar opciones seleccionadas por defecto
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        const card = radio.closest('.option-card');
        if (card) {
            card.classList.add('selected');
        }
    });
    
    // Cargar configuración guardada si existe
    loadConfiguration();
}

function updateSummary() {
    // Actualizar texto del resumen
    document.getElementById('summary-processor').textContent = selectedComponents.processor || 'No seleccionado';
    document.getElementById('summary-ram').textContent = selectedComponents.ram || 'No seleccionado';
    document.getElementById('summary-gpu').textContent = selectedComponents.gpu;
    document.getElementById('summary-storage').textContent = selectedComponents.storage;
    document.getElementById('summary-screen').textContent = selectedComponents.screen;

    // Calcular total
    totalPrice = basePrices.processor + basePrices.ram + basePrices.gpu + 
                 basePrices.storage + basePrices.screen;

    // Actualizar precio total con animación
    animatePrice(totalPrice);
}

function animatePrice(newPrice) {
    const priceElement = document.getElementById('total-price');
    const currentPrice = parseInt(priceElement.textContent.replace('$', '')) || 0;
    
    if (currentPrice === newPrice) return;
    
    const duration = 500;
    const steps = 30;
    const increment = (newPrice - currentPrice) / steps;
    let step = 0;
    
    const animation = setInterval(() => {
        step++;
        const intermediatePrice = Math.round(currentPrice + (increment * step));
        priceElement.textContent = '$' + intermediatePrice;
        
        if (step >= steps) {
            clearInterval(animation);
            priceElement.textContent = '$' + newPrice;
        }
    }, duration / steps);
}

function buyPC() {
    // Validar que se hayan seleccionado los componentes obligatorios
    if (!selectedComponents.processor) {
        showNotification('Por favor selecciona un procesador para tu PC');
        return;
    }
    
    if (!selectedComponents.ram) {
        showNotification('Por favor selecciona memoria RAM para tu PC');
        return;
    }

    // Crear resumen de la orden
    const orderSummary = `
Resumen de tu PC:
• Procesador: ${selectedComponents.processor}
• RAM: ${selectedComponents.ram}
• Tarjeta Gráfica: ${selectedComponents.gpu}
• Almacenamiento: ${selectedComponents.storage}
• Pantalla: ${selectedComponents.screen}

Total: $${totalPrice}
    `;

    // Llenar el textarea con el resumen
    document.getElementById('mensaje').value = orderSummary;
    document.getElementById('estado').innerHTML = '';

    // Calcular fecha de entrega (5-7 días hábiles desde hoy)
    const fechaEntrega = calcularFechaEntrega();
    document.getElementById('fecha-entrega').textContent = fechaEntrega;

    // Mostrar el modal
    document.getElementById('contact-modal').style.display = 'block';
}

function calcularFechaEntrega() {
    const hoy = new Date();
    const diasEntrega = 7; // 7 días hábiles (aprox 10 días calendario)
    const fechaEntrega = new Date(hoy);
    fechaEntrega.setDate(hoy.getDate() + diasEntrega);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fechaEntrega.toLocaleDateString('es-ES', options);
}

function formatCurrency(value) {
    return '$' + Number(value || 0).toLocaleString('en-US');
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entities[char];
    });
}

function createInvoiceNumber() {
    return `FAC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function createInvoiceData(customerData) {
    const createdAt = new Date();

    return {
        number: createInvoiceNumber(),
        createdAt: createdAt.toLocaleString('es-DO', {
            dateStyle: 'long',
            timeStyle: 'short'
        }),
        deliveryDate: document.getElementById('fecha-entrega').textContent,
        warranty: '1 año de garantía',
        customer: customerData,
        components: [
            { label: 'Procesador', value: selectedComponents.processor, price: basePrices.processor },
            { label: 'RAM', value: selectedComponents.ram, price: basePrices.ram },
            { label: 'Tarjeta Gráfica', value: selectedComponents.gpu, price: basePrices.gpu },
            { label: 'Almacenamiento', value: selectedComponents.storage, price: basePrices.storage },
            { label: 'Pantalla', value: selectedComponents.screen, price: basePrices.screen }
        ],
        total: totalPrice
    };
}

function getInvoiceMarkup(invoice, includeActions = true) {
    const componentLines = invoice.components.map(component => `
        <div class="invoice-line">
            <span><strong>${escapeHtml(component.label)}:</strong> ${escapeHtml(component.value)}</span>
            <span>${formatCurrency(component.price)}</span>
        </div>
    `).join('');

    const actionsMarkup = includeActions ? `
            <div class="invoice-actions">
                <button type="button" class="invoice-btn" onclick="downloadInvoice()">Descargar factura</button>
                <button type="button" class="invoice-btn" onclick="printInvoice()">Imprimir factura</button>
            </div>
    ` : '';

    return `
        <div class="invoice-card">
            <div class="invoice-success">Pedido confirmado exitosamente.</div>
            <div class="invoice-header">
                <div>
                    <h3>Factura de compra</h3>
                    <div class="invoice-number">No. ${escapeHtml(invoice.number)}</div>
                </div>
                <div class="invoice-date">${escapeHtml(invoice.createdAt)}</div>
            </div>

            <div class="invoice-section">
                <h4>Datos del cliente</h4>
                <div class="invoice-meta">
                    <div><strong>Nombre:</strong> ${escapeHtml(invoice.customer.nombre)}</div>
                    <div><strong>Teléfono:</strong> ${escapeHtml(invoice.customer.telefono)}</div>
                    <div><strong>Dirección:</strong> ${escapeHtml(invoice.customer.direccion)}, ${escapeHtml(invoice.customer.ciudad)}, CP: ${escapeHtml(invoice.customer.codigoPostal)}</div>
                    <div><strong>Entrega estimada:</strong> ${escapeHtml(invoice.deliveryDate)}</div>
                </div>
            </div>

            <div class="invoice-section">
                <h4>Detalle de la PC</h4>
                <div class="invoice-lines">
                    ${componentLines}
                </div>
            </div>

            <div class="invoice-warranty">${escapeHtml(invoice.warranty)}</div>

            <div class="invoice-total">
                <span>Total</span>
                <span>${formatCurrency(invoice.total)}</span>
            </div>

            ${actionsMarkup}
        </div>
    `;
}

function getInvoiceDocument(invoice) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura ${escapeHtml(invoice.number)}</title>
    <style>
        body {
            margin: 0;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: #f4f6ff;
            color: #222;
        }

        .invoice-card {
            max-width: 760px;
            margin: 0 auto;
            padding: 24px;
            background: #fff;
            border: 1px solid #dfe4ff;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(40, 55, 120, 0.12);
        }

        .invoice-success {
            color: #2e7d32;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .invoice-header,
        .invoice-line,
        .invoice-total {
            display: flex;
            justify-content: space-between;
            gap: 16px;
        }

        .invoice-header {
            align-items: flex-start;
            margin-bottom: 18px;
        }

        .invoice-header h3 {
            margin: 0 0 6px;
            color: #5c6fe5;
            font-size: 28px;
        }

        .invoice-number,
        .invoice-date,
        .invoice-meta {
            color: #555;
            line-height: 1.6;
        }

        .invoice-section {
            margin-top: 18px;
        }

        .invoice-section h4 {
            margin: 0 0 10px;
            font-size: 18px;
            color: #333;
        }

        .invoice-lines {
            display: grid;
            gap: 10px;
        }

        .invoice-line {
            padding-bottom: 10px;
            border-bottom: 1px solid #eceefe;
        }

        .invoice-line strong {
            color: #333;
        }

        .invoice-warranty {
            margin-top: 18px;
            padding: 14px 16px;
            border-radius: 12px;
            background: #eef2ff;
            color: #34408a;
            font-weight: 700;
            text-align: center;
        }

        .invoice-total {
            margin-top: 18px;
            padding-top: 16px;
            border-top: 2px solid #d7ddff;
            font-size: 20px;
            font-weight: 700;
        }

        .invoice-total span:last-child {
            color: #5c6fe5;
            font-size: 28px;
        }

        @media print {
            body {
                padding: 0;
                background: #fff;
            }

            .invoice-card {
                box-shadow: none;
                border: none;
                border-radius: 0;
                max-width: none;
            }
        }
    </style>
</head>
<body>
    ${getInvoiceMarkup(invoice, false)}
</body>
</html>
    `;
}

function renderInvoice(invoice) {
    document.getElementById('estado').innerHTML = getInvoiceMarkup(invoice, true);
}

function downloadInvoice() {
    if (!lastInvoice) {
        showNotification('No hay una factura lista para descargar');
        return;
    }

    const blob = new Blob([getInvoiceDocument(lastInvoice)], {
        type: 'text/html;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `factura-${lastInvoice.number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function printInvoice() {
    if (!lastInvoice) {
        showNotification('No hay una factura lista para imprimir');
        return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
        showNotification('Tu navegador bloqueó la ventana de impresión');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(getInvoiceDocument(lastInvoice));
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 300);
}

// Cerrar modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contact-modal');
    const closeModal = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');

    // Cerrar modal con el botón X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Cerrar modal haciendo clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Manejar envío del formulario (sistema de pedidos)
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar que el formulario tenga datos
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const ciudad = document.getElementById('ciudad').value;
        const codigo_postal = document.getElementById('codigo_postal').value;
        const mensaje = document.getElementById('mensaje').value;
        
        if (!nombre || !telefono || !direccion || !ciudad || !codigo_postal || !mensaje) {
            showNotification('Por favor completa todos los campos');
            return;
        }

        // Simular confirmación del pedido
        document.getElementById('estado').innerHTML = `
            <div style="color: #4CAF50; font-weight: bold; margin-top: 15px;">
                ✅ ¡Pedido confirmado exitosamente!
            </div>
            <div style="margin-top: 10px;">
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Dirección:</strong> ${direccion}, ${ciudad}, CP: ${codigo_postal}</p>
                <p><strong>Fecha de entrega:</strong> ${document.getElementById('fecha-entrega').textContent}</p>
                <p><strong>Total:</strong> $${totalPrice}</p>
            </div>
        `;

        const invoice = createInvoiceData({
            nombre: nombre,
            telefono: telefono,
            direccion: direccion,
            ciudad: ciudad,
            codigoPostal: codigo_postal
        });

        lastInvoice = invoice;
        renderInvoice(invoice);
        
        showNotification('¡Pedido confirmado exitosamente!');
        
        // Guardar pedido en localStorage
        guardarPedido(invoice);
        
        // Cerrar modal después de 3 segundos
        document.getElementById('estado').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

function guardarPedido(invoice) {
    const pedido = {
        fecha: new Date().toISOString(),
        nombre: invoice.customer.nombre,
        telefono: invoice.customer.telefono,
        direccion: invoice.customer.direccion,
        ciudad: invoice.customer.ciudad,
        codigo_postal: invoice.customer.codigoPostal,
        componentes: selectedComponents,
        total: totalPrice,
        fecha_entrega: invoice.deliveryDate,
        factura_numero: invoice.number,
        garantia: invoice.warranty
    };
    
    // Obtener pedidos anteriores
    let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidos.push(pedido);
    
    // Guardar pedidos
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    console.log('Pedido guardado:', pedido);
}

function resetConfiguration() {
    // Resetear selecciones
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Resetear cards seleccionadas
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Resetear valores por defecto
    document.getElementById('gpu-integrated').checked = true;
    document.getElementById('storage1tb').checked = true;
    document.getElementById('screen15fhd').checked = true;
    
    // Marcar cards por defecto
    document.getElementById('gpu-integrated').closest('.option-card').classList.add('selected');
    document.getElementById('storage1tb').closest('.option-card').classList.add('selected');
    document.getElementById('screen15fhd').closest('.option-card').classList.add('selected');
    
    // Resetear variables
    selectedComponents = {
        processor: null,
        ram: null,
        gpu: 'Integrada',
        storage: '1TB SSD',
        screen: '15.6" FHD IPS'
    };
    
    basePrices = {
        processor: 0,
        ram: 0,
        gpu: 0,
        storage: 140,
        screen: 150
    };
    
    changeHistory = [];
    updateSummary();
    showNotification('Configuración reseteada');
}

// Función de animación de selección
function animateSelection(card) {
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
}

// Función para agregar al historial
function addToHistory(component, value) {
    const timestamp = new Date().toLocaleTimeString();
    changeHistory.push({
        component: component,
        value: value,
        time: timestamp
    });
    
    // Limitar historial a 10 cambios
    if (changeHistory.length > 10) {
        changeHistory.shift();
    }
    
    console.log('Historial:', changeHistory);
}

// Función para mostrar notificaciones visuales
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para guardar configuración en localStorage
function saveConfiguration() {
    const config = {
        selectedComponents: selectedComponents,
        basePrices: basePrices,
        totalPrice: totalPrice,
        changeHistory: changeHistory
    };
    
    localStorage.setItem('pcConfig', JSON.stringify(config));
    showNotification('Configuración guardada exitosamente');
}

// Función para cargar configuración desde localStorage
function loadConfiguration() {
    const savedConfig = localStorage.getItem('pcConfig');
    
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            
            // Restaurar componentes seleccionados
            if (config.selectedComponents) {
                selectedComponents = config.selectedComponents;
            }
            
            // Restaurar precios base
            if (config.basePrices) {
                basePrices = config.basePrices;
            }
            
            // Restaurar historial
            if (config.changeHistory) {
                changeHistory = config.changeHistory;
            }
            
            // Actualizar interfaz
            updateSummary();
            
            // Marcar opciones seleccionadas
            Object.keys(selectedComponents).forEach(key => {
                const value = selectedComponents[key];
                if (value) {
                    const radio = document.querySelector(`input[name="${key}"][value="${value.replace(/ /g, '').toLowerCase()}"]`);
                    if (radio) {
                        radio.checked = true;
                        const card = radio.closest('.option-card');
                        if (card) {
                            card.classList.add('selected');
                        }
                    }
                }
            });
            
            showNotification('Configuración cargada exitosamente');
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    }
}

// Función para exportar configuración a JSON
function exportConfiguration() {
    const config = {
        selectedComponents: selectedComponents,
        basePrices: basePrices,
        totalPrice: totalPrice,
        changeHistory: changeHistory,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pc-configuracion.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Configuración exportada a JSON');
}

// Función para importar configuración desde JSON
function importConfiguration(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                
                // Restaurar componentes seleccionados
                if (config.selectedComponents) {
                    selectedComponents = config.selectedComponents;
                }
                
                // Restaurar precios base
                if (config.basePrices) {
                    basePrices = config.basePrices;
                }
                
                // Restaurar historial
                if (config.changeHistory) {
                    changeHistory = config.changeHistory;
                }
                
                // Actualizar interfaz
                updateSummary();
                
                // Marcar opciones seleccionadas
                Object.keys(selectedComponents).forEach(key => {
                    const value = selectedComponents[key];
                    if (value) {
                        const radio = document.querySelector(`input[name="${key}"][value="${value.replace(/ /g, '').toLowerCase()}"]`);
                        if (radio) {
                            radio.checked = true;
                            const card = radio.closest('.option-card');
                            if (card) {
                                card.classList.add('selected');
                            }
                        }
                    }
                });
                
                showNotification('Configuración importada exitosamente');
            } catch (error) {
                console.error('Error al importar configuración:', error);
                showNotification('Error al importar configuración');
            }
        };
        
        reader.readAsText(file);
    }
}

// Agregar efectos hover a las tarjetas de opciones
function addHoverEffects() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
        });
    });
}

// Inicializar efectos hover
document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
});
