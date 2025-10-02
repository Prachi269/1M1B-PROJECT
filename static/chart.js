// Highlight wrong predictions
const wrongPoints = chartData.actual.map((val, idx) => val !== chartData.predicted[idx] ? chartData.predicted[idx] : null);

// Get canvas context
const ctxLine = document.getElementById('lineChart').getContext('2d');
const ctxBar = document.getElementById('barChart').getContext('2d');

// Line Chart for Actual vs Predicted
const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: chartData.timestamps,
        datasets: [
            { 
                label: 'Actual', 
                data: chartData.actual, 
                borderColor: 'green', 
                fill: false, 
                tension: 0.1 
            },
            { 
                label: 'Mispredicted', 
                data: wrongPoints, 
                borderColor: 'red', 
                backgroundColor: 'red', 
                showLine: false,
                pointRadius: 6 
            }
        ]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
            x: { display: true, title: { display: true, text: 'Timestamp' } },
            y: { display: true, title: { display: true, text: 'Value' }, min: 0, max: 1 }
        }
    }
});

// Bar Chart: Mispredictions per Interval
const intervalCounts = {};
chartData.timestamps.forEach((ts, idx) => {
    const timeKey = ts.slice(11,16); // "HH:MM" as interval
    if(chartData.actual[idx] !== chartData.predicted[idx]){
        intervalCounts[timeKey] = (intervalCounts[timeKey] || 0) + 1;
    }
});

const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: Object.keys(intervalCounts),
        datasets: [{
            label: 'Mispredictions',
            data: Object.values(intervalCounts),
            backgroundColor: 'orange'
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: true, title: { display: true, text: 'Time Interval (HH:MM)' } },
            y: { display: true, title: { display: true, text: 'Count of Mispredictions' }, beginAtZero: true }
        }
    }
});
