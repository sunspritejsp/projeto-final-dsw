let members = [];

// Função auxiliar para gerenciar mensagens de status e suas classes
function setStatus(message, type = '') {
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = message;
  statusMessage.classList.remove('hidden', 'error', 'success');

  if (type) {
    statusMessage.classList.add(type);
  }
}

function hideStatus() {
  const statusMessage = document.getElementById('status-message');
  statusMessage.classList.add('hidden');
  statusMessage.classList.remove('error', 'success');
}

async function fetchMembers() {
  try {
    const response = await fetch('/members');
    if (!response.ok) {
      throw new Error('Falha na resposta do servidor');
    }
    members = await response.json();
    renderMembers();
  } catch (error) {
    setStatus('Não foi possível carregar os membros.', 'error');
  }
}

// Mostrar a lista na página
function renderMembers() {
  const memberList = document.getElementById('member-list');
  const search = document.getElementById('search').value.toLowerCase();
  const onlyStudents = document.getElementById('filter-student').checked;

  const filtered = members.filter(m => {
    const matchesName = m.name.toLowerCase().includes(search);
    const matchesStudent = !onlyStudents || m.student === 1;
    return matchesName && matchesStudent;
  });

  memberList.innerHTML = '';

  if (filtered.length === 0) {
    setStatus('Nenhum membro encontrado.');
    return;
  }

  // Só esconde o status se não houver uma mensagem de sucesso/erro ativa
  const statusMessage = document.getElementById('status-message');
  if (!statusMessage.classList.contains('success') && !statusMessage.classList.contains('error')) {
    hideStatus();
  }

  filtered.forEach(m => {
    const article = document.createElement('article');
    article.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Título <h2> sem card-title
    const title = document.createElement('h2');
    title.textContent = m.name;

    // Meta informações
    const meta = document.createElement('p');
    meta.className = 'card-meta';

    const planText = m.student === 1 ? `Pipoca ${m.plan} · Estudante` : `Pipoca ${m.plan}`;
    const formattedDate = new Date(m.registration_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    const lines = [
      planText,
      m.email,
      `${m.city}/${m.state}`,
      `Membro desde ${formattedDate}`
    ];

    lines.forEach((lineText, index) => {
      meta.appendChild(document.createTextNode(lineText));
      if (index < lines.length - 1) {
        meta.appendChild(document.createElement('br'));
      }
    });

    // Ações do card
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editLink = document.createElement('a');
    editLink.href = `club.html?id=${m.id}`;
    editLink.className = 'button';
    editLink.textContent = 'Editar';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'button button-secondary';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.addEventListener('click', () => handleDelete(m.id, m.name, deleteBtn));

    actions.appendChild(editLink);
    actions.appendChild(deleteBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(meta);
    cardBody.appendChild(actions);
    article.appendChild(cardBody);
    memberList.appendChild(article);
  });
}

// Fluxo de delete de membro
async function handleDelete(id, name, button) {
  if (!confirm(`Deseja excluir ${name}?`)) return;

  button.disabled = true;

  try {
    const res = await fetch(`/members/${id}`, { method: 'DELETE' });

    if (res.status === 204) {
      members = members.filter(m => m.id !== id);
      setStatus('Membro excluído.', 'success');
      renderMembers();
      return;
    }

    if (res.status === 404) {
      const data = await res.json();
      setStatus(data.error || 'Membro não encontrado.', 'error');
      button.disabled = false;
      return;
    }

    // Fallback para outros erros HTTP (ex: 500)
    setStatus('Erro ao excluir o membro.', 'error');
    button.disabled = false;
  } catch (error) {
    setStatus('Erro de conexão ao tentar excluir o membro.', 'error');
    button.disabled = false;
  }
}

document.getElementById('search').addEventListener('input', () => {
  hideStatus();
  renderMembers();
});

document.getElementById('filter-student').addEventListener('change', () => {
  hideStatus();
  renderMembers();
});

fetchMembers();