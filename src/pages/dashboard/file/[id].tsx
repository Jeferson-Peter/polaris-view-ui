import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Card,
  CardHeader,
  CardBody,
  Icon,
  useToast,
  Spinner,
  Flex,
  Button,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { getAccessToken } from '@/services/authService';
import {fetchFileDetailsApi, FileData} from "@/services/fileService";


interface Filter {
  col: string;
  val: string;
}

const FileDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [fileData, setFileData] = useState<FileData>({
    headers: [],
    data: [],
    page: 1,
    page_size: 10,
    total_records: 0,
    total_pages: 1,
  });
  const [rows, setRows] = useState<any[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filter[]>([]); // Store filters as an array of objects
  const toast = useToast();

const fetchFileDetails = async (page: number) => {
  if (!id) return;

  setLoading(true);

  try {
    const data = await fetchFileDetailsApi({
      id: id as string,
      page,
      pageSize: fileData.page_size,
      filters,
    });

    if (!data) {
      throw new Error('No data returned from API');
    }

    const transformedRows = data.data.map((row) =>
      data.headers.map((header) => row[header])
    );

    setFileData({
      ...data,
    });
    setRows(transformedRows);
  } catch (error: any) {
    console.error('Error fetching file details:', error);
    toast({
      title: 'Error loading file details',
      description: error || 'An unexpected error occurred',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (router.isReady) {
      fetchFileDetails(fileData.page);
    }
  }, [id, filters, router.isReady]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    fetchFileDetails(newPage);
  };

  const handleFilterChange = (column: string, value: string) => {
    const existingFilterIndex = filters.findIndex((filter) => filter.col === column);
    const updatedFilters = [...filters];

    if (existingFilterIndex >= 0) {
      if (value) {
        updatedFilters[existingFilterIndex].val = value; // Update existing filter
      } else {
        updatedFilters.splice(existingFilterIndex, 1); // Remove filter if value is empty
      }
    } else if (value) {
      updatedFilters.push({ col: column, val: value }); // Add new filter
    }

    setFilters(updatedFilters);
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
      <Card bg="gray.700" borderRadius="md" boxShadow="md">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Icon as={FiFileText} w={6} h={6} color="teal.400" mr={2} />
              <Heading size="lg" color="teal.500">File Details</Heading>
            </Flex>
            <VStack spacing={4} align="flex-start">
              {/* Dynamic Filter Inputs */}
              {fileData.headers.map((header) => (
                <HStack key={header} spacing={2}>
                  <Text color="teal.300">{header}:</Text>
                  <Input
                    placeholder={`Filter by ${header}`}
                    value={filters.find((filter) => filter.col === header)?.val || ''}
                    onChange={(e) => handleFilterChange(header, e.target.value)}
                    size="sm"
                  />
                  {filters.find((filter) => filter.col === header) && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleFilterChange(header, '')}
                    >
                      Remove
                    </Button>
                  )}
                </HStack>
              ))}
            </VStack>
          </Flex>
          <Text color="gray.400" mt={2}>
            Below is the detailed content of the selected file.
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="striped" colorScheme="teal" bg="gray.800" borderRadius="md">
            <Thead>
              <Tr>
                {fileData.headers.map((header, index) => (
                  <Th key={index} color="teal.300">{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <Td key={colIndex} color="white">{cell}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <HStack justifyContent="space-between" mt={4}>
            <Text color="gray.400">
              Page {fileData.page} of {fileData.total_pages} | Total Records: {fileData.total_records}
            </Text>
            <HStack>
              <Button
                onClick={() => handlePageChange(fileData.page - 1)}
                isDisabled={fileData.page === 1}
                colorScheme="teal"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(fileData.page + 1)}
                isDisabled={fileData.page === fileData.total_pages}
                colorScheme="teal"
                size="sm"
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default FileDetailPage;
