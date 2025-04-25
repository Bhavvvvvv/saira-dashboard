import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Navbar, Nav, Card, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import './App.css';
import Hero from './components/Hero';
import Contact from './components/Contact';

interface CallRecord {
  id: string;
  agent_id: string;
  customer_name: string;
  recipient_phone_number: string;
  conversation_duration: string;
  total_cost?: string;
  status: string;
  created_at: string;
  summary: string;
  transcript: string;
  telephony_data: string;
  step_id: string;
  [key: string]: any;
}

function App() {
  const [records, setRecords] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debounce search term to avoid excessive filtering
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.sheetbest.com/sheets/798c7576-ed26-4bb4-835d-698143fddacb');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.warn("BVH inside data", data);
        setRecords(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewRecord = (record: CallRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Function to extract call ID from telephony_data
  const getCallId = (telephonyData: string) => {
    try {
      const data = JSON.parse(telephonyData);
      return data.provider_call_id || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  // Function to get tag based on status or other fields
  const getTag = (record: CallRecord) => {
    // This is a simple example - you might want to implement more complex logic
    const statusMap: {[key: string]: string} = {
      'completed': 'Converted',
      'pending': 'Follow Up',
      'active': 'New Lead'
    };
    
    const status = record.status ? record.status.toLowerCase() : '';
    return statusMap[status] || 'New Lead';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter records based on debounced search term
  const filteredRecords = records.filter(record => {
    const search = debouncedSearchTerm.toLowerCase();
    if (!search) return true; // If no search term, return all records
    
    return (
      (record.customer_name && record.customer_name.toLowerCase().includes(search)) ||
      (record.recipient_phone_number && record.recipient_phone_number.toLowerCase().includes(search)) ||
      (record.status && record.status.toLowerCase().includes(search)) ||
      (record.step_id && record.step_id.toLowerCase().includes(search)) ||
      (record.summary && record.summary.toLowerCase().includes(search))
    );
  });

  // Helper function to capitalize first letter of each word
  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Saira</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Dashboard</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Hero 
        title="Lead Management Dashboard"
        subtitle="To handle all the user calls efficiently."
      />
      <Container>
        <Row className="mb-4">
          <Col md={12}>
            <Card className="text-center" style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <Card.Body>
                <Form className="mb-4">
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="fas fa-search">🔍</i>
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Search by name, phone, status, or any keyword..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {searchTerm && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={clearSearch}
                      >
                        ✕
                      </Button>
                    )}
                  </InputGroup>
                </Form>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <p>Loading data...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">
                    <p className="mb-0">Error: {error}</p>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <table className="table table-hover table-striped">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>Sr. No.</th>
                          <th style={{ minWidth: '120px' }}>Customer Name</th>
                          <th style={{ minWidth: '140px' }}>Phone Number</th>
                          <th style={{ minWidth: '120px' }}>Recording URL</th>
                          <th style={{ minWidth: '140px' }}>Current Step ID</th>
                          <th style={{ minWidth: '140px' }}>Call ID</th>
                          <th style={{ minWidth: '100px' }}>Duration</th>
                          <th style={{ minWidth: '120px' }}>Created At</th>
                          <th style={{ minWidth: '100px' }}>Status</th>
                          <th style={{ minWidth: '100px' }}>Tag</th>
                          <th style={{ minWidth: '150px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.length > 0 ? (
                          filteredRecords.map((record, index) => {
                            // Parse telephony_data to get recording URL
                            let recordingUrl = "#";
                            try {
                              const telephonyData = JSON.parse(record.telephony_data || '{}');
                              recordingUrl = telephonyData.recording_url || "#";
                            } catch (e) {
                              // Use default value if parsing fails
                            }
                            
                            return (
                              <tr key={record.id}>
                                <td style={{ width: '60px' }}>{index + 1}</td>
                                <td style={{ minWidth: '120px' }}>{record.customer_name || 'N/A'}</td>
                                <td style={{ minWidth: '140px' }}>{record.recipient_phone_number || 'N/A'}</td>
                                <td style={{ minWidth: '120px' }}><a href={recordingUrl} target="_blank" rel="noopener noreferrer">Recording</a></td>
                                <td style={{ minWidth: '140px' }}>{record.step_id || 'N/A'}</td>
                                <td style={{ minWidth: '140px' }}>{getCallId(record.telephony_data)}</td>
                                <td style={{ minWidth: '100px' }}>{record.conversation_duration || '0'}s</td>
                                <td style={{ minWidth: '120px' }}>{new Date(record.created_at).toLocaleDateString()}</td>
                                <td style={{ minWidth: '100px' }}>{capitalizeFirstLetter(record.status) || 'N/A'}</td>
                                <td style={{ minWidth: '100px' }}>{getTag(record)}</td>
                                <td style={{ minWidth: '150px' }}>
                                  <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleViewRecord(record)}
                                  >
                                    View more
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={11} className="text-center">No records found matching the search criteria</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {filteredRecords.length > 0 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <p className="mb-0">
                          Showing {filteredRecords.length} of {records.length} records
                          {debouncedSearchTerm && 
                            ` matching "${debouncedSearchTerm}"`}
                        </p>
                        {searchTerm && (
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={clearSearch}
                          >
                            Clear Search
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Contact Section */}
      <Contact />

      {/* Call Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Call Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <h4>Customer: {selectedRecord.customer_name || 'N/A'}</h4>
              <p><strong>Phone:</strong> {selectedRecord.recipient_phone_number}</p>
              <p><strong>Duration:</strong> {selectedRecord.conversation_duration} seconds</p>
              <p><strong>Status:</strong> {capitalizeFirstLetter(selectedRecord.status)}</p>
              <p><strong>Date:</strong> {new Date(selectedRecord.created_at).toLocaleString()}</p>
              
              <h5 className="mt-4">Summary</h5>
              <p>{selectedRecord.summary}</p>
              {/* Replace 'user' with 'User' and add custom string */}
              <div className="transcript-container p-3 bg-light mb-4">
                {selectedRecord.summary && (
                  <p>
                    {selectedRecord.summary.split(' ').map((word, index) => {
                      if (word.toLowerCase() === 'user') {
                        return (
                          <React.Fragment key={index}>
                            {'User'}
                            <br />
                            <span className="text-muted">CUSTOMER FROM VOLT MONEY</span>
                            {' '}
                          </React.Fragment>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>
                )}
              </div>
              <h5 className="mt-4">Transcript</h5>
              <div className="transcript-container p-3 bg-light" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {selectedRecord.transcript ? (
                  selectedRecord.transcript.split('\\n').map((line, i) => {
                    if (line.toLowerCase().includes('assistant')) {
                      return (
                        <p key={i} className="text-success">
                          <strong>{line.split(':')[0].toUpperCase()}:</strong><br/>
                          <span>AI POWERED ASSISTANT FROM VOLT MONEY</span><br/>
                          {line.includes(':') ? line.split(':').slice(1).join(':') : line}
                        </p>
                      );
                    }
                    return <p key={i} className="text-primary">{line}</p>;
                  })
                ) : (
                  <p>No transcript available</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
