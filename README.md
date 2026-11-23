# Verbo Crianças: protótipo dos apps

Protótipo navegável do Verbo Crianças, com a identidade visual do guia. Ele reúne em uma só página:

| Endereço | O que é |
| --- | --- |
| `#pais` | App dos pais (login por e-mail ou telefone): check-in dos filhos, avisos por notificação, agenda e cartas de histórias |
| `#tias` | App das tias (login próprio): sala, check-in e check-out, cuidados da criança e envio de avisos |
| `#gestao` | Gestão (login por perfil): painel, famílias, equipe, agenda, relatórios, acessos e registro |
| `#visitante` | Página aberta pelo QR Code da entrada, sem instalar nada |

Os quatro conversam entre si dentro da mesma página. Por exemplo: a tia envia um aviso e ele aparece como notificação no app dos pais, e a gestão vê a ação no registro.

## Modo protótipo (sem Firebase): login por app

Cada app pede o seu próprio login. Uma conta de pais não entra no app das tias, e assim por diante. A tela mostra as contas de exemplo, com o botão **Preencher**.

| App | Perfil | Entrada | Senha |
| --- | --- | --- | --- |
| Pais | Maria Souza | maria@email.example | souza123 |
| Pais | Carla Almeida | carla@email.example | almeida123 |
| Tias | Tia Raquel | raquel@verbo.example | raquel123 |
| Tias | Tia Joana | joana@verbo.example | joana123 |
| Gestão | Administrador | admin@verbo.example | admin123 |
| Gestão | Coordenação | coord@verbo.example | coord123 |
| Gestão | Recepção | recepcao@verbo.example | recepcao123 |

Há mais contas de exemplo na tela de cada app.

**O que cada perfil da gestão vê:**

- **Recepção:** painel e famílias (não altera capacidade das salas).
- **Coordenação:** também equipe, agenda e relatórios.
- **Administrador:** tudo, incluindo **Acessos** (criar contas, desativar, redefinir senha) e o registro de ações.

Ao cadastrar uma família, o sistema cria o acesso do responsável (entra com o telefone). Ao criar o acesso de uma tia, ela já aparece na equipe. Desativar uma conta tira a pessoa do app na hora.

## Arquivos

- `index.html`: a página
- `styles.css`: visual (cores, fontes, espaçamentos)
- `app.js`: telas e comportamento
- `favicon.svg`: ícone da aba
- `cloud.js`, `firebase-config.js`, `sw.js`, `manifest.webmanifest`, `firestore.rules` e `firebase.json`: ligação com o Firebase (veja abaixo)

Mantenha tudo na mesma pasta, como está.

## Como publicar no GitHub e testar

1. No GitHub, clique em **New repository**, dê um nome (por exemplo `verbo-criancas`) e deixe **Public**. No plano gratuito, o GitHub Pages só funciona em repositório público. O protótipo só tem dados de exemplo.
2. Na página do repositório, clique em **Add file > Upload files**, arraste os arquivos desta pasta e clique em **Commit changes**.
3. Vá em **Settings > Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main** e pasta **/ (root)**, e salve.
4. Depois de um ou dois minutos, o endereço aparece nessa mesma tela, no formato `https://SEU-USUARIO.github.io/verbo-criancas/`.
5. Para abrir direto em cada app, acrescente ao endereço `#pais`, `#tias`, `#gestao` ou `#visitante`.

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
8. **Primeiro administrador:** abra `.../#gestao`. Como ainda não existe ninguém, aparece o formulário **Primeiro acesso**. Crie o administrador logo, antes de divulgar o endereço. Depois disso, o formulário some. Tias e equipe são criadas em **Gestão > Acessos**, e os responsáveis em **Famílias**.

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
| `sw.js` | Mostra o aviso como notificação do aparelho |
| `manifest.webmanifest` | Permite instalar o site na tela inicial |

### Limites do plano gratuito

- **Avisos:** a notificação aparece no aparelho **enquanto o app estiver aberto**, mesmo em segundo plano. Com o celular bloqueado ou o app fechado, o aviso só chega quando a pessoa abrir o app. Notificação de verdade com o celular bloqueado exige enviar por um servidor, que só existe no plano Blaze (pago por uso). Se um dia migrarem, é uma etapa a mais, sem refazer o resto.
- **Notificação no iPhone** só funciona depois de **adicionar o site à tela inicial** (Compartilhar > Adicionar à Tela de Início) e abrir por esse ícone.
- A **lotação das salas** que pais e visitantes veem é atualizada quando alguém da equipe está com o app aberto. A trava de sala lotada é feita no aparelho, não no servidor.
- O **relatório de domingos anteriores** ainda usa números de exemplo. Os dados de hoje são reais.
- Qualquer pessoa conectada consegue **escrever** no registro de ações, mas só o administrador lê. O cadastro pelo QR Code de visitante é aberto por natureza: confira as famílias novas na Gestão.
- Cota gratuita do Firestore: 50 mil leituras e 20 mil gravações por dia. Costuma bastar para uma igreja pequena. Mais crianças e salas abertas ao mesmo tempo gastam mais.
- Nada foi testado com o seu projeto real. Se algo recusar gravar, a tela avisa e o console do navegador mostra o motivo.

*Aprender. Adorar. Crescer com Jesus.*
