export const ROLE_SKILLS = {
  'Backend SWE': [
    'Python', 'Go', 'Java', 'TypeScript', 'Node.js', 'REST', 'gRPC', 
    'PostgreSQL', 'Redis', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 
    'Terraform', 'CI/CD', 'GitHub Actions'
  ],
  'ML Platform': [
    'Python', 'PyTorch', 'TensorFlow', 'JAX', 'Airflow', 'MLflow', 
    'Kubeflow', 'Ray', 'Spark', 'Feature Store', 'ONNX', 'SageMaker', 
    'Vertex AI', 'Docker', 'Kubernetes', 'AWS'
  ],
  'Data Eng': [
    'Python', 'SQL (Advanced)', 'dbt', 'Airflow', 'Spark', 'Kafka', 
    'Snowflake', 'BigQuery', 'Databricks', 'PostgreSQL', 'ETL/ELT', 
    'Orchestration'
  ],
  'Platform-SRE': [
    'Linux', 'AWS', 'GCP', 'Azure', 'Kubernetes', 'Helm', 'Terraform', 
    'Prometheus', 'Grafana', 'Networking', 'CDNs', 'Incident Response', 
    'Observability', 'CI/CD'
  ],
  'Solutions Eng': [
    'APIs', 'Auth/OAuth', 'Webhooks', 'Postman', 'JavaScript', 'Python', 
    'SQL', 'Integrations', 'Demoing', 'Customer Comms'
  ]
} as const;

export const GLOBAL_SKILLS = [
  'Rust', 'C#', 'Kotlin', 'Swift', 'React', 'Next.js', 'Django', 'Flask', 
  'FastAPI', 'Spring', '.NET', 'Rails', 'MySQL', 'SQLite', 'MongoDB', 
  'RabbitMQ', 'GraphQL', 'WebSockets', 'Snowflake', 'BigQuery', 'Databricks', 
  'Pandas', 'NumPy', 'Hugging Face', 'LangChain', 'Ray', 'Git', 'Bash'
];

export function rankSkills(selectedRoles: string[]) {
  const laneUnion = Array.from(
    new Set(selectedRoles.flatMap(r => (ROLE_SKILLS as any)[r] ?? []))
  );
  const rest = GLOBAL_SKILLS.filter(s => !laneUnion.includes(s));
  return [...laneUnion, ...rest];
}