const http = require('http');
const https = require('https');
const { URL } = require('url'); // Import the URL module
const fs = require('fs');

export default async function auth(req, res) {
    try {


  if (req.url.startsWith('/api/transactions')) {
    const accessToken = "90iph80fw7sgemjijz54frmydqql2gb";
    const storeHash = "bohausxa6o";

    // Parse the request URL to extract the query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = url.searchParams.get('page') || 1; // Default to page 1 if not provided

    const isSelectedPresent = url.searchParams.has('selected');

    let apiUrl

    if(!isSelectedPresent)

      apiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?page=${page}&sort=date_created:desc`;
    
    else{
      
      var selected = url.searchParams.get('selected');
      
      var query = url.searchParams.get('queryValue')

      apiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?page=${page}`

      if(selected == 'min_order_id')
        apiUrl += `&min_id=${query}&sort=id:asc `
      else if(selected == 'max_order_id')
        apiUrl += `&max_id=${query}&sort=id:desc`
      else if (selected == 'customer_email') 
        apiUrl += `&email=${query}&sort=date_created:desc`

    }

    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': accessToken
        }
      });

      const data = await apiResponse.json();

      console.log(data)

      if(data.length && data[0].status== 400)          res.end(JSON.stringify({transactionData:[], fromOrders:0}));

      const orderIDs =  data.map(order=>order.id)

        res.writeHead(apiResponse.status, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust this based on your requirements
        });

        console.log(orderIDs.length)

      if(orderIDs.length){

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

          transactionData = transactionData.map(transaction => {

              const orderId = transaction.order_id
              let order = data.filter(order=> order.id == orderId )
              if(order.length){
                order=order[0]
                transaction.customerName = order['billing_address']['first_name']+' ' + order['billing_address']['last_name']
                transaction.email = order['billing_address']['email']
              }

              return transaction

          })

          res.end(JSON.stringify({transactionData, fromOrders:orderIDs.length}));

        
        } catch (error) {
        
          console.error('Error fetching transactions:', error);
          res.end(JSON.stringify({transactionData:[], fromOrders:0}));
        
        }

      }else{

        res.end(JSON.stringify({transactionData:[], fromOrders:0}));

      }



    } catch (error) {
      // res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error: ' + error }));
    }
  } else {
    // res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }


    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}



