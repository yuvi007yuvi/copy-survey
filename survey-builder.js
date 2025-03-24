// Survey Builder JavaScript

// Global variables to store survey data
let surveyData = {
    title: '',
    description: '',
    questions: [],
    settings: {
        anonymousResponses: false,
        multipleResponses: false,
        requireLogin: false,
        showProgress: true
    }
};

// Show question type options
function showQuestionTypes() {
    const questionTypes = document.getElementById('questionTypes');
    questionTypes.style.display = questionTypes.style.display === 'none' ? 'grid' : 'none';
}

// Add new question to the survey
function addQuestion(type) {
    const questionList = document.getElementById('questionList');
    const questionId = `question-${surveyData.questions.length + 1}`;
    
    let questionHTML = `
        <div class="question-item" id="${questionId}">
            <div class="question-header">
                <input type="text" class="question-text" placeholder="Enter your question">
                <div class="question-actions">
                    <button onclick="moveQuestion('${questionId}', 'up')" class="move-btn">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button onclick="moveQuestion('${questionId}', 'down')" class="move-btn">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button onclick="deleteQuestion('${questionId}')" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
    `;

    switch(type) {
        case 'multiple-choice':
            questionHTML += `
                <div class="answer-options">
                    <div class="option-list" id="${questionId}-options">
                        <div class="option-item">
                            <input type="text" placeholder="Option 1">
                            <button onclick="deleteOption(this)" class="delete-option">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <button onclick="addOption('${questionId}-options')" class="add-option-btn">
                        <i class="fas fa-plus"></i> Add Option
                    </button>
                </div>
            `;
            break;

        case 'rating':
            questionHTML += `
                <div class="rating-scale">
                    <input type="number" min="1" max="10" value="5" class="scale-input">
                    <label>Maximum rating</label>
                </div>
            `;
            break;

        case 'text':
            questionHTML += `
                <div class="text-response">
                    <select class="text-type">
                        <option value="short">Short Answer</option>
                        <option value="long">Long Answer</option>
                    </select>
                </div>
            `;
            break;

        case 'yes-no':
            questionHTML += `
                <div class="yes-no-options">
                    <label><input type="radio" name="${questionId}-yn" value="yes" disabled> Yes</label>
                    <label><input type="radio" name="${questionId}-yn" value="no" disabled> No</label>
                </div>
            `;
            break;
    }

    questionHTML += `
        <div class="question-settings">
            <label><input type="checkbox"> Required</label>
        </div>
    </div>
    `;

    // Create question element
    const questionElement = document.createElement('div');
    questionElement.innerHTML = questionHTML;
    questionList.appendChild(questionElement.firstElementChild);

    // Hide question types menu
    document.getElementById('questionTypes').style.display = 'none';

    // Add question to survey data
    surveyData.questions.push({
        id: questionId,
        type: type,
        text: '',
        required: false,
        options: type === 'multiple-choice' ? [''] : []
    });
}

// Add option to multiple choice question
function addOption(optionListId) {
    const optionList = document.getElementById(optionListId);
    const optionCount = optionList.children.length + 1;
    
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
        <input type="text" placeholder="Option ${optionCount}">
        <button onclick="deleteOption(this)" class="delete-option">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    optionList.appendChild(optionItem);
}

// Delete option from multiple choice question
function deleteOption(button) {
    const optionItem = button.parentElement;
    const optionList = optionItem.parentElement;
    optionList.removeChild(optionItem);
}

// Move question up or down
function moveQuestion(questionId, direction) {
    const question = document.getElementById(questionId);
    const questionList = question.parentElement;
    
    if (direction === 'up' && question.previousElementSibling) {
        questionList.insertBefore(question, question.previousElementSibling);
    } else if (direction === 'down' && question.nextElementSibling) {
        questionList.insertBefore(question.nextElementSibling, question);
    }
}

// Delete question
function deleteQuestion(questionId) {
    const question = document.getElementById(questionId);
    question.remove();
    
    // Remove question from survey data
    surveyData.questions = surveyData.questions.filter(q => q.id !== questionId);
}

