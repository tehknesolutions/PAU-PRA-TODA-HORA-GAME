# GDD v0.2 — Killer Fists: OranKork

## Core Fantasy

O jogador começa totalmente magro, sem capacidade de luta, treina, aprende a combater, desenvolve o corpo e avança até tornar-se um dos lutadores mais conhecidos, enfrentando no caminho a ameaça da OranKork.

## Core Loop

`TREINAR → DESENVOLVER CORPO/TÉCNICA → LUTAR → APRENDER → VENCER DESAFIOS → GANHAR RECONHECIMENTO → AVANÇAR CONTRA A ORANKORK`

## Formato de combate

- fighting game 2D;
- sprites desenhados à mão / pixel art;
- movimentação direcional;
- ataques básicos por soco e chute;
- golpes especiais por combinações e charge;
- resposta rápida e legível de fighting game clássico.

## Linguagem de input

Os especiais são expressos como sequências de direção, tempo/charge e botão.

Exemplos já aprovados para Norman:

- **Tornado Kick:** `CIMA (3s) → CHUTE`
- **Elbow:** `BAIXO (2s) → CIMA → BAIXO → SOCO`

## Sistema elemental universal

Todos os personagens possuem:

- Electric: `CIMA + SOCO`
- Water: `BAIXO + SOCO`
- Fire: `CIMA + CHUTE`
- Wind: `BAIXO + CHUTE`
- Earth: `ESQUERDA → DIREITA + CHUTE`

Esses comandos formam uma linguagem compartilhada entre o roster, sem eliminar os golpes exclusivos de cada lutador.

## Norman “The Psychic” Albert

Chefe/líder da OranKork. Possui cinco ataques/especiais na estrutura aprovada do personagem.

### Psychic

`CHARGE 3s → Electric → Water → Fire`

A técnica Psychic transforma três comandos elementais universais em uma combinação longa exclusiva de Norman.

## Progressão do protagonista

Estado inicial:

- corpo totalmente magro;
- nenhuma capacidade de luta desenvolvida.

O jogador melhora através de treinamento. A evolução precisa ser perceptível tanto no desempenho quanto na representação do personagem.

## Roster

A seleção possui **15 personagens principais** e **2 secretos**.

Personagens confirmados nesta fase incluem:

- Norman “The Psychic” Albert;
- Khabib Nurgaliyev;
- Akira Mori;
- Liang Wei;
- Somchai Prasert;
- Seo-jun Han;
- João Batista;
- Amara Okoye;
- Viktor Volkov;
- Diego Reyes;
- Maeve O'Connor;
- Arjun Singh;
- Leila Haddad;
- Nikolaos Drakos;
- Malia Kealoha.

Secretos:

- Connor McAlpha — rival de Khabib Nurgaliyev;
- Winston Charlie — rival de Norman Albert.

## Referências culturais

Os lutadores são construídos a partir de culturas, tradições marciais, estátuas e/ou pessoas reais como referência. A referência orienta identidade e estilo; o personagem permanece ficcional.

## Direção visual

Referência principal: **Street Fighter Alpha 2**.

- 2D sprite art;
- pixel art;
- desenho manual;
- anime/mangá;
- animação quadro a quadro;
- silhuetas fortes e legíveis;
- evitar aparência de render 3D convertido para 2D;
- evitar aparência genérica de IA;
- sem elementos/cartoon adicionais abaixo/fora da arte principal do personagem.

## Campanha

A OranKork funciona como antagonismo central. O jogador evolui de iniciante até possuir capacidade de enfrentar a organização e seu líder Norman Albert.

A estrutura detalhada da Grande Guerra, chefes intermediários, mapa da campanha e ordem dos confrontos permanece TBD.

## Regra de design

O domínio do jogo deve vir de duas progressões simultâneas:

1. **progressão do personagem**, conquistada por treinamento;
2. **progressão do jogador**, conquistada ao aprender timing, inputs, combinações e matchups.
