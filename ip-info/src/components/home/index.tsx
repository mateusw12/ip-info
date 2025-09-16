import React, { useState, useEffect } from "react";
import { Card, Input, Button, Table, Typography, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Image from "next/image";

const MapWithMarker = dynamic(() => import("./../map"), { ssr: false });

const { Title } = Typography;
const STORAGE_KEY = "ipinfo_ip_history_v1";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export const SearchIP: React.FC = () => {
  const [ip, setIp] = useState("");
  const [history, setHistory] = useState<IpInfo[]>([]);

  // Carrega histórico
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (data: IpInfo) => {
    const updated = [data, ...history.filter((h) => h.ip !== data.ip)];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const fetchIp = async (queryIp?: string) => {
    try {
      const res = await fetch(`/api/ipInfo${queryIp ? "?ip=" + queryIp : ""}`);
      const data = await res.json();
      saveHistory(data);
      message.success("IP buscado com sucesso!");
      setIp("");
    } catch {
      message.error("Erro ao buscar IP.");
    }
  };

  const handleSearch = () => fetchIp(ip);
  const handleMyIp = () => fetchIp();
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    message.info("Histórico limpo.");
  };

  const columns = [
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Cidade", dataIndex: "city", key: "city" },
    { title: "Região", dataIndex: "region", key: "region" },
    {
      title: "País",
      dataIndex: "country",
      key: "country",
      render: (country: string) =>
        country ? (
          <span>
            <Image
              src={`https://flagcdn.com/24x18/${country.toLowerCase()}.png`}
              alt={country}
              width={24}
              height={18}
              style={{ marginRight: 6 }}
            />
            {country}
          </span>
        ) : null,
    },
    { title: "Org", dataIndex: "org", key: "org" },
    { title: "Postal", dataIndex: "postal", key: "postal" },
    { title: "Timezone", dataIndex: "timezone", key: "timezone" },
  ];

  return (
    <Card style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <Title level={3}>Buscador de IP</Title>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Digite um IP (ex: 8.8.8.8)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 250 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          disabled
        >
          Buscar IP
        </Button>
        <Button onClick={handleMyIp}>Meu IP</Button>
        <Button danger icon={<DeleteOutlined />} onClick={clearHistory}>
          Limpar
        </Button>
      </div>

      <Table
        dataSource={history}
        columns={columns}
        rowKey="ip"
        pagination={{ pageSize: 5 }}
      />

      {history.length > 0 && <MapWithMarker loc={history[0].loc} />}
    </Card>
  );
};
