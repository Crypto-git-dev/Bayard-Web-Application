import React, { useState } from 'react';
import PromptSuggestions from '../components/ui/PromptSuggestions';

function PromptsPage() {
    const [inputValue, setInputValue] = useState('');
    const [submittedPrompts, setSubmittedPrompts] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            setSubmittedPrompts([...submittedPrompts, inputValue]);
            setInputValue('');
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    return (
        <div className="prompts-page">
            <h1>Prompts Page</h1>
            <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <textarea
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter your prompt here..."
                        rows={4}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="submitted-prompts">
                <h2>Submitted Prompts:</h2>
                <ul>
                    {submittedPrompts.map((prompt, index) => (
                        <li key={index}>{prompt}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PromptsPage;