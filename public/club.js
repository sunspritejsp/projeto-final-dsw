async function buscar(url) {
  const resposta = await fetch(url);
  const data = await resposta.json();
  const errorMessage = data.error || null;
  const status = resposta.status;
  return { data, errorMessage, status };
}

async function buscarMembro(id) {
  const { data, errorMessage } = await buscar(`/members/${id}`);
  if (errorMessage) throw new Error(errorMessage);
  return data;
}

async function tryBuscarMembro(id) {
  try {
    return await buscarMembro(id);
  } catch (error) {
    mostrarErro(error.message);
  }
}

function mostrarErro(mensagem) {
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = mensagem;
  statusMessage.classList.remove('hidden');
  statusMessage.classList.add('error');
}

async function iniciar() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  const membro = await tryBuscarMembro(id);
  if (!membro) return;
  console.log(membro); // próximo passo: preencher o formulário
}

iniciar();
