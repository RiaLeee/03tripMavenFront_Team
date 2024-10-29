import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTChatting = () => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // MQTT 브로커에 연결
        const mqttClient = mqtt.connect('mqtt://localhost:1884'); // 또는 'ws://broker.hivemq.com:8000/mqtt' (웹소켓 사용 시)
        
        mqttClient.on('connect', () => {
            //console.log('Connected to MQTT broker');
            setIsConnected(true);
            mqttClient.subscribe('python/mqtt'); // 원하는 토픽 구독
        });

        mqttClient.on('message', (topic, message) => {
            //console.log('Received message:', message.toString());
            setMessage(message.toString());
        });

        mqttClient.on('error', (err) => {
            console.error('Connection error:', err);
        });

        mqttClient.on('close', () => {
            //console.log('Disconnected from MQTT broker');
            setIsConnected(false);
        });

        setClient(mqttClient);

        // 컴포넌트 언마운트 시 클라이언트 종료
        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, []);

    const publishMessage = () => {
        if (client && isConnected) {
            client.publish('python/mqtt', '대박연결됐다');
        }
    };

    return (
        <div>
            <h1>MQTT Example</h1>
            <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
            <button onClick={publishMessage}>Send Message</button>
            <p>Received Message: {message}</p>
        </div>
    );
};

export default MQTTChatting;