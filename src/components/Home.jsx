import React, { useState, useEffect } from 'react';
import { getUser } from '../api'; // Ensure this API call is implemented correctly

function Home() {
  const [step, setStep] = useState('menu');
  const [language, setLanguage] = useState('en-US');
  const [isStarted, setIsStarted] = useState(false); // Track when animation starts
  const [showContent, setShowContent] = useState(false); // Track when welcome message should appear
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false); // Track if the welcome message has been spoken
  const [accountNumber, setAccountNumber] = useState(''); // To store account number
  const [buttonText, setButtonText] = useState('Start'); // Toggle text for the start button
  const [intervalId, setIntervalId] = useState(null); // Store interval ID for clearing
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(false); // Track visibility of welcome messages

  const englishWelcomeMessage = "Welcome to Voice Bank Assistant";
  const teluguWelcomeMessage = "వాయిస్ బ్యాంక్ అసిస్టెంట్ కు స్వాగతం";

  useEffect(() => {
    // Start the animation when the component loads
    setIsStarted(true);

    // Show the welcome message and button after 2 seconds
    const timeoutId = setTimeout(() => {
      setShowContent(true);
      setWelcomeMessageVisible(true); // Show the welcome message

      // Speak welcome messages only if it hasn't been spoken before
      if (!hasSpokenWelcome) {
        speakWelcomeMessages(); // Speak welcome messages after animation
        setHasSpokenWelcome(true); // Set to true to avoid repetition
      }

      // Start the text toggling for the button
      const toggleInterval = setInterval(() => {
        setButtonText((prevText) => (prevText === 'Start' ? 'ప్రారంభ' : 'Start'));
      }, 1000); // Toggle text every 1 second

      setIntervalId(toggleInterval); // Store interval ID
    }, 2000); // Wait for 2 seconds before showing the content

    // Cleanup timeout and interval if component unmounts
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId); // Clear the interval on unmount
    };
  }, [hasSpokenWelcome]);

  const handleStart = () => {
    // Move to language selection step
    setStep('language');
    speakLanguageSelection(); // Speak language options

    // Stop the button text toggling once the user clicks start
    if (intervalId) {
      clearInterval(intervalId); // Stop toggling text
    }
  };

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const speakWelcomeMessages = () => {
    // Speak the welcome messages in both languages
    speakText(englishWelcomeMessage, 'en-US');
    speakText(teluguWelcomeMessage, 'en-US');

    // Instructions to click on the start button in both languages
    speakText('click on the start button to begin.', 'en-US');
    speakText('ప్రారంభ బటన్ పై క్లిక్ చేయండి.', 'en-US');
  };

  const speakLanguageSelection = () => {
    // Speak the language selection options in both languages
    speakText('Press Red color button for English, Green color button for Telugu', 'en-US');
    speakText('ఇంగ్లీష్ కోసం రెడ్ కలర్ బటన్, తెలుగు కోసం గ్రీన్ కలర్ నొక్కండి', 'en-US');
  };

  const handleLanguageSelection = (selectedLang) => {
    if (selectedLang === '1') {
      setLanguage('en-US');
      speakText('You have selected English.', 'en-US'); // Speak confirmation in English
    } else if (selectedLang === '2') {
      setLanguage('te-IN'); // Set the language to Telugu
      speakText('మీరు తెలుగు ఎన్నుకున్నారు.', 'en-US'); // Speak confirmation in Telugu
    }

    setStep('account'); // Move to account input step
    speakText('Please say your account number.', language); // Prompt user to say their account number
    startListening(); // Start listening for the account number
  };

  const handleAccountNumber = async (command) => {
    const enteredAccountNumber = command.replace(/\D/g, ''); // Remove non-digit characters
    if (enteredAccountNumber.length === 10) {
      setAccountNumber(enteredAccountNumber);
      try {
        const user = await getUser(enteredAccountNumber); // Fetch user data
        speakText(`Your account balance is ${user.balance} rupees.`, language); // Speak balance
        setStep('menu'); // Move to next action step
      } catch (error) {
        speakText('Account not found. Please try again.', language);
      }
    } else {
      speakText('Invalid account number. Please try again.', language);
    }
  };

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language; // Set language for recognition

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      if (step === 'language') {
        if (command.includes('English') || command.includes('1')) {
          handleLanguageSelection('1');
        } else if (command.includes('Telugu') || command.includes('2')) {
          handleLanguageSelection('2');
        } else {
          speakText('Press Red color button for English or Green color button for Telugu.', language);
        }
      } else if (step === 'account') {
        handleAccountNumber(command); // Handle account number input
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      // Restart listening after ending
      startListening();
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 transition-all">
      {/* Animated Title */}
      <div
        className={`text-center transition-transform duration-1000 ease-in-out ${
          isStarted ? 'transform translate-y-[-150px]' : ''
        }`}
      >
        <h1 className="text-6xl font-bold mb-4">Voice Bank Assistant</h1>
      </div>

      {/* Welcome Message */}
      {isStarted && showContent && step === 'menu' && welcomeMessageVisible && (
        <div className="text-center transition-opacity duration-500 ease-in mt-8">
          {/* Display the welcome messages immediately */}
          <p className="text-xl">{englishWelcomeMessage}</p>
          <p className="text-xl">{teluguWelcomeMessage}</p>

          <p className='text-xl'>click on the start button to begin.</p>
          <p className='text-xl'>ప్రారంభ బటన్ పై క్లిక్ చేయండి</p>
        </div>
      )}

      {/* Start Button */}
      {welcomeMessageVisible && (
        <button
          className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
          onClick={handleStart}
        >
          {buttonText} {/* The text that toggles between 'Start' and 'ప్రారంభ' */}
        </button>
      )}

      {/* Language Selection */}
      {step === 'language' && (
        <div className="text-center mt-16">
          <h2 className="text-2xl mb-4">
            Press Red color button for English, Green color for Telugu
          </h2>
          <h2 className="text-2xl mb-4">
            ఇంగ్లీష్ కోసం రెడ్ కలర్ బటన్, తెలుగు కోసం గ్రీన్ కలర్ నొక్కండి
          </h2>
          <button
            className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-600"
            onClick={() => handleLanguageSelection('1')}
          >
            English
          </button>
          <button
            className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 ml-4"
            onClick={() => handleLanguageSelection('2')}
          >
            తెలుగు (Telugu)
          </button>
        </div>
      )}

      {/* Account Number Input */}
      {step === 'account' && (
        <div className="text-center mt-16">
          <h2 className="text-2xl mb-4">
            Please say your account number.
          </h2>
        </div>
      )}

      {/* Language Confirmation */}
      {step === 'confirmation' && (
        <div className="text-center mt-16">
          <h2 className="text-2xl mb-4">{languageMessage}</h2>
        </div>
      )}
    </div>
  );
}

export default Home;
