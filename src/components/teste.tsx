import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Icon, Button } from '@chakra-ui/react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const quotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "Do not watch the clock. Do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  },
];

const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const QuoteCard: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());

  const handleNewQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      bg="gray.700"
      color="white"
      boxShadow="lg"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Icon as={FaQuoteLeft} w={8} h={8} color="teal.300" />
        <Text fontSize="lg" fontStyle="italic">
          {currentQuote.quote}
        </Text>
        <Icon as={FaQuoteRight} w={8} h={8} color="teal.300" />
        <Text fontWeight="bold" color="teal.500">
          - {currentQuote.author}
        </Text>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={handleNewQuote}
        >
          New Quote
        </Button>
      </VStack>
    </Box>
  );
};

export default QuoteCard;
