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
   console.log('Requisição recebida no webhook');
   console.log('VERIFY_TOKEN configurado:', process.env.VERIFY_TOKEN);

   const mode = req.query['hub.mode'];
   const token = req.query['hub.verify_token'];
   const challenge = req.query['hub.challenge'];

   console.log('Parâmetros recebidos:', { mode, token, challenge });

   if (!mode || !token) {
      console.log('Parâmetros mode ou token ausentes');
      return res.sendStatus(400);
   }

   if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
   } else {
      console.log('Verificação falhou:', { mode, token });
      res.sendStatus(403);
   }
});


app.get('/teste', (req, res) => {
   console.log('Rota funcionando');

});
// Rota para receber mensagens
app.post('/webhook', (req, res) => {
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

         // Função para enviar mensagem de resposta
         sendMessage(phone_number_id, from, `Recebi sua mensagem: ${msg_body}`);
      }
      res.sendStatus(200);
   } else {
      res.sendStatus(404);
   }
});

// Função para enviar mensagens
async function sendMessage(phone_number_id, to, message) {
   try {
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
   } catch (error) {
      console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
   }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Servidor rodando na porta ${PORT}`);
});