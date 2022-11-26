module.exports = app=>{
    //Função que verifica se a variavel tem algum conteudo, se não retorna erro
    function existsOrError(value,  msg){
        if(!value) throw msg
        if(Array.isArray(value)&& value.length===0) throw msg
        if(typeof value ==='string'&& !value.trim()) throw msg
    }
    //Função que verifica se a variavel tem algum conteudo, se tiver retorna erro
    function notExistsOrError(value, msg){
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }
    //Função que verifica se as variaveis possuem o mesmo conteudo
    function equalsOrError(valueA, valueB,msg){
        if(valueA!==valueB) throw msg
    }
    return{existsOrError,notExistsOrError,equalsOrError}
}