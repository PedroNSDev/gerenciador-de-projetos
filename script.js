// ================= DLEMENTOS =================
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

const displayName = document.getElementById('display-name');
const displayLevel = document.getElementById('display-level');

// =========== DUSUÁRIOS =============
const usuarios = [
    { id:1, name:"Admin", username:"admin", senha:"123", nivel:2 },
    { id:2, name:"User", username:"user", senha:"123", nivel:1 },
    { id:3, name:"Visitante", username:"visit", senha:"123", nivel:0 }
];

// ====== FSTORAGE ============
const STORAGE_KEY = "sistema-projetos";

let currentUser = null;
let logs = [];

// ============ FBANCO ==============
let projetosDB = [
{
    id:1,
    nome:"Projeto A",
    descricao:"Sistema teste",
    usuarios:[1,2],
    sessoes:[
        {
            id:1,
            nome:"Sessão 1",
            descricao:"Frontend",
            usuarios:[2],
            etapas:[
                {
                    id:1,
                    nome:"Login",
                    descricao:"Tela login",
                    status:"Não iniciado",
                    usuarios:[2]
                }
            ]
        }
    ]
}
];

// ================= FSTORAGE=================
function salvarDados(){
    const dados = {
        projetos: projetosDB,
        logs: logs
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function carregarDados(){
    const dados = localStorage.getItem(STORAGE_KEY);

    if(dados){
        const parsed = JSON.parse(dados);
        projetosDB = parsed.projetos || [];
        logs = parsed.logs || [];
    }
}

carregarDados();

// ================= FLOG =================
function addLog(msg){
    const data = new Date().toLocaleString();
    logs.push(`[${data}] ${currentUser.name}: ${msg}`);
}

// =========== FLOGIN =================
function fazerLogin(){
    const u = usernameInput.value;
    const p = passwordInput.value;

    const user = usuarios.find(x=>x.username===u && x.senha===p);

    if(user){
        currentUser = user;
        loginError.style.display = 'none';
        mostrarTela(false);
        carregarDashboard();
    } else {
        loginError.style.display = 'block';
    }
}

function fazerLogout(){
    currentUser = null;
    document.getElementById('logs-container').classList.add('hidden');
    document.getElementById('log-entries').innerHTML = "";
    mostrarTela(true);
}

// ============= TELA =================
function mostrarTela(login=true){
    document.getElementById('login-screen').classList.toggle('hidden', !login);
    document.getElementById('dashboard-screen').classList.toggle('hidden', login);
}

// ========== DASH ===============
function carregarDashboard(){
    displayName.textContent = currentUser.name;
    displayLevel.textContent = "Nível " + currentUser.nivel;

    renderizarProjetos();

    const logsPanel = document.getElementById('logs-container');

    if(currentUser.nivel === 2){
        logsPanel.classList.remove('hidden');
        mostrarLogs();
    } else {
        logsPanel.classList.add('hidden');
    }
}

// ================= HELPERS =================
function formatStatus(status){
    return status
        .toLowerCase()
        .replace(" ", "-")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ================= RENDER =================
function renderizarProjetos(){
    const container = document.getElementById('projetos-container');
    container.innerHTML = "";

    projetosDB.forEach(p=>{
        let sessoesHTML = p.sessoes.map(s=>{
            let etapasHTML = s.etapas.map(e=>`
                <div class="step-box status-${formatStatus(e.status)}">
                    <div>
                        <b>${e.nome}</b> (${e.status})<br>
                        <small>${e.descricao}</small>
                    </div>

                    ${currentUser.nivel>=1 ? `
                    <div style="display:flex; gap:5px;">
                        <button class="btn-small" onclick="editarEtapa(${p.id},${s.id},${e.id})">Editar</button>
                        <button class="btn-small" onclick="alterarStatus(${p.id},${s.id},${e.id})">Status</button>
                    </div>
                    ` : ""}
                </div>
            `).join("");

            return `
            <div class="session-box">
                <h4>${s.nome}</h4>
                <p>${s.descricao}</p>
                ${etapasHTML}
                ${currentUser.nivel>=1 ? `<button onclick="criarEtapa(${p.id},${s.id})">+ Etapa</button>`:""}
            </div>
            `;
        }).join("");

        container.innerHTML += `
        <div class="project-card">
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            ${sessoesHTML}
            ${currentUser.nivel>=1 ? `<button onclick="criarSessao(${p.id})">+ Sessão</button>`:""}
        </div>
        `;
    });

    if(currentUser.nivel>=1){
        container.innerHTML += `<button onclick="criarProjeto()">+ Projeto</button>`;
    }
}

// ============= CRIAR ==============
function criarProjeto(){
    const nome = prompt("Nome do projeto:");
    if(!nome) return;

    projetosDB.push({
        id:Date.now(),
        nome,
        descricao:"Novo projeto",
        usuarios:[currentUser.id],
        sessoes:[]
    });

    addLog("Criou projeto: "+nome);
    salvarDados();
    renderizarProjetos();
}

function criarSessao(pId){
    const nome = prompt("Nome da sessão:");
    if(!nome) return;

    const proj = projetosDB.find(p=>p.id===pId);

    proj.sessoes.push({
        id:Date.now(),
        nome,
        descricao:"Nova sessão",
        usuarios:[currentUser.id],
        etapas:[]
    });

    addLog("Criou sessão: "+nome);
    salvarDados();
    renderizarProjetos();
}

function criarEtapa(pId,sId){
    const nome = prompt("Nome da etapa:");
    if(!nome) return;

    const proj = projetosDB.find(p=>p.id===pId);
    const sess = proj.sessoes.find(s=>s.id===sId);

    sess.etapas.push({
        id:Date.now(),
        nome,
        descricao:"Nova etapa",
        status:"Não iniciado",
        usuarios:[currentUser.id]
    });

    addLog("Criou etapa: "+nome);
    salvarDados();
    renderizarProjetos();
}

// ========= EDITAR ==============
function editarEtapa(pId,sId,eId){
    const proj = projetosDB.find(p=>p.id===pId);
    const sess = proj.sessoes.find(s=>s.id===sId);
    const etapa = sess.etapas.find(e=>e.id===eId);

    const novo = prompt("Novo nome:", etapa.nome);
    if(!novo) return;

    etapa.nome = novo;

    addLog("Editou etapa: "+novo);
    salvarDados();
    renderizarProjetos();
}

// =============== STATUS ================
function alterarStatus(pId,sId,eId){
    const proj = projetosDB.find(p=>p.id===pId);
    const sess = proj.sessoes.find(s=>s.id===sId);
    const etapa = sess.etapas.find(e=>e.id===eId);

    const ordem = ["Não iniciado", "Em progresso", "Finalizado"];

    let index = ordem.indexOf(etapa.status);
    index = (index + 1) % ordem.length;

    etapa.status = ordem[index];

    addLog("Alterou status para: " + etapa.status);
    salvarDados();
    renderizarProjetos();
}

// =============== LOGS ===============
function mostrarLogs(){
    if(currentUser.nivel !== 2) return;
    const div = document.getElementById('logs-container');
    div.classList.remove('hidden');
    document.getElementById('log-entries').innerHTML =
        logs.map(l=>`<p>> ${l}</p>`).join("");
}
function toggleColaboradores(projId){
    const div = document.getElementById(`colab-${projId}`);
    
    if(div.classList.contains('hidden')){
        div.classList.remove('hidden');
    } else {
        div.classList.add('hidden');
    }
}