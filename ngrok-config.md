# Configuração do Ngrok para Webhook do WhatsApp

## Instalação do Ngrok

1. Baixe o Ngrok em: https://ngrok.com/download
2. Extraia o arquivo baixado
3. Crie uma conta gratuita em https://ngrok.com/signup
4. Copie o token de autenticação do seu painel do Ngrok
5. Configure o token usando o comando:
   ```bash
   ngrok authtoken seu_token_aqui
   ```

## Iniciando o Túnel HTTP

1. Certifique-se que sua aplicação está rodando na porta 3000
2. Abra um novo terminal e execute:
   ```bash
   ngrok http 3000
   ```
3. O Ngrok irá gerar uma URL HTTPS (exemplo: https://abc123.ngrok.io)

## Configurando o Webhook no Meta Developer

1. Acesse https://developers.facebook.com
2. Vá para seu aplicativo do WhatsApp
3. Em "Configuração do Webhook":
   - URL do Webhook: Cole a URL do Ngrok + "/webhook" (exemplo: https://abc123.ngrok.io/webhook)
   - Token de Verificação: Use o mesmo valor configurado em VERIFY_TOKEN no arquivo .env
   - Selecione os campos de inscrição necessários (messages, message_reactions, etc)

## Observações Importantes

- A URL do Ngrok muda cada vez que você reinicia o serviço (na versão gratuita)
- Mantenha o terminal do Ngrok aberto enquanto estiver testando
- Atualize a URL do webhook no painel do Meta sempre que reiniciar o Ngrok
- Para desenvolvimento local, o Ngrok é uma solução temporária. Em produção, use um servidor com IP fixo e HTTPS configurado