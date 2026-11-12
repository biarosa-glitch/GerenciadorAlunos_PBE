import { listarTodos } from "../MANIPULADOR/manipulador_alunos.js";

//trazer a lista - OK

//saber qual é o último ID cadastrado - OK
//somar mais um, para ser o próximo ID - OK

//return - OK

export async function gerarNovoId(){
    const registroAlunos = await listarTodos();

    //pegar todos os IDs existentes
    const ids = registroAlunos.map((aluno) => aluno.id);

    //retorna o maior id encontrado +1, garantindo que seja unico
    const novoId = Math.max(...ids) + 1;
    return novoId;
};