// Preview survey
function previewSurvey() {
    // Save current survey data
    updateSurveyData();
    
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    let previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${surveyData.title} - Preview</title>
            <link rel="stylesheet" href="styles.css">
            <style>
                .preview-banner {
                    background: #4361ee;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                }
            </style>
        </head>
        <body>
            <div class="preview-banner">Preview Mode</div>
            <div class="container" style="margin-top: 60px;">
                <div class="survey-form">
                    <h1>${surveyData.title}</h1>
                    <p>${surveyData.description}</p>
    `;

    // Add questions
    surveyData.questions.forEach(question => {
        previewHTML += `
            <div class="question-item">
                <h3>${question.text || 'Untitled Question'}</h3>
        `;

        switch(question.type) {
            case 'multiple-choice':
                question.options.forEach((option, index) => {
                    previewHTML += `
                        <label>
                            <input type="radio" name="${question.id}" value="${index}">
                            ${option || `Option ${index + 1}`}
                        </label>
                    `;
                });
                break;

            case 'rating':
                previewHTML += `
                    <div class="rating-preview">
                        ${Array.from({length: 5}, (_, i) => i + 1).map(num => `
                            <label>
                                <input type="radio" name="${question.id}" value="${num}">
                                ${num}
                            </label>
                        `).join('')}
                    </div>
                `;
                break;

            case 'text':
                previewHTML += `
                    <textarea rows="3" placeholder="Your answer"></textarea>
                `;
                break;

            case 'yes-no':
                previewHTML += `
                    <label><input type="radio" name="${question.id}" value="yes"> Yes</label>
                    <label><input type="radio" name="${question.id}" value="no"> No</label>
                `;
                break;
        }

        previewHTML += `</div>`;
    });

    previewHTML += `
                </div>
            </div>
        </body>
        </html>
    `;

    previewWindow.document.write(previewHTML);
}

// Save survey
function saveSurvey() {
    // Update survey data
    updateSurveyData();
    
    // Validate survey
    if (!validateSurvey()) {
        alert('Please fill in all required fields before saving.');
        return;
    }
    
    // Save survey data (in a real application, this would send data to a server)
    console.log('Survey saved:', surveyData);
    alert('Survey saved successfully!');
}

// Update survey data from form
function updateSurveyData() {
    // Update basic info
    surveyData.title = document.getElementById('surveyTitle').value;
    surveyData.description = document.getElementById('surveyDescription').value;
    
    // Update settings
    surveyData.settings = {
        anonymousResponses: document.getElementById('anonymousResponses').checked,
        multipleResponses: document.getElementById('multipleResponses').checked,
        requireLogin: document.getElementById('requireLogin').checked,
        showProgress: document.getElementById('showProgress').checked
    };
    
    // Update questions
    const questionElements = document.querySelectorAll('.question-item');
    surveyData.questions = Array.from(questionElements).map(element => {
        const questionData = {
            id: element.id,
            text: element.querySelector('.question-text').value,
            required: element.querySelector('.question-settings input[type="checkbox"]').checked
        };
        
        // Get question type specific data
        if (element.querySelector('.option-list')) {
            questionData.type = 'multiple-choice';
            questionData.options = Array.from(element.querySelectorAll('.option-item input')).map(input => input.value);
        } else if (element.querySelector('.rating-scale')) {
            questionData.type = 'rating';
            questionData.scale = parseInt(element.querySelector('.scale-input').value);
        } else if (element.querySelector('.text-response')) {
            questionData.type = 'text';
            questionData.textType = element.querySelector('.text-type').value;
        } else if (element.querySelector('.yes-no-options')) {
            questionData.type = 'yes-no';
        }
        
        return questionData;
    });
}

// Validate survey before saving
function validateSurvey() {
    if (!surveyData.title.trim()) {
        return false;
    }
    
    if (surveyData.questions.length === 0) {
        return false;
    }
    
    for (const question of surveyData.questions) {
        if (!question.text.trim()) {
            return false;
        }
        
        if (question.type === 'multiple-choice' && 
            (!question.options.length || !question.options.some(opt => opt.trim()))) {
            return false;
        }
    }
    
    return true;
}

// Initialize event listeners when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize survey settings
    const settingsInputs = document.querySelectorAll('.survey-settings input[type="checkbox"]');
    settingsInputs.forEach(input => {
        input.addEventListener('change', function() {
            surveyData.settings[this.id] = this.checked;
        });
    });
});