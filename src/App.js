import React, { useState } from 'react';
import { getSuggestions } from './api/api';
import './App.css';

function App() {
    const [design, setDesign] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setDesign(e.target.value);
    };

    const handleGetSuggestions = async () => {
        setLoading(true);
        const response = await getSuggestions({ design });
        setSuggestions(response.data);
        setLoading(false);
    };

    return (
        <div className="App">
            <div className="header">
                <h1>AI Design Assistant</h1>
                <p>Enhance your designs with AI suggestions</p>
            </div>
            <div className="container">
                <textarea
                    value={design}
                    onChange={handleInputChange}
                    placeholder="Paste your design data here..."
                />
                <button onClick={handleGetSuggestions} disabled={loading}>
                    Get Suggestions
                    {loading && <div className="spinner"></div>}
                </button>
                <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div className="suggestion" key={index}>
                            <span className="suggestion-icon">&#128396;</span>
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
