from flask import Flask, request, render_template, redirect, url_for
import pandas as pd
import json

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def dashboard():
    chart_data = {
        'line': {'labels': [], 'datasets': [
            {'label': 'Actual', 'data': [], 'borderColor': 'rgba(255,165,0,1)','backgroundColor':'rgba(255,165,0,0.2)'},
            {'label': 'Predicted', 'data': [], 'borderColor': 'rgba(46,139,87,1)','backgroundColor':'rgba(46,139,87,0.2)'}
        ]},
        'bar': {'labels': [], 'datasets': [
            {'label': 'Mispredictions', 'data': [], 'backgroundColor': 'rgba(255,99,132,0.6)'}
        ]}
    }
    accuracy = None

    if request.method == 'POST':
        file = request.files['csv_file']
        if file:
            df = pd.read_csv(file)
            
            # Ensure required columns exist
            if all(col in df.columns for col in ['Timestamp','Actual','Predicted']):
                # Line chart
                chart_data['line']['labels'] = df['Timestamp'].tolist()
                chart_data['line']['datasets'][0]['data'] = df['Actual'].tolist()
                chart_data['line']['datasets'][1]['data'] = df['Predicted'].tolist()

                # Bar chart: mispredictions
                mispred = (df['Actual'] != df['Predicted']).astype(int)
                chart_data['bar']['labels'] = df['Timestamp'].tolist()
                chart_data['bar']['datasets'][0]['data'] = mispred.tolist()

                # Accuracy
                accuracy = f"{round(100*(df['Actual'] == df['Predicted']).mean(), 2)}%"
            else:
                accuracy = "CSV must have 'Timestamp','Actual','Predicted' columns"

    return render_template('index.html', chart_data=json.dumps(chart_data), accuracy=accuracy)

if __name__ == '__main__':
    app.run(debug=True)
