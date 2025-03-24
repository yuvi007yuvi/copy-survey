// Initialize all preview elements
const previewElements = {
    logo: document.getElementById('previewLogo'),
    photo: document.getElementById('previewPhoto'),
    name: document.getElementById('previewName'),
    designation: document.getElementById('previewDesignation'),
    employeeId: document.getElementById('previewEmployeeId'),
    department: document.getElementById('previewDepartment'),
    validUntil: document.getElementById('previewValidUntil')
};

// Handle file inputs
function handleFileInput(inputElement, previewElement, defaultSrc) {
    inputElement.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewElement.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            previewElement.src = defaultSrc;
        }
    });
}

// Handle text inputs
function handleTextInput(inputElement, previewElement) {
    inputElement.addEventListener('input', function(e) {
        previewElement.textContent = e.target.value || previewElement.defaultValue;
    });
}

// Initialize file inputs
handleFileInput(
    document.getElementById('companyLogo'),
    previewElements.logo,
    'image.png'
);
handleFileInput(
    document.getElementById('photo'),
    previewElements.photo,
    'placeholder.png'
);

// Initialize text inputs
handleTextInput(
    document.getElementById('name'),
    previewElements.name
);
handleTextInput(
    document.getElementById('designation'),
    previewElements.designation
);
handleTextInput(
    document.getElementById('employeeId'),
    previewElements.employeeId
);
handleTextInput(
    document.getElementById('department'),
    previewElements.department
);

// Handle date input
document.getElementById('validUntil').addEventListener('input', function(e) {
    const date = new Date(e.target.value);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    previewElements.validUntil.textContent = formattedDate;
});

// Helper function to prepare ID card element for export
function prepareIdCardForExport() {
    const element = document.getElementById('idCardPreview');
    const clone = element.cloneNode(true);
    
    clone.style.position = 'relative';
    clone.style.width = '350px';
    clone.style.margin = '0';
    clone.style.padding = '20px';
    
    const waveBg = clone.querySelector('.wave-bg');
    if (waveBg) {
        waveBg.style.position = 'absolute';
        waveBg.style.opacity = '0.8';
    }
    
    return clone;
}

// Helper function to get file name base
function getFileNameBase() {
    const name = previewElements.name.textContent.toLowerCase().replace(/\s+/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    return `id-card-${name}-${timestamp}`;
}

// Generate PDF
document.getElementById('generatePDF').addEventListener('click', async function() {
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';

    try {
        const clone = prepareIdCardForExport();
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${getFileNameBase()}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
                letterRendering: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        await html2pdf().set(opt).from(clone).save();
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    } finally {
        this.disabled = false;
        this.innerHTML = '<i class="fas fa-file-pdf"></i> Export as PDF';
    }
});

// Generate Image
document.getElementById('generateImage').addEventListener('click', async function() {
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Image...';

    try {
        const clone = prepareIdCardForExport();
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        document.body.removeChild(clone);

        // Create download link
        const link = document.createElement('a');
        link.download = `${getFileNameBase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('There was an error generating the image. Please try again.');
    } finally {
        this.disabled = false;
        this.innerHTML = '<i class="fas fa-image"></i> Export as Image';
    }
});