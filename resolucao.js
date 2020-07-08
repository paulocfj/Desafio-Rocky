const fs = require('fs');

let banco = require('./broken-database.json');
const { exception } = require('console');

function corrigirCaracter(banco) {
    try {
        banco.forEach(n => {
            n.name = n.name.replace(/\u00DF/g, "b");
            n.name = n.name.replace(/\u00F8/g, "o");
            n.name = n.name.replace(/\u00E6/g, "a");
            n.name = n.name.replace(/\u00A2/g, "c");
        });
    } catch (ex) {
        console.log('Problema ao receber o banco de arquivos json: ', ex);
    }
}

function corrigirPreco(banco) {
    try {
        banco.forEach(n => {
            if (typeof n.price == 'string') {
                n.price = Number(n.price);
            }
        });
    } catch (ex) {
        console.log('Problema ao receber o banco de arquivos json: ', ex);
    }

}

function corrigirQuantidade(banco) {
    try {
        banco.forEach(n => {
            if (n.quantity === undefined) {
                n.quantity = 0;
            }
        });
    } catch (ex) {
        console.log('Problema ao receber o banco de arquivos json: ', ex);
    }

}

function exportarArquivo(banco) {
    banco = JSON.stringify(banco);
    fs.writeFile('./saida.json', banco, (err) => {
        if (err) {
            console.log(err);
        }
    });
}


function imprimeNome(banco) {
    try {
        banco.sort(function(a, b) {
            return a.category < b.category ? -1 : a.category > b.category ? 1 : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        });
        try {
            let lista = banco.map(n => {
                return n.name;
            });
            console.log('Lista de Produtos: ', lista);
        } catch (ex) {
            console.log('Houve um problema ao gerar a lista', ex);
        }
    } catch (ex) {
        console.log('Problema ao receber o banco de arquivos json: ', ex);
    }
}

function calculaEstoque(banco) {
    try {
        let estoque = [{
                category: 'Acessórios',
                valor: 0
            }, {
                category: 'Eletrodomésticos',
                valor: 0
            }, {
                category: 'Eletrônicos',
                valor: 0
            }, {
                category: 'Panelas',
                valor: 0
            }

        ];

        banco.forEach(n => {
            estoque.forEach(e => {
                if (n.category == e.category) {
                    e.valor = e.valor + (n.price * n.quantity);
                }
            })
        });

        return estoque;
    } catch (ex) {
        console.log('Problema ao receber o banco de arquivos json: ', ex);
    }

}

corrigirCaracter(banco);
corrigirPreco(banco);
corrigirQuantidade(banco);
imprimeNome(banco);
console.log('Estoque total: ', calculaEstoque(banco));
exportarArquivo(banco);