import { useEffect, useState } from 'react';

// const baseURL = "https://stellular-naiad-f9e846.netlify.app"
// const baseURL = "http://localhost:3000"


//hello
const transactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromOrders, setFromOrders] = useState(0)

  const fetchTransactions = async (page) => {
    try {
      const response = await fetch(`/api/transactions?page=${page}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }

      let fetchedData = await response.json();
      let transactionData  = fetchedData.transactionData
      setTransactions(transactionData);
      setFromOrders(parseInt(fetchedData.fromOrders))
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
      <h1>transactions</h1>
	    <table>
	      <thead>
	        <tr>
	        	<th>Order ID</th>
	          <th>Date Created</th>
	          <th>Email</th>
	          <th>Customer Name</th>
	          <th>Amount</th>
	          <th>Transaction ID</th>
	          <th>Method</th>
	          <th>Gateway</th>
	          <th>Card Type</th>
	          <th>AVS Result</th>
	        </tr>
	      </thead>
	      <tbody>
	        {transactions.map(transaction => (
	          <tr key={transaction.id}>
	          	<td>{transaction.order_id}</td>
	            <td>{transaction.date_created}</td>
	            <td>{transaction?.email}</td>
	            <td>{transaction?.customerName}</td>
	            <td>{transaction.amount}</td>
	            <td>{transaction.id}</td>
	            <td>{transaction.method}</td>
	            <td>{transaction.gateway}</td>
	            <td>{transaction.credit_card?.card_type }</td>
	            <td>{transaction.avs_result.message}</td>
	          </tr>
	        ))}
	      </tbody>
	    </table>
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={handleNextPage} disabled={fromOrders < 50}>
          Next
        </button>
      </div>
    </div>
  );
};

export default transactionsPage;
