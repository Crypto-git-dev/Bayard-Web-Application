# **Bayard: Generative AI LGBTQ Research Assistant** 

*This repository contains the frontend code for the Bayard project. The backend code can be found in a separate repository at \[[https://github.com/jweaver9/bayard_one\](https://github.com/jweaver9/bayard_one)](https://github.com/jweaver9/bayard_one]\(https://github.com/jweaver9/bayard_one\)). The frontend and backend work together to provide a seamless user experience and enable the retrieval and generation of relevant LGBTQ+ research information.*

*For detailed documentation on how to use and contribute to Bayard , please visit [\[docs.bayardlab.or](http://docs.bayardlab.org)g\][(https://docs.bayardlab.or](https://docs.bayardlab.org)g).*

## **About Bayard**

**Bayard_One** is an innovative open-source retrieval-augmented generative AI assistant that aims to transform the way researchers, academics, and community members engage with LGBTQ+ scholarship.\
\
By integrating a vast collection of **over 20,000 LGBTQ+ research papers**, journals, and resources, Bayard_One provides a centralized platform for exploring the diverse and complex landscape of LGBTQ+ knowledge, fostering a deeper understanding of the community's experiences, challenges, and triumphs.

## **Open Source. Forever.**

\
At Bayard Lab, we firmly believe in the power of open-source technology to drive innovation, foster collaboration, and promote accessibility. As an open-source platform, Bayard_One's codebase is available for anyone to access, review, and contribute to, enabling a global community of developers, researchers, and advocates to collectively shape the future of LGBTQ+ scholarship.\
\
By adopting an open-source approach, we ensure transparency, encourage community participation, and facilitate the continuous improvement of our platform. This commitment to openness extends beyond our technology; it permeates our values, our partnerships, and our unwavering dedication to democratizing access to LGBTQ+ knowledge. Through our open-source model, we invite scholars, activists, and allies from around the world to join us in our mission to empower LGBTQ+ voices and create a more inclusive, collaborative, and accessible landscape of scholarly research.

## **Features**

- Chat interface for querying the AI assistant
- Retrieval of relevant LGBTQ+ research documents
- Document summaries and abstracts
- Resizable panels for chat and document display
- Smooth animations and transitions
- Loading indicators and status updates
- Copy, share, and provide feedback on chat messages
- Regenerate responses
- Keyboard shortcuts for sending messages

## **Technologies Used**

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI components
- Framer Motion for animations
- React Spring for animations
- React Hot Toast for notifications
- Axios for API requests

## **Getting Started**

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: 
   - `BAYARD_API_KEY`: API key for the Bayard API
4. Run the development server: `npm run dev`
5. Open <http://localhost:3000> in your browser

## **Folder Structure**

- `app/`: Next.js app directory 
  - `page.tsx`: Main chat page component
- `components/`: Reusable UI components
- `pages/api/`: API routes 
  - `bayard-proxy.ts`: Proxy route for Bayard API requests
- `public/`: Public assets
- `styles/`: Global styles

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## **License**

This project is licensed under the [MIT License](LICENSE).

## **Contact**

For any questions or inquiries, please contact the Bayard Lab team at [contact@bayardlab.org](mailto:contact@bayardlab.org).