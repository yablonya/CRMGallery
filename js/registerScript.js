let date
let passwordErrorMessages = [];
const REGEX = {
    UPPER_CASE: /[A-Z]/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
    DIGIT: /[0-9]/,
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    NAME_UK:  /[А-Яа-яҐґЄєІіЇї`']+/,
    CYRILLIC: /[А-Яа-яҐґЄєІіЇїЁё`']+/gu,
};

const ERROR_MESSAGES = {
    UPPER_CASE: 'Password must contain at least one uppercase letter',
    SPECIAL_CHAR: 'Password must contain at least one special character',
    DIGIT: 'Password must contain at least one digit',
    DATE: 'Password cannot contain your birth date',
    NAME: 'You cannot have your name in password',
    LENGTH_SHORT: 'Password must be at least 8 characters',
    LENGTH_LONG: 'Password cannot be longer than 24 characters',
    EMAIL_INVALID: 'Некоректна email адреса. Будь-ласка перевірте, чи ви вказали її правильно',
    NAME_INVALID: 'Це поле має бути заповнено лише українською мовою',
    CYRILLIC: 'You cannot enter cyrillic symbols in this field'
};

const hasUpperCase = (str) => REGEX.UPPER_CASE.test(str);
const hasSpecialChar = (str) => REGEX.SPECIAL_CHAR.test(str);
const hasDigit = (str) => REGEX.DIGIT.test(str);


function showError(elementId, message) {
    const element = document.getElementById(elementId+'PermanentErrorMessage')
    element.classList.toggle('errorText', !!message);
    element.innerText = message.toString() || '';
    element.style.display = ''
}


function showTemporaryError(elementId, message, duration) {
    const element = document.getElementById(elementId + 'TemporaryErrorMessage');
    if (element.querySelector('.temporaryError')) {
        return;
    }
    const tempErrorDiv = document.createElement('div');
    tempErrorDiv.className = 'temporaryError';
    tempErrorDiv.innerText = message;
    tempErrorDiv.style.color = 'red';
    element.appendChild(tempErrorDiv);

    setTimeout(() => {
        if (document.body.contains(tempErrorDiv)) {
            element.removeChild(tempErrorDiv);
        }
    }, duration);
}

function nameValidator(name) {
    const isValid = REGEX.NAME_UK.test(name.value) || name.value.length === 0;
    showError(name.id, isValid ? '' : ERROR_MESSAGES.NAME_INVALID);
    return isValid;
}

function emailValidator(email) {
    const isValid = REGEX.EMAIL.test(email.value) || email.value.length === 0;
    showError(email.id, isValid ? '' : ERROR_MESSAGES.EMAIL_INVALID);
    return isValid;
}

function hasDate(str, date) {
    const datePatterns = (date.toString() + '-' + date.toString().slice(2,4)).split('-');
    return atLeastTwo(datePatterns, str)
}
function atLeastTwo(array, str){
    let refArray = array
    let counter = 0
    for(let i = 0;i<refArray.length;i++){
        if(str.includes(refArray[i])) {
            counter++
            refArray.splice(i,1)
            i=0
        }
    }
    return counter>1
}

function nameFilled(){
    let idList = []
    if(document.getElementById('name').value.length>0) idList.push('name')
    if(document.getElementById('surname').value.length>0) idList.push('surname')
    if(document.getElementById('midname').value.length>0) idList.push('midname')
    return idList
}
function containName(str){
    const names = nameFilled().filter((id) =>{
        return str.includes(document.getElementById(id).value);
    })
    return names.length>0
}

function shakePasswordContainer() {
    const container = document.getElementById('password-input');
    container.classList.add('shake');
    container.addEventListener('animationend', () => {
        container.classList.remove('shake');
    });
}

const isCyrillic = (str) => REGEX.CYRILLIC.test(str)
function passwordValidator(passwordInput) {
    passwordErrorMessages = []

    const password = passwordInput.value;

    if (password.length === 0) {
        return false;
    }
    if(isCyrillic(password)) {
        showTemporaryError(passwordInput.id, ERROR_MESSAGES.CYRILLIC, 4000);
        shakePasswordContainer();
        passwordInput.value = password.replace(REGEX.CYRILLIC, '')
    }
    if (!hasUpperCase(password)) {
        passwordErrorMessages.push(ERROR_MESSAGES.UPPER_CASE);
    }
    if (!hasSpecialChar(password)) {
        passwordErrorMessages.push(ERROR_MESSAGES.SPECIAL_CHAR);
    }
    if (!hasDigit(password)) {
        passwordErrorMessages.push(ERROR_MESSAGES.DIGIT);
    }
    if (hasDate(password, date)) {
        passwordErrorMessages.push(ERROR_MESSAGES.DATE);
    }
    if (containName(password)) {
        passwordErrorMessages.push(ERROR_MESSAGES.NAME);
    }
    if (password.length < 8) {
        passwordErrorMessages.push(ERROR_MESSAGES.LENGTH_SHORT);
    }
    if (password.length > 24) {
        passwordErrorMessages.push(ERROR_MESSAGES.LENGTH_LONG);
    }

    showError(passwordInput.id, passwordErrorMessages.join('\n'));
    return passwordErrorMessages.length === 0;
}

function checkAll(){
    const name = document.getElementById('name');
    const surname = document.getElementById('surname');
    const midname = document.getElementById('midname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    return nameValidator(name)
        && nameValidator(surname)
        && nameValidator(midname)
        && passwordValidator(password)
        && emailValidator(email);

}

function formatDate(date) {
    let refDate = new Date(date)
    const dd = String(refDate.getDate()).padStart(2, '0');
    const mm = String(refDate.getMonth() + 1).padStart(2, '0');
    const yyyy = refDate.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
}
function addRow() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const midname = document.getElementById('midname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('date').value;
    const file = document.getElementById('file-input').value;
    const phone = document.getElementById('cellphone').value
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if(checkAll()){
        const newRow = table.insertRow();
        newRow.innerHTML = `<td><input type="checkbox" class="rowCheckbox" onclick="updateMasterCheckbox()"></td><td>${name}</td><td>${surname}</td><td>${midname}</td></td><td>${password}</td><td>${email}</td><td>${formatDate(dob)}</td><td>${gender}</td><td>${phone}</td><td>${file}</td>`;


        document.getElementById('name').value = ''
        document.getElementById('surname').value= ''
        document.getElementById('midname').value= ''
        document.getElementById('email').value= ''
        document.getElementById('password').value= ''
        document.getElementById('file-input').value= ''
        setYesterdayDate()
    }
}

function setYesterdayDate(){
    const dateInput = document.getElementById('date');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');

    const yesterdayDate = yyyy + '-' + mm + '-' + dd;
    const minDate = yyyy-128 + '-' + mm + '-' + dd
    dateInput.setAttribute('max', yesterdayDate);
    dateInput.setAttribute('min', minDate)
    dateInput.value = yesterdayDate;
    return yesterdayDate
}

function toggleCheckboxes() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const checkboxes = document.querySelectorAll('.rowCheckbox');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = masterCheckbox.checked;
    }
}

