const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { JWT } = require('google-auth-library');

// Carica le credenziali
const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'google-credentials.json')));

// ID del foglio di calcolo (puoi trovarlo nell'URL di Google Sheets)
const spreadsheetId = 'IL_TUO_SPREADSHEET_ID';

// Configura l'autenticazione con il servizio Google Sheets
const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      // Ricevi i dati inviati dal form (puoi estendere la logica per includere tutti i campi del form)
      const data = JSON.parse(event.body);

      // Usa l'API Google Sheets per aggiungere una nuova riga
      const sheets = google.sheets({ version: 'v4', auth });

      const request = {
        spreadsheetId,
        range: 'Foglio1!A1',  // Range dove i dati saranno inseriti, ad esempio, partendo da A1
        valueInputOption: 'RAW',
        resource: {
          values: [
            [
              data.name,
              data.meal,    // Pasto (es. colazione, pranzo, cena, ecc.)
              data.score,    // Punteggio
              data.details,  // Dettagli del pasto
            ]
          ]
        }
      };

      const response = await sheets.spreadsheets.values.append(request);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Dati inviati correttamente!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Errore nell\'invio dei dati!' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Metodo non consentito' }),
    };
  }
};
