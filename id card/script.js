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

// Generate PDF
document.getElementById('generatePDF').addEventListener('click', function() {
    const element = document.getElementById('idCardPreview');
    const opt = {
        margin: 1,
        filename: 'id-card.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save().catch(function(error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    });
});