function deleteRows() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const checkboxes = document.querySelectorAll('.rowCheckbox');

    for (let i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            table.deleteRow(i);
        }
    }
    if(table.length===undefined) document.getElementById('masterCheckbox').checked = false;
}

function duplicateRows() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const checkboxes = document.querySelectorAll('.rowCheckbox');

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const clone = table.rows[i].cloneNode(true);
            clone.querySelector('.rowCheckbox').checked = false;
            table.appendChild(clone);
        }
    }
}

function showPassword() {
    document.getElementById('password').type = 'text';
}

function hidePassword() {
    document.getElementById('password').type = 'password';
}

function updateDate() {
    date = document.getElementById('date').value;
}
function clearErrorMessages(){
    const password = document.getElementById('password').value
    if(password.length===0) showError('password', '')
}

function Listeners() {
    document.getElementById('password').addEventListener("input", clearErrorMessages)
    document.getElementById('showPassword').addEventListener('mousedown', showPassword);
    document.getElementById('showPassword').addEventListener('mouseup', hidePassword);
    document.getElementById('showPassword').addEventListener('mouseleave', hidePassword);
    document.getElementById('date').addEventListener('input', updateDate);
}
function autofill(){
    document.getElementById('password').value = "Greenbaby20!4"
    document.getElementById('name').value = "Костянтин"
    document.getElementById('surname').value = "Ісаєв"
    document.getElementById('midname').value = "Сергійович"
    document.getElementById('email').value = "onargo@gmail.com"
    document.getElementById('date').value = '2004-06-17'
    document.getElementById('cellphone').value = '+38(063)-823-53-77'
}

function updateMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    let allChecked = true;

    for (let i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            allChecked = false;
            break;
        }
    }
    masterCheckbox.checked = allChecked;
}
document.addEventListener('DOMContentLoaded', () => {
    date = setYesterdayDate();
    Listeners();
});
document.getElementById('autofill').addEventListener('click', autofill)
