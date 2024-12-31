/** @format */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useCallback } from "react";
import axios from "axios";

// Helper function to convert an image file to Base64
const loadImageBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

// React hook for sensitive content detection
const useSensitiveContentDetection = (apiKey) => {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	// Function to check text content
	const checkSensitiveContent = useCallback(
		async (content) => {
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

				/*     const prompt = `Analyze the following text and Return only "Sensitive" if any of the above is found or "Not Sensitive" if the content does not contain any sensitive material for the presence of sensitive content such as:
            1. Violence or gore (e.g., blood, injury, death).
            2. Hate speech or discriminatory statements (e.g., based on race, religion, gender, etc.).
            3. Sexual content or explicit material (e.g., pornography, inappropriate nudity).
            4. Misinformation or harmful health advice (e.g., misleading medical claims, fake news).
            5. Harassment, bullying, or harmful behavior.
            6. Any content promoting illegal activities or violence.
            
            Content to analyze: \n\n${content}`;*/
				const prompt = `Analyze the following text and Return only "Sensitive" and also return the reason if any of the following is found or "Not Sensitive" if the content does not contain any sensitive material. The analysis must include checks for:

1. **Violence or Gore:**
   - Depictions of blood, injury, or death.
   - Content inciting violence or glorifying violent acts.

2. **Hate Speech or Discrimination:**
   - Statements based on race, religion, gender, or other protected categories.
   - Slurs, threats, or derogatory remarks targeting individuals or groups.

3. **Sexual Content or Explicit Material:**
   - Pornography, inappropriate nudity, or sexually suggestive content.
   - Grooming or exploitation involving minors.

4. **Misinformation or Harmful Advice:**
   - Misleading medical claims, fake news, or unverified information.
   - Harmful health advice or false political claims.

5. **Harassment, Bullying, or Harmful Behavior:**
   - Targeted harassment or bullying.
   - Content promoting self-harm or glorifying suicide.

6. **Illegal Activities or Promotion of Violence:**
   - Encouragement of criminal acts (e.g., drug use, tax evasion, hacking).
   - Incitement to riots, rebellion, or terrorism.

7. **Profanity and Offensive Language:**
   - Profane or vulgar language.
   - Racial slurs or offensive terms.

8. **Workplace Harassment or Misconduct:**
   - Discriminatory or unethical workplace behavior.
   - Inappropriate comments in a professional context.

9. **Substance Abuse Promotion:**
   - Encouraging illegal drug use or excessive alcohol consumption.
   - Sharing recipes or methods for illegal substances.

10. **Copyright or Intellectual Property Violations:**
    - Sharing or promoting unauthorized use of copyrighted material.
    - Encouraging plagiarism or bypassing intellectual property protections.

Content to analyze: \n\n${content}`;

				const result = await model.generateContent(prompt);
				const response = await result.response;
				const text = await response.text();

				setResult(text.trim());
			} catch (err) {
				setError(`Error during sensitive content analysis: ${err.message}`);
			} finally {
				setIsLoading(false);
			}
		},
		[apiKey]
	);

	// Function to check image or video content
	const checkSensitiveMedia = useCallback(async (file, mediaType) => {
		if (!file) {
			setError("No file provided for analysis.");
			return;
		}

		setIsLoading(true);
		setError(null);
		setResult(null);

		try {
			const base64 = await loadImageBase64(file);

			const url =
				mediaType === "video"
					? "https://example-video-analysis-api.com/analyze"
					: "https://detect.roboflow.com/explicit/1";

			const response = await axios({
				method: "POST",
				url: url,
				params: {
					api_key: "77NfUfT1hzpTIkkF3h3F",
				},
				data: base64,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			setResult(response.data);
		} catch (err) {
			setError(`Error during media analysis: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	}, []);
	console.log(result);
	return {
		isLoading,
		result,
		error,
		checkSensitiveContent,
		checkSensitiveMedia,
	};
};

export default useSensitiveContentDetection;
