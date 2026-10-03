# ASSET REUSE POLICY — PAU PRA TODA OBRA

Status: REFERÊNCIA / GOVERNANÇA TÉCNICA

## Objetivo

Permitir reaproveitamento de assets e pipelines existentes sem contaminar o repositório com binários pesados, origem incerta ou incompatibilidades silenciosas.

## Regras

1. Nenhum asset externo entra no runtime sem proveniência mínima.
2. Registrar:
   - origem/repositório;
   - autor/criador quando disponível;
   - licença;
   - versão/tag;
   - hash/checksum quando disponível;
   - formato;
   - papel no jogo;
   - status: CANDIDATE / APPROVED / INTEGRATED / REJECTED.
3. Preferir assets CC0/public-domain ou assets próprios com proveniência clara.
4. Binários grandes devem preferencialmente ficar em Releases/Asset Vault, não no histórico Git.
5. Asset externo nunca pode ser dependência única do core: manter fallback técnico/procedural quando possível.
6. Rig e animações devem ser validados separadamente.
7. Mapeamento de animação deve ser explícito: state -> clip exato.
8. Reuso visual não transforma lore, canon ou design do projeto-fonte em canon deste jogo.

## Fontes prioritárias já auditadas

### Taijifu Masters Assets
Uso principal:
- catálogo de packs;
- manifests;
- checksums;
- convenção de releases;
- contratos de compatibilidade.

### Alakazam Strangeverse
Uso principal:
- proveniência de assets;
- GLB/glTF;
- auditoria de rig;
- quantização/runtime;
- animação;
- fallback;
- render QA.

### Taijifu Masters
Uso principal:
- assets de combate/protótipos quando compatíveis;
- dados e estruturas técnicas de Godot;
- padrões de telemetria e gameplay.

## Estrutura alvo

```text
assets/
├── catalog/
├── manifests/
├── provenance/
└── runtime/
```

Somente `runtime/` deve conter o que for realmente necessário ao build do jogo.

## Regra de soberania

`ASSET REUTILIZÁVEL ≠ SISTEMA IMPORTADO ≠ CÂNONE IMPORTADO`

Cada integração precisa ser aprovada no contexto do PAU PRA TODA OBRA.
