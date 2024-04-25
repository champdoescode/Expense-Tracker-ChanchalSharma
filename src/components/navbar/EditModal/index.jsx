import React from 'react'

const EditModal = ({ transaction, onClose, onSubmit }) => {
    const [editedType, setEditedType] = useState(transaction.type);
    const [editedAmount, setEditedAmount] = useState(transaction.amount);
    const [editedText, setEditedText] = useState(transaction.text);
  
    const handleTypeChange = (e) => {
      setEditedType(e.target.value);
    };
  
    const handleAmountChange = (e) => {
      setEditedAmount(e.target.value);
    };
  
    const handleTextChange = (e) => {
      setEditedText(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedTransaction = {
        ...transaction,
        type: editedType,
        amount: parseFloat(editedAmount),
        text: editedText
      };
      onSubmit(updatedTransaction);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 w-96 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Edit Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="type" className="mr-2">
                Type:
              </label>
              <select
                id="type"
                value={editedType}
                onChange={handleTypeChange}
                className="border p-2"
              >
                <option value="income">Income</option>
                <option value="expenses">Expenses</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="mr-2">
                Amount:
              </label>
              <input
                type="number"
                id="amount"
                value={editedAmount}
                onChange={handleAmountChange}
                className="border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="text" className="mr-2">
                Text:
              </label>
              <input
                type="text"
                id="text"
                value={editedText}
                onChange={handleTextChange}
                className="border p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mr-2"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default EditModal