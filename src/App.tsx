import React, { useState, useEffect } from "react";

export default function App(): JSX.Element {
  const [flag, setFlag] = useState<string | null>(null);

  const getFlag = async (): Promise<void> => {
    try {
      const res = await fetch(
        "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/777269",
      );
      if (res.ok) {
        const data = await res.text();
        setFlag(data);
      } else {
        throw new Error(`Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch the flag:", error);
      setFlag(null);
    }
  };

  useEffect(() => {
    getFlag();
  }, []);

  const TypeWriter: React.FC<{ text: string }> = ({ text }) => {
    const [index, setIndex] = useState<number>(0);
    const [delay, setDelay] = useState<boolean>(true);

    useEffect(() => {
      if (index === text.length) {
        return;
      }

      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timeout);
    }, [index, text]);

    useEffect(() => {
      if (index === text.length) {
        setDelay(false);
      } else {
        const delayTimeout = setTimeout(() => {
          setDelay((prev) => !prev);
        }, 500);

        return () => clearTimeout(delayTimeout);
      }
    }, [delay, index, text]);

    return (
      <ul>
        {text.split("").map((char, key) => (
          <li key={key}>
            {key < index ? char : key === index && delay ? " " : ""}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {!flag ? (
        <h1>Loading&hellip;</h1>
      ) : (
        <>
          <TypeWriter text={flag} />
        </>
      )}
    </div>
  );
}

/*
Script used to to get the URL in step 2

ramp_ctf_script.py

import requests
from bs4 import BeautifulSoup

# URL provided in the challenge
url = 'https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge'

# Fetch the webpage content
response = requests.get(url)
html_content = response.text

# Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Find all <i> tags with class 'char' within the specified DOM structure
valid_chars = soup.find_all('code', attrs={'data-class': True})
hidden_url = ''

for code_tag in valid_chars:
    div_tags = code_tag.find_all('div', attrs={'data-tag': True})
    for div_tag in div_tags:
        span_tags = div_tag.find_all('span', attrs={'data-id': True})
        for span_tag in span_tags:
            i_tags = span_tag.find_all('i', class_='char')
            for i_tag in i_tags:
                # Extract the character from the 'value' attribute
                hidden_url += i_tag['value']

print(f'Hidden URL: {hidden_url}')

# Optionally, you can make a request to the hidden URL to validate it
response = requests.get(hidden_url)
if response.status_code == 200:
    print('Successfully accessed the hidden URL.')
else:
    print('Failed to access the hidden URL.')

*/
