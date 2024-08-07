// src/App.js

import React, { useState } from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Sample initial data
const initialData = {
  from: {
    company: "Consultination LLC",
    address: "3700 Massachusetts Avenue Northwest, Washington, DC 20016 US",
    phone: "+1 202 914 9038",
    email: "info@consultination.co",
  },
  invoiceNumber: "20221053",
  date: "25-October-2022",
  workOrder: "WO#220422379",
  purchaseOrder: "PO# 885731-01",
  attention: "M. Kouskoutis",
  serviceDate: "10/22/2022",
  orderDate: "10/21/2022",
  jobDescription: "empty water reservoir from 6 gallon water and replace the part in the water meter",
  items: [
    { description: "Trip charge + 1 hourly rate", quantity: 1, unitPrice: 350.0 },
  ],
  taxRate: 0.07, // 7% tax rate
  to: {
    company: "MaintenX International",
    address: "2202 N Howard Ave, Tampa, FL 33607",
    phone: "+ 855-751-0075",
    email: "xvendorinv@maintenx.com",
  },
  serviceLocation: {
    company: "GAMESTOP Location:2729",
    address: "281 PREMIER BLVD, ROANOKE, NC 27870",
    phone: "2525378392",
  },
  paymentTerms: "to be received within 60 days on account ending xxxxxx7010",
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
});

// Create Document Component
const Invoice = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * data.taxRate;
  const total = subtotal + tax;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text>From: {data.from.company}</Text>
          <Text>{data.from.address}</Text>
          <Text>PH: {data.from.phone}</Text>
          <Text>{data.from.email}</Text>
        </View>
        <View style={styles.header}>
          <Text>INVOICE: {data.invoiceNumber}</Text>
          <Text>Date: {data.date}</Text>
          <Text>WO#: {data.workOrder}</Text>
          <Text>PO#: {data.purchaseOrder}</Text>
          <Text>Att: {data.attention}</Text>
        </View>
        <View style={styles.section}>
          <Text>SERVICE DATE: {data.serviceDate}</Text>
          <Text>ORDER DATE: {data.orderDate}</Text>
          <Text>Job description: {data.jobDescription}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>#</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Item Description</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Quantity</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Unit price ($)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total ($)</Text>
            </View>
          </View>
          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.unitPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{(item.quantity * item.unitPrice).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>Tax: ${tax.toFixed(2)}</Text>
          <Text>Total: ${total.toFixed(2)}</Text>
        </View>
        <View style={styles.section}>
          <Text>To: {data.to.company}</Text>
          <Text>{data.to.address}</Text>
          <Text>PH: {data.to.phone}</Text>
          <Text>{data.to.email}</Text>
        </View>
        <View style={styles.section}>
          <Text>Service Location:</Text>
          <Text>{data.serviceLocation.company}</Text>
          <Text>{data.serviceLocation.address}</Text>
          <Text>Phone: {data.serviceLocation.phone}</Text>
        </View>
        <View style={styles.section}>
          <Text>Payment terms: {data.paymentTerms}</Text>
        </View>
      </Page>
    </Document>
  );
};

const App = () => {
  const [invoiceData, setInvoiceData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    items[index][name] = value;
    setInvoiceData((prevData) => ({
      ...prevData,
      items,
    }));
  };

  const handleAddItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { description: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    const items = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prevData) => ({
      ...prevData,
      items,
    }));
  };

  return (
    <div>
      <h1>Invoice Generator</h1>
      <form>
        <h2>From</h2>
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={invoiceData.from.company}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={invoiceData.from.address}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={invoiceData.from.phone}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={invoiceData.from.email}
          onChange={(e) => handleChange(e)}
        />

        <h2>Invoice Details</h2>
        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={invoiceData.invoiceNumber}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={invoiceData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="workOrder"
          placeholder="Work Order"
          value={invoiceData.workOrder}
          onChange={handleChange}
        />
        <input
          type="text"
          name="purchaseOrder"
          placeholder="Purchase Order"
          value={invoiceData.purchaseOrder}
          onChange={handleChange}
        />
        <input
          type="text"
          name="attention"
          placeholder="Attention"
          value={invoiceData.attention}
          onChange={handleChange}
        />

        <h2>Service Details</h2>
        <input
          type="date"
          name="serviceDate"
          value={invoiceData.serviceDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="orderDate"
          value={invoiceData.orderDate}
          onChange={handleChange}
        />
        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={invoiceData.jobDescription}
          onChange={handleChange}
        />

        <h2>Items</h2>
        {invoiceData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="unitPrice"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, e)}
            />
            <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>

        <h2>To</h2>
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={invoiceData.to.company}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={invoiceData.to.address}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={invoiceData.to.phone}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={invoiceData.to.email}
          onChange={(e) => handleChange(e)}
        />

        <h2>Service Location</h2>
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={invoiceData.serviceLocation.company}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={invoiceData.serviceLocation.address}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={invoiceData.serviceLocation.phone}
          onChange={(e) => handleChange(e)}
        />

        <h2>Payment Terms</h2>
        <input
          type="text"
          name="paymentTerms"
          placeholder="Payment Terms"
          value={invoiceData.paymentTerms}
          onChange={(e) => handleChange(e)}
        />

        <h2>Tax Rate</h2>
        <input
          type="number"
          name="taxRate"
          placeholder="Tax Rate"
          value={invoiceData.taxRate}
          onChange={(e) => handleChange(e)}
        />
      </form>

      <PDFDownloadLink document={<Invoice data={invoiceData} />} fileName="invoice.pdf">
        {({ loading }) => (loading ? "Loading document..." : "Download Invoice")}
      </PDFDownloadLink>
    </div>
  );
};

export default App;
