import React, { useState, useEffect } from 'react';

interface PromptSuggestionsProps {
    onSuggestionClick: (suggestion: string) => void;
}

function PromptSuggestions({ onSuggestionClick }: PromptSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const response = await fetch('/api/generate_prompt');
            const data = await response.json();
            setSuggestions(data.prompts);
        };

        fetchSuggestions();
    }, []);

    return (
        <div className="prompt-suggestions">
            <h3>Prompt Suggestions:</h3>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => onSuggestionClick(suggestion)}>
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PromptSuggestions;