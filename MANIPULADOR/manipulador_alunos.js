// Imports
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Não importa onde será chamado, sempre vai conseguir encontrar o arquivo

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDados = path.join(__dirname, "..", "BD", "registros_alunos.json");

// Lógica 

// ListarTodos - Lê um arquivo local

export async function listarTodos() {

    const conteudo = await fs.readFile(caminhoDados, "utf-8");
    return JSON.parse(conteudo);
}

// Escrever/Salvar
// SalvarTodos - Esrever em um arquivo local

export async function salvarTodos(cadastros) {

    await fs.writeFile(caminhoDados, JSON.stringify(cadastros, null, 2), "utf-8");
}

// // outro modo de listar ID -
// export async fuction listaPorId(id) {

// const registroAlunos = await listarTodos();
// const aluno = registroAlunos.find((aluno) => aluno.id === id);

// };

// Funções Auxiliares