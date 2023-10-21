let date
const UPPER_CASE_REGEX = /[A-Z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const DIGIT_REGEX = /[0-9]/;


function showError(elementId, message) {
    const element = document.getElementById(elementId+'ErrorMessage')
    element.classList.toggle('errorText', !!message);
    element.innerText = message.toString() || '';
    element.style.display = ''
}
function nameValidator(name) {
    const regCheck = /[А-Яа-яҐґЄєІіЇї`']+/gu
     if(regCheck.test(name.value) || name.value.length===0) {
         showError(name.id, '')
         return true
     }
    else {
        showError(name.id, 'Це поле має бути заповнено лише українською мовою')
         return false
     }
}
function emailValidator(email){
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if(regex.test(email.value)){
        showError(email.id, '')
        return true
    }
    else if(email.value.length === 0){
        showError(email.id, '')
        return false
    }
    showError(email.id, 'Некоректна email адреса. Будь-ласка перевірте, чи ви вказали її правильно')
    return false
}
function hasUpperCase(str) {
    return UPPER_CASE_REGEX.test(str);
}

function hasSpecialChar(str) {
    return SPECIAL_CHAR_REGEX.test(str);
}

function hasDigit(str) {
    return DIGIT_REGEX.test(str);
}
function hasDate(str, date) {
    const datePatterns = (date.toString() + '-' + date.toString().slice(2,4)).split('-');
    return datePatterns.some(pattern => str.includes(pattern));
}
function passwordValidator(passwordInput) {
    const password = passwordInput.value;


    if (password.length === 0) {
        showError(passwordInput.id, '');
        return false;
    }

    const errorMessages = [];

    if (!hasUpperCase(password)) {
        errorMessages.push('Password must contain at least one uppercase letter\n');
    }
    if (!hasSpecialChar(password)) {
        errorMessages.push('Password must contain at least one special character\n');
    }
    if (!hasDigit(password)) {
        errorMessages.push('Password must contain at least one digit\n');
    }
    // Assuming `date` is defined elsewhere in your code
    if (hasDate(password, date)) {
        errorMessages.push('Password cannot contain the selected date\n');
    }
    if (password.length < 8) {
        errorMessages.push('Password must be at least 8 characters\n');
    }
    if (password.length > 24) {
        errorMessages.push('Password cannot be longer than 24 characters\n');
    }

    showError(passwordInput.id, errorMessages.join(''));
    return errorMessages.length === 0;
}

function checkString(givenString, stringList) {
    let count = 0;
    for (let i = 0; i < stringList.length; i++) {
        const stringElement = String(stringList[i]);
        if (givenString.includes(stringElement)) {
            count++;
            if (count >= 2) {
                return true;
            }
        }
    }
    return false;
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

function addRow() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const midname = document.getElementById('midname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('date').value;
    const file = document.getElementById('file-input').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if(checkAll()){
        const newRow = table.insertRow();
        newRow.innerHTML = `<td><input type="checkbox" class="rowCheckbox"></td><td>${name}</td><td>${surname}</td><td>${midname}</td></td><td>${password}</td><td>${email}</td><td>${dob}</td><td>${gender}</td><td>${file}</td>`;


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
    date = document.getElementById('date').value
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



document.getElementById('showPassword').addEventListener('mousedown', function() {
    document.getElementById('password').type = 'text';
});

document.getElementById('showPassword').addEventListener('mouseup', function() {
    document.getElementById('password').type = 'password';
});

document.getElementById('showPassword').addEventListener('mouseleave', function() {
    document.getElementById('password').type = 'password';
});

document.addEventListener('DOMContentLoaded', function() {
    setYesterdayDate()
});


document.getElementById('telephone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '+38(0';
    for (let i = 0; i < value.length; i++) {
        if (i === 2) formatted += ') ';
        else if (i === 5) formatted += '-';
        else if (i === 7) formatted += '-';
        formatted += value[i];
    }

    e.target.value = formatted;
});
