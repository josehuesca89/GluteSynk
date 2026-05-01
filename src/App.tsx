import React, { useState } from 'react';
import './App.css';

function App() {
    // Fixed lang state declaration
    const [lang, setLang] = useState('en');

    return (
        <div className="App">
            <h1>{lang === 'en' ? 'Hello!' : '¡Hola!'}</h1>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}>Switch Language</button>
        </div>
    );
}

export default App;