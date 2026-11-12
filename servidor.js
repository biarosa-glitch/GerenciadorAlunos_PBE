// Imports
import express from "express";
import {listarTodos, salvarTodos} from "./MANIPULADOR/manipulador_alunos.js"; //+listarPorId caso use a outra forma de listar por ID
import { gerarNovoId } from "./FUNCOES/functions.js";

const app = express(); // Criação da instância do express
const PORT = 3000;
app.use(express.json()); // Convertendo de maneira mais direta (middleware)

// GET - /alunos
app.get("/alunos", async (req, res) => {

    try{
        const alunos = await listarTodos();

        return res.status(200).json(alunos);
    }
    catch(error){
        console.log("Erro ao listar alunos", error);
        return res.status(500).json({error: "Não foi possível ler os registros de alunos"});

    }
});

// GET - /alunos/:id
app.get("/alunos/:id", async(req,res)=> {
try{
    //Recuperar o ID enviado na url e converter para Number
    const id = Number(req.params.id);

    // Leio os dados cadastrados
    const dados = await listarTodos();

    // Procurar o id com id informado usando find
    const alunosCadastrados = dados.find((aluno) => aluno.id === id);

    // Verificar se encontrou o atendimento
    if(!alunosCadastrados) {
            return res.status(404).json({erro: "Aluno não encontrado..."});
        }
    res.json(alunosCadastrados);


    //mensagem de resposta 
    return res.status(200).json({ mensagem: "Aluno encontrado com sucesso!"})

}
catch(error){
    console.log("Erro ao alterar o  cadastro", error);
    return res.status(500).json({ error: "Não foi possível alterar e salvar o cadastro"})
}

});

//POST - /alunonovo (Valida campos obrigatórios)
app.post("/alunonovo", async (req, res) => {
    try{
    //dados do novo cadastro
    const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo } = req.body;

    //valida campos obrigatórios
    if(!matricula || !nome ||!turma || !data|| !presente){
        return res.status(400).json({erro: "Todos os campos são obrigatórios"});
    }

    //gerando um novo ID único
    const id = await gerarNovoId();
    
    //criar objeto com os dados do novo cadastro
    const novoCadastro = {
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma: turma,
        data: data,
        presente: presente,
        motivoSaida: motivoSaida || null, //Se não for fornecido, será nulo
        minutosFora: Number(minutosFora) || 0, //Se não for fornecido, será 0
        alertaTempo: alertaTempo || false, //Se não for fornecido, será falso
    };

    //leitura do arquivo existente
    const cadastros = await listarTodos(); 
    cadastros.push(novoCadastro);
    
    //salvando o arquivo atualizado
    await salvarTodos(cadastros);

    return res.status(201).json({ mensagem: "Registro realizado com sucesso!"})

}
catch(error){
    console.log("Erro ao salvar cadastro", error);
    return res.status(500).json({ error: "Não foi possível salvar o registro..."})
}
});

//PUT - /alunos/:id
app.put("/alunos/:id", async(req,res)=> {
try{
    //Recuperar o ID enviado na url e converter para Number
    const id = Number(req.params.id);

    // Leio os dados cadastrados
    const dados = await listarTodos();

    // Procurar o id com id informado usando find
    const alunoExistente = dados.find((atendimento) => atendimento.id === id);

    // Verificar se encontrou o atendimento
    if(!alunoExistente) {
            return res.status(404).json({erro: "Aluno não encontrado!"});
        }

    //se comportará como um novo cadastro
    //dados do novo cadastro
    const {matricula, nome, turma, data, presente, motivoSaida, minutosFora} = req.body;
    
    //valida campos obrigatórios
    if(!matricula|| !nome|| !turma|| !data || !presente){
        return res.status(400).json({erro: "Todos os campos são obrigatórios."});
    }

    //criar objeto com os dados do novo cadastro
    const registroAtualizado = {
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma: turma,
        data: data,
        presente: presente,
        motivoSaida: motivoSaida,
        minutosFora: Number(minutosFora),
        alertaTempo: false,
    };

    //substituir o atendimento existente pelo atualizado - map
    const dadosAtualizados = dados.map((atendimento) => 
        atendimento.id === id ? registroAtualizado: atendimento
    );

    //Salvar a lista nova
    await salvarTodos(dadosAtualizados);

    //mensagem de resposta 
    return res.status(200).json({ mensagem: "Registro atualizado com sucesso!"})

}
catch(error){
    console.log("Erro ao alterar o  cadastro", error);
    return res.status(500).json({ error: "Não foi possível alterar e salvar o registro..."})
}
});

// DELETE - /aluno/id
app.delete("/aluno/:id", async (req, res) => {

    try {
        // Recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        // Leio os dados cadastrados
        const dados = await listarTodos();

        // Mantém apenas os itens com id diferente
        const dadosAtualizados = dados.filter((atendimento) => atendimento.id !== id);

        // Verificar se deletou
        if(dadosAtualizados.length === dados.length) {
            return res.status(404).json({erro: "Registro não deletado"});
        }

        // Salvar a lista nova
        await salvarTodos(dadosAtualizados);

        // Mensagem de resposta para ver se deu certo
        return res.status(200).json({mensage: "Registro excluído com sucesso"});
    }
    catch (error) {
        console.log("Erro ao deletar cadastro", error);
        return res.status(500).json({error: "Não foi possível deletar o registro"});
    }

});

// Funções Auxiliares
app.listen(PORT, () => {
    console.log("Servidor rodando na porta: ", PORT);
});