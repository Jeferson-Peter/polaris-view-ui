import { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Link,
  Spinner,
  Flex,
  Icon,
  Text,
  useToast,
  VStack,
  Center,
  Button,
  Input,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { FaFileUpload } from 'react-icons/fa';
import NextLink from 'next/link';
import { getAccessToken } from '@/services/authService';
import {fetchFiles, uploadFile} from "@/services/fileService";

interface FileItem {
  id: string;
  file_name: string;
  url: string;
}

const FilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel', 'application/octet-stream']; // CSV and Parquet
  const authToken = getAccessToken(); // Get the auth token

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const filesData = await fetchFiles();
        setFiles(filesData);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          title: 'Error fetching files',
          description: 'There was an issue loading the files. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [toast]);

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

    try {
      const uploadedFile = await uploadFile(file);

      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh the file list after a successful upload
      setFiles(prevFiles => [...prevFiles, uploadedFile]);
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

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5} textAlign="center" color="teal.500">Uploaded Files</Heading>

      <VStack spacing={4} align="stretch" mb={8}>
        <Center
          p={4}
          border="2px dashed"
          borderColor="teal.500"
          borderRadius="md"
          bg="gray.50"
          _hover={{ bg: 'gray.100' }}
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
          onClick={handleUpload}
          isDisabled={!file}
        >
          Upload
        </Button>
      </VStack>

      {files.length === 0 ? (
        <Text>No files uploaded yet.</Text>
      ) : (
        <List spacing={4}>
          {files.map((file) => (
            <ListItem key={file.id}>
              <NextLink href={`/dashboard/file/${file.id}`} passHref>
                <Link
                  _hover={{ textDecoration: 'none' }}
                  _focus={{ boxShadow: 'outline' }}
                  bg="gray.700"
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiFileText} w={6} h={6} color="teal.400" mr={4} />
                  <Text color="white">{file.file_name}</Text>
                </Link>
              </NextLink>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FilesPage;
