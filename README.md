# Lunch API

Este repositório contém uma API para gerenciar pedidos em um restaurante/lanchonete. A API permite cadastrar produtos, clientes e realizar pedidos, além de consultar os pedidos em andamento e seus respectivos status. A API é documentada usando o Swagger, que fornece uma interface intuitiva para testar e explorar os endpoints.

## Pré-requisitos

- Node.js
- Docker

## Começando

Siga as instruções abaixo para obter uma cópia do projeto localmente e executá-lo para fins de desenvolvimento e teste.

1. Faça o download do repositório do projeto:
```shell
git clone https://github.com/thegabslima/lunch-api.git
```

2. Instale as dependências necessárias:
```shell
cd lunch-api
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes informações de banco de dados:

```
DB_TYPE="mysql"
DB_PORT=3306
DB_USERNAME=""
DB_PASSWORD=""
DB_DATABASE="DB_LUNCH-API"
```

## Executar o projeto

Execute o seguinte comando para iniciar o projeto em um contêiner Docker:
```shell
docker-compose up -d
```

Após o contêiner estar em execução, você poderá acessar a API em seu navegador usando os seguintes endereços:

- Para acessar o Swagger: http://localhost:8080/api
- Para acessar o phpMyAdmin: http://localhost:8081

## Documentação das rotas

### Categorias

A tabela "category" já foi previamente preenchida com as seguintes informações:

| ID | NAME           |
|----|----------------|
| 1  | Lanche         |
| 2  | Acompanhamento |
| 3  | Bebida         |
| 4  | Sobremesa      |

Essas categorias foram inseridas para classificar os produtos de acordo com suas respectivas categorias, permitindo uma organização adequada dos itens do cardápio.

### Produto(s)

#### Cadastrar

Para cadastrar um produto, utilize o endpoint `/item` com o método POST.

Endpoint: `POST /item`

Exemplo de dados para cadastrar um produto:
```json
{
  "name": "Coca-Cola",
  "price": 7,
  "description": "Refrigerante de 2L",
  "category_id": 3
}
```

#### Consultar

Para consultar um produto, existem rotas disponíveis para busca por categorias e por ID do produto.

- Por ID do Produto: `GET /item/{id}`
- Buscar Lanche(s): `GET /item/getItemBySnack`
- Buscar Acompanhamento(s): `GET /item/getItemByFollowUp`
- Buscar Bebida(s): `GET /item/getItemByDrink`
- Buscar sobremesa(s): `GET /item/getItemByDessert`

Substitua `{id}` pelo ID real do produto ao consultar por ID do Produto.

### Cliente(s)

#### Cadastrar

Para cadastrar o(s) cliente(s) no Swagger, utilize o endpoint `/client` com método POST.
O cliente pode optar por não se identificar.

Cada produto deve conter os seguintes campos:

- `document`: string (documento do cliente)
- `name`: string (nome do cliente)
- `email`: string (e-mail do cliente)

Endpoint: `POST /client`

Exemplo de valor com identificação do cliente:
```json
{
  "document": "0000000000",
  "name": "FIAP",
  "email": "aluno@fiap.com.br"
}
```

Exemplo de valor sem identificação do cliente:
```json
{ }
```

#### Consultar

Utilize a rota abaixo para realizar consultas específicas de acordo com o documento do cliente.

Endpoint: `GET /client/{document}`

Lembre-se de substituir `{document}` pelo documento real do cliente.



### Pedido(s)

#### Cadastrar

Para cadastrar o(s) pedido(s) no Swagger, utilize o endpoint `/order` utilize o endpoint POST.

Cada pedido deve conter os seguintes campos:

- `itemsIds`: array (Lista de produtos)
- `id`: number (id do produto)
- `quantity`: number (quantidade do produto)
- `clientId`: number (ID do cliente)

Endpoint:`POST /order`

 Exemplo de valor para cadastrar um pedido:

```json
{
  "itemsIds": [
    {
      "id": 0,
      "quantity": 0
    }
  ],
  "clientId": 0
}
```

#### Consultar

Para realizar consultas após o cadastro de um pedido, existem rotas disponíveis para busca por todos os pedidos e seus respectivos status, bem como por ID do pedido.

Por ID do pedido

Endpoint: `GET /order/{id}`

Lembre-se de substituir `{id}` pelo ID real do pedido.

Buscar todos os pedidos

Endpoint: `GET /order/list-processing-orders`

#### Atualizar

Após o pedido ser realizado, ele será cadastrado com o status inicial de "recebido". Esse status será atualizado ao longo do processo de produção, variando entre os seguintes valores: "Em Produção", "Pronto" e "Finalizado".

À medida que o pedido avança na produção, o status será atualizado para refletir o progresso. Isso pode ser feito utilizando as seguintes rotas:

Altera o status do pedido para "Em Produção"

Endpoint: `PUT /order/{id}/status/processing`

Altera o status do pedido para "Pronto"

Endpoint: `PUT /order/{id}/status/ready`

Altera o status do pedido para "Finalizado"

Endpoint: `PUT /order/{id}/status/finished`

Lembre-se de substituir `{id}` pelo ID real do pedido.


# Fluxo de Pedidos em Restaurante/Lanchonete

Este é um guia passo a passo para criar um fluxo de pedidos em um restaurante/lanchonete utilizando a API disponibilizada. Siga os seguintes passos na ordem indicada: cadastrar produto(s), cadastrar cliente(s) e cadastrar pedido(s).

## Cadastrar produto(s)

Para cadastrar um produto, faça uma requisição POST para o endpoint `/item`.

Exemplo de como preencher os valores para cadastrar um produto:

```json
{
  "name": "Coca-Cola",
  "price": 7,
  "description": "Refrigerante de 2L",
  "category_id": 3
}
```

## Cadastrar cliente(s)

Para cadastrar um cliente, faça uma requisição POST para o endpoint `/client`.

Exemplo de valor com identificação do cliente:

```json
{
  "document": "0000000000",
  "name": "FIAP",
  "email": "aluno@fiap.com.br"
}
```

Exemplo de valor sem identificação do cliente:

```json
{ }
```

## Cadastrar pedido(s)

Para cadastrar um pedido, faça uma requisição POST para o endpoint `/order`.

Exemplo de como preencher os valores para cadastrar um pedido:

```json
{
  "itemsIds": [
    {
      "id": 1,
      "quantity": 2
    }
  ],
  "clientId": 1
}
```

## Consultar pedido(s) e status

Para consultar os pedidos em andamento e seus respectivos status, faça uma requisição GET para o endpoint `/list-processing-orders`.

Essas rotas permitem que você cadastre produtos, clientes e pedidos, além de consultar os pedidos e seus respectivos status.




*teste*
