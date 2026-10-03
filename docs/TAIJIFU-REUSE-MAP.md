# TAIJIFU & RELATED REPOSITORIES — REUSE MAP FOR PAU PRA TODA OBRA

Status: **REFERÊNCIA / KNOW-HOW / REAPROVEITAMENTO CONTROLADO**

## Regra de soberania

Este documento NÃO torna nenhum repositório externo autoridade sobre o jogo.

`CONSULTAR ≠ IMPORTAR ≠ APROVAR ≠ CANONIZAR`

Todo reaproveitamento segue:

`CONSULTAR → IDENTIFICAR KNOW-HOW → AVALIAR → ADAPTAR → PROPOR → APROVAR → INCORPORAR`

## Contexto Taijifu

Taijifu é tratado aqui como uma arte marcial do ecossistema HNK e como fonte privilegiada de conhecimento marcial, pedagógico, arquitetural e de assets. A história/autoria declarada para o projeto é registrada separadamente como contexto do criador, sem transformar esse dado em regra técnica do jogo.

## 1. TAIJIFU-SITE

Papel útil:
- Source of Truth curricular do Taijifu;
- Canon versionado;
- separação explícita entre conteúdo canônico e projeções de app/UI;
- 4 Bases, 10 Faixas, 32 Caminhos, 128 Núcleos.

Reuso recomendado no jogo:
- taxonomia marcial;
- modelagem de capacidades;
- classificação de distância, timing, estrutura, transições, fadiga, recuperação, estratégia pessoal e metaaprendizagem;
- referência para organizar árvore de competências e famílias de skills.

Importante: usar como referência de domínio, não copiar automaticamente o currículo inteiro para o game.

### Conceitos especialmente úteis

- Tai: presença, alcance, mobilidade, longa distância e decisão.
- Ji: estrutura, proximidade, controle, solo e sobrevivência no contato.
- Fu: fluxo, coordenação, transição, ritmo e visão do todo.
- Integração/Sobrevivência: adaptação, continuidade e saída segura.

Núcleos com alto valor para sistemas do game:
- cadeia cinética;
- alavanca/base/postura;
- geração e redirecionamento de força;
- timing/janela;
- defesa em camadas;
- escape/reversão/recuperação;
- função sob resistência;
- transições;
- distância-contato;
- desequilíbrio-queda-solo;
- técnica/decisão sob fadiga;
- força aplicada;
- potência/capacidade aeróbica;
- mobilidade/equilíbrio/coordenação;
- programação/carga/recuperação;
- Style Signature;
- estratégia pessoal;
- Self-Lab;
- retenção/transferência;
- continuidade longitudinal.

## 2. SW-TAIJIFU

Papel útil:
- metodologia de ensino e treino;
- runtime de sessão;
- Technique → Drill → Session → Evidence → Progress;
- readiness;
- persistência;
- gates claros entre conteúdo confirmado e conteúdo ainda source-pending.

Reuso recomendado:
- M3 Training Vertical Slice;
- sessões estruturadas;
- blocos temporizados;
- repetições;
- descanso;
- readiness;
- evidência de treino;
- separação entre aprender, praticar, provar e progredir.

Princípio excelente para o jogo:
- treino deve produzir evidência;
- repetição bruta não deve equivaler automaticamente a domínio.

## 3. taijifu-platform

Papel útil:
- arquitetura de conhecimento compartilhado;
- progressão pedagógica:
  Faixa → Caminho → Núcleo → Lição → Prática → Checkpoint → Evidência → Transferência → Avaliação.

Reuso recomendado:
- design de academias, professores, currículos e progressão de aprendizado;
- estrutura de pré-requisitos;
- gates de aprendizado;
- separação entre XP de jogo e graduação marcial real.

Regra importante:
- jogo não deve confundir progresso lúdico com graduação real Taijifu.

## 4. taijifu-masters

Papel útil:
- maior fonte técnica para combate, IA, observação, telemetria e progressão por experiência real;
- Godot 4.3+;
- simulação 60 Hz;
- domínio por arma;
- observação marcial em estágios;
- IA tática;
- hurtboxes regionais;
- grappling ativo;
- telemetria;
- heatmaps;
- estados situacionais.

Reuso recomendado imediato:
- arquitetura de FighterController → StateMachine / Movement / Combat / Defense / Resource / Equipment / Ability;
- TechniqueData / AttackData;
- telemetria desacoplada;
- observação marcial;
- aprendizado por eventos reais;
- princípio: atributos alteram comportamento, não apenas números;
- dificuldade muda consistência, não atributos ocultos;
- domínio registra experiência, não poder mágico.

