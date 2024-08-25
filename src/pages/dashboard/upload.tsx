import { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  useToast,
  Text,
  Icon,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaFileUpload } from 'react-icons/fa';
import axios from 'axios';

const UploadFilePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel', 'application/octet-stream']; // CSV and Parquet
  const authToken = 'your-auth-token-here'; // Replace with your actual token

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      const isParquet = selectedFile.name.endsWith('.parquet');
      const isCSV = allowedFileTypes.includes(selectedFile.type);

      if (!isCSV && !isParquet) {
        toast({
          title: 'Invalid file type',
          description: 'Only CSV and Parquet files are allowed.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (selectedFile.size > maxFileSize) {
        toast({
          title: 'File too large',
          description: 'The file size must be less than 10 MB.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', file.name);
    formData.append('file_type', file.name.endsWith('.csv') ? 'csv' : 'parquet');

    try {
      await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setFile(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={useColorModeValue('linear(to-r, teal.500, green.500)', 'linear(to-r, gray.800, gray.900)')}
      px={4}
    >
      <Box
        w="full"
        maxW="md"
        bg={useColorModeValue('white', 'gray.800')}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h1" textAlign="center" color="teal.500" mb={6}>
          Upload Your File
        </Heading>
        <VStack spacing={4} align="stretch">
          <Center
            p={4}
            border="2px dashed"
            borderColor="teal.500"
            borderRadius="lg"
            bg={useColorModeValue('gray.50', 'gray.700')}
            _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
            cursor="pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <Icon as={FaFileUpload} w={8} h={8} color="teal.500" mb={2} />
            <Text fontSize="md" color="teal.500">
              {file ? file.name : 'Click to select a file'}
            </Text>
          </Center>
          <Input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            display="none"
          />
          <Button
            colorScheme="teal"
            width="full"
            mt={4}
            onClick={handleUpload}
            isDisabled={!file}
          >
            Upload
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default UploadFilePage;
