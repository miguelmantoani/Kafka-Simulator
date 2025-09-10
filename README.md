# 🚀 Simulador de Ambiente Kafka com Dashboard Interativo

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

Este projeto simula um ambiente de mensageria inspirado no Apache Kafka, composto por múltiplos "brokers" independentes e um dashboard centralizado para monitorização em tempo real. É uma ferramenta educacional e de desenvolvimento para visualizar conceitos de tópicos, partições e distribuição de mensagens.

---

## 🎯 Principais Funcionalidades

* **Simulação Multi-Broker**: Inicie várias instâncias de brokers, cada uma a operar de forma independente com o seu próprio armazenamento de dados (SQLite).
* **Dashboard Centralizado**: Uma única interface (`dashboard.py`) agrega e exibe o status e as métricas de todos os brokers configurados.
* **Monitorização em Tempo Real**: O dashboard atualiza automaticamente a cada 2 segundos, mostrando o status (online/offline), as últimas mensagens e gráficos de contagem de mensagens.
* **Visualização de Dados**: Gráficos de barra (usando Chart.js) para cada broker, mostrando a distribuição de mensagens por tópico e partição.
* **Interface de Publicação**: Uma página simples (`index.html`) permite que o utilizador envie mensagens para um tópico e partição específicos.
* **Filtragem Dinâmica**: O dashboard permite filtrar a visualização de mensagens e gráficos por uma partição específica em todos os brokers.

---

## 🏛️ Arquitetura do Sistema

O sistema é composto por dois tipos de serviços: o **Dashboard** (agregador) e os **Brokers** (trabalhadores).

* **Brokers (`broker.py`)**: Cada broker é um servidor Flask independente que armazena mensagens na sua própria base de dados SQLite. Possui uma interface web para que os utilizadores possam publicar novas mensagens.
* **Dashboard (`dashboard.py`)**: É o ponto de entrada principal para visualização. Ele consulta a API de cada broker a cada 2 segundos para obter estatísticas e exibe-as numa interface web amigável e centralizada. A publicação de mensagens **não** é feita através do dashboard.

---

## 🛠️ Tecnologias Utilizadas

* **Backend**: Python 3, Flask, Requests
* **Base de Dados**: SQLite 3
* **Frontend**: HTML5, CSS3, JavaScript
* **Bibliotecas JS**: Chart.js (para gráficos), Bootstrap (para o layout responsivo)
* **Configuração**: JSON (`brokers.json`)

---

## ⚙️ Instalação e Configuração

Para executar este projeto, precisará de ter o Python 3 e o `pip` instalados.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/miguelmantoani/Kafka-Simulator.git](https://github.com/miguelmantoani/Kafka-Simulator.git)
    cd Kafka-Simulator
    ```

2.  **Crie um ambiente virtual e ative-o (Recomendado):**
    ```bash
    # Para Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Para macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Crie o ficheiro `requirements.txt`** com as dependências do Python:
    ```txt
    Flask
    requests
    ```

4.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure os Brokers**:
    O ficheiro `brokers.json` define quais brokers serão iniciados e em que portas. Pode adicionar ou remover brokers conforme necessário.
    ```json
    {
      "Broker1": {"db": "Broker1.db", "port": 5001},
      "Broker2": {"db": "Broker2.db", "port": 5002},
      "Broker3": {"db": "Broker3.db", "port": 5003}
    }
    ```

---

## ▶️ Como Executar a Aplicação

A simulação requer que cada broker e o dashboard principal sejam executados em terminais separados.

1.  **Inicie cada Broker**:
    Abra um terminal para cada broker definido no `brokers.json` e execute o comando abaixo, substituindo a porta e o nome do ficheiro da base de dados. A base de dados será criada automaticamente na primeira execução.

    ```bash
    # Terminal 1 - Iniciar Broker 1
    python broker.py 5001 Broker1.db

    # Terminal 2 - Iniciar Broker 2
    python broker.py 5002 Broker2.db

    # Terminal 3 - Iniciar Broker 3
    python broker.py 5003 Broker3.db
    ```

2.  **Inicie o Dashboard**:
    Abra um quarto terminal e inicie o servidor do dashboard principal.

    ```bash
    python dashboard.py
    ```

---

## 🕹️ Como Usar

1.  **Aceda ao Dashboard**:
    Abra o seu navegador e aceda a `http://localhost:5000`. Verá o painel principal a monitorizar todos os brokers em tempo real.

2.  **Publique Mensagens**:
    Para enviar mensagens, aceda à interface de qualquer um dos brokers. Por exemplo, `http://localhost:5001`. Preencha o formulário e envie. As mensagens aparecerão no dashboard.

3.  **Filtre os Dados**:
    Use o menu suspenso no dashboard para filtrar a visualização por um tópico/partição específico. Os gráficos e as listas de mensagens serão atualizados para refletir o filtro.

---

## 🤝 Como Contribuir

1.  Faça um **fork** do projeto.
2.  Crie uma nova branch (`git checkout -b feature/minha-feature`).
3.  Faça o **commit** das suas alterações (`git commit -m 'Adiciona minha-feature'`).
4.  Faça o **push** para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request**.

---

Desenvolvido por **Miguel Mantoani**.