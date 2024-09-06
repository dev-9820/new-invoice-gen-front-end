import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    seller: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      pan_no: "",
      gst_no: "",
    },
    billing: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      state_code: "",
    },
    shipping: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      state_code: "",
    },
    order: {
      order_no: "",
      order_date: "",
    },
    invoice: {
      invoice_no: "",
      invoice_date: "",
      reverse_charge: "No",
    },
    items: [
      {
        description: "",
        unit_price: 0,
        quantity: 1,
        discount: 0,
        tax_rate: 5.0,
      },
    ],
  });

  const handleChange = (e, section, field, index = null) => {
    const value = e.target.value;

    setFormData((prevState) => {
      if (index !== null) {
        const newItems = [...prevState.items];
        newItems[index][field] = value;
        return { ...prevState, items: newItems };
      }

      return {
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://new-invoice-gen.onrender.com/generate_invoice", formData, {
        responseType: "blob",
      });
      // Download the PDF file from the server response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf"); // Name of the PDF
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("There was an error generating the invoice!", error);
    }
  };

  return (
    <div className="App-header">
      <h1>Invoice Generator</h1>
      <form onSubmit={handleSubmit}>
        <h2>Seller Details</h2>
        <input
          type="text"
          placeholder="Seller Name"
          onChange={(e) => handleChange(e, "seller", "name")}
        />
        <input
          type="text"
          placeholder="Seller Address"
          onChange={(e) => handleChange(e, "seller", "address")}
        />
        <h2>Buyer Details</h2>
        <input
          type="text"
          placeholder="Buyer Name"
          onChange={(e) => handleChange(e, "billing", "name")}
        />
        <input
          type="text"
          placeholder="Buyer Address"
          onChange={(e) => handleChange(e, "billing", "address")}
        />

        <h2>Items</h2>
        {formData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Item Description"
              onChange={(e) => handleChange(e, "items", "description", index)}
            />
            <input
              type="number"
              placeholder="Unit Price"
              onChange={(e) => handleChange(e, "items", "unit_price", index)}
            />
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => handleChange(e, "items", "quantity", index)}
            />
            {/* Add other item fields like discount, tax rate, etc. */}
          </div>
        ))}

        <button type="submit">Generate Invoice</button>
      </form>
    </div>
  );
}

export default App;
