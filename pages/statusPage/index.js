import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });
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
    </>
  );
}
