import React, { useState } from 'react';

/**
 * XSS Demo Page
 * This page is intentionally vulnerable to XSS for educational purposes.
 * Do NOT use this pattern in production!
 */
const XSSDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(input); // Intentionally unsanitized
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>XSS Demo (Intentionally Vulnerable)</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="xss-input">Enter any text (or XSS payload):</label>
        <input
          id="xss-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', margin: '12px 0', padding: 8 }}
        />
        <button type="submit">Submit</button>
      </form>
      {submitted && (
        <div style={{ marginTop: 24 }}>
          <strong>Output:</strong>
          {/* Intentionally using dangerouslySetInnerHTML for XSS demonstration */}
          <div style={{ border: '1px solid #f00', marginTop: 8, padding: 8, background: '#fff0f0' }}
            dangerouslySetInnerHTML={{ __html: submitted }}
          />
        </div>
      )}
      <p style={{ color: '#b00', marginTop: 32 }}><b>Warning:</b> This page is intentionally vulnerable to XSS. Do not use this code in production.</p>
    </div>
  );
};

export default XSSDemo; 