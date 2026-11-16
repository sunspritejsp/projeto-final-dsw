// setup do servidor
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// validacoes
function validateMember(m={}){
    if(typeof m.name !== 'string' || m.name.trim().length > 100 || m.name.trim().length < 2){
        return 'O nome deve ter entre 2 e 100 caracteres';
    }

    if(typeof m.email !== 'string' || m.email.trim().length > 100 || !/^\S+@\S+\.\S+$/.test(m.email)){
        return 'Informe um email válido';
    }
    if(typeof m.birth_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.birth_date)){
        return 'Informe uma data de nascimento no formato AAAA-MM-DD';
    }
    if(!['Pequena', 'Média', 'Grande'].includes(m.plan)){
        return 'Informe um plano válido';
    }

    if(typeof m.student !== 'boolean'){ // conversão acontece dentro da rota de insert, para 0 e 1, devido padrão do sqlite
        return 'Informe um valor válido para estudante';
    }

    if(typeof m.zip_code !== 'string' || !/^[0-9]{5}-?[0-9]{3}$/.test(m.zip_code)){
        return 'Informe o CEP no formato 00000-000';
    }

        if(typeof m.street !== 'string' || m.street.trim().length > 100 || m.street.trim().length < 2){
        return 'A rua deve ter entre 2 e 100 caracteres';
    }

    // opcional so confer se veio preenchido
    if(m.house_number !== undefined && m.house_number !== null){
        if(!Number.isInteger(m.house_number) || m.house_number < 1 || m.house_number > 99999){
            return 'O número da casa deve ser um inteiro entre 1 e 99999';
        }
    }

    if(typeof m.city !== 'string' || m.city.trim().length > 100 || m.city.trim().length < 2){
        return 'A cidade deve ter entre 2 e 100 caracteres';
    }

    const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    if(!states.includes(m.state)){
        return 'Escolha um estado (UF) válido';
    }

    // opcional so confere se veio preenchido
    if(m.address_details !== undefined && m.address_details !== null){
        if(typeof m.address_details !== 'string' || m.address_details.length > 200){
            return 'O complemento deve ter até 200 caracteres';
        }
    }
    return null;
}

// rota de listagem GET
app.get('/members', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM members ORDER BY id DESC');
    const members = stmt.all();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao consultar membros.' });
  }
});

// rota de busca de um membro GET
app.get('/members/:id', (req, res) => {
  try {
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);

    if (!member) {
      return res.status(404).json({ error: 'Membro não encontrado.' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao consultar membro.' });
  }
});

// rota de inserção POST
app.post('/members', (req, res) =>{
    const error = validateMember(req.body);
    if(error){
        return res.status(400).json({error});
    }

    try{
        const info = db.prepare(`INSERT INTO members(name, email, birth_date, plan,
         student, zip_code, street,
         house_number, city, state, address_details) VALUES (?,?,?,?,?,?,?,?,?,?,
         ?)`).run(
            req.body.name, req.body.email, req.body.birth_date, req.body.plan,
            req.body.student ? 1 : 0, req.body.zip_code, req.body.street, req.body.house_number, req.body.city,
            req.body.state, req.body.address_details
            );
        const member = db.prepare('SELECT * FROM members WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(member);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno ao cadastrar membro'});
    }
});

// rota de edição PUT
app.put('/members/:id', (req, res) => {
  const error = validateMember(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const info = db.prepare(`UPDATE members SET
      name = ?, email = ?, birth_date = ?, plan = ?, student = ?, zip_code = ?,
      street = ?, house_number = ?, city = ?, state = ?, address_details = ?
      WHERE id = ?`).run(
      req.body.name, req.body.email, req.body.birth_date, req.body.plan,
      req.body.student ? 1 : 0, req.body.zip_code, req.body.street, req.body.house_number,
      req.body.city, req.body.state, req.body.address_details,
      req.params.id
    );

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Membro não encontrado.' });
    }

    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao atualizar membro.' });
  }
});

// rota de delete DELETE
app.delete('/members/:id', (req, res) => {
  try {
    const id = req.params.id;
    const info = db.prepare('DELETE FROM members WHERE id = ?').run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Membro não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao excluir membro.' });
  }
});

// inicia o server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;