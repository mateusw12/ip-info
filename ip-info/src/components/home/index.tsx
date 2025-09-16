import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  List,
  Typography,
  message,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const STORAGE_KEY = "ipinfo_ip_history_v1";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
}

export const SearchIP: React.FC = () => {
  const [ip, setIp] = useState("");
  const [history, setHistory] = useState<IpInfo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (data: IpInfo) => {
    const updated = [data, ...history.filter((h) => h.ip !== data.ip)];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSearch = async () => {
    if (!ip) return;
    try {
      const res = await fetch(`/api/ipinfo?ip=${ip}`);
      const data = await res.json();
      saveHistory({ ip: data.ip, city: data.city, region: data.region });
      message.success("IP buscado com sucesso!");
      setIp("");
    } catch {
      message.error("Erro ao buscar IP.");
    }
  };

  const handleMyIp = async () => {
    try {
      const res = await fetch(`/api/ipInfo`);
      const data = await res.json();
      saveHistory({ ip: data.ip, city: data.city, region: data.region });
      message.success("Seu IP foi buscado!");
    } catch {
      message.error("Erro ao buscar seu IP.");
    }
  };

  // Limpar histórico
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    message.info("Histórico limpo.");
  };

  return (
    <Card style={{ maxWidth: 600, margin: "20px auto" }}>
      <Title level={3}>Buscador de IP</Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Digite um IP manualmente"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} disabled>
          Buscar IP
        </Button>
        <Button onClick={handleMyIp}>Meu IP</Button>
        <Button danger icon={<DeleteOutlined />} onClick={clearHistory}>
          Limpar
        </Button>
      </Space>

      <List
        bordered
        dataSource={history}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.ip}</Text> — {item.city}, {item.region}
          </List.Item>
        )}
      />
    </Card>
  );
};
