import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useCallback } from 'react';

const useSensitiveContentDetection = (apiKey) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const checkSensitiveContent = useCallback(async (content) => {
        if (!apiKey) {
          setError("API key is missing. Please provide the API key");
          return;
        }
        if (!content) {
            setResult(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Analyze the following text for the presence of sensitive content such as:
            1. Violence or gore (e.g., blood, injury, death).
            2. Hate speech or discriminatory statements (e.g., based on race, religion, gender, etc.).
            3. Sexual content or explicit material (e.g., pornography, inappropriate nudity).
            4. Misinformation or harmful health advice (e.g., misleading medical claims, fake news).
            5. Harassment, bullying, or harmful behavior.
            6. Any content promoting illegal activities or violence.
            Return only "Sensitive" if any of the above is found or "Not Sensitive" if the content does not contain any sensitive material.

            Content to analyze: \n\n${content}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setResult(text.trim());

        } catch (err) {
            setError(`Error during sensitive content analysis: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);
    console.log(result);
    return { isLoading, result, error, checkSensitiveContent };
};

export default useSensitiveContentDetection;


