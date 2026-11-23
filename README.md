# Verbo Crianças: protótipo dos apps

São **três apps**, cada um na sua própria página, com a identidade visual do guia:

| Endereço | App | Quem usa |
| --- | --- | --- |
| `index.html` (endereço principal) | **Verbo Crianças**: app das famílias e da equipe de sala | Responsáveis e tias. O app identifica sozinho pelo login e abre a área certa. Não existe tela para escolher o perfil. |
| `gestao.html` | **Gestão**: painel, famílias, equipe, agenda, relatórios, acessos e registro | Recepção, coordenação e administrador. Login próprio, só com e-mail e senha. |
| `visitante.html` | **Check-in de visitante** | Quem lê o QR Code na entrada. Abre direto, sem login e sem baixar nada. |

- **Famílias:** check-in dos filhos, avisos da equipe por notificação e agenda.
- **Tias:** sala, check-in e check-out, cuidados da criança e envio de avisos. A aba **Visitantes** mostra o **QR Code** para exibir ou imprimir na entrada.
- **Gestão:** o administrador também vê o QR Code, para imprimir.
- **Tia ou tio que também é pai ou mãe:** usa uma conta só. Em **Gestão > Acessos**, o administrador escolhe a família na linha da tia (ou no formulário de novo acesso). Daí em diante, o app abre na equipe e mostra no topo a troca **Equipe | Minha família**. Quem não tem os dois papéis não vê a troca.
- Quem entra no endereço errado não passa: uma conta da Gestão não abre o app das famílias, e uma conta de família não abre a Gestão.

No protótipo, os apps conversam entre si na mesma aba do navegador. Com o Firebase, passam a conversar entre aparelhos.

## Modo protótipo (sem Firebase): contas de exemplo

A tela de login de cada app mostra as contas de exemplo, com o botão **Preencher**.

| App | Perfil | Entrada | Senha |
| --- | --- | --- | --- |
| Verbo Crianças | Responsável (Maria Souza) | maria@email.example | souza123 |
| Verbo Crianças | Responsável (Carla Almeida) | carla@email.example | almeida123 |
| Verbo Crianças | Tia Raquel | raquel@verbo.example | raquel123 |
| Verbo Crianças | Tia Joana | joana@verbo.example | joana123 |
| Gestão | Administrador | admin@verbo.example | admin123 |
| Gestão | Coordenação | coord@verbo.example | coord123 |
| Gestão | Recepção | recepcao@verbo.example | recepcao123 |

Há mais contas de exemplo nas telas de login.

**O que cada perfil da gestão vê:**

- **Recepção:** painel e famílias (não altera capacidade das salas).
- **Coordenação:** também equipe, agenda e relatórios.
- **Administrador:** tudo, incluindo **Acessos** (criar contas, desativar, redefinir senha) e o registro de ações.

Ao cadastrar uma família, o sistema cria o acesso do responsável (entra com o telefone). Ao criar o acesso de uma tia, ela já aparece na equipe. Desativar uma conta tira a pessoa do app na hora.

## Arquivos

- `index.html`, `gestao.html`, `visitante.html`: as três páginas (um app cada)
- `styles.css`: visual (cores, fontes, espaçamentos)
- `app.js`: telas e comportamento dos três apps
- `qrcode.js`: desenha o QR Code do visitante
- `favicon.svg`: ícone da aba
- `cloud.js`, `firebase-config.js`, `sw.js`, `manifest.webmanifest`, `firestore.rules` e `firebase.json`: ligação com o Firebase (veja abaixo)

Mantenha tudo na mesma pasta, como está.

## Como publicar no GitHub e testar

