import { useEffect, useState } from 'react';
import { Panel, Table, Button, Text, Box, ProgressBar } from '@bigcommerce/big-design';

import{ ChevronRightIcon , ChevronLeftIcon } from  '@bigcommerce/big-design-icons'
// const baseURL = "https://stellular-naiad-f9e846.netlify.app"
// const baseURL = "http://localhost:3000"


//hello
const transactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromOrders, setFromOrders] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTransactions = async (page) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/transactions?page=${page}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }

      let fetchedData = await response.json();
      let transactionData  = fetchedData.transactionData
      setTransactions(transactionData);
      setFromOrders(parseInt(fetchedData.fromOrders))
      setIsLoading(false)
      console.log(fetchedData)
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

	const handleNextPage = () => {
	  if (fromOrders === 50) {
	    setCurrentPage(currentPage + 1);
	  }
	};


  return (
    <div>

      {isLoading ? (
        <Box marginVertical="large">
          <ProgressBar />
        </Box>
      ) : (


				<Panel
				  header="Order Transaction Details"
				>
					<Table
					  columns={[
					    {
					      header: 'Order ID', hash: 'order_id', render: ({ order_id }) => order_id
					    },	
					    {  header: 'Date Created', hash: 'date_created', render: ({ date_created }) => date_created
					    },	
					    {  header: 'Email', hash: 'email', render: ({ email }) => email
					    },	
					    {  header: 'Customer Name', hash: 'customerName', render: ({ customerName }) => customerName
					    },	
					    {  header: 'Amount', hash: 'amount', render: ({ amount }) => amount
					    },	
					    {  header: 'Transaction ID', hash: 'id', render: ({ id }) => id
					    },	
					    {  header: 'Method', hash: 'method', render: ({ method }) => method
					    },	
					    {  header: 'Gateway', hash: 'gateway', render: ({ gateway }) => gateway
					    },	
					    {  header: 'Card Type', hash: 'credit_card', render: ({ credit_card }) => credit_card?.card_type
					    },	
					    {  header: 'AVS Result', hash: 'avs_result', render: ({ avs_result }) => avs_result.message
					    }	
					    
					  ]}
					  items={transactions}
					  stickyHeader
					/>
		      <div style={{margin:"20px",display:"flex", alignItems:"center", justifyContent:"center"}}>
		        <Button variant="utility"  onClick={handlePreviousPage} disabled={currentPage === 1}>
		          <ChevronLeftIcon/>
		        </Button>
	  				<Button variant="utility">Page {currentPage}</Button>
	  				<Button variant="utility" onClick={handleNextPage} disabled={fromOrders < 50}>
		          <ChevronRightIcon  />
	  				</Button>
		      </div>
				</Panel>

      )}

		</div>
  );
};

export default transactionsPage;
