from flask import Flask, request, jsonify, Response
import tabula
import pandas as pd
import os
import io
from flask_cors import CORS
import subprocess
import sys

app = Flask(__name__)
CORS(app)


@app.route('/debug', methods=['GET'])
def debug_info():
    try:
        # Check Python version
        python_version = sys.version

        # Check if Java is installed
        java_check = subprocess.run(['java', '-version'], capture_output=True, text=True)
        java_version = java_check.stderr if java_check.returncode == 0 else "Java not installed"

        # Check installed Python packages
        installed_packages = subprocess.run(['pip', 'freeze'], capture_output=True, text=True).stdout

        return jsonify({
            "python_version": python_version,
            "java_version": java_version,
            "installed_packages": installed_packages
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Hello from Flask on Vercel!"

@app.route('/convert', methods=['POST'])
def convert_pdf():
    # Check if the request has a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    temp_pdf_path = "temp.pdf"
    file.save(temp_pdf_path)

    try:
        dfs = tabula.read_pdf(temp_pdf_path, pages='all', multiple_tables=True)
        combined_df = pd.concat(dfs, ignore_index=True)
        json_data = combined_df.to_dict(orient='records')
        os.remove(temp_pdf_path)

        return jsonify({
            "json": {"data": json_data},
            "csv": combined_df.to_csv(index=False)
        })

    except Exception as e:
        os.remove(temp_pdf_path)
        return jsonify({"error": str(e)}), 500

@app.route('/convert_to_csv', methods=['POST'])
def convert_to_csv():
    # Check if the request has a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    temp_pdf_path = "temp.pdf"
    file.save(temp_pdf_path)

    try:
        dfs = tabula.read_pdf(temp_pdf_path, pages='all', multiple_tables=True)
        combined_df = pd.concat(dfs, ignore_index=True)
        csv_buffer = io.StringIO()
        combined_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        os.remove(temp_pdf_path)

        return Response(
            csv_buffer.getvalue(),
            mimetype='text/csv',
            headers={"Content-Disposition": "attachment; filename=converted.csv"}
        )

    except Exception as e:
        os.remove(temp_pdf_path)
        return jsonify({"error": str(e)}), 500

# Expose the Flask app as `application` for Vercel
application = app

if __name__ == '__main__':
    app.run(debug=True)
