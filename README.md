# MS Order

Este repositório contém um microserviço para gerenciar pedidos em um restaurante/lanchonete. A API permite cadastrar produtos e realizar pedidos, além de consultar os pedidos em andamento e seus respectivos status. A API é documentada usando o Swagger, que fornece uma interface intuitiva para testar e explorar os endpoints.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=FIAP-SOAT-GRP5_ms-order&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=FIAP-SOAT-GRP5_ms-order)

## Pré-requisitos

- Node.js
- Docker

## Começando

Siga as instruções abaixo para obter uma cópia do projeto localmente e executá-lo para fins de desenvolvimento e teste.

1. Faça o download do repositório do projeto:

```shell
git clone https://github.com/FIAP-SOAT-GRP5/ms-order.git
```

2. Instale as dependências necessárias, se necessário:

```shell
cd lunch-api
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes informações de banco de dados:

```
NODE_ENV="development"
TZ="America/São Paulo"
PORT="3000"

DB_TYPE="mysql"
DB_HOST="localhost"
DB_PORT="3306"
DB_USERNAME=""
DB_PASSWORD=""
DB_DATABASE="app"

MP_ACCESS_TOKEN=""

JWT_KEY=""

QUEUE_CREATE_ORDER_URL=""
QUEUE_UPDATE_ORDER_URL=""

AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
```

## Documentação das rotas

### Categorias

A tabela "category" já foi previamente preenchida com as seguintes informações:

| ID  | NAME           |
| --- | -------------- |
| 1   | Lanche         |
| 2   | Acompanhamento |
| 3   | Bebida         |
| 4   | Sobremesa      |

Essas categorias foram inseridas para classificar os produtos de acordo com suas respectivas categorias, permitindo uma organização adequada dos itens do cardápio.

### Produto(s)

#### Consultar

Para consultar um produto, existem rotas disponíveis para busca por categorias e por ID do produto.

- Por ID do Produto: `GET /item/{id}`
- Buscar todos os Produtos: `GET /item`
- Buscar Lanche(s): `GET /item/getItemBySnack`
- Buscar Acompanhamento(s): `GET /item/getItemByFollowUp`
- Buscar Bebida(s): `GET /item/getItemByDrink`
- Buscar sobremesa(s): `GET /item/getItemByDessert`

Substitua `{id}` pelo ID real do produto ao consultar por ID do Produto.

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

#### Atualizar

Para atualizar um produto, utilize o endpoint `/item/{id}` com o método PUT.

Endpoint: `PUT /item/{id}`

Exemplo de dados para atualizar um produto:

```json
{
	"name": "Coca-Cola",
	"price": 7,
	"description": "Refrigerante de 2L",
	"category_id": 3
}
```

### Pedido(s)

#### Cadastrar

##### - Por menssageria

O cadastro do pedido por meio de mensageria, utilizando o microserviço de produção (production), deve ser feito pela fila `create_order`.

Cada pedido deve conter os seguintes campos:

- `status`: string
- `id`: number (ID do produto)

Exemplo de como preencher os valores para cadastro:

```json
{
	"status": "awaiting_payment",
	"id": 7
}
```

Esse processo implica em enviar uma mensagem para a fila `create_order` com as informações necessárias do pedido, garantindo que o microserviço de produção receba e processe a requisição corretamente. Certifique-se de incluir esses campos ao enviar dados para a fila, para que o sistema possa interpretar e processar a informação adequadamente.

##### Via Swagger

Para cadastrar o(s) pedido(s) no Swagger, utilize o endpoint `/order` utilize o endpoint POST.

Cada pedido deve conter os seguintes campos:

- `itemsIds`: array (Lista de produtos)
- `id`: number (id do produto)
- `quantity`: number (quantidade do produto)

Endpoint:`POST /order`

Exemplo de valor para cadastrar um pedido:

```json
{
	"itemsIds": [
		{
			"id": 0,
			"quantity": 0
		}
	]
}
```

#### Atualização

##### - Por menssageria

A atualização do pedido por meio de mensageria, utilizando o microserviço de produção (production), deve ser feito pela fila `update_order`.

Cada pedido deve conter os seguintes campos:

- `status`: string
- `id`: number (ID do produto)

Exemplo de como preencher os valores para atualização:

```json
{
	"status": "awaiting_payment",
	"id": 7
}
```

Esse processo implica em enviar uma mensagem para a fila `update_order` com as informações necessárias do pedido, garantindo que o microserviço de produção receba e processe a requisição corretamente. Certifique-se de incluir esses campos ao enviar dados para a fila, para que o sistema possa interpretar e processar a informação adequadamente.

#### Consultar

Para realizar consultas após o cadastro de um pedido, existem rotas disponíveis para busca por todos os pedidos e seus respectivos status, bem como por ID do pedido.

Por ID do pedido

Endpoint: `GET /order/{id}`

Lembre-se de substituir `{id}` pelo ID real do pedido.

Buscar todos os pedidos

Endpoint: `GET /order/list-all-orders`

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
	]
}
```

## Consultar pedido(s) e status

Para consultar os pedidos em andamento e seus respectivos status, faça uma requisição GET para o endpoint `/list-all-orders`.

Essas rotas permitem que você cadastre produtos, clientes e pedidos, além de consultar os pedidos e seus respectivos status.
