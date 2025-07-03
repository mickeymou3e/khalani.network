export enum CertificateRegistry {
  PJM_GATS = "PJM-GATS",
  M_RETS = "M-RETS",
  NAR = "NAR",
  WREGIS = "WREGIS",
  NEPOOL_GIS = "NEPOOL-GIS",
  NC_RETS = "NC-RETS",
  MIRECS = "MIRECS",
  NYGATS = "NYGATS",
  ERCOT = "ERCOT",
  NVTRECS = "NVTRECS",
}

export const Registries = [
  {
    name: CertificateRegistry.NAR,
    icon: CertificateRegistry.NAR,
    description: "North American Renewables Registry",
    transferAccountId: "JasmineEnergy",
  },
  {
    name: CertificateRegistry.PJM_GATS,
    icon: "PJM_GATS",
    description: "PJM Generation Attribute Tracking System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.M_RETS,
    icon: "M_RETS",
    description: "Midwest Renewable Energy Tracking System",
    transferAccountId: "Jasmine Energy",
  },
  {
    name: CertificateRegistry.WREGIS,
    icon: CertificateRegistry.WREGIS,
    description: "Western Renewable Energy Generation Information System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.NEPOOL_GIS,
    icon: "NEPOOL_GIS",
    description: "New England Power Pool Generation Information System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.NC_RETS,
    icon: "NC_RETS",
    description: "North Carolina Renewable Energy Tracking System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.MIRECS,
    icon: CertificateRegistry.MIRECS,
    description: "Michigan Renewable Energy Certification System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.NYGATS,
    icon: CertificateRegistry.NYGATS,
    description: "New York Generation Attribute Tracking System",
    transferAccountId: "",
  },
  {
    name: CertificateRegistry.ERCOT,
    icon: CertificateRegistry.ERCOT,
    description: "Electric Reliability Council of Texas",
    transferAccountId: "Jasmine Energy Corporation",
  },
  {
    name: CertificateRegistry.NVTRECS,
    icon: CertificateRegistry.NVTRECS,
    description: "Nevada Tracks Renewable Energy Credits",
    transferAccountId: "",
  },
];

export const getRegistry = (registry: CertificateRegistry) =>
  Registries.find(({ name }) => name === registry);
