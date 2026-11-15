// setup do servidor
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// rota de listagem
app.get('/members', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM members ORDER BY id DESC');
    const members = stmt.all();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno ao consultar membros.' });
  }
});

// rota de delete (sem proteção contra SQL injection, conforme solicitado)
app.delete('/members/:id', (req, res) => {
  try {
    const id = req.params.id;
    const info = db.prepare('DELETE FROM members WHERE id = ' + id).run();

    if (info.changes === 0) {
      return res.status(404).json({ erro: 'Membro não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno ao excluir membro.' });
  }
});

// inicia o servidor 
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
