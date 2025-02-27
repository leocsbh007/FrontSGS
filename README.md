# Front END Sistema de Gerenciamento de Segurança - PROJETO Final Infinity


# Sistema de Gestão de Segurança - Frontend

Este repositório contém o **frontend** para interação com o sistema de gestão de segurança. O sistema permite o login, gerenciamento de dados do usuário e acesso a uma área protegida.

## Funcionalidades

### 1. **Tela de Login**
A tela de login permite que o usuário informe:
- **Usuário**
- **Email**
- **Senha**

Após o preenchimento, ao clicar em "Entrar", o sistema faz uma requisição para a API (endpoint `/login`), que valida as credenciais e retorna um **token** de autenticação.

### 2. **Área Protegida (Dashboard)**
Após o login bem-sucedido, o usuário é redirecionado para a **área protegida**, onde pode:
- Visualizar e atualizar seus dados de **usuário**, **nome** e **email**.
- Enviar essas alterações para a API através de uma requisição `PUT` para o endpoint `/user/{id}`.
- O token de autenticação é utilizado nas requisições para garantir que o usuário está autenticado.

### 3. **Logout**
O usuário pode **sair** da área protegida, removendo o token armazenado no `localStorage` e sendo redirecionado para a tela de login.

## Tecnologias Utilizadas
- **HTML**, **CSS** e **JavaScript Puro**
- **Axios** para requisições HTTP
- **localStorage** para armazenamento do token de autenticação

## Como Testar

### Passo 1: Subir a API
1. Clone o repositório da API:

```bash
git clone https://github.com/leocsbh007/SistemaGestaoSeguranca.git


### Passo 2: Configurar o Frontend
1. Clone este repositório do frontend:
```bash
git clone <URL_DO_REPOSITORIO_FRONTEND>

2. Caso não tenha o Axios instalado, adicione a dependência:
- **Se estiver usando Node.js, instale o Axios com o comando npm install axios.
- **Caso esteja utilizando apenas HTML estático, o Axios já está incluso através do CDN.


Passo 3: Testar o Login
Abra o arquivo index.html no seu navegador.
Insira as credenciais de usuário, email e senha.
O sistema enviará os dados para o endpoint /login da API.
Se as credenciais estiverem corretas, você será redirecionado para a área protegida (tela dashboard.html).
Verifique se o token foi salvo no localStorage do navegador. Você pode verificar isso abrindo o console do navegador e rodando:

Passo 4: Atualizar Dados
Na área protegida (dashboard.html), edite o usuário, nome e email.
Clique em "Atualizar Dados" para enviar as novas informações para a API. As informações serão enviadas para o endpoint /user/{id} com o token de autenticação.
O status da operação será exibido na tela, confirmando a atualização dos dados.


Passo 5: Testar Logout
Clique no botão "Sair" na área protegida para remover o token de autenticação.
O sistema redirecionará você de volta para a tela de login (index.html).