interface ServerConfig {
  ip: string;
  port: number;
  name: string;
}

interface GameMode {
  name: string;
  servers: ServerConfig[];
}

export const gameModes: GameMode[] = [
  {
    name: "Maniac",
    servers: [
      {
        name: "Maniac #1",
        ip: "62.122.214.164",
        port: 27022
      },
      {
        name: "Maniac #2",
        ip: "46.174.48.233",
        port: 27050
      },
      {
        name: "Maniac #3",
        ip: "192.168.1.10",
        port: 27024
      },
      {
        name: "Maniac #4",
        ip: "203.0.113.5",
        port: 27060
      },
      {
        name: "Maniac #5",
        ip: "10.0.0.20",
        port: 27025
      }
    ]
  },
  {
    name: "Classic",
    servers: [
      {
        name: "Classic #1",
        ip: "62.122.214.164",
        port: 27023
      },
      {
        name: "Classic #2",
        ip: "127.0.0.4",
        port: 27015
      },
      {
        name: "Classic #3",
        ip: "192.168.2.3",
        port: 27016
      },
      {
        name: "Classic #4",
        ip: "203.0.113.10",
        port: 27017
      }
    ]
  },
  {
    name: "Casual",
    servers: [
      {
        name: "Casual #1",
        ip: "54.221.100.100",
        port: 27018
      },
      {
        name: "Casual #2",
        ip: "54.221.100.101",
        port: 27019
      },
      {
        name: "Casual #3",
        ip: "54.221.100.102",
        port: 27020
      }
    ]
  },
  {
    name: "Competitive",
    servers: [
      {
        name: "Competitive #1",
        ip: "192.0.2.1",
        port: 27021
      },
      {
        name: "Competitive #2",
        ip: "192.0.2.2",
        port: 27022
      },
      {
        name: "Competitive #3",
        ip: "192.0.2.3",
        port: 27023
      }
    ]
  }
];