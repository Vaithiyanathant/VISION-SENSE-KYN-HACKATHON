import React, { useState } from 'react';
import useSensitiveContentDetection from '../utils.js'; // Adjust path as needed

const Test = () => {
    const [text, setText] = useState('');

    // In a real app, you should fetch this from a secure config source or use environment variables (at build time) - NEVER store directly in your components.
     const apiKey = 'AIzaSyAMWmhv-D0M_WnBCiuR1WYHhbg9rFTLOLY';

    const { isLoading, result, error, checkSensitiveContent } = useSensitiveContentDetection(apiKey);


    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleCheckContent = async () => {
        await checkSensitiveContent(text)
    }
    return (
        <div>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text to check"
                rows="5"
            />
            <br />
            <button onClick={handleCheckContent} disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Check Content'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && <p>Result: {result}</p>}
        </div>
    );
};

export default Test;