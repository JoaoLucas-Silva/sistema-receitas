# 🍽️ Sistema de Controle de Receitas

Sistema web desenvolvido para a disciplina de Back-End com o objetivo de gerenciar receitas culinárias cadastradas por alunos.

A aplicação segue o padrão arquitetural **MVC (Model-View-Controller)**, com foco na organização do backend e na separação de responsabilidades entre as camadas.

---

## 🚀 Tecnologias utilizadas

* Node.js
* Express
* Express-Handlebars
* Sequelize
* PostgreSQL
* MongoDB
* Mongoose
* Express-Session

---

## 📌 Funcionalidades

### 👤 Usuário Aluno

* Login no sistema
* Cadastro, edição e exclusão de receitas
* Associação de receitas a categorias
* Cadastro de habilidades com nível de 0 a 10

### 🛠️ Administrador

* Gerenciamento de usuários
* Gerenciamento de categorias
* Gerenciamento de habilidades

### 🌐 Usuário Externo

* Visualização de receitas
* Filtro de receitas por categoria
* Visualização de relatórios de habilidades

---

## 🧱 Arquitetura

O projeto é estruturado seguindo o padrão MVC:

```
Model → acesso aos dados (PostgreSQL e MongoDB)  
Controller → lógica da aplicação  
View → interface com o usuário (Handlebars)  
```

---

## 📦 Observações

* PostgreSQL é utilizado para os dados principais do sistema
* MongoDB é utilizado para armazenamento de comentários
* O projeto utiliza sessões para controle de autenticação
* Estrutura organizada para facilitar manutenção e trabalho em equipe

---

## 👥 Projeto acadêmico

Desenvolvido para a disciplina de Programação Web Back-End.
