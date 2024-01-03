import { useEffect, useState } from 'react';

// const baseURL = "https://stellular-naiad-f9e846.netlify.app"
const baseURL = "http://localhost:3000"


//hello
const transactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromOrders, setFromOrders] = useState(0)

  const fetchTransactions = async (page) => {
    try {
      const response = await fetch(`${baseURL}/api/transactions?page=${page}`);

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
	          <th>Transaction ID</th>
	          <th>Order ID</th>
	          <th>Event</th>
	          <th>Method</th>
	          <th>Amount</th>
	          <th>Currency</th>
	          <th>Gateway</th>
	          <th>Payment Method ID</th>
	          <th>Status</th>
	          <th>Test</th>
	          <th>Fraud Review</th>
	          <th>Reference Transaction ID</th>
	          <th>Date Created</th>
	          <th>AVS Result</th>
	          <th>CVV Result</th>
	          <th>Card Type</th>
	          <th>Card Last 4</th>
	          <th>Card Expiry Month</th>
	          <th>Card Expiry Year</th>
	        </tr>
	      </thead>
	      <tbody>
	        {transactions.map(transaction => (
	          <tr key={transaction.id}>
	            <td>{transaction.id}</td>
	            <td>{transaction.order_id}</td>
	            <td>{transaction.event}</td>
	            <td>{transaction.method}</td>
	            <td>{transaction.amount}</td>
	            <td>{transaction.currency}</td>
	            <td>{transaction.gateway}</td>
	            <td>{transaction.payment_method_id}</td>
	            <td>{transaction.status}</td>
	            <td>{transaction.test ? 'True' : 'False'}</td>
	            <td>{transaction.fraud_review ? 'True' : 'False'}</td>
	            <td>{transaction.reference_transaction_id}</td>
	            <td>{transaction.date_created}</td>
	            <td>{transaction.avs_result.message}</td>
	            <td>{transaction.cvv_result.message}</td>
	            <td>{transaction.credit_card?.card_type }</td>
	            <td>{transaction.credit_card?.card_last4 }</td>
	            <td>{transaction.credit_card?.card_expiry_month }</td>
	            <td>{transaction.credit_card?.card_expiry_year }</td>
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