### Insight direto para M2

A progressão por técnica deve considerar eventos diferentes, e não só spam de repetição:
- viu;
- reconheceu;
- defendeu;
- reproduziu;
- adaptou;
- dominou.

Isso encaixa perfeitamente com:
- XP por uso;
- qualidade da prática;
- retorno decrescente;
- histórico contextual.

## 5. taijifu-masters-assets

Papel útil:
- governança de assets;
- manifests;
- checksums;
- packs versionados;
- releases;
- compatibilidade;
- Asset Vault.

Reuso recomendado:
- NÃO copiar binários pesados para o repo do jogo sem necessidade;
- usar manifestos e referências versionadas;
- registrar licença, origem, hash, versão e compatibilidade;
- baixar asset binário apenas quando for integrar de fato.

Padrão recomendado para PPTO:
- `assets/catalog/`
- `assets/manifests/`
- binários grandes via GitHub Releases quando necessário.

## 6. taijifu-legacy

Papel útil:
- fundação limpa de jogo de luta em Godot;
- separação cenas/scripts/assets/docs;
- roadmap modular.

Reuso recomendado:
- organização de projeto;
- modularização futura;
- catálogo de dados externo.

Não usar:
- decisões antigas específicas de design que conflitem com o Survival Martial RPG atual.

## 7. alakazam-strangeverse

Papel útil:
- pipeline 3D;
- provenance de assets;
- GLB/glTF;
- rig audit;
- animation mapping;
- QA visual;
- fallback procedural;
- web runtime Three.js/Vite;
- regras claras para ingestão de assets.

Reuso recomendado:
- character pipeline;
- asset provenance;
- hashes;
- validação de rig;
- mapeamento explícito de states → clips;
- fallback seguro quando asset externo falhar;
- critérios de aceitação visual;
- não permitir asset externo quebrar o core.

### Regra de assets reaproveitada

Preferir:
- CC0/public domain;
- proveniência registrada;
- hash;
- versão;
- licença;
- caminho local;
- papel no runtime.

## 8. MATRIZ DE REUSO POR MILESTONE

### M1 Fighter Core
- taijifu-masters: ResourceController / Fighter state boundaries
- SW-Taijifu: readiness
- Taijifu Canon: fatigue/recovery/body-state vocabulary

### M2 Progression-by-Use
- taijifu-masters: Martial Observation
- taijifu-masters: weapon mastery model
- Taijifu Canon: skills/families/transitions/style signature
- SW-Taijifu: Evidence → Progress

### M3 Training Vertical Slice
- SW-Taijifu: runtime de sessão
- Taijifu Platform: currículo/prática/checkpoint
- Canon: PFI, carga, recuperação, mobilidade, coordenação

### M4/M5 Combat
- taijifu-masters: combat controllers, defense, grappling, hurtboxes, AI, telemetry
- taijifu-legacy: modularização Godot
- Canon: zonas, timing, controle, solo, transições

### M8 Adaptive Body
- Canon: capacidade, força, potência, aeróbico, mobilidade
- Alakazam: pipeline de personagem/rig/render QA

### Assets / Visual
- taijifu-masters-assets: manifests/releases
- Alakazam: provenance + pipeline GLB/glTF + animation QA

## 9. PRINCÍPIOS INCORPORADOS COMO REFERÊNCIA

1. aprendizado real deve ser contextual;
2. repetição sem desafio sofre retorno decrescente;
3. experiência observada ≠ domínio;
4. técnica ≠ função;
5. atributos alteram comportamento;
6. dificuldade de IA não deve usar bônus invisíveis;
7. telemetria serve para entender trajetória e não só placar;
8. assets precisam de proveniência;
9. sistemas devem ter fallback;
10. nenhum repo externo pode canonizar silenciosamente decisões de PPTO.

## 10. Próximos reaproveitamentos prioritários

- M2: adaptar Martial Observation para técnica individual;
- M2: integrar eventos de uso/defesa/reprodução/adaptação ao XP;
- M3: importar o modelo conceitual Technique → Drill → Session → Evidence → Progress;
- M4+: reaproveitar padrões de StateMachine/Combat/Defense/Resource;
- Assets: criar catálogo e provenance antes de importar binários.

