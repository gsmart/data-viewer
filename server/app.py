from flask import Flask, request, jsonify, Response
import tabula
import pandas as pd
import os
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "UP", "message": "Flask service is running"}), 200

@app.route('/convert', methods=['POST'])
def convert_pdf():
    
    # Check if the request has a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file to a temporary file
    temp_pdf_path = "temp.pdf"
    file.save(temp_pdf_path)

    try:
        # Convert PDF to list of DataFrames
        dfs = tabula.read_pdf(temp_pdf_path, pages='all', multiple_tables=True)

        # Combine all DataFrames into one
        combined_df = pd.concat(dfs, ignore_index=True)

        # Prepare JSON response
        json_data = combined_df.to_dict(orient='records')

        # Clean up temporary file
        os.remove(temp_pdf_path)

        # Return JSON response
        return jsonify({
            "json": {"data": json_data},
            "csv": combined_df.to_csv(index=False)  # CSV remains as a string in JSON
        })

    except Exception as e:
        os.remove(temp_pdf_path)
        return jsonify({"error": str(e)}), 500

@app.route('/convert_to_csv', methods=['POST'])
def convert_to_csv():
    pass
    # Check if the request has a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file to a temporary file
    temp_pdf_path = "temp.pdf"
    file.save(temp_pdf_path)

    try:
        # Convert PDF to list of DataFrames
        dfs = tabula.read_pdf(temp_pdf_path, pages='all', multiple_tables=True)

        # Combine all DataFrames into one
        combined_df = pd.concat(dfs, ignore_index=True)

        # Save the CSV to a buffer
        csv_buffer = io.StringIO()
        combined_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)

        # Clean up temporary file
        os.remove(temp_pdf_path)

        # Return CSV as a downloadable response
        return Response(
            csv_buffer.getvalue(),
            mimetype='text/csv',
            headers={
                "Content-Disposition": "attachment; filename=converted.csv"
            }
        )

    except Exception as e:
        os.remove(temp_pdf_path)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
