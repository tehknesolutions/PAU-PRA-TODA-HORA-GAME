# ROADMAP v0.2 — Killer Fists: OranKork

O roadmap atual prioriza colocar o **fighting game 2D jogável** o mais cedo possível. A antiga sequência centrada em MMORPG/3D foi superada pela nova direção aprovada.

## M0 — Reboot canônico — CONCLUÍDO

- título Killer Fists: OranKork;
- OranKork como organização antagonista;
- Norman “The Psychic” Albert como líder/vilão;
- 2D sprites/pixel art;
- referência visual Street Fighter Alpha 2;
- progressão desde lutador totalmente magro e sem capacidade;
- roster 15 + 2 secretos;
- sistema de comandos especiais e elementos.

## M1 — Fighting Core 2D

- arena 2D;
- dois fighters;
- andar para esquerda/direita;
- pular/agachar;
- soco;
- chute;
- vida;
- hit/hurt boxes;
- hit stun;
- knockback;
- rounds;
- vitória/derrota.

**Gate:** uma luta completa precisa ser jogável do início ao KO.

## M2 — Command Interpreter

- histórico temporal de inputs;
- direções;
- botões;
- simultaneidade;
- sequências;
- charge por duração;
- janela de tolerância;
- prioridade de comandos.

**Gate:** reconhecer deterministicamente comandos simples, sequenciais e carregados.

## M3 — Elemental Core

Implementar a linguagem universal:

- Electric `CIMA + SOCO`;
- Water `BAIXO + SOCO`;
- Fire `CIMA + CHUTE`;
- Wind `BAIXO + CHUTE`;
- Earth `ESQUERDA → DIREITA + CHUTE`.

**Gate:** os cinco comandos funcionam sobre o mesmo interpretador e podem ser configurados por personagem.

## M4 — Norman Vertical Slice

Primeiro personagem usado para provar especiais complexos.

- Tornado Kick;
- Elbow;
- Psychic;
- completar/validar seus cinco golpes especiais aprovados;
- efeitos e feedback dos elementos;
- CPU básica para combate contra ele.

**Gate:** Psychic reconhece `charge 3s → Electric → Water → Fire` sem disparos falsos.

## M5 — Sprite Pipeline

- padrão de resolução e escala;
- idle;
- walk;
- jump/crouch;
- punch/kick;
- hit;
- KO;
- especiais;
- animação quadro a quadro;
- importação dos assets aprovados.

**Gate:** personagem completo em sprite art mantém leitura e fluidez no combate real.

## M6 — Roster 15

Implementar progressivamente os 15 personagens principais, preservando identidade cultural/marcial e golpes próprios.

**Gate:** todos selecionáveis e capazes de completar uma luta.

## M7 — Secret Fighters

- Connor McAlpha;
- Winston Charlie;
- condições de desbloqueio TBD;
- rivalidades específicas.

## M8 — Progression / Training

- estado inicial extremamente magro;
- treino;
- crescimento corporal;
- evolução de capacidade de luta;
- domínio de técnicas;
- reconhecimento/ranking.

**Gate:** jogador consegue perceber diferença real entre o personagem inicial e sua versão treinada.

## M9 — OranKork Campaign

- estrutura da organização;
- progressão narrativa;
- rivais e confrontos;
- Grande Guerra;
- caminho até Norman;
- boss fight.

**Gate:** campanha completa conduz do iniciante ao confronto final com Norman.

## M10 — Polish

- HUD final;
- seleção de personagens;
- telas de versus/vitória;
- cenários;
- áudio;
- efeitos;
- balanceamento;
- performance;
- controles para teclado/gamepad;
- QA.

## Princípio de execução

> **Primeiro provar a luta. Depois expandir o mundo.**

A implementação não deve ficar bloqueada esperando todos os sprites finais: sistemas de combate podem avançar com placeholders e receber os assets aprovados posteriormente.
