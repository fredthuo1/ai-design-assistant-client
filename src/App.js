import React, { useState } from 'react';
import { getSuggestions } from './api/api';
import './App.css';

function App() {
    const [design, setDesign] = useState('');
    const [context, setContext] = useState('');
    const [suggestions, setSuggestions] = useState({});
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('quick');  // Default to Quick Suggestion Mode
    const [collapsed, setCollapsed] = useState({});

    const handleInputChange = (e) => {
        setDesign(e.target.value);
    };

    const handleContextChange = (e) => {
        setContext(e.target.value);
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleGetSuggestions = async () => {
        setLoading(true);
        try {
            const response = await getSuggestions({ design, context, mode });
            console.log("Response from backend:", response.data);
            setSuggestions(response.data);

            // Initialize collapsed state for each suggestion section
            const initialCollapsedState = {};
            Object.keys(response.data).forEach(key => {
                initialCollapsedState[key] = true;
            });
            setCollapsed(initialCollapsedState);

        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
        setLoading(false);
    };

    const toggleCollapse = (section) => {
        setCollapsed(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    console.log("Current suggestions state:", suggestions);

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
                <textarea
                    value={context}
                    onChange={handleContextChange}
                    placeholder="Add context (e.g., target audience, branding guidelines)..."
                    style={{ marginTop: '10px' }}
                />
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="mode">Select Suggestion Mode:</label>
                    <select id="mode" value={mode} onChange={handleModeChange}>
                        <option value="quick">Quick Suggestions</option>
                        <option value="in-depth">In-Depth Analysis</option>
                    </select>
                </div>
                <button onClick={handleGetSuggestions} disabled={loading}>
                    Get Suggestions
                    {loading && <div className="spinner"></div>}
                </button>
                {!loading && Object.keys(suggestions).length > 0 && (
                    <div className="suggestions">
                        {Object.entries(suggestions).map(([section, details], index) => (
                            <div key={index} className="suggestion-group">
                                <h2 className="suggestion-title" onClick={() => toggleCollapse(section)}>
                                    <span className="icon-colored">📝</span>{section}
                                    <span className={`toggle-icon ${collapsed[section] ? '' : 'collapsed'}`}>
                                        &#9654;
                                    </span>
                                </h2>
                                <div className={`collapse-content ${collapsed[section] ? '' : 'show'}`}>
                                    <div className="suggestion-detail">
                                        {details.map((detail, i) => (
                                            <p key={i}>{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
