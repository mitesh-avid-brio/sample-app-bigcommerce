const http = require('http');
const https = require('https');
const { URL } = require('url'); // Import the URL module
const fs = require('fs');

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/transactions')) {
    const accessToken = "90iph80fw7sgemjijz54frmydqql2gb";
    const storeHash = "bohausxa6o";

    // Parse the request URL to extract the query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = url.searchParams.get('page') || 1; // Default to page 1 if not provided

    const apiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?page=${page}`;

    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': accessToken
        }
      });

      const data = await apiResponse.json();

      const orderIDs = data.map(order=>order.id)

        res.writeHead(apiResponse.status, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust this based on your requirements
        });


      if(!orderIDs.length)
        res.end("{transactionData:[], fromOrders:0}");

      const transactionURLs = orderIDs.map(orderID => `https://api.bigcommerce.com/stores/${storeHash}/v3/orders/${orderID}/transactions`)

        try {
          const responses = await Promise.all(transactionURLs.map(url => fetch(url, {
            headers: {
              'Accept': 'application/json',
              'X-Auth-Token': accessToken, // Replace with your access token
            },
          })));

          let transactionData = await Promise.all(responses.map(response => response.json()));

          transactionData = transactionData.map(transaction => (transaction['data'][0])).filter(transaction2=> transaction2!=null)



          res.end(JSON.stringify({transactionData, fromOrders:orderIDs.length}));

        
        } catch (error) {
        
          console.error('Error fetching transactions:', error);
          res.end("[]");
        
        }



    } catch (error) {
      // res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error: ' + error }));
    }
  } else {
    // res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const port = 5000; // Choose a port for your server

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
