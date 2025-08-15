import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Alert, Divider, Row, Col } from 'antd';
import { FireOutlined, BugOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { addPageLog, addVisitor, checkVisitorExists } from '../services/firebaseRealtimeService';
import { checkFirebaseConnection, getFirebaseErrorDetails } from '../utils/firebaseDebug';

const { Title, Text, Paragraph } = Typography;

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addTestResult = (test, success, message, error = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testFirebaseConnection = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 0: Basic Firebase connection
    try {
      addTestResult('Firebase Connection Test', true, 'Testing basic Firebase connectivity...');
      
      const connectionResult = await checkFirebaseConnection();
      if (connectionResult.success) {
        addTestResult('Firebase Connection', true, '✅ Firebase connection successful!');
      } else {
        const errorDetails = getFirebaseErrorDetails({ code: connectionResult.code, message: connectionResult.error });
        addTestResult('Firebase Connection', false, '❌ Firebase connection failed', errorDetails);
        setTesting(false);
        return;
      }
    } catch (error) {
      const errorDetails = getFirebaseErrorDetails(error);
      addTestResult('Firebase Connection', false, '❌ Firebase connection test failed', errorDetails);
      setTesting(false);
      return;
    }

    // Test 1: Add test visitor
    try {
      const testVisitor = {
        fingerprint: `test_${Date.now()}`,
        firstVisit: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: 'Test Page'
      };

      addTestResult('Test Visitor Data', true, 'Generated test visitor data');

      const visitorId = await addVisitor(testVisitor);
      addTestResult('Add Visitor', true, `✅ Visitor added successfully with ID: ${visitorId}`);

      // Test 2: Check visitor exists
      const exists = await checkVisitorExists(testVisitor.fingerprint);
      addTestResult('Check Visitor Exists', true, `✅ Visitor check result: ${exists}`);

      // Test 3: Add test page log
      const testPageLog = {
        fingerprint: testVisitor.fingerprint,
        sessionId: `test_session_${Date.now()}`,
        path: '/firebase-test',
        fullUrl: window.location.href,
        title: 'Firebase Test Page',
        time: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: 'Test',
        isNewVisitor: true
      };

      const pageLogId = await addPageLog(testPageLog);
      addTestResult('Add Page Log', true, `✅ Page log added successfully with ID: ${pageLogId}`);

      addTestResult('All Tests Complete', true, '🎉 All Firebase tests passed successfully!');

    } catch (error) {
      console.error('Firebase test error:', error);
      const errorDetails = getFirebaseErrorDetails(error);
      addTestResult('Firebase Test Failed', false, '❌ Firebase operation failed', errorDetails);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>
            <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
            Firebase Realtime Database Test
          </Title>
          <Paragraph type="secondary">
            Test Firebase Realtime Database connection and debug any issues
          </Paragraph>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Button 
            type="primary" 
            size="large"
            icon={<BugOutlined />}
            onClick={testFirebaseConnection}
            loading={testing}
          >
            {testing ? 'Testing Firebase...' : 'Run Firebase Tests'}
          </Button>
        </div>

        {testResults.length > 0 && (
          <>
            <Divider orientation="left">Test Results</Divider>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {testResults.map((result, index) => (
                <Alert
                  key={index}
                  type={result.success ? 'success' : 'error'}
                  message={
                    <div>
                      <strong>[{result.timestamp}] {result.test}</strong>
                      <br />
                      <Text>{result.message}</Text>
                      {result.error && (
                        <div style={{ marginTop: '8px' }}>
                          <Text code type="danger">
                            {typeof result.error === 'object' ? JSON.stringify(result.error, null, 2) : result.error}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                  showIcon
                />
              ))}
            </Space>
          </>
        )}

        <Divider orientation="left">Firebase Realtime Database Configuration</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="Firebase Project Info">
              <Text strong>Project ID:</Text> <Text code>tracking-e659f</Text><br />
              <Text strong>Database URL:</Text> <Text code>https://tracking-e659f-default-rtdb.asia-southeast1.firebasedatabase.app</Text><br />
              <Text strong>Auth Domain:</Text> <Text code>tracking-e659f.firebaseapp.com</Text><br />
              <Text strong>API Key:</Text> <Text code>AIzaSyCo_z_bFTepfzkzsRngUfvhwwU7eUoLSWo</Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title="Database Structure">
              <Text strong>Page Logs:</Text> <Text code>/pageLogs</Text><br />
              <Text strong>Visitors:</Text> <Text code>/visitors</Text><br />
              <Text strong>Analytics:</Text> <Text code>/analytics</Text><br />
              <br />
              <Alert 
                type="info" 
                message="Firebase Realtime Database uses JSON structure with real-time sync"
                showIcon
                size="small"
              />
            </Card>
          </Col>
        </Row>

        <Divider orientation="left">Debug Info</Divider>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px' }}>
          <Text strong>Current URL:</Text> <Text code>{window.location.href}</Text><br />
          <Text strong>User Agent:</Text> <Text code>{navigator.userAgent}</Text><br />
          <Text strong>Screen:</Text> <Text code>{screen.width}x{screen.height}</Text><br />
          <Text strong>Language:</Text> <Text code>{navigator.language}</Text><br />
          <Text strong>Platform:</Text> <Text code>{navigator.platform}</Text><br />
          <Text strong>Timezone:</Text> <Text code>{Intl.DateTimeFormat().resolvedOptions().timeZone}</Text>
        </div>
      </Card>
    </div>
  );
};

export default FirebaseTest;
