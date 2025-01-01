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
			const prompt = `Analyze the following text and respond in the same language as the provided content. If the content is in English, return the result in English. If the content is in Tamil, return the result in Tamil. Analyze the content and respond as either "Sensitive" along with the reason or "Not Sensitive" if no sensitive material is found. The analysis must include checks for:

1. **Violence or Gore**:
   - Depictions of blood, injury, or death.
   - Content inciting violence or glorifying violent acts.

2. **Hate Speech or Discrimination**:
   - Statements based on race, religion, gender, or other protected categories.
   - Slurs, threats, or derogatory remarks targeting individuals or groups.

3. **Sexual Content or Explicit Material**:
   - Pornography, inappropriate nudity, or sexually suggestive content.
   - Grooming or exploitation involving minors.

4. **Misinformation or Harmful Advice**:
   - Misleading medical claims, fake news, or unverified information.
   - Harmful health advice or false political claims.

5. **Harassment, Bullying, or Harmful Behavior**:
   - Targeted harassment or bullying.
   - Content promoting self-harm or glorifying suicide.

6. **Illegal Activities or Promotion of Violence**:
   - Encouragement of criminal acts (e.g., drug use, tax evasion, hacking).
   - Incitement to riots, rebellion, or terrorism.

7. **Profanity and Offensive Language**:
   - Profane or vulgar language.
   - Racial slurs or offensive terms.

8. **Workplace Harassment or Misconduct**:
   - Discriminatory or unethical workplace behavior.
   - Inappropriate comments in a professional context.

9. **Substance Abuse Promotion**:
   - Encouraging illegal drug use or excessive alcohol consumption.
   - Sharing recipes or methods for illegal substances.

10. **Copyright or Intellectual Property Violations**:
    - Sharing or promoting unauthorized use of copyrighted material.
    - Encouraging plagiarism or bypassing intellectual property protections.

**If Tamil Content is Provided**:
கீழே உள்ள உரையை பகுப்பாய்வு செய்து, அதே மொழியில் பதிலளிக்கவும். எது "Sensitive" என்று கண்டறிந்து அதன் காரணத்துடன் திருப்பிக்கொடுக்கவும். எந்த சந்தேகமான உள்ளடக்கமும் இல்லையெனில் "Not Sensitive" என்று திருப்பிக்கொடுக்கவும். பகுப்பாய்வு பின்வரும் விசாரணைகளைச் சேர்ந்ததாக இருக்க வேண்டும்:

1. **வன்முறை அல்லது குரோதம்**:
   - ரத்தம், காயம் அல்லது இறப்பின் விவரங்கள்.
   - வன்முறையை தூண்டும் அல்லது வன்முறையை போற்றும் உள்ளடக்கம்.

2. **வெறுப்புரை அல்லது பாகுபாடு**:
   - ஜாதி, மதம், பாலினம் அல்லது பிற பாதுகாக்கப்பட்ட பிரிவுகளை அடிப்படையாகக் கொண்ட கருத்துகள்.
   - கோர்மொழிகள், மிரட்டல்கள் அல்லது இழிவான வார்த்தைகள்.

3. **காமப்பொருள் அல்லது அநாகரிக உள்ளடக்கம்**:
   - நிர்வாணம், காமத்துக்கு உட்பட்ட உள்ளடக்கம் அல்லது பாலியல் பரிந்துரை.
   - சிறார்கள் தொடர்பான சுரண்டல் அல்லது ஒழுக்கமற்ற நடத்தை.

4. **தவறான தகவல் அல்லது சேதப்படுத்தும் ஆலோசனை**:
   - தவறான மருத்துவக் கூற்றுகள், பொய்யான செய்தி அல்லது சரிபார்க்கப்படாத தகவல்.
   - தீங்கு விளைவிக்கும் சுகாதார ஆலோசனை அல்லது பொய்யான அரசியல் கூற்றுகள்.

5. **துன்புறுத்தல், கொடுமைப்படுத்தல் அல்லது தீங்கு விளைவிக்கும் நடத்தை**:
   - இலக்கு வைத்துத் துன்புறுத்தல் அல்லது கொடுமைப்படுத்தல்.
   - தற்கொலைக்கு தூண்டும் அல்லது தற்கொலை செய்ய முயற்சிக்க தூண்டும் உள்ளடக்கம்.

6. **கடுமையான செயல்பாடுகள் அல்லது வன்முறையின் ஊக்குவிப்பு**:
   - குற்றச்செயல்களுக்கு ஊக்குவிப்பு (எ.கா., போதைப்பொருள், வரிவிலக்கு, ஹேக்கிங்).
   - கலவரம், கிளர்ச்சி அல்லது தீவிரவாதத்திற்கு தூண்டுதல்.

7. **அவதூறு மற்றும் குரூரமான மொழி**:
   - அநாகரிகமான அல்லது இழிவான வார்த்தைகள்.
   - ஜாதி மற்றும் மத அடிப்படையிலான இழிவான வார்த்தைகள்.

8. **தொழிலிட துன்புறுத்தல் அல்லது தவறான நடத்தை**:
   - பாகுபாடு அல்லது நெறிமுறையற்ற தொழில் நடத்தைகள்.
   - தொழில்முறை சூழலில் தேவையற்ற கருத்துக்கள்.

9. **போதைப்பொருள் பழக்கத்தை ஊக்குவித்தல்**:
   - போதைப்பொருள் அல்லது மது பயன்பாட்டை ஊக்குவித்தல்.
   - போதைப்பொருளை தயாரிக்க வழிமுறைகளை பகிர்ந்துகொள்ளுதல்.

10. **பதிப்புரிமை அல்லது அறிவுசார் சொத்துக்களின் மீறல்**:
    - பதிப்புரிமை பெற்ற உள்ளடக்கத்தை அனுமதியின்றி பகிர்வு அல்லது விளம்பரம்.
    - அறிவுசார் உரிமைகளை மீறுவதை ஊக்குவித்தல்.

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