1. No GitHub, clique em **New repository**, dê um nome (por exemplo `verbo-criancas`) e deixe **Public**. No plano gratuito, o GitHub Pages só funciona em repositório público. O protótipo só tem dados de exemplo.
2. Na página do repositório, clique em **Add file > Upload files**, arraste os arquivos desta pasta e clique em **Commit changes**.
3. Vá em **Settings > Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main** e pasta **/ (root)**, e salve.
4. Depois de um ou dois minutos, o endereço aparece nessa mesma tela, no formato `https://SEU-USUARIO.github.io/verbo-criancas/`.
5. Os endereços dos apps ficam assim: `.../` (famílias e tias), `.../gestao.html` (gestão) e `.../visitante.html` (visitante, é o que o QR Code abre).

Para testar no celular, abra o endereço no navegador. A página pede internet apenas para carregar as fontes Nunito.

No modo protótipo, o login é simulado: as senhas de exemplo ficam visíveis no código e nada é guardado. Ao recarregar a página, tudo volta ao início, e a notificação aparece só dentro da página. Isso serve para testar telas e fluxos. Para dados reais, ligue ao Firebase.

## Ligar ao Firebase (plano gratuito)

Tudo funciona no plano **Spark (gratuito)**, sem cartão. Sem configuração, o app roda como protótipo local. Para ligar ao Firebase, siga estes passos uma vez:

1. **Projeto:** em console.firebase.google.com, crie o projeto "Verbo Crianças".
2. **Authentication:** em *Build > Authentication > Sign-in method*, ative **E-mail/senha** e **Anônimo**. O anônimo permite o check-in de visitante pelo QR Code, sem criar conta.
3. **Domínio:** em *Authentication > Settings > Authorized domains*, adicione `russo-speack.github.io`.
4. **Firestore:** em *Build > Firestore Database > Create database*, escolha o modo **produção** e a região `southamerica-east1` (São Paulo).
5. **App web:** em *Project settings (engrenagem) > General > Your apps*, registre um app **Web** (ícone `</>`) e copie o `firebaseConfig`.
6. **Configuração no código:** abra `firebase-config.js`, cole os valores e faça o commit.
7. **Regras:** em *Firestore Database > Rules*, apague o que estiver lá, cole o conteúdo de `firestore.rules` e clique em **Publish**. Não precisa instalar nada no computador.
8. **Primeiro administrador:** abra `.../gestao.html`. Como ainda não existe ninguém, aparece o formulário **Primeiro acesso**. Crie o administrador logo, antes de divulgar o endereço. Depois disso, o formulário some. Tias e equipe são criadas em **Gestão > Acessos**, e os responsáveis em **Famílias**.

### Como fica o login

- **Pais:** entram com o **telefone** cadastrado e a senha provisória que a gestão recebe ao cadastrar a família. Na tela **Perfil** podem trocar a senha e ativar os avisos no aparelho.
- **Tias e gestão:** entram com **e-mail** e senha. A senha provisória aparece uma única vez, na tela de quem criou o acesso. Quem tem e-mail pode usar "Esqueci minha senha".
- **Redefinir a senha de um responsável** cria um novo login para o mesmo telefone, mostra a nova senha e inutiliza a antiga. Para tias e gestão, a redefinição envia um link ao e-mail.
- **Desativar um acesso** impede a pessoa de ler ou gravar qualquer dado, e ela é desconectada na hora.
- Cada aparelho guarda **um perfil por vez**. Para trocar de app com outra conta, saia primeiro.

### Arquivos

| Arquivo | Função |
| --- | --- |
| `firebase-config.js` | Chaves do seu projeto (podem ficar públicas) |
| `cloud.js` | Liga o app ao Firebase: login, sincronização e avisos |
| `firestore.rules` | Quem lê e grava o quê (pais só veem a própria família, tias e gestão conforme o perfil) |
| `sw.js` | Recebe o aviso (mesmo com o app fechado) e mostra como notificação |
| `worker/push-worker.js` | Servidor de avisos no Cloudflare Workers (opcional, grátis) |
| `chaves.html` | Gera as chaves do servidor de avisos |
| `manifest.webmanifest` | Permite instalar o site na tela inicial |

