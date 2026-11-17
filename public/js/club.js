const form = document.getElementById('member-form');
const message = document.getElementById('status-message');
const button = document.getElementById('submit-button');

function showMessage(text, type) {
  message.textContent = text;
  message.className = 'message ' + type; // 'message error' ou 'message success' (tira o hidden)
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  // validação em JS (o HTML não cobre estas duas)
  const name = document.getElementById('name').value.trim();
  const birthDate = document.getElementById('birth-date').value;
  const now = new Date();
  const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

  if (name === '') {
    showMessage('Informe o nome.', 'error');
    return;
  }
  if (birthDate > today) {
    showMessage('A data de nascimento não pode ser no futuro.', 'error');
    return;
  }

  // monta o objeto do contrato
  const houseNumber = document.getElementById('house-number').value;
  const details = document.getElementById('address-details').value.trim();

  const member = {
    name: name,
    email: document.getElementById('email').value.trim(),
    birth_date: birthDate,
    plan: document.querySelector('input[name="plan"]:checked').value,
    student: document.getElementById('student').checked,
    zip_code: document.getElementById('zip-code').value.trim(),
    street: document.getElementById('street').value.trim(),
    house_number: houseNumber === '' ? null : Number(houseNumber),
    city: document.getElementById('city').value.trim(),
    state: document.getElementById('state').value,
    address_details: details === '' ? null : details,
  };

  // envia
  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    const response = await fetch('/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });

    if (response.status === 201) {
      showMessage('Inscrição realizada!', 'success');
      form.reset();
    } else {
      const data = await response.json();
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Não foi possível conectar ao servidor.', 'error');
  }

  button.disabled = false;
  button.textContent = 'Inscrever';
});
