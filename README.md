# Verbo Crianças: protótipo dos apps

Protótipo navegável do Verbo Crianças, com a identidade visual do guia. Ele reúne em uma só página:

| Endereço | O que é |
| --- | --- |
| `#pais` | App dos pais (login por e-mail ou telefone): check-in dos filhos, avisos por notificação, agenda e cartas de histórias |
| `#tias` | App das tias (login próprio): sala, check-in e check-out, cuidados da criança e envio de avisos |
| `#gestao` | Gestão (login por perfil): painel, famílias, equipe, agenda, relatórios, acessos e registro |
| `#visitante` | Página aberta pelo QR Code da entrada, sem instalar nada |

Os quatro conversam entre si dentro da mesma página. Por exemplo: a tia envia um aviso e ele aparece como notificação no app dos pais, e a gestão vê a ação no registro.

## Login por app

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

Mantenha os quatro arquivos na mesma pasta.

## Como publicar no GitHub e testar

1. No GitHub, clique em **New repository**, dê um nome (por exemplo `verbo-criancas`) e deixe **Public**. No plano gratuito, o GitHub Pages só funciona em repositório público. O protótipo só tem dados de exemplo.
2. Na página do repositório, clique em **Add file > Upload files**, arraste os arquivos desta pasta e clique em **Commit changes**.
3. Vá em **Settings > Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main** e pasta **/ (root)**, e salve.
4. Depois de um ou dois minutos, o endereço aparece nessa mesma tela, no formato `https://SEU-USUARIO.github.io/verbo-criancas/`.
5. Para abrir direto em cada app, acrescente ao endereço `#pais`, `#tias`, `#gestao` ou `#visitante`.

Para testar no celular, abra o endereço no navegador. A página pede internet apenas para carregar as fontes Nunito.

## O que este protótipo ainda não faz

- **Não guarda dados.** Ao recarregar a página, tudo volta ao estado inicial.
- **Não sincroniza entre aparelhos.** Cada pessoa vê a sua própria cópia, então um celular não recebe o aviso enviado por outro.
- **A notificação é simulada.** Ela aparece dentro da página. Notificação de verdade, com o celular bloqueado, exige um app instalado e um servidor.
- **Os QR Codes são desenhos de exemplo**, sem leitura real.
- **O login é simulado.** Cada app tem a sua tela de entrada, mas as senhas de exemplo ficam visíveis no código (`app.js`) e na própria tela. Serve para testar o fluxo, não para proteger dados.

Os próximos passos naturais são: banco de dados com login de verdade e permissões por função (pais, tias e gestão), notificações push reais e QR Codes lidos pela câmera.

*Aprender. Adorar. Crescer com Jesus.*