### Avisos com o app fechado (grátis, no Cloudflare)

O navegador entrega notificações com o app fechado pelo padrão **Web Push**. Falta só um servidorzinho para disparar o aviso quando a tia o envia. Ele roda no **Cloudflare Workers**, plano gratuito (100 mil pedidos por dia, sem cartão). O código está em `worker/push-worker.js`. Tudo se faz pelo navegador, sem instalar nada.

1. **Chaves:** com o site publicado, abra `.../chaves.html`, clique em **Gerar chaves** e deixe a página aberta (ou copie as duas chaves para um lugar seguro). A pública não é segredo. A **privada é segredo**: não coloque no GitHub.
2. **Conta:** crie uma conta grátis em dash.cloudflare.com.
3. **Worker:** em *Workers & Pages > Create > Create Worker*, dê o nome `verbo-push` e clique em **Deploy**. Depois clique em **Edit code**, apague o código de exemplo, cole o conteúdo de `worker/push-worker.js` e clique em **Deploy**.
4. **Variáveis:** em *Settings > Variables and Secrets*, adicione:
   - `PROJECT_ID` (texto): o `projectId` do Firebase
   - `VAPID_PUBLIC` (texto): a chave pública do passo 1
   - `VAPID_PRIVATE` (**Secret**): a chave privada do passo 1
   - `VAPID_SUBJECT` (texto): `mailto:` seguido do seu e-mail
   - `ALLOWED_ORIGIN` (texto): `https://russo-speack.github.io`

   Clique em **Deploy** de novo.
5. **Endereço do Worker:** copie o endereço do Worker (algo como `https://verbo-push.SEU-USUARIO.workers.dev`).
6. **Configuração do app:** em `firebase-config.js`, preencha `vapidPublicKey` (chave pública) e `pushUrl` (endereço do Worker) e faça o commit.
7. **Regras:** publique de novo o `firestore.rules` (há uma regra nova para os aparelhos inscritos).
8. **Em cada celular de pais:** *Perfil > Ativar avisos neste aparelho*.

Como funciona: o aparelho dos pais se inscreve e guarda a inscrição no Firestore. Quando a tia envia um aviso, o app dela envia a inscrição da família ao Worker junto com o login dela. O Worker confere o login (só contas reais, nunca visitantes), criptografa a mensagem e entrega ao serviço de notificações do navegador, que acorda o celular. O Worker não guarda nada. No **iPhone**, precisa estar no iOS 16.4 ou mais novo e o site adicionado à tela inicial.

### Limites do plano gratuito

- **Avisos:** sem o passo "Avisos com o app fechado" (abaixo), a notificação aparece no aparelho só **enquanto o app estiver aberto**, mesmo em segundo plano. Com esse passo, ela chega também com o app fechado e o celular bloqueado. Visitantes (QR Code) recebem os avisos só dentro da página.
- **Notificação no iPhone** só funciona depois de **adicionar o site à tela inicial** (Compartilhar > Adicionar à Tela de Início) e abrir por esse ícone.
- A **lotação das salas** que pais e visitantes veem é atualizada quando alguém da equipe está com o app aberto. A trava de sala lotada é feita no aparelho, não no servidor.
- O **relatório de domingos anteriores** ainda usa números de exemplo. Os dados de hoje são reais.
- Qualquer pessoa conectada consegue **escrever** no registro de ações, mas só o administrador lê. O cadastro pelo QR Code de visitante é aberto por natureza: confira as famílias novas na Gestão.
- Cota gratuita do Firestore: 50 mil leituras e 20 mil gravações por dia. Costuma bastar para uma igreja pequena. Mais crianças e salas abertas ao mesmo tempo gastam mais.
- Nada foi testado com o seu projeto real. Se algo recusar gravar, a tela avisa e o console do navegador mostra o motivo.

*Aprender. Adorar. Crescer com Jesus.*
