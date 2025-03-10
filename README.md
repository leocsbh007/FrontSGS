# Sistema de Gerenciamento de Recursos (SGM) - FrontEnd

## Repositorio
[Git] (https://github.com/leocsbh007/FrontSGS.git)

## Descrição
Este é um projeto de **Sistema de Gerenciamento de Recursos** que permite o controle de usuários, recursos e empréstimos. O sistema possui uma interface responsiva e autenticação via **JWT**, consumindo uma API desenvolvida em **FastAPI**.

## Tecnologias Utilizadas
- **Frontend**: HTML, CSS, JavaScript
- **Bibliotecas**: [Axios](https://axios-http.com/) para requisições HTTP
- **Backend**: FastAPI (deve estar rodando para funcionamento completo)
- **Autenticação**: JWT Token armazenado no localStorage

## Estrutura do Projeto

```
/
├── assets/               # Estilos e recursos estáticos
├── js/                   # Scripts do frontend
│   ├── auth.js           # Autenticação e login
│   ├── user.js           # Gerenciamento de usuários
│   ├── resource.js       # Gerenciamento de recursos
│   ├── loan.js           # Gerenciamento de empréstimos
├── index.html            # Página inicial
├── login.html            # Tela de login
├── dashboard.html        # Dashboard principal
├── users.html            # Gestão de usuários
├── resources.html        # Gestão de recursos
├── loans.html            # Gestão de empréstimos
└── README.md             # Documentação
```

## Como Rodar o Projeto

### 1. Backend (FastAPI)
1. Certifique-se de que o backend **FastAPI** está rodando.
2. A API deve estar disponível em `http://localhost:8080`.
3. O sistema utiliza autenticação JWT, então você precisará de um usuário registrado para login.

### 2. Frontend
1. Clone ou baixe o repositório.
2. Abra o **index.html** em um navegador ou sirva os arquivos com um servidor local, como **Live Server** no VSCode.

## Como Testar

### 1. Login
- Acesse `login.html`.
- Insira as credenciais de um usuário cadastrado.
- Se autenticado com sucesso, será redirecionado para `index.html`.
- Usuario: Admin
- Email: admin@email.com
- Senha: admin1234


### 2. Gestão de Usuários
- Navegue até `users.html`.
- Adicione, edite ou exclua usuários usando o modal de cadastro.

### 3. Gestão de Recursos
- Acesse `resources.html`.
- Cadastre novos recursos, edite ou remova conforme necessário.

### 4. Gestão de Empréstimos
- Entre em `loans.html`.
- Registre novos empréstimos e altere status conforme necessário.

### 5. Dasboard
- Entre em `dashboard.html`.
- Infelizmente não consegui finalizar a parte da Dashboard até o dia da entrega 06/03/2025
- Ela estará nas proximas atualizações

## Autenticação e Proteção
- Após o login, o **token JWT** é armazenado no `localStorage`.
- Páginas protegidas verificam esse token antes de carregar.
- O logout remove o token e redireciona para a tela de login.



## Contato
Caso tenha dúvidas ou sugestões, entre em contato com o desenvolvedor.

---
*Este README pode ser atualizado conforme novas funcionalidades sejam adicionadas ao projeto.*

