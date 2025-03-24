// Handle file input for company logo
document.getElementById('companyLogo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewLogo').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle file input for photo
document.getElementById('photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewPhoto').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle text input updates
const updatePreview = (inputId, previewId) => {
    document.getElementById(inputId).addEventListener('input', function(e) {
        document.getElementById(previewId).textContent = e.target.value;
    });
};

// Update preview for all text inputs
updatePreview('name', 'previewName');
updatePreview('designation', 'previewDesignation');
updatePreview('employeeId', 'previewEmployeeId');
updatePreview('department', 'previewDepartment');
updatePreview('validUntil', 'previewValidUntil');

// Handle PDF generation
document.getElementById('generatePDF').addEventListener('click', function() {
    const element = document.getElementById('idCardPreview');
    const opt = {
        margin: 1,
        filename: 'id-card.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
});