# Aplicação WhatsApp API

Esta é uma aplicação simples em Node.js para integração com a API do WhatsApp Business.

## Configuração

1. Primeiro, instale as dependências do projeto:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie o arquivo `.env` e configure suas credenciais:
  - `WHATSAPP_TOKEN`: Token de acesso da API do WhatsApp Business
  - `VERIFY_TOKEN`: Token de verificação para o webhook (você pode criar qualquer string única)
  - `PORT`: Porta onde o servidor irá rodar (padrão: 3000)

## Como obter as credenciais do WhatsApp Business

1. Acesse o [Facebook Developers](https://developers.facebook.com/)
2. Crie um aplicativo ou use um existente
3. Adicione a capacidade do WhatsApp Business ao seu aplicativo
4. Configure um número de telefone de teste
5. Gere um token de acesso permanente

## Executando a aplicação

```bash
npm start
```

## Funcionalidades

- Webhook para receber mensagens do WhatsApp
- Envio automático de mensagens de resposta
- Verificação de webhook para configuração com a plataforma do WhatsApp

## Endpoints

- `GET /webhook`: Endpoint para verificação do webhook pelo WhatsApp
- `POST /webhook`: Endpoint para receber mensagens

## Observações

- Esta é uma implementação básica e pode ser expandida conforme necessário
- Lembre-se de configurar corretamente o webhook no painel do Facebook Developers
- Para uso em produção, considere adicionar mais camadas de segurança e tratamento de erros