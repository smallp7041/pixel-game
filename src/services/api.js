import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const MOCK_MODE = API_URL === 'PLACEHOLDER_URL' || !API_URL;

const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "When was the first Pixel Art game created?",
        options: ["1972", "1980", "1995", "2000"],
        answer: "1972" // Pong? Or maybe just sample data.
    },
    {
        id: 2,
        question: "Which color is #FF0000?",
        options: ["Blue", "Red", "Green", "Yellow"],
        answer: "Red"
    },
    {
        id: 3,
        question: "What does CPU stand for?",
        options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Power Unit"],
        answer: "Central Processing Unit"
    },
    {
        id: 4,
        question: "1 + 1 = ?",
        options: ["1", "2", "3", "11"],
        answer: "2"
    },
    {
        id: 5,
        question: "Best AI?",
        options: ["Gemini", "Antigravity", "Deepmind", "All of above"],
        answer: "All of above"
    }
];

export const fetchQuestions = async (count = 5) => {
    if (MOCK_MODE) {
        console.log("Fetching Mock Questions");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // Shuffle mock questions and return count
        const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    try {
        // Use fetch instead of axios for better GAS redirect handling
        // Setup timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_URL}?action=getQuestions&count=${count}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId); // Clear timeout on response

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Assumption: GAS returns [...]
    } catch (error) {
        console.error("Error fetching questions:", error);
        if (error.name === 'AbortError') {
            throw new Error("Timeout: Google Sheets did not respond in time.");
        }
        throw error;
    }
};

export const submitScore = async (data) => {
    // data: { userId, score, maxScore, attempts, etc. }
    if (MOCK_MODE) {
        console.log("Submitting Mock Score:", data);
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true };
    }

    try {
        // Use fetch with no-cors for GAS POST
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(data)
        });

        return { success: true };
    } catch (error) {
        console.error("Error submitting score:", error);
        // In no-cors mode, we can't really catch network errors easily unless offline
        throw error;
    }
}
