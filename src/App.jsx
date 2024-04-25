import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EditModal from './components/navbar/EditModal';
import Navbar from './components/navbar';


function App() {
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const [submittedData, setSubmittedData] = useState(() => {
    const storedData = localStorage.getItem('submittedData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [formData, setFormData] = useState({
    month: '',
    type: 'Income',
    amount: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('submittedData', JSON.stringify(submittedData));
  }, [submittedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingMonthIndex = submittedData.findIndex(item => item.month === formData.month);

    if (existingMonthIndex !== -1) {
      const updatedData = [...submittedData];
      updatedData[existingMonthIndex].data.push({
        type: formData.type,
        amount: formData.amount,
        description: formData.description
      });
      setSubmittedData(updatedData);
    } else {
      const newData = [...submittedData, {
        month: formData.month,
        data: [{
          type: formData.type,
          amount: formData.amount,
          description: formData.description
        }]
      }];
      setSubmittedData(newData);
    }
    setFormData({
      month: '',
      type: 'Income',
      amount: '',
      description: ''
    });
  };

  const handleClearStorage = () => {
    localStorage.removeItem('submittedData');
    setSubmittedData([]);
  };

  const handleRemoveEntry = (monthIndex, dataIndex) => {
    const updatedData = [...submittedData];
    updatedData[monthIndex].data.splice(dataIndex, 1);
    setSubmittedData(updatedData);
  };

  const calculateTotal = (data, type) => {
    return data.reduce((total, item) => {
      if (item.type === type) {
        return total + parseFloat(item.amount);
      }
      return total;
    }, 0);
  };

  return (
    <>
    <Navbar/>
    <div>
      <form onSubmit={handleSubmit} className="bg-[#161b22] max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="month" className="block text-white text-sm font-bold mb-2">Month:</label>
          <select id="month" name="month" value={formData.month} onChange={handleChange} className="bg-[#1b2026] shadow appearance-none rounded w-full py-2 px-3 text-gray-400 border border-slate-700 focus:outline-none">
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-white text-sm font-bold mb-2">Type:</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} className="bg-[#1b2026] shadow appearance-none rounded w-full py-2 px-3 text-gray-400 border border-slate-700 focus:outline-none">
            <option value="Income">Income</option>
            <option value="Expenses">Expenses</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-white text-sm font-bold mb-2">Amount:</label>
          <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="bg-[#1b2026] shadow appearance-none rounded w-full py-2 px-3 text-gray-400 border border-slate-700 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-white text-sm font-bold mb-2">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-[#1b2026] shadow appearance-none rounded w-full py-2 px-3 text-gray-400 border border-slate-700 focus:outline-none" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
      </form>

      <div className='w-full flex justify-center '>
        <div className='w-10/12 bg-[#161b22]'>
        <h2 className="text-xl text-white p-8 font-bold mb-2">My Profit:</h2>
        {months.map((month, monthIndex) => {
            const monthData = submittedData.find(item => item.month === month);
            if (!monthData) return null;

            const incomeTotal = calculateTotal(monthData.data, 'Income');
            const expensesTotal = calculateTotal(monthData.data, 'Expenses');
            const netIncome = incomeTotal - expensesTotal;

            return (
              <div key={monthIndex} className=" rounded p-4 mb-2 bg-[#161b22] border border-gray-500 mx-8">
                <h2 className="text-xl text-slate-400 font-bold">{month}</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
                {monthData.data.map((data, dataIndex) => (
                  
                    <div key={dataIndex} className="grid-items bg-[#1b2026] border border-gray-700 rounded shadow-xl p-4 ml-4 mt-2">
                      <p className='text-blue-50'><strong>Type:</strong> {data.type}</p>
                      <p className='text-blue-50'><strong>Amount:</strong> {data.amount}</p>
                      <p className='text-blue-50'><strong>Description:</strong> {data.description}</p>
                      <button onClick={() => handleRemoveEntry(monthIndex, dataIndex)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-1">Remove</button>
                    </div>
                ))}
                </div>
                <div className="ml-4 mt-2 flex justify-end flex-col items-end">
                  <p className='text-lime-600'><strong>Total Income:</strong> {incomeTotal}</p>
                  <p className='text-red-600'><strong>Total Expenses:</strong> {expensesTotal}</p>
                  <p className='text-lime-500'><strong>Profit:</strong> {netIncome}</p>
                </div>
              </div>
            );
          })}
      </div>
      </div>
      <button onClick={handleClearStorage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
        Delete Local Storage
      </button>
    </div>
    </>
  )
}


export default App
