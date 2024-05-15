import React, { useState, useEffect } from 'react';
import { Lexend_Peta } from 'next/font/google';
import Image from 'next/image';
import SQUIRREL from '@/assets/noun-squirrel-2777144.png';

const lexend_peta = Lexend_Peta({
subsets: ['latin'],
weight: ['700'],
});


interface PromptSuggestionsProps {
    onPromptSelect: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptSelect }) => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

    useEffect(() => {
        const informedExamples = [
            "What is the history of the Stonewall Riots and their impact on the LGBTQ+ rights movement?",
            "How has the representation of LGBTQ+ characters in media evolved over time?",
            "What are the challenges faced by LGBTQ+ youth in schools and how can educators support them?",
            "How do intersectional identities, such as race and disability, impact the experiences of LGBTQ+ individuals?",
            "What is the significance of Pride Month and how has it changed since its inception?",
            "How have LGBTQ+ activists and organizations contributed to the fight for marriage equality?",
            "What are the health disparities faced by LGBTQ+ communities and what factors contribute to these disparities?",
            "How has the HIV/AIDS epidemic affected LGBTQ+ communities and what lessons can be learned from the response to the crisis?",
            "What is the role of allyship in supporting LGBTQ+ rights and how can allies be effective advocates?",
            "How do different cultures and religions view and treat LGBTQ+ individuals around the world?",
            "What are the unique challenges faced by transgender and non-binary individuals in accessing healthcare and legal recognition?",
            "How has the LGBTQ+ rights movement intersected with other social justice movements, such as the civil rights movement and the women's rights movement?",
            "What is the impact of discrimination and stigma on the mental health of LGBTQ+ individuals?",
            "How have LGBTQ+ artists and writers used their work to challenge societal norms and push for greater acceptance?",
            "What are the experiences of LGBTQ+ individuals in the workplace and what policies can employers implement to create inclusive environments?",
            "How have LGBTQ+ families challenged traditional notions of family structure and parenting?",
            "What is the history of the LGBTQ+ rights movement in different countries and how have activists worked to advance equality?",
            "How do LGBTQ+ individuals navigate coming out and what factors influence their decision to disclose their identity?",
            "What is the role of LGBTQ+ community centers and organizations in providing support and resources to individuals?",
            "How have LGBTQ+ athletes challenged stereotypes and pushed for greater inclusion in sports?",
            "What are the unique challenges faced by LGBTQ+ older adults and what resources are available to support them?",
            "How has the LGBTQ+ rights movement been influenced by feminist and queer theory?",
            "What is the impact of conversion therapy on LGBTQ+ individuals and what efforts have been made to ban the practice?",
            "How do LGBTQ+ individuals navigate relationships and dating in a heteronormative society?",
            "What are the experiences of LGBTQ+ individuals in the military and what policies have been implemented to support them?",
            "How have LGBTQ+ individuals been affected by the criminal justice system and what reforms are needed to address disparities?",
            "What is the role of LGBTQ+ representation in politics and how have LGBTQ+ politicians worked to advance equality?",
            "How do LGBTQ+ individuals navigate issues of faith and spirituality?",
            "What are the unique challenges faced by LGBTQ+ immigrants and refugees?",
            "How have LGBTQ+ individuals been impacted by the COVID-19 pandemic and what resources are available to support them?",
            "What is the history of drag culture and how has it influenced LGBTQ+ activism and art?",
            "How do LGBTQ+ individuals navigate issues of body image and beauty standards?",
            "What are the experiences of LGBTQ+ individuals in rural communities and what resources are available to support them?",
            "How have LGBTQ+ individuals been affected by police brutality and what efforts have been made to address this issue?",
            "What is the role of LGBTQ+ tourism in promoting acceptance and visibility?",
            "How do LGBTQ+ individuals navigate issues of reproductive rights and family planning?",
            "What are the unique challenges faced by LGBTQ+ individuals with disabilities?",
            "How have LGBTQ+ individuals been affected by the opioid epidemic and what resources are available to support them?",
            "What is the history of LGBTQ+ activism in the labor movement and how have unions supported LGBTQ+ workers?",
            "How do LGBTQ+ individuals navigate issues of housing discrimination and homelessness?",
            "What are the experiences of LGBTQ+ individuals in the foster care system and what reforms are needed to support them?",
            "How have LGBTQ+ individuals been affected by natural disasters and what resources are available to support them?",
            "What is the role of LGBTQ+ affinity groups in promoting community and support within organizations?",
            "How do LGBTQ+ individuals navigate issues of aging and end-of-life care?",
            "What are the unique challenges faced by LGBTQ+ individuals in the tech industry?",
            "How have LGBTQ+ individuals been affected by the prison industrial complex and what reforms are needed to address this issue?",
            "What is the history of LGBTQ+ activism in the environmental movement and how are LGBTQ+ individuals impacted by climate change?",
            "How do LGBTQ+ individuals navigate issues of substance abuse and addiction?",
            "What are the experiences of LGBTQ+ individuals in the sex work industry and what resources are available to support them?",
            "How have LGBTQ+ individuals been affected by the student debt crisis and what reforms are needed to address this issue?",
            "What is the role of LGBTQ+ employee resource groups in promoting diversity and inclusion in the workplace?",
            "How do LGBTQ+ individuals navigate issues of domestic violence and intimate partner violence?",
            "What are the unique challenges faced by LGBTQ+ individuals in the healthcare industry?",
            "How have LGBTQ+ individuals been affected by the war on drugs and what reforms are needed to address this issue?",
            "What is the history of LGBTQ+ activism in the anti-war movement and how are LGBTQ+ individuals impacted by military conflicts?",
            "How do LGBTQ+ individuals navigate issues of self-care and mental health?",
            "What are the experiences of LGBTQ+ individuals in the entertainment industry and what efforts have been made to increase representation?",
            "How have LGBTQ+ individuals been affected by the affordable housing crisis and what reforms are needed to address this issue?",
            "What is the role of LGBTQ+ sports leagues and organizations in promoting community and visibility?",
            "How do LGBTQ+ individuals navigate issues of immigration and citizenship?",
            "What are the unique challenges faced by LGBTQ+ individuals in the education system and what reforms are needed to support them?",
            "How have LGBTQ+ individuals been affected by the rise of right-wing extremism and what efforts have been made to combat hate crimes?",
            "What is the history of LGBTQ+ activism in the reproductive rights movement and how are LGBTQ+ individuals impacted by restrictions on reproductive healthcare?",
            "How do LGBTQ+ individuals navigate issues of polyamory and non-monogamy?",
            "What are the experiences of LGBTQ+ individuals in the gig economy and what resources are available to support them?",
            "How have LGBTQ+ individuals been affected by the COVID-19 pandemic and what efforts have been made to address health disparities?",
            "What is the role of LGBTQ+ media in promoting visibility and representation?",
            "How do LGBTQ+ individuals navigate issues of body modification and gender-affirming surgery?",
            "What are the unique challenges faced by LGBTQ+ individuals in the fashion industry?",
            "How have LGBTQ+ individuals been affected by the rise of social media and what efforts have been made to combat online harassment?",
            "What is the history of LGBTQ+ activism in the disability rights movement and how are LGBTQ+ individuals with disabilities impacted by ableism?",
            "How do LGBTQ+ individuals navigate issues of kink and BDSM?",
            "What are the experiences of LGBTQ+ individuals in the publishing industry and what efforts have been made to increase representation?",
            "How have LGBTQ+ individuals been affected by the rise of gentrification and what reforms are needed to address this issue?",
            "What is the role of LGBTQ+ organizations in providing legal support and advocacy?",
            "How do LGBTQ+ individuals navigate issues of sex education and sexual health?",
            "What are the unique challenges faced by LGBTQ+ individuals in the music industry?",
            "How have LGBTQ+ individuals been affected by the rise of the gig economy and what reforms are needed to address worker exploitation?",
            "What is the history of LGBTQ+ activism in the prison abolition movement and how are LGBTQ+ individuals impacted by mass incarceration?",
            "How do LGBTQ+ individuals navigate issues of chosen family and alternative kinship structures?",
            "What are the experiences of LGBTQ+ individuals in the art world and what efforts have been made to increase representation?",
            "How have LGBTQ+ individuals been affected by the rise of the surveillance state and what efforts have been made to protect privacy rights?",
            "What is the role of LGBTQ+ organizations in providing mental health support and resources?",
            "How do LGBTQ+ individuals navigate issues of public accommodations and access to public spaces?",
            "What are the unique challenges faced by LGBTQ+ individuals in the culinary industry?",
            "How have LGBTQ+ individuals been affected by the rise of the wellness industry and what efforts have been made to promote body positivity?",
            "What is the history of LGBTQ+ activism in the harm reduction movement and how are LGBTQ+ individuals impacted by the criminalization of drug use?",
            "How do LGBTQ+ individuals navigate issues of travel and tourism?",
            "What are the experiences of LGBTQ+ individuals in the beauty industry and what efforts have been made to increase representation?",
            "How have LGBTQ+ individuals been affected by the rise of the influencer economy and what efforts have been made to promote authenticity and transparency?",
            "What is the role of LGBTQ+ organizations in providing career development and networking opportunities?",
            "How do LGBTQ+ individuals navigate issues of financial planning and wealth management?",
            "What are the unique challenges faced by LGBTQ+ individuals in the automotive industry?",
            "How have LGBTQ+ individuals been affected by the rise of the sharing economy and what reforms are needed to address worker exploitation?",
            "What is the history of LGBTQ+ activism in the animal rights movement and how are LGBTQ+ individuals impacted by speciesism?",
            "How do LGBTQ+ individuals navigate issues of spirituality and religion?",
            "What are the experiences of LGBTQ+ individuals in the gaming industry and what efforts have been made to increase representation?",
            "How have LGBTQ+ individuals been affected by the rise of the attention economy and what efforts have been made to promote digital wellbeing?",
            "What is the role of LGBTQ+ organizations in providing housing support and resources?",
            "How do LGBTQ+ individuals navigate issues of estate planning and inheritance?",
            "What are the unique challenges faced by LGBTQ+ individuals in the sports industry?",
            "How have LGBTQ+ individuals been affected by the rise of the creator economy and what efforts have been made to promote fair compensation and intellectual property rights?"
        ];

        setSuggestedPrompts(informedExamples);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromptIndex((prevIndex) => Math.floor(Math.random() * suggestedPrompts.length));
        }, 4000);

        return () => {
            clearInterval(interval);
        };
    }, [suggestedPrompts.length]);

    return (
        <div className="bg-white dark:bg-gray-600 rounded-lg shadow-lg p-10 sm:w-full h-auto">
            <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mr-4">
                    <Image src={SQUIRREL} alt="Bayard_One Logo" width={50} height={50} />
                </div>
                <h2 className={`text-2xl font-bold text-gray-800 uppercase dark:text-amber-400 ${lexend_peta.className}`}>Bayard_One</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-6">
                Bayard_One is a retrieval-augmented generative (RAG) generative AI that combines the power of deep learning with a vast LGBTQ+ knowledge base. As a RAG AI, it generates highly relevant, contextual, and insightful responses by synthesizing information from multiple sources and drawing connections between ideas.
            </p>
            <div className="hidden sm:block">
            <p className="text-gray-700 dark:text-gray-200 mb-6">
                With access to over 20,000 LGBTQ+ research papers, journals, and resources, Bayard_One provides unparalleled support for researchers, students, and community members exploring LGBTQ+ issues. By democratizing access to LGBTQ+ scholarship, Bayard_One empowers individuals from all backgrounds to engage with and contribute to the dynamic field of queer studies, fostering a deeper understanding of the LGBTQ+ experience.
            </p>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-amber-400 mb-4">Suggested Prompts</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <button
                        onClick={() => onPromptSelect(suggestedPrompts[currentPromptIndex])}
                        className="text-left text-gray-700 dark:text-amber-300 hover:text-gray-900 dark:hover:text-amber-400 transition-colors duration-200"
                    >
                        <span className="text-lg font-semibold">{suggestedPrompts[currentPromptIndex]}</span>
                        <p className="mt-4 text-gray-500 dark:text-gray-200">Click to select this prompt and start exploring the topic.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptSuggestions;
