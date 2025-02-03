import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function VersionDb() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi);

  let dataDatabase = "loading...";

  if (!isLoading && data) {
    dataDatabase = (
      <>
        <div>Conexão Ativa: {data.dependencies.database.active_connection}</div>
        <div>Máximo Conexões: {data.dependencies.database.max_connections}</div>
        <div>Versão: {data.dependencies.database.version}</div>
      </>
    );
  }

  return (
    <>
      <p>{dataDatabase}</p>
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });
  console.log("pint: ", data);
  let updateAtText = "loading...";
  if (!isLoading && data) {
    updateAtText = new Date(data.update_at).toString("pt-BR");
  }
  return <p>Última atualização: {updateAtText}</p>;
}

export default function statusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <h1>Database</h1>
      <VersionDb />
    </>
  );
}
