import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ip } = req.query;

  try {
    const url = ip
      ? `https://ipinfo.io/${ip}/json`
      : `https://ipinfo.io/json`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao buscar IP", details: error.message });
  }
}
