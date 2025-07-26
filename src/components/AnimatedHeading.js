import React, { useEffect, useRef } from 'react';
import './AnimatedHeading.css';

const AnimatedHeading = ({ title }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    const container = headingRef.current;
    container.innerHTML = ''; // Clear previous content

    const range = { min: 1, max: 9 };
    const getRandom = () =>
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    const lines = title.split('\n'); // Split the title by line

    lines.forEach((line, lineIndex) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'letter-container';

      line.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = `letterDrop ld${getRandom()}`;
        span.textContent = char === ' ' ? '\u00A0' : char;
        wrapper.appendChild(span);
      });

      container.appendChild(wrapper);

      // Add <br> except after the last line
      if (lineIndex !== lines.length - 1) {
        container.appendChild(document.createElement('br'));
      }
    });
  }, [title]);

  return <h1 ref={headingRef} className="animated-heading"></h1>;
};

export default AnimatedHeading;
