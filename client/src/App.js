import React, { useState } from "react";
import { HotTable } from "@handsontable/react";
// import Handsontable from "handsontable";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import "handsontable/dist/handsontable.full.css";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [textareaValue, setTextareaValue] = useState("");


  const validateTextareaContent = (content) => {
    if (!content.trim()) {
      setError("Textarea is empty. Please paste valid CSV content.");
      return false;
    }
    const rows = content.trim().split("\n");
    if (rows.length === 0 || !rows[0].includes(",")) {
      setError("Invalid CSV format. Ensure content has comma-separated values.");
      return false;
    }
    return true;
  };


  // Parse CSV from textarea
  const handleTextareaSubmit = () => {
    if (!validateTextareaContent(textareaValue)) {
      return;
    }

    try {
      const parsed = Papa.parse(textareaValue, { header: false });
      setData(parsed.data);
      setError("");
    } catch (err) {
      setError("Error parsing CSV from textarea. Please check your input.");
    }
  };

  // Parse CSV, XLS, XLSX, or PDF files
  const handleFileUpload = async (file) => {
    const maxRowCount = parseInt(process.env.REACT_APP_ROW_LIMIT, 10);
    const apiUrl = process.env.REACT_APP_PDF_API_URL;

    const validateRowCount = (parsedData) => {
      if (parsedData.length > maxRowCount) {
        setError(`The file contains more than ${maxRowCount} rows. Please upload a smaller file.`);
        return false;
      }
      return true;
    };


    if (file) {
      const fileType = file.name.split(".").pop().toLowerCase();

      if (fileType === "csv") {
        // Handle CSV files using Papa.parse
        Papa.parse(file, {
          complete: (result) => {
            if (validateRowCount(result.data)) {
              setData(result.data);
              setError("");
            }
          },
          error: () => setError("Error parsing CSV file. Please try again."),
        });
      } else if (fileType === "xls" || fileType === "xlsx") {
        // Handle XLS and XLSX files using XLSX library
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (validateRowCount(parsedData)) {
            setData(parsedData);
            setError("");
          }
        };
        reader.onerror = () =>
          setError("Error reading Excel file. Please try again.");
        reader.readAsArrayBuffer(file);
      } else if (fileType === "pdf") {
        // Handle PDF files by sending them to the Flask endpoint
        try {
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post(
            `${apiUrl}/convert_to_csv`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // Parse the returned CSV from the Flask server
          const csvContent = response.data;
          const parsedData = csvContent
            .trim()
            .split("\n")
            .map((row) => row.split(","));
          if (validateRowCount(parsedData)) {
            setData(parsedData);
            setError("");
          }
        } catch (err) {
          setError("Failed to process the PDF. Please try again.");
          console.error(err);
        }
      } else {
        setError("Unsupported file type. Please upload a CSV, XLS, XLSX, or PDF file.");
      }
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextareaValue(value);

    // Reset error and border when the textarea is empty or being corrected
    if (!value.trim() || validateTextareaContent(value)) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Excel/CSV Data Viewer
        </h1>
        <div className="flex flex-col gap-4">
          {/* Textarea Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Paste CSV Data
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              rows="5"
              placeholder="Paste your CSV here..."
              value={textareaValue}
              // onChange={(e) => setTextareaValue(e.target.value)}
              onChange={handleTextareaChange}
            />
            {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            <button
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              onClick={handleTextareaSubmit}
            >
              Process CSV
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload File (CSV, XLS, XLSX, PDF)
            </label>
            <input
              type="file"
              accept=".csv, .xls, .xlsx, .pdf"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded-full file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>

          
          

          {/* Handsontable Grid */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Data Grid
            </label>
            <div className="border rounded-lg overflow-hidden">
              <HotTable
                data={data}
                colHeaders={data[0] || []} // Use the first row as headers
                rowHeaders={true}
                width="100%"
                height="300"
                licenseKey="non-commercial-and-evaluation" // Required for Handsontable
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
