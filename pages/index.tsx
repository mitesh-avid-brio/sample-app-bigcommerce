import { useEffect, useState } from 'react';
import { Panel, Table, Button, Text, Box, ProgressBar, Modal,Radio, Form,FormGroup, Input, InputProps  } from '@bigcommerce/big-design';

import{ ChevronRightIcon , ChevronLeftIcon,FilterListIcon  } from  '@bigcommerce/big-design-icons'
// const baseURL = "https://stellular-naiad-f9e846.netlify.app"
// const baseURL = "http://localhost:3000"

function dateFunction(dateInput){ 
// Input date string
let inputDateStr = dateInput;
// Create a Date object from the input date string
let inputDate = new Date(inputDateStr);
// Format the Date object into RFC-2822 format
let rfc2822Date = inputDate.toUTCString();
console.log(rfc2822Date);
  return rfc2822Date;
}


//hello
const transactionsPage = () => {
	const [transactions, setTransactions] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [fromOrders, setFromOrders] = useState(-1)
	const [isLoading, setIsLoading] = useState(true)
	const [isOpen, setIsOpen] = useState(false);
	const [finalSearchQuery, setFinalSearchQuery] = useState('')
	const [queryValue, setQueryValue] = useState('')
	
	const [selected, setSelected] = useState('min_order_id');
	
	const [finalSelected, setFinalSelected] = useState('');
	
	const handleChange: InputProps['onChange'] = (event) =>{
		setSelected(event.target.value);
	}
	
	
	const fetchTransactions = async () => {
		try {
			
			setIsLoading(true)
			
			let url = `/api/transactions?page=${currentPage}`
			
			if(queryValue.length){
				
				url+=`&selected=${selected}&queryValue=${queryValue}`
				
			}
			console.log(url)
			
			const response = await fetch(url);
			
			if (!response.ok) {
				throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
			}			
			
			let fetchedData = await response.json();
			console.log('fetchedData', fetchedData)
			let transactionData  = fetchedData.transactionData
			setTransactions(transactionData);
			setFromOrders(parseInt(fetchedData.fromOrders))
			setIsLoading(false)
		} catch (error) {
			console.error('Error fetching transactions:', error);
		}
	};
	
	useEffect(() => {
		fetchTransactions();
	}, [currentPage, finalSearchQuery, finalSelected]);
	
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
		
		{isLoading && (
			<>
			<div  style={{position:"fixed", backgroundColor:"white", top: "0px", zIndex: 9999, width:"100%", marginBottom:"20px"}}>
			<Box marginVertical="large">
			<ProgressBar />
			</Box>
			</div>
			</>
			)} 
			
			{ fromOrders !== -1 && (	
				
				<Panel
				header="Order Transaction Details"
				>
				<div className='filterBox'>
					<Button variant="utility" onClick={() => setIsOpen(true)} className="sortPopUp">
					<FilterListIcon/>
					</Button>
				</div>
				
				{queryValue.length ? (
					<div>
					<Button variant="utility" onClick={() => {setQueryValue('');setFinalSearchQuery('')}}>
					<Text>{selected}:{queryValue}</Text>
					</Button>
					</div>
					):''}
					
					<Modal
					actions={[
						{
							text: 'Cancel',
							variant: 'subtle',
							onClick: () => setIsOpen(false),
						},
						{ text: 'Apply', onClick: () => {setIsOpen(false);setFinalSelected(selected); setCurrentPage(1); setFinalSearchQuery(queryValue) }},
					]}
					closeOnClickOutside={false}
					closeOnEscKey={true}
					header="Filter By"
					isOpen={isOpen}
					onClose={() => {setIsOpen(false)}}
					>
					
					
					<div>
					<div className="radioWrapper">
						<Radio
						checked={selected === 'min_order_id'}
						label="Minimum Order ID"
						onChange={handleChange}
						value="min_order_id"
						className='radioBtns'
						style={{marginBottom:"30px"}}
						/>
					</div>
					
					<div className="radioWrapper">
						<Radio
						checked={selected === 'max_order_id'}
						label="Maximum Order ID"
						onChange={handleChange}
						value="max_order_id"
						className='radioBtns'
						style={{marginBottom:"30px"}}
						/>
					</div>
					<div className="radioWrapper">
						<Radio
						checked={selected === 'customer_email'}
						label="Customer Email"
						onChange={handleChange}
						value="customer_email"
						className='radioBtns'
						style={{marginBottom:"30px"}}
						/>
					</div>
					<Input
					onChange={(event)=>setQueryValue(event.target.value) }
					placeholder="Query"
					type="text"
					value={queryValue}
					/>
					
					</div>
					
					
					</Modal>
					
					{transactions.length?(
						<div className="scrollableTable">
							<div className="tableWrapper">
								<Table
								columns={[
									{
									header: 'Order ID', hash: 'order_id', render: ({ order_id }) => order_id
									},	
									{  header: 'Date Created', hash: 'date_created', render: ({ date_created }) => dateFunction(date_created).replace("GMT", "")
									},	
									{  header: 'Email', hash: 'email', render: ({ email }) => email
									},	
									{  header: 'Customer Name', hash: 'customerName', render: ({ customerName }) => customerName
									},	
									{  header: 'Amount', hash: 'amount', render: ({ amount }) => `$${amount}`
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
							</div>
					</div>):''}


{!isLoading && (
	<div style={{margin:"20px",display:"flex", alignItems:"center", justifyContent:"center"}}>
	<Button variant="utility"  onClick={handlePreviousPage} disabled={currentPage === 1}>
	<ChevronLeftIcon/>
	</Button>
	<Button variant="utility">Page {currentPage}</Button>
	<Button variant="utility" onClick={handleNextPage} disabled={fromOrders < 50}>
	<ChevronRightIcon  />
	</Button>
	</div>
	)} 
	
	</Panel>
	
	)}
	
	
	</div>
	);
};

export default transactionsPage;
