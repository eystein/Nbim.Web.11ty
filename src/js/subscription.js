const inputEmail = document.getElementById('mail');
let inputEmailValue;
if (inputEmail !== null) inputEmailValue = inputEmail.value;
const verifyEmailBtn = document.getElementById('verify');
const acceptTerms = document.getElementById('Confirm');
const errorMsg = document.getElementById('errorMsg');
let validEmail = false;

export function initialRender() {
    errorMsg.style.display = "none";
    verifyEmailBtn.classList.add('disabled');
    verifyEmailBtn.setAttribute('disabled', '');
}

// Based on: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function inputChangeEventHandler(event) {
    // Set 'value' as user types on input
    this.setAttribute('value', event.target.value);
    inputEmailValue = event.target.value;
    if (!validateEmail(inputEmailValue)) {
        errorMsg.style.display = "block";
        validEmail = false;
    } else {
        errorMsg.style.display = "none";
        validEmail = true;
    }
    if (event.target.value) {
        if (acceptTerms.hasAttribute('checked') && validEmail) {
            verifyEmailBtn.removeAttribute('disabled');
            verifyEmailBtn.classList.remove('disabled');
        } else {
            verifyEmailBtn.classList.add('disabled');
            verifyEmailBtn.setAttribute('disabled', '');
        }
    } else {
        verifyEmailBtn.classList.add('disabled');
        verifyEmailBtn.setAttribute('disabled', '');
    }
}

export function termsChangeEventHandler(event) {
    if (event.target.checked) {
        acceptTerms.classList.add('checked');
        acceptTerms.setAttribute('checked', '');
        validEmail = validateEmail(inputEmailValue);
        if (inputEmailValue && validateEmail(inputEmailValue)) {
            verifyEmailBtn.removeAttribute('disabled');
            verifyEmailBtn.classList.remove('disabled');
        } else {
            verifyEmailBtn.classList.add('disabled');
            verifyEmailBtn.setAttribute('disabled', '');
        }
    } else {
        acceptTerms.classList.remove('checked');
        acceptTerms.removeAttribute('checked');
        verifyEmailBtn.classList.add('disabled');
        verifyEmailBtn.setAttribute('disabled', '');
    }
}
