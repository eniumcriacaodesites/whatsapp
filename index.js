require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Configurações da API do WhatsApp
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';

// Rota para verificação do webhook
app.get('/webhook', (req, res) => {
   console.log('\n[Webhook] Nova requisição de verificação recebida');
   console.log('[Webhook] VERIFY_TOKEN configurado:', process.env.VERIFY_TOKEN);

   const mode = req.query['hub.mode'];
   const token = req.query['hub.verify_token'];
   const challenge = req.query['hub.challenge'];

   console.log('[Webhook] Parâmetros recebidos:', { mode, token, challenge });

   if (!mode || !token) {
      console.log('[Webhook] Erro: Parâmetros mode ou token ausentes');
      return res.sendStatus(400);
   }

   if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('[Webhook] Verificação realizada com sucesso!');
      res.status(200).send(challenge);
   } else {
      console.log('[Webhook] Erro: Verificação falhou:', { mode, token });
      res.sendStatus(403);
   }
});

// Rota para receber mensagens
app.post('/webhook', (req, res) => {
   console.log('\n[Webhook] Nova mensagem recebida');
   const body = req.body;

   if (body.object) {
      if (body.entry &&
         body.entry[0].changes &&
         body.entry[0].changes[0].value.messages &&
         body.entry[0].changes[0].value.messages[0]
      ) {
         const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
         const from = body.entry[0].changes[0].value.messages[0].from;
         const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

         console.log('[Webhook] Mensagem recebida de:', from);
         console.log('[Webhook] Conteúdo:', msg_body);

         // Função para enviar mensagem de resposta
         sendMessage(phone_number_id, from, `Recebi sua mensagem: ${msg_body}`);
      }
      res.sendStatus(200);
   } else {
      console.log('[Webhook] Erro: Objeto inválido recebido');
      res.sendStatus(404);
   }
});

// Rota para enviar mensagem de teste
app.post('/send-test', async (req, res) => {
   try {
      console.log('\n[Test Message] Nova requisição de teste recebida');
      const { to, message } = req.body;

      if (!to || !message) {
         console.log('[Test Message] Erro: Parâmetros inválidos');
         return res.status(400).json({
            error: 'Número de telefone e mensagem são obrigatórios',
            example: {
               to: '5511999999999',
               message: 'Sua mensagem aquii'
            }
         });
      }

      console.log('[Test Message] Tentando enviar mensagem para:', to);
      console.log('[Test Message] Conteúdo:', message);

      // Obtém o phone_number_id do primeiro número configurado
      const response = await axios({
         method: 'GET',
         url: `${WHATSAPP_API_URL}/${process.env.WHATSAPP_BUSINESS_ID}/phone_numbers`,
         headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
         }
      });

      const phone_number_id = response.data.data[0].id;
      console.log('[Test Message] Phone Number ID obtido:', phone_number_id);

      await sendMessage(phone_number_id, to, message);
      console.log('[Test Message] Mensagem enviada com sucesso!');

      res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso' });
   } catch (error) {
      console.error('[Test Message] Erro:', error.response?.data || error.message);
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
   }
});

// Função para enviar mensagens
async function sendMessage(phone_number_id, to, message) {
   try {
      console.log('\n[Send Message] Iniciando envio de mensagem');
      console.log('[Send Message] Destinatário:', to);
      console.log('[Send Message] Conteúdo:', message);

      await axios({
         method: 'POST',
         url: `${WHATSAPP_API_URL}/${phone_number_id}/messages`,
         headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
         },
         data: {
            messaging_product: 'whatsapp',
            to: to,
            text: { body: message }
         }
      });

      console.log('[Send Message] Mensagem enviada com sucesso!');
   } catch (error) {
      console.error('[Send Message] Erro ao enviar mensagem:', error.response?.data || error.message);
      throw error;
   }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`\n[Server] Servidor rodando na porta ${PORT}`);
   console.log('[Server] Endpoints disponíveis:');
   console.log('  - GET /webhook: Verificação do webhook');
   console.log('  - POST /webhook: Recebimento de mensagens');
   console.log('  - POST /send-test: Envio de mensagens de teste');
});