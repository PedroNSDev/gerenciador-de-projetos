CREATE DATABASE IF NOT EXISTS meu_sistema;
USE meu_sistema;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    senha VARCHAR(255),
    nivel INT DEFAULT 0
);

CREATE TABLE projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(20),
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- usuário teste (senha: 123)
INSERT INTO usuarios (nome, username, senha, nivel)
VALUES ('Admin', 'admin', PASSWORD('123'), 2);
