let members = []; 

async function fetchMembers() {
  const response = await fetch('/members');
  members = await response.json();
  renderMembers();
}

// mostrar a lista na página
function renderMembers() {
  const memberList = document.getElementById('member-list');
  const statusMessage = document.getElementById('status-message');
  
  const search = document.getElementById('search').value.toLowerCase();
  const onlyStudents = document.getElementById('filter-student').checked;

  const filtered = members.filter(m => {
    const matchesName = m.name.toLowerCase().includes(search);
    const matchesStudent = !onlyStudents || m.student === 1;
    return matchesName && matchesStudent;
  });

  if (filtered.length === 0) {
    memberList.innerHTML = '';
    statusMessage.textContent = 'Nenhum membro encontrado.';
    statusMessage.classList.remove('hidden');
    return;
  }
  statusMessage.classList.add('hidden');
  memberList.innerHTML = filtered.map(m => `
    <article class="card">
      <div class="card-body">
        <h3 class="card-title">${m.name}</h3>
        <p class="card-meta">
          <strong>Plano:</strong> Pipoca ${m.plan}<br>
          <strong>E-mail:</strong> ${m.email}<br>
          <strong>Estudante:</strong> ${m.student ? 'Sim' : 'Não'}<br>
          <strong>Cidade:</strong> ${m.city} - ${m.state}<br>
          <strong>Endereço:</strong> ${m.street}${m.house_number ? ', nº ' + m.house_number : ''}
        </p>
        <div class="card-actions">
          <a href="club.html?id=${m.id}" class="button button-secondary">Editar</a>
          <button type="button" class="button" onclick="handleDelete(${m.id}, '${m.name}')">Excluir</button>
        </div>
      </div>
    </article>
  `).join('');
}


// fluxo de delete de membro
async function handleDelete(id, name) {
  if (!confirm(`Deseja excluir ${name}?`)) return;

  const res = await fetch(`/members/${id}`, { method: 'DELETE' });

  if (res.status === 204) {
    members = members.filter(m => m.id !== id);
    renderMembers();
  }
}

document.getElementById('search').addEventListener('input', renderMembers);
document.getElementById('filter-student').addEventListener('change', renderMembers);
fetchMembers();