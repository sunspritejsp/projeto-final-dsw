function campo(id) {
  return document.getElementById(id);
}

async function requisitar(url, opcoes) {
  try {
    const resposta = await fetch(url, opcoes);
    const dados = await resposta.json();
    return { dados, erro: dados.error || null };
  } catch {
    return { dados: null, erro: 'Não foi possível conectar ao servidor.' };
  }
}

function mostrarMensagem(texto, tipo) {
  const mensagem = campo('status-message');
  mensagem.textContent = texto;
  mensagem.className = `message ${tipo}`;
}

function preencherFormulario(membro) {
  campo('member-id').value = membro.id;
  campo('name').value = membro.name;
  campo('email').value = membro.email;
  campo('birth-date').value = membro.birth_date;
  document.querySelector(`input[name="plan"][value="${membro.plan}"]`).checked = true;
  campo('student').checked = membro.student === 1;
  campo('zip-code').value = membro.zip_code;
  campo('street').value = membro.street;
  campo('house-number').value = membro.house_number ?? '';
  campo('city').value = membro.city;
  campo('state').value = membro.state;
  campo('address-details').value = membro.address_details ?? '';
}

async function iniciarModoEdicao() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;

  const { dados, erro } = await requisitar(`/members/${id}`);
  if (erro) {
    mostrarMensagem(erro, 'error');
    return;
  }
  preencherFormulario(dados);
  campo('form-title').textContent = 'Editar inscrição';
  campo('submit-button').textContent = 'Salvar alterações';
  campo('cancel-button').classList.remove('hidden');
}

function validarFormulario() {
  if (campo('name').value.trim().length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres.';
  }
  const hoje = new Date().toLocaleDateString('en-CA'); // en-CA formata como AAAA-MM-DD
  if (campo('birth-date').value > hoje) {
    return 'A data de nascimento não pode estar no futuro.';
  }
  return null;
}

function lerFormulario() {
  const numeroCasa = campo('house-number').value;
  const complemento = campo('address-details').value.trim();
  return {
    name: campo('name').value.trim(),
    email: campo('email').value.trim(),
    birth_date: campo('birth-date').value,
    plan: document.querySelector('input[name="plan"]:checked').value,
    student: campo('student').checked,
    zip_code: campo('zip-code').value.trim(),
    street: campo('street').value.trim(),
    house_number: numeroCasa ? Number(numeroCasa) : null,
    city: campo('city').value.trim(),
    state: campo('state').value,
    address_details: complemento || null,
  };
}

function salvarMembro(id, membro) {
  return requisitar(id ? `/members/${id}` : '/members', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membro),
  });
}

async function enviarFormulario(evento) {
  evento.preventDefault();

  const erroValidacao = validarFormulario();
  if (erroValidacao) {
    mostrarMensagem(erroValidacao, 'error');
    return;
  }

  const id = campo('member-id').value;
  const botao = campo('submit-button');
  const textoBotao = botao.textContent;
  botao.disabled = true;
  botao.textContent = 'Enviando...';

  const { erro } = await salvarMembro(id, lerFormulario());
  if (erro) {
    mostrarMensagem(erro, 'error');
  } else if (id) {
    mostrarMensagem('Alterações salvas!', 'success');
  } else {
    campo('member-form').reset();
    mostrarMensagem('Inscrição realizada!', 'success');
  }

  botao.disabled = false;
  botao.textContent = textoBotao;
}

campo('member-form').addEventListener('submit', enviarFormulario);
campo('cancel-button').addEventListener('click', () => {
  location.href = 'members.html';
});
iniciarModoEdicao();
