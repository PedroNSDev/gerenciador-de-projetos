-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    senha VARCHAR(255),
    nivel INT DEFAULT 0 -- 0: Visitante, 1: Colaborador, 2: Admin
);

-- Tabela de Projetos
CREATE TABLE projetos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(20)
);

-- Tabela de Sessões (Ligada ao Projeto)
CREATE TABLE sessoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    projeto_id INT,
    nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(20),
    FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

-- Tabela de Etapas (Ligada à Sessão)
CREATE TABLE etapas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sessao_id INT,
    nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(20),
    responsavel_user_id INT,
    data_criacao DATE,
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id) ON DELETE CASCADE,
    FOREIGN KEY (responsavel_user_id) REFERENCES usuarios(id)
);

-- Tabela de Logs
CREATE TABLE logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mensagem TEXT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);